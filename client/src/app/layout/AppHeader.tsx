import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  useLogoutMutation,
  useUserInfoQuery,
} from "../../features/account/accountApi";
import { toast } from "react-toastify";

export default function AppHeader() {
  const { data: user } = useUserInfoQuery();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  // State terpisah untuk masing-masing dropdown
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const manageDropdownRef = useRef<HTMLLIElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const roles = user?.roles ?? [];
  const isSuperAdmin = roles.includes("super_admin");
  const isEmployer = roles.includes("employer");
  const isEmployee = roles.includes("employee");

  // Close dropdown saat click di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        manageDropdownRef.current &&
        !manageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsManageOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch {
      toast.error("Logout failed.");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(90deg, #0b0436, #16075f)",
        minHeight: "80px",
      }}
    >
      <div className="container-fluid px-4">
        <Link
          to="/"
          className="navbar-brand fw-bold text-white"
          style={{ fontSize: "22px" }}
        >
          JOBANK
        </Link>

        <button
          className="navbar-toggler border border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appNavbar"
          aria-controls="appNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="appNavbar">
          <ul className="navbar-nav mx-auto align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <Link className="nav-link text-white px-3" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3" to="/search/jobs">
                Search
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-white px-3" to="/bookmarks">
                  Bookmark
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link text-white px-3" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white px-3" to="/about">
                About
              </Link>
            </li>
            {/* Menu Kelola dipindah ke samping About dengan gaya nav-link biasa */}
            {user && (
              <li
                className="nav-item dropdown position-relative"
                ref={manageDropdownRef}
              >
                <button
                  type="button"
                  className="nav-link text-white px-3 bg-transparent border-0 dropdown-toggle"
                  onClick={() => {
                    setIsManageOpen((prev) => !prev);
                    setIsUserOpen(false);
                  }}
                >
                  Kelola
                </button>

                <ul
                  className={`dropdown-menu shadow mt-2 ${
                    isManageOpen ? "show" : ""
                  }`}
                  style={{ position: "absolute", left: 0, top: "100%" }}
                >
                  {isEmployee && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/applications"
                          onClick={() => setIsManageOpen(false)}
                        >
                          Applications
                        </Link>
                      </li>
                    </>
                  )}

                  {isSuperAdmin && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/categories"
                          onClick={() => setIsManageOpen(false)}
                        >
                          Category
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/contacts"
                          onClick={() => setIsManageOpen(false)}
                        >
                          Contact
                        </Link>
                      </li>
                    </>
                  )}

                  {isEmployer && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/company"
                          onClick={() => setIsManageOpen(false)}
                        >
                          Company
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/manage/jobs"
                          onClick={() => setIsManageOpen(false)}
                        >
                          Company Job
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-light me-1">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn text-white"
                  style={{ background: "#ff6b35", borderColor: "#ff6b35" }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Dropdown User Profile di sebelah kanan */}
                <div
                  className="dropdown position-relative"
                  ref={userDropdownRef}
                >
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center p-0 border-0"
                    onClick={() => {
                      setIsUserOpen((prev) => !prev);
                      setIsManageOpen(false);
                    }}
                  >
                    <span className="text-white me-2 fw-semibold d-none d-lg-inline">
                      {user.name}
                    </span>
                    <img
                      src={user.avatarUrl || "/assets/icons/user.svg"}
                      width="40"
                      height="40"
                      className="rounded-circle border border-2 border-light"
                      alt={user.name}
                      style={{ objectFit: "cover" }}
                    />
                  </button>

                  <ul
                    className={`dropdown-menu dropdown-menu-end shadow mt-2 ${
                      isUserOpen ? "show" : ""
                    }`}
                    style={{ position: "absolute", right: 0, top: "100%" }}
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                        onClick={() => setIsUserOpen(false)}
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item text-danger fw-semibold"
                        onClick={() => {
                          setIsUserOpen(false);
                          void handleLogout();
                        }}
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
