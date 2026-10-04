import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApplyMutation } from "./applicationApi";
import { toast } from "react-toastify";
import { useGetJobQuery } from "../job/jobApi";
import { formatDate } from "../../lib/utils";

export default function ApplyJobPage() {
  const { slug = "" } = useParams();
  const { data: job } = useGetJobQuery(slug);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [apply, { isLoading }] = useApplyMutation();
  const navigate = useNavigate();

  const submit = async () => {
    if (!resume || !message.trim()) {
      toast.error("Please complete the cover letter and attach your resume.");
      return;
    }

    const form = new FormData();
    form.append("Resume", resume);
    form.append("Message", message);

    try {
      await apply({ slug, body: form }).unwrap();
      toast.success("Application submitted successfully.");
      navigate("/apply/success");
    } catch (error) {
      console.error("Application failed:", error);
      toast.error("Failed to submit application.");
    }
  };

  return (
    <>
      <main
        className="min-vh-100 pb-5 position-relative overflow-x-hidden"
        style={{
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#0B0436",
        }}
      >
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

        <div className="container position-relative my-5" style={{ zIndex: 1 }}>
          <form
            className="apply-card mx-auto col-lg-8 bg-white shadow-lg p-4 p-lg-5 mt-5 text-dark"
            style={{ borderRadius: 32 }}
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            {/* Floating Company Logo */}
            <div
              className="position-relative bg-white shadow d-flex align-items-center justify-content-center mb-3"
              style={{
                width: 110,
                height: 110,
                top: -85,
                left: 20,
                borderRadius: 24,
                border: "1px solid #eee",
              }}
            >
              <img
                src={job?.thumbnailUrl || "/assets/logos/Logo-black.svg"}
                style={{
                  maxWidth: "70%",
                  maxHeight: "70%",
                  objectFit: "contain",
                }}
                alt="Company Logo"
              />
            </div>

            <div style={{ marginTop: "-50px" }}>
              <span
                className="badge mb-3 text-white px-3 py-2 fw-semibold"
                style={{
                  backgroundColor: "#7B3FE4",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              >
                {job?.isOpen !== false ? "WE'RE HIRING!" : "CLOSED"}
              </span>

              <h2
                className="fw-bold mb-1"
                style={{ fontSize: "32px", color: "#0C0039" }}
              >
                {job ? job.name : "Apply Job"}
              </h2>
              <p className="text-muted" style={{ fontSize: "14px" }}>
                {job
                  ? `${job.categoryName} • Posted at ${formatDate(job.createdAt ?? undefined)}`
                  : `Job reference: ${slug}`}
              </p>

              {/* Job Metadata Badges (without border-top/border-bottom lines) */}
              {job && (
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
                      Rp {job.salary.toLocaleString("id-ID")} /mo
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
              )}
            </div>

            <div className="mt-4">
              <label
                className="fw-bold fs-5 mb-2 d-flex align-items-center gap-2"
                htmlFor="cover-letter"
                style={{ color: "#0C0039", fontSize: "18px" }}
              >
                <img src="/assets/icons/award.svg" width="20" alt="" />
                Write Best Cover Letter
              </label>
              <textarea
                id="cover-letter"
                className="form-control"
                style={{
                  borderRadius: 16,
                  border: "1.5px solid #E2E8F0",
                  padding: "16px 20px",
                  fontSize: "14px",
                }}
                rows={6}
                placeholder="Tell your great skills and experiences"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label
                className="fw-bold fs-5 mb-2 d-flex align-items-center gap-2"
                htmlFor="uploadBox"
                style={{ color: "#0C0039", fontSize: "18px" }}
              >
                <img src="/assets/icons/brifecase-tick.svg" width="20" alt="" />
                Complete Your Profile
              </label>
              <input
                id="uploadBox"
                type="file"
                className="form-control"
                style={{
                  borderRadius: 16,
                  border: "1.5px solid #E2E8F0",
                  padding: "16px 20px",
                  fontSize: "14px",
                }}
                accept=".pdf,application/pdf"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                required
              />
              <div className="form-text text-muted">PDF resume only.</div>
            </div>

            <hr className="my-4" />

            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2">
                <img src="/assets/icons/security-user.svg" width="20" alt="" />
                <small className="fw-semibold text-muted">
                  We secure your data 100%
                </small>
              </div>
              <button
                type="submit"
                className="btn text-white rounded-pill px-5 py-3 fw-semibold shadow-sm"
                style={{ backgroundColor: "#FF6B35", fontSize: "14px" }}
                disabled={isLoading || !resume || !message.trim()}
              >
                {isLoading ? "Submitting..." : "Apply Now"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
