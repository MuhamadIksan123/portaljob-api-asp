import { Link } from "react-router";

export default function ApplySuccessPage() {
  return (
    <main
      className="min-vh-100 d-flex flex-column"
      style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#0B0436" }}
    >
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="text-center">
          <img
            src="/assets/backgrounds/success illustration.png"
            alt="Success"
            className="img-fluid mb-4"
            style={{ maxWidth: 330 }}
          />

          <h1 className="fw-semibold text-white mb-3" style={{ fontSize: 32 }}>
            Well, Great Work!
          </h1>

          <p
            className="text-white mb-4"
            style={{ maxWidth: 390, margin: "auto" }}
          >
            We have received your application and the recruiter will review in a
            couple business days
          </p>

          <Link
            to="/"
            className="btn text-white rounded-pill px-4 py-2 fw-semibold"
            style={{ backgroundColor: "#FF6B2C" }}
          >
            Explore Other Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
