import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "./accountApi";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await login({ email, password }).unwrap();
      toast.success("Login successful.");
      navigate("/categories");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your email and password.");
    }
  };

  return (
    <main
      className="min-vh-100"
      style={{ fontFamily: "Poppins, sans-serif", color: "#0E0140" }}
    >
      <div className="row g-0 min-vh-100">
        <div className="col-lg-5 d-none d-lg-block position-relative overflow-hidden">
          <img
            src="/assets/backgrounds/Smiley Woman on Floor.png"
            alt="background image"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
          <div
            className="position-absolute bottom-0 start-0 end-0 mx-4 mb-4 bg-white p-4 shadow-sm"
            style={{ border: "1px solid #E8E4F8", borderRadius: 20 }}
          >
            <p className="fw-semibold mb-4" style={{ lineHeight: "32px" }}>
              Berkat Jobank saya bisa bekerja dari rumah dengan santai tanpa
              harus macet-macetan. Seluruh lokernya juga aman bebas dari
              penipuan yang sering terjadi saat ini di seluruh dunia.
            </p>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src="/assets/photos/photo2.png"
                  alt="profile picture"
                  className="rounded-circle"
                  width="60"
                  height="60"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <p className="fw-semibold mb-0">Shayna Angga</p>
                  <p className="small mb-0">Programmer</p>
                </div>
              </div>
              <div className="d-flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <img
                    key={index}
                    src="/assets/icons/Star.svg"
                    alt="star"
                    width="22"
                    height="22"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="col-12 col-lg-7 d-flex align-items-center justify-content-center py-5 px-4">
          <div className="w-100" style={{ maxWidth: 500 }}>
            <Link to="/" className="d-inline-flex mb-5">
              <img
                src="/assets/logos/Logo-black.svg"
                alt="logo"
                style={{ width: 180 }}
              />
            </Link>

            <form
              className="d-flex flex-column gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <h1 className="h3 fw-bold mb-0">Sign In</h1>

              <div>
                <label className="form-label fw-semibold" htmlFor="email">
                  Email Address
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-4">
                    <img
                      src="/assets/icons/sms.svg"
                      alt="email icon"
                      width="24"
                      height="24"
                    />
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="form-control border-start-0 rounded-end-pill shadow-none"
                    placeholder="Write your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label fw-semibold" htmlFor="password">
                  Password
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-4">
                    <img
                      src="/assets/icons/lock.svg"
                      alt="password icon"
                      width="24"
                      height="24"
                    />
                  </span>
                  <input
                    id="password"
                    type="password"
                    className="form-control border-start-0 rounded-end-pill shadow-none"
                    placeholder="Write your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <Link
                    to="/login"
                    className="small text-decoration-none"
                    style={{ color: "#0E0140" }}
                  >
                    Forgot Password
                  </Link>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <button
                  type="submit"
                  className="btn rounded-pill py-3 fw-semibold text-white"
                  style={{ backgroundColor: "#FF6B2C" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In to My Account"}
                </button>
                <Link
                  to="/register"
                  className="btn rounded-pill py-3 fw-semibold"
                  style={{ color: "#0E0140", border: "1px solid #0E0140" }}
                >
                  Create New Account
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
