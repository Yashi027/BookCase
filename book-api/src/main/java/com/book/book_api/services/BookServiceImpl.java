package com.book.book_api.services;

import com.book.book_api.dtos.BookDto;
import com.book.book_api.entities.Book;
import com.book.book_api.repository.BookRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {
    @Value("${project.images}")
    private String path;
    @Value("${base.url}")
    private String baseurl;

    private final BookRepository bookRepository;
    private final FileService fileService;

    public BookServiceImpl(BookRepository bookRepository, FileService fileService) {
        this.bookRepository = bookRepository;
        this.fileService = fileService;
    }

    @Override
    public BookDto addBook(BookDto bookDto, MultipartFile multipartFile) throws IOException {
        if (multipartFile != null && !multipartFile.isEmpty()) {

            String originalFilename = multipartFile.getOriginalFilename();

            if (originalFilename != null &&
                    Files.exists(Paths.get(path, originalFilename))) {
                throw new FileAlreadyExistsException(
                        "File already exists. Please use another file.");
            }

            String uploadedFileName = fileService.uploadFile(path, multipartFile);

            bookDto.setBookCover(uploadedFileName);
            bookDto.setBookCoverUrl(
                    baseurl + "/api/v1/file/" + uploadedFileName);
        } else {
            bookDto.setBookCover(null);
            bookDto.setBookCoverUrl(null);
        }

        Book book = convertToBook(bookDto);
        Book savedBook = bookRepository.save(book);

        return convertToBookDto(savedBook);
    }

    @Override
    public BookDto getBook(String isbn) {
        Book book = bookRepository.findById(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found with ISBN: " + isbn));
        return convertToBookDto(book);
    }

    @Override
    public List<BookDto> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream().map(this::convertToBookDto).toList();
    }


    @Override
    public BookDto updateBook(
            String isbn,
            BookDto bookDto,
            MultipartFile multipartFile
    ) throws IOException {

        Book book = bookRepository.findById(isbn)
                .orElseThrow(() ->
                        new RuntimeException("Book not found with ISBN: " + isbn)
                );

        String bookCover = book.getBookCover();
        String bookCoverUrl = book.getBookCoverUrl();

        if (multipartFile != null && !multipartFile.isEmpty()) {
            String uploadedFileName = fileService.uploadFile(path, multipartFile);

            bookCover = uploadedFileName;
            bookCoverUrl = baseurl + "/api/v1/file/" + uploadedFileName;
        }

        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setCategory(bookDto.getCategory());
        book.setPrice(bookDto.getPrice());
        book.setQuantity(bookDto.getQuantity());

        book.setBookCover(bookCover);
        book.setBookCoverUrl(bookCoverUrl);

        Book updatedBook = bookRepository.save(book);

        return convertToBookDto(updatedBook);
    }


    @Override
    public String deleteBook(String isbn) throws IOException {
        Book book = bookRepository.findById(isbn).orElseThrow(() -> new RuntimeException("Book not found"));
        //Files.deleteIfExists(Paths.get(path + File.separator + book.getBookCover()));
        bookRepository.delete(book);
        return "Book deleted successfully with ISBN: {isbn}";
    }

    private BookDto convertToBookDto(Book book) {
        return BookDto.builder()
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .author(book.getAuthor())
                .price(book.getPrice())
                .category(book.getCategory())
                .quantity(book.getQuantity())
                .bookCover(book.getBookCover())
                .bookCoverUrl(book.getBookCoverUrl())
                .build();
    }

    private Book convertToBook(BookDto bookDto) {
        return Book.builder()
                .isbn(bookDto.getIsbn())
                .title(bookDto.getTitle())
                .author(bookDto.getAuthor())
                .price(bookDto.getPrice())
                .category(bookDto.getCategory())
                .quantity(bookDto.getQuantity())
                .bookCover(bookDto.getBookCover())
                .bookCoverUrl(bookDto.getBookCoverUrl())
                .build();
    }
}
