import { useParams } from "react-router";
import AppHeader from "../../app/layout/AppHeader";
import { useGetMineByIdQuery } from "./applicationApi";

export default function MyApplicationDetailPage() {
  const { id } = useParams();
  const applicationId = Number(id);
  const { data: application, isLoading } = useGetMineByIdQuery(applicationId, {
    skip: !Number.isInteger(applicationId),
  });

  if (isLoading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        Loading...
      </div>
    );
  if (!application)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        Application not found.
      </div>
    );

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <AppHeader title="Candidate Details" />
      <main className="py-5">
        <div className="container" style={{ maxWidth: 960 }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 8 }}>
            <div className="card-body p-4 p-lg-5">
              <div className="row align-items-center g-4">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 bg-light d-flex align-items-center justify-content-center"
                      style={{ width: 120, height: 90 }}
                    >
                      <img
                        src="/assets/icons/briefcase.svg"
                        alt=""
                        width="50"
                        height="50"
                      />
                    </div>
                    <div>
                      <h1
                        className="h5 fw-bold mb-1"
                        style={{ color: "#1e1b4b" }}
                      >
                        {application.jobName}
                      </h1>
                      <p className="text-secondary small mb-0">
                        {application.companyName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="d-flex justify-content-md-end">
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        backgroundColor: application.isHired
                          ? "#22C55E"
                          : "#F97316",
                      }}
                    >
                      {application.isHired ? "HIRED" : "SUBMITTED"}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="my-5" />

              <h2 className="h5 fw-bold" style={{ color: "#1e1b4b" }}>
                My Profile
              </h2>
              <div className="d-flex align-items-center gap-3 mt-3">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{ width: 70, height: 70 }}
                >
                  <img
                    src="/assets/icons/user.svg"
                    alt=""
                    width="36"
                    height="36"
                  />
                </div>
                <div>
                  <p className="fw-bold mb-1" style={{ color: "#1e1b4b" }}>
                    {application.candidateName}
                  </p>
                  <p className="text-secondary small mb-0">
                    {application.candidateId}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h2 className="h5 fw-bold" style={{ color: "#1e1b4b" }}>
                  Message
                </h2>
                <p className="mb-0">{application.message}</p>
              </div>

              <div className="mt-4">
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary rounded-pill px-4"
                >
                  Open Resume
                </a>
              </div>

              <div className="mt-5">
                <p className="text-secondary mb-0">
                  Application status is based on the existing API response and
                  current state logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
