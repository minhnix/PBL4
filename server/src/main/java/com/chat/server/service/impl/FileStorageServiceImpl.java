package com.chat.server.service.impl;

import com.chat.server.exception.FileStorageException;
import com.chat.server.exception.ResourceNotFoundException;
import com.chat.server.payload.response.UploadFileResponse;
import com.chat.server.service.FileStorageService;
import com.chat.server.util.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private final Path rootLocation;

    @Autowired
    public FileStorageServiceImpl() {
        this.rootLocation = Paths.get(AppConstants.UPLOAD_DIR);
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not initialize storage");
        }
    }

    @Override
    public UploadFileResponse store(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new FileStorageException("Failed to store empty file.");
            }
            String fileName = file.getOriginalFilename();
            if (fileName == null) throw new FileStorageException("Filename is null");
            fileName = StringUtils.cleanPath(fileName);
            if (fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            String randomId = UUID.randomUUID().toString();
            String fileNameStore = randomId.concat(fileName.substring(fileName.lastIndexOf(".")));
            Path destinationFile = this.rootLocation.resolve(Paths.get(fileNameStore))
                    .normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new FileStorageException("Cannot store file outside current directory.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile,
                        StandardCopyOption.REPLACE_EXISTING);
            }
            UploadFileResponse response = new UploadFileResponse();
            response.setFileType(file.getContentType());
            response.setFileName(fileName);
            response.setFileDownloadUri(fileNameStore);
            response.setSize(file.getSize());
            return response;
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file.");
        }
    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File", "filename", filename);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File", "filename", filename);
        }
    }

}
