package com.book.book_api.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class FileServiceImpl implements FileService{
    @Override
    public String uploadFile(String path, MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        String filepath = path + File.separator + filename;
        File f = new File(path);
        if(!f.exists()){
            f.mkdir();
        }
        Files.copy(file.getInputStream(), Paths.get(filepath));
        return "";
    }

    @Override
    public InputStream getResourceFile(String path, String fileName) throws FileNotFoundException {
        String filepath = path + File.separator + fileName;
        return null;
    }
}
