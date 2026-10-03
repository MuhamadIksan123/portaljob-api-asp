import AppHeader from "../../app/layout/AppHeader";
import { useParams } from "react-router";
import { useGetJobApplicationsQuery, useHireMutation } from "./applicationApi";
import { toast } from "react-toastify";

export default function CandidatesPage() {
  const { jobId } = useParams();
  const id = Number(jobId);
  const { data: candidates = [] } = useGetJobApplicationsQuery(id, {
    skip: !Number.isInteger(id),
  });
  const [hire] = useHireMutation();

  const handleHire = async (candidateId: number) => {
    try {
      await hire(candidateId).unwrap();
      toast.success("Candidate hired successfully.");
    } catch (error) {
      console.error("Hire failed:", error);
      toast.error("Failed to hire candidate.");
    }
  };

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <AppHeader title="Candidates" />
      <main className="py-5">
        <div className="container" style={{ maxWidth: 1140 }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 8 }}>
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h1 className="h4 fw-bold mb-0" style={{ color: "#1e1b4b" }}>
                  Candidates
                </h1>
                <span className="text-secondary small">
                  {candidates.length} candidates
                </span>
              </div>

              {candidates.length === 0 ? (
                <div className="alert alert-light border">
                  No candidates found.
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="border-bottom pb-3">
                      <div className="row align-items-center g-3">
                        <div className="col-12 col-lg-6">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                              style={{ width: 64, height: 64 }}
                            >
                              <img
                                src="/assets/icons/user.svg"
                                alt=""
                                width="32"
                                height="32"
                              />
                            </div>
                            <div>
                              <h2
                                className="h6 fw-bold mb-1"
                                style={{ color: "#1e1b4b" }}
                              >
                                {candidate.candidateName}
                              </h2>
                              <p className="text-secondary small mb-0">
                                {candidate.candidateId}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-3">
                          <div className="small text-secondary mb-1">
                            Status
                          </div>
                          <span
                            className="badge rounded-pill px-3 py-2"
                            style={{
                              backgroundColor: candidate.isHired
                                ? "#22C55E"
                                : "#F97316",
                            }}
                          >
                            {candidate.isHired ? "HIRED" : "WAITING"}
                          </span>
                        </div>
                        <div className="col-12 col-lg-3 d-flex justify-content-lg-end flex-wrap gap-2">
                          <a
                            href={candidate.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary rounded-pill"
                          >
                            Resume
                          </a>
                          {!candidate.isHired && (
                            <button
                              type="button"
                              className="btn rounded-pill text-white fw-bold"
                              style={{ backgroundColor: "#4338CA" }}
                              onClick={() => void handleHire(candidate.id)}
                            >
                              Hire
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 mb-0">{candidate.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
