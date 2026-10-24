import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks, updateBook, deleteBook } from "../services/book.service";
import type { BookDto } from "../types/BookDto";
import EditBook from "../components/EditBook";
import DeleteBook from "../components/DeleteBook";

const Home = () => {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingIsbn, setDeletingIsbn] = useState<string | null>(null);
  const [selectedDeleteBook, setSelectedDeleteBook] = useState<BookDto | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadBooks = useCallback(async () => {
    try {
      setError("");
      const res = await getAllBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Unable to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const getCover = (book: BookDto) =>
    book.bookCoverUrl || book.bookCover || "";

  const handleEdit = (book: BookDto): void => {
    setSelectedBook(book);
    setIsEditOpen(true);
    setMessage("");
  };

  const handleEditSubmit = async (
    book: BookDto,
    file?: File
  ): Promise<void> => {
    try {
      const formData = new FormData();

      formData.append("bookDtoJson", JSON.stringify(book));

      if (file) {
        formData.append("file", file);
      }

      const response = await updateBook(book.isbn, formData);

      console.log("Book updated:", response.data);

      setMessage("Book updated successfully!");
      setIsEditOpen(false);
      setSelectedBook(null);

      await loadBooks();
    } catch (error: any) {
      console.error("Update error:", error);
      console.error("Backend response:", error.response?.data);
      console.error("HTTP status:", error.response?.status);

      alert(
        `Update failed (${error.response?.status ?? "Network error"}): ${typeof error.response?.data === "string"
          ? error.response.data
          : JSON.stringify(error.response?.data ?? error.message)
        }`
      );
    }
  };

  const handleDeleteClick = (book: BookDto): void => {
    setSelectedDeleteBook(book);
    setIsDeleteOpen(true);
    setMessage("");
    setError("");
  };

  
const handleConfirmDelete = async (isbn: string): Promise<void> => {
  try {
    setDeletingIsbn(isbn);
    setMessage("");
    setError("");

    const response = await deleteBook(isbn);

    console.log("Book deleted:", response.data);

    setBooks((previousBooks) =>
      previousBooks.filter((book) => book.isbn !== isbn)
    );

    setIsDeleteOpen(false);
    setSelectedDeleteBook(null);
    setMessage("Book deleted successfully!");
  } catch (err: any) {
    console.error("Failed to delete book:", err);
    console.error("HTTP status:", err.response?.status);
    console.error("Backend response:", err.response?.data);

    setError(
      `Delete failed (${err.response?.status ?? "Network error"}): ${
        typeof err.response?.data === "string"
          ? err.response.data
          : JSON.stringify(err.response?.data ?? err.message)
      }`
    );
  } finally {
    setDeletingIsbn(null);
  }
};


  return (
    <div className="min-h-screen bg-stone-50 text-gray-800">
      <section className="relative overflow-hidden bg-emerald-950 px-5 py-16 text-white sm:px-10 sm:py-20 lg:py-24">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-800/40 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="mb-5 inline-block rounded-full border border-amber-300/30 bg-white/5 px-4 py-2 text-sm text-amber-300">
              Your personal book collection
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Every book opens a{" "}
              <span className="text-amber-300">new world.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-emerald-100 sm:text-lg">
              Discover your next favorite read, explore different genres,
              and find stories worth keeping on your shelf.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#all-books"
                className="rounded-lg bg-amber-300 px-6 py-3 font-semibold text-emerald-950 transition hover:bg-amber-200"
              >
                Explore Collection →
              </a>

              <Link
                to="/add-book"
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                + Add a Book
              </Link>
            </div>
          </div>

          <div className="hidden items-center justify-center md:flex">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-white/5 lg:h-96 lg:w-96">
              <div className="absolute h-60 w-60 rounded-full border border-amber-300/20 lg:h-80 lg:w-80" />

              <div className="rotate-[-8deg] rounded-r-xl bg-amber-300 p-5 shadow-2xl lg:p-7">
                <div className="flex h-52 w-36 flex-col justify-between border-l-4 border-emerald-950/20 bg-amber-200 p-4 text-emerald-950 lg:h-64 lg:w-44">
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    The joy of
                  </span>
                  <span className="text-3xl font-bold leading-tight lg:text-4xl">
                    Reading
                  </span>
                  <span className="text-xs">
                    A journey between pages
                  </span>
                </div>
              </div>

              <span className="absolute right-5 top-10 text-3xl text-amber-300">
                ✦
              </span>
              <span className="absolute bottom-8 left-7 text-2xl text-amber-300">
                ✧
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="all-books"
        className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
              The Bookcase library
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Explore all books
            </h2>

            <p className="mt-2 text-gray-500">
              Find something wonderful to read next.
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900">
              {books.length} {books.length === 1 ? "book" : "books"}
            </span>
          )}
        </div>

        {message && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
          >
            {message}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-5 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void loadBooks();
              }}
              className="mt-5 rounded-lg bg-emerald-900 px-5 py-2.5 font-medium text-white hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">📚</div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Your library is waiting
            </h3>

            <p className="mt-2 text-gray-500">
              No books have been added yet. Start building your collection!
            </p>

            <Link
              to="/add-book"
              className="mt-6 inline-block rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Add Your First Book
            </Link>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {books.map((book) => {
              const cover = getCover(book);

              return (
                <article
                  key={book.isbn}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    {cover ? (
                      <img
                        src={cover}
                        alt={`Cover of ${book.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700 p-4 text-center text-white">
                        <span className="text-4xl">📖</span>
                        <p className="mt-4 line-clamp-3 text-base font-bold sm:text-lg">
                          {book.title}
                        </p>
                        <span className="mt-3 text-xs text-emerald-100">
                          BOOKCASE EDITION
                        </span>
                      </div>
                    )}

                    <span className="absolute left-2 top-2 max-w-[85%] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
                      {book.category || "General"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3
                      title={book.title}
                      className="line-clamp-2 text-sm font-bold leading-5 text-gray-900 sm:text-base"
                    >
                      {book.title}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                      by {book.author}
                    </p>

                    <div className="mt-auto pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-lg font-bold text-emerald-900">
                          ₹{Number(book.price).toLocaleString("en-IN")}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold sm:text-xs ${book.quantity > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                            }`}
                        >
                          {book.quantity > 0
                            ? `${book.quantity} in stock`
                            : "Out of stock"}
                        </span>
                      </div>

                      <p className="mt-3 truncate border-t border-gray-100 pt-3 text-xs text-gray-400">
                        ISBN: {book.isbn}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(book)}
                          disabled={saving}
                          className="flex-1 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(book)}
                          disabled={deletingIsbn !== null}
                          className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-emerald-900 px-5 py-10 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">
          A good book is always a good idea.
        </h2>
        <p className="mt-3 text-emerald-100">
          Keep exploring. Keep reading. Keep discovering.
        </p>
      </section>

      <EditBook
        book={selectedBook}
        isOpen={isEditOpen}
        onClose={() => {
          if (!saving) {
            setIsEditOpen(false);
            setSelectedBook(null);
          }
        }}
        onSubmit={handleEditSubmit}
      />

      <DeleteBook
        book={selectedDeleteBook}
        isOpen={isDeleteOpen}
        onClose={() => {
          if (deletingIsbn === null) {
            setIsDeleteOpen(false);
            setSelectedDeleteBook(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={deletingIsbn !== null}
      />

      {saving && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="rounded-xl bg-white px-6 py-4 font-semibold text-gray-800 shadow-xl">
            Saving changes...
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
