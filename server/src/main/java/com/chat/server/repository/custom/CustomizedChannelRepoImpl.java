package com.chat.server.repository.custom;

import com.chat.server.model.Channel;
import com.chat.server.model.Message;
import com.chat.server.model.User;
import com.chat.server.payload.response.ChannelInfo;
import com.chat.server.payload.response.ChannelMessage;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
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
        AggregationResults<ChannelInfo> results = template.aggregate(aggregation, Channel.COLLECTION_NAME, ChannelInfo.class);
        ChannelInfo channelInfo = results.getUniqueMappedResult();
        return Optional.ofNullable(channelInfo);
    }

    @Override
    public List<ChannelMessage> findAllChannelByUser(String userId) {
        ObjectId userOId = new ObjectId(userId);
        Query query = Query.query(Criteria.where("users").is(userOId));
        List<Channel> channels = template.find(query, Channel.class);
        List<ObjectId> channelIds = channels.stream().map(channel -> new ObjectId(channel.getId())).toList();

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("channelId").in(channelIds)),
                Aggregation.sort(Sort.Direction.DESC, "createdAt"),
                Aggregation.group("channelId")
                        .first("content").as("latestMessage")
                        .first("createdAt").as("createdAt")
                        .first("sender").as("sender")
                        .first("createdAt").as("createdAt"),
                Aggregation.lookup(User.COLLECTION_NAME, "_id", "channels", "userInfos")
//                Aggregation.addFields().addField("userInfo")
//                        .withValue(ArrayOperators.ArrayElemAt.arrayOf("userInfo").elementAt(0))
//                        .build(),
//                Aggregation.project()
//                        .and("latestMessage").as("latestMessage")
//                        .and("createdAt").as("createdAt")
//                        .and("sender").as("sender")
//                        .and("_id").as("channelId")
//                        .and("userInfo.isOnline").as("isOnline")
                // TODO: impl isOnline
        );
        AggregationResults<ChannelMessage> results = template.aggregate(aggregation, Message.COLLECTION_NAME, ChannelMessage.class);
        List<ChannelMessage> channelMessages = results.getMappedResults();
        for (var channelMessage : channelMessages) {
            channelMessage.setOnline(
                    channelMessage.getUserInfos().stream().anyMatch(user -> {
                        if (user.getIsOnline() == null) return false;
                        return user.getIsOnline();
                    })
            );

            for (var channel : channels) {
                if (channel.getId().equals(channelMessage.get_id())) {
                    if (channel.getType().equals("group"))
                        channelMessage.setChannelName(channel.getName());
                    else {
                        for (var user : channelMessage.getUserInfos()) {
                            if (!user.getId().equals(userId))
                                channelMessage.setChannelName(user.getUsername());
                        }
                    }
                    channelMessage.setType(channel.getType());
                }
            }
        }
        return channelMessages;
    }

    private void updateChannel(Update updateQuery, String channelId) {
        template.updateFirst(Query.query(Criteria.where("id").is(channelId)), updateQuery, Channel.class);
    }
}
