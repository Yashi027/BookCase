package com.book.book_api.services;

import com.book.book_api.dtos.BookDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BookService {
    BookDto addBook(BookDto bookDto, MultipartFile multipartFile) throws IOException;

    BookDto getBook(String isbn);

    List<BookDto> getAllBooks();

    BookDto updateBook(String isbn, BookDto bookDto, MultipartFile multipartFile) throws IOException;

    String deleteBook(String isbn) throws IOException;
}
