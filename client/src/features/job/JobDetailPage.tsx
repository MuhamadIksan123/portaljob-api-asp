import { Link, useParams } from "react-router";
import PublicHeader from "../../app/layout/PublicHeader";
import { useGetJobQuery } from "./jobApi";

export default function JobDetailPage() {
  const { slug = "" } = useParams();
  const { data: job, isLoading } = useGetJobQuery(slug);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        Job not found.
      </div>
    );
  }

  return (
    <main
      className="min-vh-100 pb-5 overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif", color: "#0E0140" }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 overflow-hidden"
        style={{ height: 533, zIndex: -1 }}
      >
        <img
          src="/assets/backgrounds/Group 2009.png"
          alt="background"
          className="w-100 h-100"
          style={{ objectFit: "fill" }}
        />
      </div>

      <PublicHeader />

      <article
        className="container bg-white border shadow-sm p-4 p-lg-5 mt-5"
        style={{ maxWidth: 900, borderColor: "#E8E4F8", borderRadius: 20 }}
      >
        <div className="position-relative">
          <div
            className="w-100 overflow-hidden"
            style={{
              aspectRatio: "840 / 300",
              backgroundColor: "#D9D9D9",
              borderRadius: 20,
            }}
          >
            <img
              src={job.thumbnailUrl}
              alt="cover image"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="position-absolute bottom-0 start-0 translate-middle-y ms-4">
            <div
              className="d-flex align-items-center justify-content-center bg-white border shadow-sm p-3"
              style={{
                width: 120,
                height: 120,
                borderColor: "#E8E4F8",
                borderRadius: 20,
              }}
            >
              <img
                src="/assets/logos/Logo-black.svg"
                alt="logo"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="position-absolute bottom-0 end-0 translate-middle-y me-4">
            <span
              className="badge rounded-pill px-3 py-2 fw-bold"
              style={{
                backgroundColor: job.isOpen ? "#7521FF" : "#FF2C39",
                color: "#fff",
                fontSize: "1rem",
              }}
            >
              {job.isOpen ? "WE’RE HIRING!" : "CLOSED"}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-5">
          <h1
            className="fw-bold mb-2"
            style={{ fontSize: 32, lineHeight: "48px" }}
          >
            {job.name}
          </h1>
          <p className="mb-0">{job.categoryName} • Job Portal</p>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-12 col-sm-6 col-lg-3 d-flex align-items-center gap-2">
            <img
              src="/assets/icons/note-favorite-orange.svg"
              alt="icon"
              width="38"
              height="38"
            />
            <span className="fw-semibold fs-5">{job.type}</span>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 d-flex align-items-center gap-2">
            <img
              src="/assets/icons/personalcard-yellow.svg"
              alt="icon"
              width="38"
              height="38"
            />
            <span className="fw-semibold fs-5">{job.skillLevel}</span>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 d-flex align-items-center gap-2">
            <img
              src="/assets/icons/moneys-cyan.svg"
              alt="icon"
              width="38"
              height="38"
            />
            <span className="fw-semibold fs-5">
              Rp {job.salary.toLocaleString("id-ID")}/mo
            </span>
          </div>
          <div className="col-12 col-sm-6 col-lg-3 d-flex align-items-center gap-2">
            <img
              src="/assets/icons/location-purple.svg"
              alt="icon"
              width="38"
              height="38"
            />
            <span className="fw-semibold fs-5">{job.location}</span>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="h5 fw-semibold">Overview</h2>
          <p className="fs-5 mb-0" style={{ lineHeight: "34px" }}>
            {job.about}
          </p>
        </div>

        <div className="mt-5">
          <h2 className="h5 fw-semibold">Responsibilities</h2>
          <div className="d-flex flex-column gap-3 mt-3">
            {job.responsibilities.map((item) => (
              <div key={item} className="d-flex align-items-start gap-2">
                <img
                  src="/assets/icons/tick-circle.svg"
                  alt="tick icon"
                  width="24"
                  height="24"
                  className="mt-1"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h2 className="h5 fw-semibold">Qualifications</h2>
          <div className="d-flex flex-column gap-3 mt-3">
            {job.qualifications.map((item) => (
              <div key={item} className="d-flex align-items-start gap-2">
                <img
                  src="/assets/icons/tick-circle.svg"
                  alt="tick icon"
                  width="24"
                  height="24"
                  className="mt-1"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h2 className="h5 fw-semibold">Company</h2>
          <div className="d-flex align-items-center gap-3 mt-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: 70, height: 70 }}
            >
              <img
                src="/assets/logos/Logo-black.svg"
                alt="icon"
                className="img-fluid"
              />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold">{job.companyName}</span>
                <img
                  src="/assets/icons/verify.svg"
                  alt="verified"
                  width="24"
                  height="24"
                />
              </div>
              <span className="small">Company jobs</span>
            </div>
          </div>
        </div>

        <hr className="my-5" style={{ borderColor: "#E8E4F8" }} />

        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/assets/icons/security-user.svg"
              alt="icon"
              width="24"
              height="24"
            />
            <span className="fw-semibold">
              We use Angga to secure your data 100%
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn rounded-pill px-4 py-2"
              style={{ border: "1px solid #0E0140", color: "#0E0140" }}
            >
              Bookmark
            </button>
            {job.isOpen && (
              <Link
                to={`/jobs/${job.slug}/apply`}
                className="btn rounded-pill px-4 py-2 text-white fw-semibold"
                style={{ backgroundColor: "#FF6B2C" }}
              >
                Apply Now
              </Link>
            )}
          </div>
        </div>
      </article>

      {job.relatedJobs.length > 0 && (
        <section className="container mt-5 pt-3" style={{ maxWidth: 1130 }}>
          <h2 className="fw-bold fs-3 mb-4">
            Other Jobs You
            <br />
            Might Interested
          </h2>
          <div className="d-flex gap-3 overflow-auto pb-3">
            {job.relatedJobs.map((item) => (
              <div
                key={item.id}
                className="card flex-shrink-0 border shadow-sm"
                style={{ width: 300, borderColor: "#E8E4F8", borderRadius: 20 }}
              >
                <div className="card-body p-4 d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.thumbnailUrl || "/assets/logos/Logo.svg"}
                      alt={item.companyName}
                      width="70"
                      height="70"
                      style={{ objectFit: "contain" }}
                    />
                    <div>
                      <p className="fw-semibold mb-1">{item.companyName}</p>
                      <p className="small mb-0">Job listing</p>
                    </div>
                  </div>
                  <hr style={{ borderColor: "#E8E4F8" }} />
                  <p className="fw-bold fs-5 mb-0">{item.name}</p>
                  <div className="d-flex flex-column gap-2">
                    <span>{item.type}</span>
                    <span>Guaranteed</span>
                    <span>{item.location}</span>
                  </div>
                  <hr style={{ borderColor: "#E8E4F8" }} />
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold">
                      Rp {item.salary.toLocaleString("id-ID")}/mo
                    </span>
                    <Link
                      to={`/jobs/${item.slug}`}
                      className="btn rounded-pill px-4 py-2 text-white fw-semibold"
                      style={{ backgroundColor: "#FF6B2C" }}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
