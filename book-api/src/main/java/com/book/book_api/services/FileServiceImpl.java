package com.book.book_api.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadFile(String path, MultipartFile file)
            throws IOException {

        String filename = file.getOriginalFilename();

        if (filename == null || filename.isBlank()) {
            throw new IOException("Uploaded file has no filename");
        }

        Path directory = Paths.get(path);
        Files.createDirectories(directory);

        Path filepath = directory.resolve(filename).normalize();

        if (!filepath.startsWith(directory.toAbsolutePath().normalize())
                && directory.isAbsolute()) {
            throw new IOException("Invalid filename");
        }

        Files.copy(
                file.getInputStream(),
                filepath,
                StandardCopyOption.REPLACE_EXISTING
        );
        return filename;
    }

    @Override
    public InputStream getResourceFile(String path, String fileName)
            throws FileNotFoundException {

        Path directory = Paths.get(path)
                .toAbsolutePath()
                .normalize();

        Path filePath = directory.resolve(fileName)
                .toAbsolutePath()
                .normalize();

        System.out.println("Image directory: " + directory);
        System.out.println("Requested image: " + filePath);

        if (!filePath.startsWith(directory)) {
            throw new FileNotFoundException(
                    "Invalid file path: " + filePath
            );
        }

        if (!Files.exists(filePath)) {
            throw new FileNotFoundException(
                    "Image file does not exist: " + filePath
            );
        }

        return new FileInputStream(filePath.toFile());
    }
}
