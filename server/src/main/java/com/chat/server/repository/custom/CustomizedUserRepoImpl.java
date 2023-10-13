package com.chat.server.repository.custom;

import com.chat.server.model.User;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomizedUserRepoImpl implements CustomizedUserRepo {
    private final MongoTemplate template;

    @Override
    public void removeChannelFromUser(String channelId, String userId) {
        Update update = new Update().pull("channels", new ObjectId(channelId));
        updateUser(update, userId);
    }

    @Override
    public void addChannelToUser(String channelId, String userId) {
        Update update = new Update().addToSet("channels", new ObjectId(channelId));
        updateUser(update, userId);
    }

    private void updateUser(Update updateQuery, String userId) {
        template.updateFirst(Query.query(Criteria.where("id").is(userId)), updateQuery, User.class);
    }
}
