package com.chat.server.repository.custom;

import com.chat.server.model.Message;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomizedMessageRepoImpl implements CustomizedMessageRepo {
    private final MongoTemplate template;
    @Override
    public boolean existsByChannelIdAndIdLessThan(String channelId, String id) {
        Query query = Query.query(Criteria.where("channelId").is(channelId)
                .andOperator(Criteria.where("id").lt(new ObjectId(id))));
        return template.exists(query, Message.class);
    }
}
