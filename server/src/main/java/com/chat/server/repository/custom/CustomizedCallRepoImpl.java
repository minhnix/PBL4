package com.chat.server.repository.custom;

import com.chat.server.model.Call;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomizedCallRepoImpl implements CustomizedCallRepo {
    private final MongoTemplate template;

    @Override
    public boolean isUserCalling(String userId, String channelId) {
        Query query = Query.query(Criteria.where("channelId").ne(channelId)
                .orOperator(
                        Criteria.where("sendTo").is(userId),
                        Criteria.where("sender.userId").is(userId))
                .and("status").is("JOIN"));
        return template.exists(query, Call.class, Call.COLLECTION_NAME);
    }

    @Override
    public void addOfferCandidate(String callId, Document offer) {
        Update update = new Update().push("offerCandidates", offer);
        updateCall(update, callId);
    }

    @Override
    public void addAnswerCandidate(String callId, Document answer) {
        Update update = new Update().push("answerCandidates", answer);
        updateCall(update, callId);
    }

    @Override
    public Call findByUserAndNotCallId(String userId, String callId) {
        Query query = Query.query(Criteria.where("id").ne(callId)
                .orOperator(
                        Criteria.where("sendTo").is(userId),
                        Criteria.where("sender.userId").is(userId)));
        return template.findOne(query, Call.class, Call.COLLECTION_NAME);
    }

    private void updateCall(Update updateQuery, String callId) {
        template.updateFirst(Query.query(Criteria.where("id").is(callId)), updateQuery, Call.class);
    }

}
