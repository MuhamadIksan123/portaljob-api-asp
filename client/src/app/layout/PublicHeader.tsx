import { Link } from "react-router";

export default function PublicHeader() {
  return (
    <nav className="container mx-auto pt-5" style={{ maxWidth: 1130 }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <Link to="/" className="d-flex flex-shrink-0">
          <img
            src="/assets/logos/Logo.svg"
            alt="Jobank"
            style={{ width: 150, height: "auto" }}
          />
        </Link>

        <ul className="nav align-items-center gap-lg-4 gap-2">
          <li className="nav-item">
            <Link className="nav-link px-2 text-white fw-semibold" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item d-none d-md-block">
            <a
              className="nav-link px-2 text-white fw-medium"
              href="#Categories"
            >
              Features
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <a
              className="nav-link px-2 text-white fw-medium"
              href="#Categories"
            >
              Benefits
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <a className="nav-link px-2 text-white fw-medium" href="#Latest">
              Stories
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <a className="nav-link px-2 text-white fw-medium" href="#Latest">
              About
            </a>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-2">
          <Link
            to="/login"
            className="btn rounded-pill px-4 py-2 fw-semibold text-white border border-white"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn rounded-pill px-4 py-2 fw-semibold text-white border-0"
            style={{ backgroundColor: "#FF6B2C" }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
