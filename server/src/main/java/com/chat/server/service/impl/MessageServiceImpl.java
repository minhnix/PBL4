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
import org.bson.types.ObjectId;
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
    private final QueryCursorPagination<ObjectId> queryCursor;
    private final MongoTemplate template;

    @Override
    public Message saveMessage(ChatMessage chatMessage) {
        Message message = Message.builder()
                .channelId(new ObjectId(chatMessage.getChannelId()))
                .type(chatMessage.getType())
                .content(chatMessage.getContent())
                .sender(chatMessage.getSender())
                .sendTo(chatMessage.getSendTo())
                .createdAt(Instant.now())
                .build();
        return messageRepo.save(message);
    }

    @Override
    public CursorPageResponse<Message, String> findAllMessageByChannel(String channelId, CursorPageable<ObjectId> pageable, CustomUserDetails user) {
        if (!channelService.isUserJoinChannel(channelId, user.getId())) {
            throw new ForbiddenException("Access denied");
        }
        Query query = new Query();
        ObjectId channelOId = new ObjectId(channelId);
        query.addCriteria(Criteria.where("channelId").is(channelOId));
        query = queryCursor.apply(query, pageable);
        List<Message> messages = template.find(query, Message.class);
        CursorPageResponse<Message, String> res = new CursorPageResponse<>();
        res.setData(messages);
        res.setNextCursor(messages.get(0).getId());
        String preCursor = messages.get(messages.size() - 1).getId();
        res.setPreviousCursor(
                messageRepo.existsByChannelIdAndIdLessThan(channelId, preCursor) ?
                        preCursor : null
        );
        return res;
    }
}
