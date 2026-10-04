import { Link, useParams } from "react-router";
import { useGetJobQuery } from "./jobApi";
import {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useDeleteBookmarkMutation,
} from "../bookmarks/bookmarkApi";
import { toast } from "react-toastify";
import JobCard from "./JobCard";
import { formatDate } from "../../lib/utils";

export default function JobDetailPage() {
  const { slug = "" } = useParams();
  const { data: job, isLoading } = useGetJobQuery(slug);

  // 1. Ambil data list bookmark & mutasi
  const { data: bookmarks = [] } = useGetBookmarksQuery();
  const [addBookmark, { isLoading: isAdding }] = useAddBookmarkMutation();
  const [deleteBookmark, { isLoading: isDeleting }] =
    useDeleteBookmarkMutation();

  // 2. Cek apakah job saat ini sudah dibookmark
  const isBookmarked = job ? bookmarks.some((b) => b.jobId === job.id) : false;

  // 3. Handler toggle simpan / hapus bookmark
  const handleToggleBookmark = async () => {
    if (!job) {
      toast.error("Job not found.");
      return;
    }

    try {
      if (isBookmarked) {
        await deleteBookmark(job.id).unwrap();
        toast.info("Removed from bookmarks.");
      } else {
        await addBookmark(job.id).unwrap();
        toast.success("Job bookmarked.");
      }
    } catch {
      toast.error("Failed to update bookmark.");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#0B0436" }}
      >
        <span className="text-white">Loading...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#0B0436" }}
      >
        <span className="text-white">Job not found.</span>
      </div>
    );
  }

  return (
    <>
      <main
        className="min-vh-100 pb-5 position-relative overflow-x-hidden"
        style={{
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#0B0436",
        }}
      >
        {/* Background illustration */}
        <div
          className="position-absolute top-0 start-0 w-100 overflow-hidden"
          style={{ height: 1330, zIndex: 0, pointerEvents: "none" }}
        >
          <img
            src="/assets/backgrounds/Group 2009.png"
            alt=""
            className="w-100 h-100"
            style={{ objectFit: "fill" }}
          />
        </div>

        {/* Main Job Detail Content */}
        <section
          className="container my-5 position-relative"
          style={{ zIndex: 1 }}
        >
          <div className="mx-auto" style={{ maxWidth: 850 }}>
            <div
              className="bg-white shadow-lg overflow-hidden text-dark"
              style={{ borderRadius: 32 }}
            >
              <div className="p-4 pb-0">
                <img
                  src={
                    job.thumbnailUrl ||
                    "/assets/backgrounds/hero illustration v2.png"
                  }
                  className="w-100"
                  style={{ height: 320, objectFit: "cover", borderRadius: 24 }}
                  alt={job.name}
                />
              </div>

              <div className="p-4 p-lg-5">
                <span
                  className="badge mb-3 text-white px-3 py-2 fw-semibold"
                  style={{
                    backgroundColor: "#7B3FE4",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  {job.isOpen ? "WE'RE HIRING!" : "CLOSED"}
                </span>

                <h2
                  className="fw-bold mb-1"
                  style={{ fontSize: "32px", color: "#0C0039" }}
                >
                  {job.name}
                </h2>
                <p className="text-muted" style={{ fontSize: "14px" }}>
                  {job.categoryName} • Posted at{" "}
                  {formatDate(job.createdAt ?? undefined)}
                </p>

                {/* Metadata info */}
                <div className="d-flex flex-wrap gap-4 my-4 fw-semibold justify-content-between py-2">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="/assets/icons/note-favorite-orange.svg"
                      width="24"
                      height="24"
                      alt=""
                    />
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      {job.type}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="/assets/icons/personalcard-yellow.svg"
                      width="24"
                      height="24"
                      alt=""
                    />
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      {job.skillLevel}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="/assets/icons/moneys-cyan.svg"
                      width="24"
                      height="24"
                      alt=""
                    />
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      Rp {job.salary.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="/assets/icons/location-purple.svg"
                      width="24"
                      height="24"
                      alt=""
                    />
                    <span style={{ fontSize: "14px", color: "#333" }}>
                      {job.location}
                    </span>
                  </div>
                </div>

                <h5
                  className="fw-bold mt-4"
                  style={{ fontSize: "18px", color: "#0C0039" }}
                >
                  Overview
                </h5>
                <p
                  className="text-muted"
                  style={{ fontSize: "14px", lineHeight: "24px" }}
                >
                  {job.about}
                </p>

                <h5
                  className="fw-bold mt-4"
                  style={{ fontSize: "18px", color: "#0C0039" }}
                >
                  Responsibilities
                </h5>
                <ul className="list-unstyled">
                  {job.responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-center gap-2 mb-2 text-muted"
                      style={{ fontSize: "14px" }}
                    >
                      <img
                        src="/assets/icons/tick-circle.svg"
                        width="20"
                        height="20"
                        alt=""
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h5
                  className="fw-bold mt-4"
                  style={{ fontSize: "18px", color: "#0C0039" }}
                >
                  Qualifications
                </h5>
                <ul className="list-unstyled">
                  {job.qualifications.map((item, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-center gap-2 mb-2 text-muted"
                      style={{ fontSize: "14px" }}
                    >
                      <img
                        src="/assets/icons/tick-circle.svg"
                        width="20"
                        height="20"
                        alt=""
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  <h5
                    className="fw-bold mb-3"
                    style={{ fontSize: "18px", color: "#0C0039" }}
                  >
                    Company
                  </h5>
                  <div className="bg-white py-2">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center bg-light"
                        style={{ width: 60, height: 60 }}
                      >
                        <img
                          src="/assets/logos/Logo-black.svg"
                          className="img-fluid"
                          style={{
                            maxWidth: "40px",
                            maxHeight: "40px",
                            objectFit: "contain",
                          }}
                          alt="Company Logo"
                        />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6
                            className="fw-bold mb-0"
                            style={{ fontSize: "16px", color: "#0C0039" }}
                          >
                            {job.companyName}
                          </h6>
                          <img
                            src="/assets/icons/verify.svg"
                            width="16"
                            height="16"
                            alt="verified"
                          />
                        </div>
                        <small
                          className="text-muted"
                          style={{ fontSize: "13px" }}
                        >
                          12 Jobs Available
                        </small>
                      </div>
                    </div>
                    <p
                      className="text-muted mt-3 mb-0"
                      style={{ fontSize: "14px", lineHeight: "22px" }}
                    >
                      Grab adalah perusahaan teknologi terkemuka di Asia
                      Tenggara yang menyediakan berbagai layanan berbasis
                      aplikasi untuk memudahkan kebutuhan sehari-hari
                      masyarakat. Grab dikenal sebagai super app karena
                      mengintegrasikan banyak layanan dalam satu platform yang
                      praktis dan mudah digunakan.
                    </p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <small className="text-muted" style={{ fontSize: "13px" }}>
                    🔒 We use Angga to secure your data
                  </small>
                  <div className="d-flex gap-2">
                    {/* Dynamic Bookmark Button */}
                    <button
                      type="button"
                      className={`btn rounded-pill px-4 ${
                        isBookmarked
                          ? "btn-secondary text-white"
                          : "btn-outline-secondary text-dark"
                      }`}
                      disabled={isAdding || isDeleting}
                      onClick={() => void handleToggleBookmark()}
                      style={{
                        fontSize: "14px",
                        borderColor: isBookmarked ? "transparent" : "#ddd",
                      }}
                    >
                      {isAdding || isDeleting
                        ? "Loading..."
                        : isBookmarked
                          ? "Saved"
                          : "Bookmark"}
                    </button>

                    {job.isOpen ? (
                      <Link
                        to={`/jobs/${job.slug}/apply`}
                        className="btn text-white rounded-pill px-4 fw-semibold"
                        style={{ backgroundColor: "#FF6B35", fontSize: "14px" }}
                      >
                        Apply Now
                      </Link>
                    ) : (
                      <span
                        className="btn btn-secondary rounded-pill px-4"
                        style={{ fontSize: "14px" }}
                      >
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Related Jobs */}
        {job.relatedJobs.length > 0 && (
          <section
            className="my-5 container position-relative"
            style={{ zIndex: 1, maxWidth: 1130 }}
          >
            <h2
              className="fw-bold mb-4 text-white"
              style={{ fontSize: "28px", lineHeight: "36px" }}
            >
              Other Jobs You <br />
              Might Interested
            </h2>
            <div className="row g-4">
              {job.relatedJobs.map((item) => (
                <div
                  key={item.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <JobCard job={item} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
