package com.example.interviewback.util;

import org.springframework.web.multipart.MultipartFile;

public class FileUtil {
    public static boolean isValidExcelFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName != null && fileName.endsWith(".xlsx");
    }
}
