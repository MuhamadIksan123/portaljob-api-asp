import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "./accountApi";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState("employee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const submit = async () => {
    const form = new FormData();
    form.append("AccountType", accountType);
    form.append("Name", name);
    form.append("Email", email);
    form.append("Password", password);

    try {
      await register(form).unwrap();
      toast.success("Registration successful. You can now sign in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please check your data and try again.");
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
            src="/assets/backgrounds/Working from Home with Pet Dog 1.png"
            alt="background image"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
          <div
            className="position-absolute bottom-0 start-0 end-0 mx-4 mb-4 bg-white p-4 shadow-sm"
            style={{ border: "1px solid #E8E4F8", borderRadius: 20 }}
          >
            <p className="fw-semibold mb-4" style={{ lineHeight: "32px" }}>
              Jobank memberikan semangat baru setelah kena PHK, saya bisa
              belajar ilmu baru dan upgrade portfolio lalu mendapatkan pekerjaan
              remote dengan gaji cukup ideal! mantap.
            </p>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src="/assets/photos/photo1.png"
                  alt="photo"
                  className="rounded-circle"
                  width="60"
                  height="60"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <p className="fw-semibold mb-0">Masayoshi</p>
                  <p className="small mb-0">Product Designer</p>
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
          <form
            className="w-100 d-flex flex-column gap-4"
            style={{ maxWidth: 500 }}
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <Link to="/" className="d-inline-flex mb-2">
              <img
                src="/assets/logos/Logo-black.svg"
                alt="logo"
                style={{ width: 180 }}
              />
            </Link>

            <h1 className="h3 fw-bold mb-1">Create Account</h1>

            <div>
              <label className="form-label fw-semibold" htmlFor="name">
                Full Name
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-4">
                  <img
                    src="/assets/icons/user.svg"
                    alt="icon"
                    width="24"
                    height="24"
                  />
                </span>
                <input
                  id="name"
                  type="text"
                  className="form-control border-start-0 rounded-end-pill shadow-none"
                  placeholder="Write your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label fw-semibold" htmlFor="email">
                Email Address
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-4">
                  <img
                    src="/assets/icons/sms.svg"
                    alt="icon"
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
                  required
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
                    alt="icon"
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
                  required
                />
              </div>
            </div>

            <div>
              <p className="form-label fw-semibold mb-2">Account Type</p>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label
                    className={`card h-100 ${accountType === "employee" ? "border-2" : "border"}`}
                    style={{
                      borderRadius: 20,
                      borderColor:
                        accountType === "employee" ? "#FF6B2C" : "#0E0140",
                      cursor: "pointer",
                    }}
                  >
                    <div className="card-body text-center py-4">
                      <img
                        src="/assets/icons/briefcase.svg"
                        alt="icon"
                        width="46"
                        height="46"
                        className="mb-3"
                      />
                      <div className="fw-semibold">As an Employee</div>
                      <input
                        type="radio"
                        name="accountType"
                        value="employee"
                        checked={accountType === "employee"}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="visually-hidden"
                      />
                    </div>
                  </label>
                </div>
                <div className="col-12 col-sm-6">
                  <label
                    className={`card h-100 ${accountType === "employer" ? "border-2" : "border"}`}
                    style={{
                      borderRadius: 20,
                      borderColor:
                        accountType === "employer" ? "#FF6B2C" : "#0E0140",
                      cursor: "pointer",
                    }}
                  >
                    <div className="card-body text-center py-4">
                      <img
                        src="/assets/icons/building-4.svg"
                        alt="icon"
                        width="46"
                        height="46"
                        className="mb-3"
                      />
                      <div className="fw-semibold">As an Employer</div>
                      <input
                        type="radio"
                        name="accountType"
                        value="employer"
                        checked={accountType === "employer"}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="visually-hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                type="submit"
                className="btn rounded-pill py-3 fw-semibold text-white"
                style={{ backgroundColor: "#FF6B2C" }}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Sign Up Now"}
              </button>
              <Link
                to="/login"
                className="btn rounded-pill py-3 fw-semibold"
                style={{ color: "#0E0140", border: "1px solid #0E0140" }}
              >
                Sign In to My Account
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
