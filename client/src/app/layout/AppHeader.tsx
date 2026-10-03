import type { ReactNode } from "react";
import { Link } from "react-router";

type AppHeaderProps = {
  title: string;
  actions?: ReactNode;
};

export default function AppHeader({ title, actions }: AppHeaderProps) {
  return (
    <>
      <nav className="navbar bg-white border-bottom shadow-sm">
        <div className="container py-2">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/assets/logos/Logo-black.svg"
              alt="Jobank"
              style={{ width: 130, height: "auto" }}
            />
          </Link>

          <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
            <Link
              className="btn btn-link text-decoration-none text-dark"
              to="/"
            >
              Home
            </Link>
            <Link
              className="btn btn-link text-decoration-none text-dark"
              to="/categories"
            >
              Manage Categories
            </Link>
            <Link
              className="btn btn-link text-decoration-none text-dark"
              to="/company"
            >
              Manage Company
            </Link>
            <Link
              className="btn btn-link text-decoration-none text-dark"
              to="/manage/jobs"
            >
              My Listing
            </Link>
            <Link
              className="btn btn-link text-decoration-none text-dark"
              to="/applications"
            >
              My Applications
            </Link>
            <Link
              className="btn btn-link text-decoration-none text-dark"
              to="/profile"
            >
              Profile
            </Link>
            {actions}
          </div>
        </div>
      </nav>

      <header className="bg-white shadow-sm">
        <div className="container py-3 d-flex align-items-center justify-content-between gap-3">
          <h2 className="h5 mb-0 fw-semibold text-dark">{title}</h2>
          {actions ? null : null}
        </div>
      </header>
    </>
  );
}
