package com.chat.server.payload.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PagedResponse<T> {

    private List<T> content = new ArrayList<>();
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean isLast;

    public PagedResponse(List<T> content, int page, int size, long totalElements, int totalPages, boolean last) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.isLast = last;
    }

    public PagedResponse(Page<T> page) {
        this(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }
}
