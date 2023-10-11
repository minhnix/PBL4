package com.chat.server.service.impl;

import com.chat.server.exception.ForbiddenException;
import com.chat.server.model.Message;
import com.chat.server.payload.request.ChatMessage;
import com.chat.server.payload.response.CursorPageResponse;
import com.chat.server.repository.MessageRepo;
import com.chat.server.security.CustomUserDetails;
import com.chat.server.service.ChannelService;
import com.chat.server.service.MessageService;
import com.chat.server.util.CursorPageable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final MessageRepo messageRepo;
    private final ChannelService channelService;
    private final QueryCursorPagination<Instant> queryCursor;
    private final MongoTemplate template;

    @Override
    public Message saveMessage(ChatMessage chatMessage) {
        Message message = Message.builder()
                .channelId(chatMessage.getChannelId())
                .type(chatMessage.getType())
                .content(chatMessage.getContent())
                .sender(chatMessage.getSender())
                .sendTo(chatMessage.getSendTo())
                .createdAt(Instant.now())
                .build();
        return messageRepo.save(message);
    }

    @Override
    public CursorPageResponse<Message, Instant> findAllMessageByChannel(String channelId, CursorPageable<Instant> pageable, CustomUserDetails user) {
        if (!channelService.isUserJoinChannel(channelId, user.getId())) {
            throw new ForbiddenException("Access denied");
        }
        Query query = new Query();
        query.addCriteria(Criteria.where("channelId").is(channelId));
        query = queryCursor.apply(query, pageable);
        List<Message> messages = template.find(query, Message.class);
        CursorPageResponse<Message, Instant> res = new CursorPageResponse<>();
        res.setData(messages);
        res.setNextCursor(messages.get(0).getCreatedAt());
        Instant preCursor = messages.get(messages.size() - 1).getCreatedAt();
        res.setPreviousCursor(
                messageRepo.existsByChannelIdAndCreatedAtLessThan(channelId, preCursor) ?
                        preCursor : null
        );
        return res;
    }
}
