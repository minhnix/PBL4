package com.chat.server.repository.custom;

import com.chat.server.model.Channel;
import com.chat.server.model.User;
import com.chat.server.payload.response.ChannelInfo;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CustomizedChannelRepoImpl implements CustomizedChannelRepo {
    private final MongoTemplate template;

    @Override
    public void removeUserFromChannel(String userId, String channelId) {
        Update update = new Update().pull("users", new ObjectId(userId));
        updateChannel(update, channelId);
    }

    @Override
    public void addUserToChannel(String userId, String channelId) {
        Update update = new Update().addToSet("users", new ObjectId(userId));
        updateChannel(update, channelId);
    }

    @Override
    public boolean existsUserInChannel(String channelId, String userId) {
        Query query = Query.query(Criteria.where("id").is(channelId)
                .andOperator(Criteria.where("users").is(new ObjectId(userId))));
        return template.exists(query, Channel.class);
    }

    @Override
    public Optional<ChannelInfo> findDetailById(String id) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("_id").is(id)),
                Aggregation.lookup(User.COLLECTION_NAME, "users", "_id", "users")
        );
        AggregationResults<ChannelInfo> results = template.aggregate(aggregation, Channel.COLLECTION_NAME ,ChannelInfo.class);
        ChannelInfo channelInfo = results.getUniqueMappedResult();
        return Optional.ofNullable(channelInfo);
    }

    private void updateChannel(Update updateQuery, String channelId) {
        template.updateFirst(Query.query(Criteria.where("id").is(channelId)), updateQuery, Channel.class);
    }
}
