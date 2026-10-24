package com.book.book_api.controllers;

import com.book.book_api.dtos.BookDto;
import com.book.book_api.services.BookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/books")
@CrossOrigin 
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
    @PostMapping("/add-book")
    public ResponseEntity<BookDto> addBook(@RequestPart String bookDtoJson, @RequestPart(required = false)MultipartFile file) throws IOException {
        if(file==null || file.isEmpty())
            file=null;
        BookDto bookDto = getBookDto(bookDtoJson);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.addBook(bookDto, file));
    }

    @GetMapping("/all-books")
    public ResponseEntity<List<BookDto>> getAllBooks(){
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/get-book/{isbn}")
    public ResponseEntity<BookDto> getBook(@PathVariable String isbn){
        return ResponseEntity.ok(bookService.getBook(isbn));
    }

    @PutMapping("/update-book/{isbn}")
    public ResponseEntity<BookDto> updateBook(@PathVariable String isbn,
                                              @RequestPart(value = "file", required = false) MultipartFile file,
                                              @RequestPart String bookDtoJson) throws IOException{
        if(file==null || file.isEmpty())
            file = null;
        BookDto bookDto = getBookDto(bookDtoJson);
        return ResponseEntity.ok(bookService.updateBook(isbn, bookDto, file));
    }

    @DeleteMapping("/delete/{isbn}")
    public ResponseEntity<String> deleteBook(@PathVariable String isbn) throws IOException{
        return ResponseEntity.ok(bookService.deleteBook(isbn));
    }

    private BookDto getBookDto(String bookDtoJson){
        BookDto bookDto = new BookDto();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            bookDto = objectMapper.readValue(bookDtoJson, BookDto.class);
        } catch (Exception e) {
            log.info("Exception in converting string to JSON{}", e.getMessage());
        }
        return bookDto;
    }
}
