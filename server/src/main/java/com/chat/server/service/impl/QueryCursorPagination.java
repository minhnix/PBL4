package com.chat.server.service.impl;

import com.chat.server.service.QueryPagination;
import com.chat.server.util.CursorPageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

@Component
public class QueryCursorPagination<TC> implements QueryPagination<TC> {

    @Override
    public Query apply(Query query, CursorPageable<TC> pageable) {
        if (pageable.hasPreviousCursor()) {
            query.addCriteria(Criteria.where(pageable.getColumnName()).lt(pageable.getPreviousCursor()));
            query.with(Sort.by(Sort.Direction.DESC, pageable.getColumnName()));
        } else if (pageable.hasNextCursor()) {
            query.addCriteria(Criteria.where(pageable.getColumnName()).gt(pageable.getNextCursor()));
            query.with(Sort.by(Sort.Direction.ASC, pageable.getColumnName())); //TODO: FIX NEXT PAGINATION.
        } else
            query.with(Sort.by(Sort.Direction.DESC, pageable.getColumnName()));
        query.limit(pageable.getSize());
        return query;
    }
}
