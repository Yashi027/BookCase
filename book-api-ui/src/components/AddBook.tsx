import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { addBook } from "../services/book.service";
import type { BookDto } from "../types/BookDto";

const initialFormData: BookDto = {
    isbn: "",
    title: "",
    author: "",
    category: "",
    price: 0,
    quantity: 0,
};

const AddBook = () => {
    const [formData, setFormData] = useState<BookDto>(initialFormData);
    const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);
    const [bookCoverPreview, setBookCoverPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!bookCoverFile) {
            setBookCoverPreview("");
            return;
        }

        const previewUrl = URL.createObjectURL(bookCoverFile);
        setBookCoverPreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [bookCoverFile]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "quantity"
                    ? value === ""
                        ? 0
                        : Number(value)
                    : value,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setError("");

        if (file && !file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            e.target.value = "";
            setBookCoverFile(null);
            return;
        }

        setBookCoverFile(file);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (
            !formData.isbn.trim() ||
            !formData.title.trim() ||
            !formData.author.trim() ||
            !formData.category.trim()
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!Number.isFinite(formData.price) || formData.price < 0) {
            setError("Please enter a valid price.");
            return;
        }

        if (
            !Number.isInteger(formData.quantity) ||
            formData.quantity < 0
        ) {
            setError("Quantity must be a non-negative whole number.");
            return;
        }

        const data = new FormData();

        data.append(
            "bookDtoJson",
            JSON.stringify({
                ...formData,
                isbn: formData.isbn.trim(),
                title: formData.title.trim(),
                author: formData.author.trim(),
                category: formData.category.trim(),
            })
        );

        if (bookCoverFile) {
            data.append("file", bookCoverFile);
        }

        try {
            setLoading(true);

            await addBook(data);

            setMessage("Your book has been added successfully!");
            setFormData({ ...initialFormData });
            setBookCoverFile(null);

            const fileInput = document.getElementById(
                "bookCover"
            ) as HTMLInputElement | null;

            if (fileInput) fileInput.value = "";
        } catch (err: unknown) {
            const axiosError = err as {
                response?: {
                    data?: unknown;
                    status?: number;
                };
            };

            const responseData = axiosError.response?.data;

            setError(
                typeof responseData === "string"
                    ? responseData
                    : axiosError.response?.status
                        ? `Failed to add book (${axiosError.response.status}). Please try again.`
                        : "Unable to connect to the server. Please check your backend."
            );

            console.error("Error adding book:", err);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    const resetForm = () => {
        setFormData({ ...initialFormData });
        setBookCoverFile(null);
        setMessage("");
        setError("");

        const input = document.getElementById(
            "bookCover"
        ) as HTMLInputElement | null;

        if (input) input.value = "";
    };

    return (
        <main className="min-h-screen bg-[#f5f7f2] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
  
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-emerald-800">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-emerald-800">
                            Add Books
                        </span>
                    </div>

                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-800">
                        Bookcase Collection
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
                        Add a New Book
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                        Grow your collection by adding book details,
                        setting the price, and uploading a cover image.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="h-1.5 bg-emerald-900" />

                    <div className="p-5 sm:p-8 lg:p-10">
                        {message && (
                            <div
                                role="status"
                                className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                            >
                                <p className="font-bold">Success!</p>
                                <p className="mt-1">{message}</p>
                            </div>
                        )}

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                            >
                                <p className="font-bold">
                                    Something went wrong
                                </p>
                                <p className="mt-1">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                                        📖
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-emerald-950">
                                            Book Information
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Enter the basic details.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="isbn" className={labelClass}>
                                            ISBN 
                                        </label>
                                        <input
                                            id="isbn"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleChange}
                                            placeholder="Enter ISBN"
                                            required
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="title" className={labelClass}>
                                            Book Title 
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Enter book title"
                                            required
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="author" className={labelClass}>
                                            Author 
                                        </label>
                                        <input
                                            id="author"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            placeholder="Enter author name"
                                            required
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className={labelClass}>
                                            Category 
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">
                                                Choose a category
                                            </option>
                                            <option value="Fiction">Fiction</option>
                                            <option value="Non-Fiction">Non-Fiction</option>
                                            <option value="Science">Science</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Education">Education</option>
                                            <option value="Biography">Biography</option>
                                            <option value="Fantasy">Fantasy</option>
                                            <option value="Mystery">Mystery</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-gray-100" />

                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl">
                                        🏷️
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-emerald-950">
                                            Pricing & Inventory
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Set the price and available stock.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="price" className={labelClass}>
                                            Price (₹) *
                                        </label>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="quantity" className={labelClass}>
                                            Quantity *
                                        </label>
                                        <input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="border-t border-gray-100" />

                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                                        🖼️
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-emerald-950">
                                            Book Cover
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Upload an optional cover image.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-5 sm:p-6">
                                    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                                        <div className="flex h-36 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                            {bookCoverPreview ? (
                                                <img
                                                    src={bookCoverPreview}
                                                    alt="Book cover preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <span className="text-3xl">
                                                        📚
                                                    </span>
                                                    <p className="mt-2 text-xs text-gray-400">
                                                        Cover preview
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <label
                                                htmlFor="bookCover"
                                                className="mb-2 block text-sm font-semibold text-emerald-950"
                                            >
                                                Choose cover image
                                            </label>

                                            <input
                                                id="bookCover"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-900 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-emerald-800"
                                            />

                                            <p className="mt-3 text-xs text-gray-500">
                                                Image files only. The cover is optional.
                                            </p>

                                            {bookCoverFile && (
                                                <>
                                                    <p className="mt-2 break-all text-sm font-medium text-emerald-800">
                                                        {bookCoverFile.name}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setBookCoverFile(null);
                                                            const input = document.getElementById(
                                                                "bookCover"
                                                            ) as HTMLInputElement | null;
                                                            if (input) input.value = "";
                                                        }}
                                                        className="mt-2 text-sm font-semibold text-red-600 hover:underline"
                                                    >
                                                        Remove image
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Reset Form
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-900 px-7 py-3 text-sm font-bold text-amber-300 shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Adding Book..."
                                        : "＋ Add to Collection"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Every great collection starts with a book.{" "}
                    <span className="text-emerald-800">📚</span>
                </p>
            </div>
        </main>
    );
};

export default AddBook;