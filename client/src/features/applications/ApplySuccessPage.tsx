import { Link } from "react-router";
import PublicHeader from "../../app/layout/PublicHeader";

export default function ApplySuccessPage() {
  return (
    <main
      className="min-vh-100 d-flex flex-column"
      style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#0E0140" }}
    >
      <PublicHeader />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-5">
        <div className="text-center" style={{ maxWidth: 430 }}>
          <img
            src="/assets/backgrounds/success illustration.png"
            alt="cover image"
            width="330"
            height="330"
            className="img-fluid mb-4"
            style={{ objectFit: "contain" }}
          />
          <h1
            className="fw-semibold text-white mb-3"
            style={{ fontSize: 32, lineHeight: "48px" }}
          >
            Well, Great Work!
          </h1>
          <p className="text-white mb-4" style={{ lineHeight: "26px" }}>
            We have received your application and the recruiter will review in a
            couple business days
          </p>
          <Link
            to="/"
            className="btn rounded-pill px-4 py-3 text-white fw-semibold"
            style={{ backgroundColor: "#FF6B2C" }}
          >
            Explore Other Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
