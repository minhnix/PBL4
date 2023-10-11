package com.chat.server.repository.custom;

import com.chat.server.model.Channel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomizedChannelRepoImpl implements CustomizedChannelRepo {
    private final MongoTemplate template;

    @Override
    public void removeUserFromChannel(String userId, String channelId) {
        Update update = new Update().pull("users", userId);
        updateChannel(update, channelId);
    }

    @Override
    public void addUserToChannel(String userId, String channelId) {
        Update update = new Update().addToSet("users", userId);
        updateChannel(update, channelId);
    }

    private void updateChannel(Update updateQuery, String channelId) {
        template.updateFirst(Query.query(Criteria.where("id").is(channelId)), updateQuery, Channel.class);
    }
}
