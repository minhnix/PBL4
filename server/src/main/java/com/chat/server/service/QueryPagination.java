package com.chat.server.service;

import com.chat.server.util.CursorPageable;
import org.springframework.data.mongodb.core.query.Query;

public interface QueryPagination<TC> {
    Query apply(Query query, CursorPageable<TC> pageable);
}
