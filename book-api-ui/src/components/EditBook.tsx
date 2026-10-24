import React, { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { BookDto } from '../types/BookDto.ts';

interface EditBookProps {
  book: BookDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: BookDto, file?: File) => void;
}

const EditBook = ({
  book,
  isOpen,
  onClose,
  onSubmit,
}: EditBookProps) => {
  const [formData, setFormData] = useState<BookDto | null>(book);
  const [bookCover, setBookCover] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    book?.bookCoverUrl || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(book);
    setBookCover(null);
    setPreviewUrl(book?.bookCoverUrl || null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [book, isOpen]);

  const handleFormDataChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = event.target;

    setFormData((prev) => {
      if (!prev) return prev;

      const updatedValue =
        type === 'number' ? Number(value) : value;

      return {
        ...prev,
        [name]: updatedValue,
      };
    });
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];

    if (!file) return;

    setBookCover(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!formData) return;

    onSubmit(formData, bookCover ?? undefined);
  };

  if (!isOpen || !book || !formData) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Book
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close edit form"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleFormDataChange}
              required
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormDataChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleFormDataChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleFormDataChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormDataChange}
                min="0"
                step="0.01"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormDataChange}
                min="0"
                step="1"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Book Cover
            </label>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Book cover preview"
                className="mb-3 h-40 w-32 rounded-lg border border-gray-200 object-cover"
              />
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
            />

            <p className="mt-1 text-xs text-gray-500">
              Select a new image only if you want to replace the current cover.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-5 py-2 font-semibold text-white transition hover:bg-emerald-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
