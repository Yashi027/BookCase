export type BookDto = {
    isbn: string,
    title: string,
    author: string,
    category: string,
    price: number,
    quantity: number,
    bookCover?: string,
    bookCoverUrl?: string
}