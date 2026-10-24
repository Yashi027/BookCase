import React from "react";
import type { BookDto } from "../types/BookDto";

interface DeleteBookProps {
  book: BookDto | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (isbn: string) => void | Promise<void>;
  isDeleting?: boolean;
}

const DeleteBook: React.FC<DeleteBookProps> = ({
  book,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !book) {
    return null;
  }

  const handleDelete = () => {
    if (!isDeleting) {
      void onConfirm(book.isbn);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-book-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 7h12m-11 0 1 13h8l1-13M9 7V4h6v3m-5 4v5m4-5v5"
            />
          </svg>
        </div>

        <h2
          id="delete-book-title"
          className="text-center text-xl font-bold text-stone-900"
        >
          Delete Book?
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-stone-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-stone-900">
            {book.title}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-stone-300 px-4 py-2.5 font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
