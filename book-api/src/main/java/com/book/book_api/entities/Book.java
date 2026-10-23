
package com.book.book_api.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Document(collection = "books")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class Book {

    @Id
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
