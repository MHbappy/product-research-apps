package com.bappy.application.file.controller;

import com.bappy.application.common.dto.ApiResponse;
import com.bappy.application.file.dto.FileUploadResponse;
import com.bappy.application.file.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * File upload and download controller.
 */
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "File Management", description = "File upload and download endpoints")
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * Upload a file
     */
    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload file", description = "Upload a file to the server")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadFile(
            @RequestParam("file") MultipartFile file) {
        
        log.info("File upload request received: {}", file.getOriginalFilename());

        String fileName = fileStorageService.storeFile(file);
        String fileUrl = fileStorageService.getFileUrl(fileName);

        FileUploadResponse response = FileUploadResponse.builder()
                .fileName(fileName)
                .fileUrl(fileUrl)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .message("File uploaded successfully")
                .build();

        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
    }

    /**
     * Upload multiple files
     */
    @PostMapping("/upload-multiple")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload multiple files", description = "Upload multiple files to the server")
    public ResponseEntity<ApiResponse<FileUploadResponse[]>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files) {
        
        log.info("Multiple file upload request received: {} files", files.length);

        FileUploadResponse[] responses = new FileUploadResponse[files.length];
        
        for (int i = 0; i < files.length; i++) {
            String fileName = fileStorageService.storeFile(files[i]);
            String fileUrl = fileStorageService.getFileUrl(fileName);

            responses[i] = FileUploadResponse.builder()
                    .fileName(fileName)
                    .fileUrl(fileUrl)
                    .fileType(files[i].getContentType())
                    .fileSize(files[i].getSize())
                    .message("File uploaded successfully")
                    .build();
        }

        return ResponseEntity.ok(ApiResponse.success("Files uploaded successfully", responses));
    }

    /**
     * Download a file
     */
    @GetMapping("/{fileName:.+}")
    @Operation(summary = "Download file", description = "Download a file from the server")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String fileName,
            HttpServletRequest request) {

        log.info("File download request received: {}", fileName);

        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            log.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    /**
     * Get file metadata
     */
    @GetMapping("/{fileName:.+}/metadata")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get file metadata", description = "Get metadata information about a file")
    public ResponseEntity<ApiResponse<com.bappy.application.file.dto.FileMetadataDto>> getFileMetadata(
            @PathVariable String fileName) {
        
        log.info("File metadata request received: {}", fileName);
        
        // Check if using MinIO service
        if (fileStorageService instanceof com.bappy.application.file.service.MinioFileStorageService) {
            com.bappy.application.file.service.MinioFileStorageService minioService = 
                (com.bappy.application.file.service.MinioFileStorageService) fileStorageService;
            
            com.bappy.application.file.service.MinioFileStorageService.FileMetadata metadata = 
                minioService.getFileMetadata(fileName);
            
            com.bappy.application.file.dto.FileMetadataDto dto = com.bappy.application.file.dto.FileMetadataDto.builder()
                    .fileName(metadata.getFileName())
                    .fileUrl(fileStorageService.getFileUrl(fileName))
                    .contentType(metadata.getContentType())
                    .size(metadata.getSize())
                    .lastModified(metadata.getLastModified())
                    .build();
            
            return ResponseEntity.ok(ApiResponse.success("File metadata retrieved successfully", dto));
        }
        
        // For local storage, return basic info
        String fileUrl = fileStorageService.getFileUrl(fileName);
        com.bappy.application.file.dto.FileMetadataDto dto = com.bappy.application.file.dto.FileMetadataDto.builder()
                .fileName(fileName)
                .fileUrl(fileUrl)
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("File metadata retrieved successfully", dto));
    }

    /**
     * Delete a file
     */
    @DeleteMapping("/{fileName:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete file", description = "Delete a file from the server (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String fileName) {
        log.info("File delete request received: {}", fileName);
        
        fileStorageService.deleteFile(fileName);
        
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully"));
    }
}
