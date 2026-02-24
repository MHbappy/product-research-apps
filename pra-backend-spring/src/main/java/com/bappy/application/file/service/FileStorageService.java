package com.bappy.application.file.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * File storage service interface.
 * Provides abstraction for different storage implementations (local, S3, etc.)
 */
public interface FileStorageService {

    /**
     * Store a file
     *
     * @param file The file to store
     * @return The stored file name
     */
    String storeFile(MultipartFile file);

    /**
     * Load a file as Resource
     *
     * @param fileName The name of the file to load
     * @return The file as Resource
     */
    Resource loadFileAsResource(String fileName);

    /**
     * Delete a file
     *
     * @param fileName The name of the file to delete
     */
    void deleteFile(String fileName);

    /**
     * Get file URL
     *
     * @param fileName The name of the file
     * @return The URL to access the file
     */
    String getFileUrl(String fileName);
}
