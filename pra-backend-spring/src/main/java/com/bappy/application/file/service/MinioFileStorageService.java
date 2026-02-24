package com.bappy.application.file.service;

import com.bappy.application.config.MinioConfig;
import com.bappy.application.exception.BadRequestException;
import com.bappy.application.exception.ResourceNotFoundException;
import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * MinIO file storage service implementation.
 * Stores files in MinIO object storage (S3-compatible).
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Primary
public class MinioFileStorageService implements FileStorageService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    @Value("${app.url:http://localhost:8080}")
    private String appUrl;

    /**
     * Initialize MinIO bucket on startup
     */
    @PostConstruct
    public void init() {
        try {
            // Check if bucket exists, create if not
            boolean bucketExists = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .build()
            );

            if (!bucketExists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(minioConfig.getBucketName())
                                .build()
                );
                log.info("MinIO bucket created: {}", minioConfig.getBucketName());
            } else {
                log.info("MinIO bucket already exists: {}", minioConfig.getBucketName());
            }
        } catch (Exception e) {
            log.error("Error initializing MinIO bucket", e);
            throw new RuntimeException("Could not initialize MinIO bucket", e);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file");
        }

        // Get original filename
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the file's name contains invalid characters
            if (originalFileName.contains("..")) {
                throw new BadRequestException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            // Generate unique filename
            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Upload file to MinIO
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            log.info("File uploaded to MinIO: {}", fileName);
            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", e);
        } catch (Exception e) {
            throw new RuntimeException("Error uploading file to MinIO", e);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(fileName)
                            .build()
            );

            return new InputStreamResource(stream);

        } catch (ErrorResponseException e) {
            if (e.errorResponse().code().equals("NoSuchKey")) {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }
            throw new RuntimeException("Error loading file from MinIO", e);
        } catch (Exception e) {
            throw new RuntimeException("Error loading file from MinIO", e);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(fileName)
                            .build()
            );
            log.info("File deleted from MinIO: {}", fileName);

        } catch (Exception e) {
            log.error("Could not delete file from MinIO: {}", fileName, e);
            throw new RuntimeException("Could not delete file: " + fileName);
        }
    }

    @Override
    public String getFileUrl(String fileName) {
        try {
            // Generate presigned URL (valid for 7 days)
            String url = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(minioConfig.getBucketName())
                            .object(fileName)
                            .expiry(7, TimeUnit.DAYS)
                            .build()
            );
            return url;

        } catch (Exception e) {
            log.error("Error generating presigned URL for file: {}", fileName, e);
            // Fallback to API endpoint
            return appUrl + "/api/v1/files/" + fileName;
        }
    }

    /**
     * Get file metadata
     */
    public FileMetadata getFileMetadata(String fileName) {
        try {
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(fileName)
                            .build()
            );

            return FileMetadata.builder()
                    .fileName(fileName)
                    .contentType(stat.contentType())
                    .size(stat.size())
                    .lastModified(stat.lastModified().toInstant())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error getting file metadata", e);
        }
    }

    /**
     * Check if file exists
     */
    public boolean fileExists(String fileName) {
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(minioConfig.getBucketName())
                            .object(fileName)
                            .build()
            );
            return true;
        } catch (ErrorResponseException e) {
            if (e.errorResponse().code().equals("NoSuchKey")) {
                return false;
            }
            throw new RuntimeException("Error checking file existence", e);
        } catch (Exception e) {
            throw new RuntimeException("Error checking file existence", e);
        }
    }

    /**
     * File metadata class
     */
    @lombok.Data
    @lombok.Builder
    public static class FileMetadata {
        private String fileName;
        private String contentType;
        private long size;
        private java.time.Instant lastModified;
    }
}
