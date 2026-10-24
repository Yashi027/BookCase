import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-stone-50 px-5 py-16 text-gray-800 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
            About Us
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">
            Welcome to BookCase
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Your personal space to organize, manage, and explore your
            favorite books—all in one place.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold text-emerald-900">
            Our Purpose
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            BookCase is a simple and user-friendly book management
            application designed to make maintaining a book collection
            easier. You can add new books, view your collection, update
            book details, and remove books whenever needed.
          </p>

          <p className="mt-4 leading-7 text-gray-600">
            Whether you are a student, a passionate reader, or someone
            building a personal library, BookCase helps you keep your
            collection organized and accessible.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="text-3xl">📚</div>
            <h3 className="mt-4 text-lg font-bold text-emerald-900">
              Manage Books
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add, view, edit, and delete books with ease.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="text-3xl">🗂️</div>
            <h3 className="mt-4 text-lg font-bold text-emerald-900">
              Stay Organized
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Keep track of book titles, authors, categories, prices,
              and available quantities.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="text-3xl">✨</div>
            <h3 className="mt-4 text-lg font-bold text-emerald-900">
              Simple Experience
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Enjoy a clean, responsive interface that makes book
              management convenient.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-emerald-950 px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Every book has a story.
          </h2>
          <p className="mt-3 text-emerald-100">
            Let BookCase help you keep yours organized.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;