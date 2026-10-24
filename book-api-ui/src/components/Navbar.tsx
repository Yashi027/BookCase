import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isActive
                ? "bg-emerald-800 text-amber-300"
                : "text-gray-200 hover:bg-emerald-800 hover:text-white"
        }`;

    return (
        <nav className="sticky top-0 z-50 w-full bg-emerald-950 text-white shadow-lg">
            <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex shrink-0 items-center gap-2 text-2xl font-bold tracking-tight"
                >
                    <span className="text-3xl" aria-hidden="true">
                        📚
                    </span>
                    <span>
                        Book<span className="text-amber-300">Case</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-2 lg:flex">
                    <NavLink to="/" end className={navLinkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>

                    <NavLink to="/add-book" className={navLinkClass}>
                        Add Books
                    </NavLink>
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    className="inline-flex items-center justify-center rounded-lg p-2 text-2xl text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300 lg:hidden"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>

            {menuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-emerald-800 bg-emerald-950 px-4 pb-5 pt-3 lg:hidden"
                >
                    <div className="flex flex-col gap-2">
                        <NavLink
                            to="/"
                            end
                            onClick={closeMenu}
                            className={navLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/about"
                            onClick={closeMenu}
                            className={navLinkClass}
                        >
                            About
                        </NavLink>

                        <NavLink
                            to="/add-book"
                            onClick={closeMenu}
                            className={navLinkClass}
                        >
                            Add Books
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;