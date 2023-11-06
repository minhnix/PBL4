package com.chat.server.controller;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.exception.ResourceNotFoundException;
import com.chat.server.model.Call;
import com.chat.server.payload.request.CallMessage;
import com.chat.server.payload.request.CallRequest;
import com.chat.server.security.CurrentUser;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.service.CallService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@Slf4j
@AllArgsConstructor
public class CallController {
    private final CallService callService;
    private final SimpMessagingTemplate template;

    @MessageMapping("/call/pm")
    public void handleCall(@Payload CallMessage callMessage) {
        log.info(callMessage.toString());
        if (callMessage.getType().equals(CallMessage.Type.CREATE)) {
            Call call = callService.findById(callMessage.getPayload().getCallId()).get();
            if (call.getStatus().equals("JOIN")) {
                callMessage.setType(CallMessage.Type.JOIN);
            }
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
        } else if (callMessage.getType().equals(CallMessage.Type.JOIN)) {
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
        } else if (callMessage.getType().equals(CallMessage.Type.CANCEL)) {
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
        } else {

        }
    }

    @GetMapping("/api/v1/calls/{callId}")
    public Call get(@CurrentUser CustomUserDetails user,
                    @PathVariable(name = "callId") String callId) {
        if (user == null) throw new ForbiddenException("Access denied");
        Optional<Call> call = callService.findById(callId);
        return call.orElseGet(() ->
                callService.findByChannelId(callId).orElseThrow(
                        () -> new ResourceNotFoundException("Call", "id", callId)));
    }

    @PostMapping("/api/v1/calls")
    public Call create(@CurrentUser CustomUserDetails user,
                       @RequestBody CallMessage callRequest) {
        if (user == null) throw new ForbiddenException("Access denied");
        if (!user.getId().equals(callRequest.getSender().getUserId()))
            throw new ForbiddenException("Access denied");
        return callService.create(callRequest.getSendTo(), callRequest.getSender(), callRequest.getPayload());
    }

    @PatchMapping("/api/v1/calls/{callId}")
    public void update(@RequestBody CallRequest callRequest,
                       @CurrentUser CustomUserDetails user,
                       @PathVariable(name = "callId") String callId
    ) {
        if (user == null) throw new ForbiddenException("Access denied");
        callRequest.setCallId(callId);
        callService.update(callRequest);
    }

    @DeleteMapping("/api/v1/calls/{callId}")
    public void delete(@PathVariable(name = "callId") String callId) {
        callService.delete(callId);
    }

//    private String handleCreateMessageCall(CallMessage callMessage) {
//        if (callService.findByChannelId(callMessage.getPayload().getChannelId()).isEmpty()) {
//            return callService.create(callMessage)
//                    .getId();
//        } else {
//            return null;
//        }
//    }
}
