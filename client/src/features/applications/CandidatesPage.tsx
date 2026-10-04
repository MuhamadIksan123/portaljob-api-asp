import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { useGetJobApplicationsQuery, useHireMutation } from "./applicationApi";

export default function CandidatesPage() {
  const { jobId = "" } = useParams();
  const id = Number(jobId);

  const { data = [], isLoading } = useGetJobApplicationsQuery(id, {
    skip: !id,
  });

  const [hire, { isLoading: hiring }] = useHireMutation();

  const handleHire = async (applicationId: number) => {
    const confirmed = window.confirm(
      "Hire this candidate? The job will be closed automatically.",
    );

    if (!confirmed) return;

    try {
      await hire(applicationId).unwrap();
      toast.success("Candidate hired successfully.");
    } catch {
      toast.error("Failed to hire candidate.");
    }
  };

  const downloadResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return <div className="container py-5">Loading candidates...</div>;
  }

  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Candidates</h4>
            <p className="text-secondary mb-0">
              Candidate applications for this job.
            </p>
          </div>

          <Link to="/manage/jobs" className="btn btn-outline-secondary">
            Back
          </Link>
        </div>

        {data.length === 0 ? (
          <div className="alert alert-light border">No candidates found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle bg-white">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Message</th>
                  <th>Applied At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.candidateName}</td>
                    <td>{item.jobName}</td>
                    <td>{item.companyName}</td>
                    <td>{item.message || "-"}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td>
                      {item.isHired ? (
                        <span className="badge text-bg-success">Hired</span>
                      ) : (
                        <span className="badge text-bg-warning">Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {item.resumeUrl && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => downloadResume(item.resumeUrl)}
                          >
                            Resume
                          </button>
                        )}

                        {!item.isHired && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={hiring}
                            onClick={() => void handleHire(item.id)}
                          >
                            Hire
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
