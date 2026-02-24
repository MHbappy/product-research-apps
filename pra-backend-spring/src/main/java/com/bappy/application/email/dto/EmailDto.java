package com.bappy.application.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Email data transfer object.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailDto {

    private String to;
    private String subject;
    private String body;
    private boolean isHtml;
    private Map<String, Object> templateModel;
    private String templateName;
}
