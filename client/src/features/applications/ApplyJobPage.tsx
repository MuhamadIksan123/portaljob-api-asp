import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import PublicHeader from "../../app/layout/PublicHeader";
import { useApplyMutation } from "./applicationApi";
import { toast } from "react-toastify";

export default function ApplyJobPage() {
  const { slug = "" } = useParams();
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

      <form
        className="container position-relative bg-white border shadow-sm p-4 p-lg-5 mt-5"
        style={{ maxWidth: 900, borderColor: "#E8E4F8", borderRadius: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <div className="position-absolute top-0 start-0 translate-middle-y ms-5">
          <div
            className="bg-white border shadow-sm rounded-4 d-flex align-items-center justify-content-center p-3"
            style={{ width: 120, height: 120, borderColor: "#E8E4F8" }}
          >
            <img
              src="/assets/logos/Logo-black.svg"
              alt="logo"
              className="img-fluid"
            />
          </div>
        </div>

        <div className="pt-5 mt-3">
          <span
            className="badge rounded-pill px-3 py-2 fw-bold mb-3"
            style={{ backgroundColor: "#7521FF" }}
          >
            WE’RE HIRING!
          </span>
          <h1 className="fw-bold" style={{ fontSize: 32, lineHeight: "48px" }}>
            Apply Job
          </h1>
          <p className="text-secondary mb-0">Job reference: {slug}</p>
        </div>

        <div className="mt-5">
          <h2 className="h5 fw-semibold mb-3">Write Best Cover Letter</h2>
          <div className="input-group">
            <span className="input-group-text bg-white align-items-start pt-3 border-end-0 rounded-start-4">
              <img
                src="/assets/icons/award.svg"
                alt="icon"
                width="24"
                height="24"
              />
            </span>
            <textarea
              className="form-control border-start-0 rounded-end-4 shadow-none"
              rows={9}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell your great skills and experiences"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="h5 fw-semibold mb-3">Complete Your Profile</h2>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 rounded-start-4">
              <img
                src="/assets/icons/brifecase-tick.svg"
                alt="icon"
                width="24"
                height="24"
              />
            </span>
            <input
              type="file"
              className="form-control border-start-0 rounded-end-4 shadow-none"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
              required
            />
          </div>
          <div className="form-text">PDF resume only.</div>
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
          <button
            type="submit"
            className="btn rounded-pill px-4 py-3 text-white fw-semibold"
            style={{ backgroundColor: "#FF6B2C" }}
            disabled={isLoading || !resume || !message.trim()}
          >
            {isLoading ? "Submitting..." : "Submit My Application"}
          </button>
        </div>
      </form>
    </main>
  );
}
