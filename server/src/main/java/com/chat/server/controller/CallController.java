package com.chat.server.controller;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.exception.ResourceNotFoundException;
import com.chat.server.model.Call;
import com.chat.server.model.CallUserInfo;
import com.chat.server.model.UserWithUsername;
import com.chat.server.payload.request.CallMessage;
import com.chat.server.payload.request.CallRequest;
import com.chat.server.security.CurrentUser;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.security.UserPrincipal;
import com.chat.server.service.call.CallService;
import com.chat.server.service.call.CallStorage;
import com.chat.server.service.scheduler.TimeOutCallScheduler;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@AllArgsConstructor
public class CallController {
    private final CallService callService;
    private final CallStorage callStorage;
    private final SimpMessagingTemplate template;
    private final TimeOutCallScheduler timeOutCallScheduler;

    @MessageMapping("/call/pm")
    public void handleCallPM(@Payload CallMessage callMessage) {
        log.info(callMessage.toString());
        String callId = callMessage.getPayload().getCallId();
        if (callMessage.getType().equals(CallMessage.Type.CREATE)) {
            Call call = callService.findById(callId).get();
            if (call.getStatus().equals("JOIN")) {
                callMessage.setType(CallMessage.Type.JOIN);
            }
            timeOutCallScheduler.apply(callMessage);
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
        } else if (callMessage.getType().equals(CallMessage.Type.JOIN)) {
            timeOutCallScheduler.apply(callMessage);
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
            cancelAllCallCreateWhenJoin(callId, callMessage);
        } else if (callMessage.getType().equals(CallMessage.Type.CANCEL)) {
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
            template.convertAndSendToUser(callMessage.getSender().getUserId(), "/call", callMessage);
        }
    }

    @MessageMapping("/call/group/{groupId}")
    public void handleCallGroup(@DestinationVariable String groupId, @Payload CallMessage callMessage, UserPrincipal principal) {
        callMessage.setSender(new UserWithUsername(principal.getName(), principal.getUsername()));
        if (CallMessage.Type.JOIN == callMessage.getType()) {
            try {
                List<CallUserInfo> callUserInfos = callStorage.userJoin(groupId, principal.getName(), principal.getUsername());
                callMessage.getPayload().setInfo(new CallUserInfo(principal.getName(), principal.getUsername(), true, true));
                callMessage.getPayload().setInfos(callUserInfos);
                template.convertAndSend("/topic/group/" + groupId + "/join-call", callMessage);
            } catch (RuntimeException e) {
                template.convertAndSendToUser(principal.getName(), "/error", "error");
            }
        } else if (CallMessage.Type.CALL == callMessage.getType()) {
            callMessage.getPayload().setInfo(callStorage.getInfo(groupId, principal.getName()));
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
        } else if (CallMessage.Type.ACCEPT == callMessage.getType()) {
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
        } else if (CallMessage.Type.LEAVE == callMessage.getType()) {
            callStorage.userLeave(groupId, principal.getName());
            template.convertAndSend("/topic/group/" + groupId + "/leave-call", callMessage);
        } else if (CallMessage.Type.TOGGLE_CAM == callMessage.getType()) {
            CallUserInfo userInfo = callStorage.getInfo(groupId, principal.getName());
            userInfo.setEnableVideo(!userInfo.isEnableVideo());
            template.convertAndSend("/topic/group/" + groupId + "/toggle", callMessage);
        } else if (CallMessage.Type.TOGGLE_MIC == callMessage.getType()) {
            CallUserInfo userInfo = callStorage.getInfo(groupId, principal.getName());
            userInfo.setEnableAudio(!userInfo.isEnableAudio());
            template.convertAndSend("/topic/group/" + groupId + "/toggle", callMessage);
        }
        log.info(String.valueOf(callStorage.getValue(groupId).size()));
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

    private void cancelAllCallCreateWhenJoin(String callId, CallMessage callMessage) {
        callMessage.setType(CallMessage.Type.CANCEL);
        Call call = callService.findByUserAndNotCallId(callMessage.getSendTo(), callId);
        if (call != null) {
            callMessage.getPayload().setCallId(call.getId());
            template.convertAndSendToUser(callMessage.getSendTo(), "/call", callMessage);
        }
        Call call1 = callService.findByUserAndNotCallId(callMessage.getSender().getUserId(), callId);
        if (call1 != null) {
            callMessage.getPayload().setCallId(call1.getId());
            template.convertAndSendToUser(callMessage.getSender().getUserId(), "/call", callMessage);
        }
    }
}
