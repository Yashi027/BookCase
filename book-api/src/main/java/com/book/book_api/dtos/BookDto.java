package com.book.book_api.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BookDto {

    private String isbn;

    @NotBlank(message = "This field is required")
    private String title;

    @NotBlank(message = "This field is required")
    private String author;

    @NotBlank(message = "This field is required")
    private String category;

    @NotNull(message = "This field is required")
    private Double price;

    @NotNull(message = "This field is required")
    private Integer quantity;

    private String bookCover;

    private String bookCoverUrl;
}
