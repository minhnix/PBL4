package com.chat.server.service;

import com.chat.server.payload.response.UploadFileResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface FileStorageService {
    void init();
    UploadFileResponse store(MultipartFile file);
    Path load(String filename);
    Resource loadAsResource(String filename);
}
