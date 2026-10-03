import { Link } from "react-router";
import AppHeader from "../../app/layout/AppHeader";
import { useGetMineQuery } from "./applicationApi";

export default function MyApplicationsPage() {
  const { data: applications = [], isLoading } = useGetMineQuery();

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <AppHeader title="Manage Job Applications" />
      <main className="py-5">
        <div className="container" style={{ maxWidth: 1140 }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 8 }}>
            <div className="card-body p-4 p-lg-5">
              <h1 className="h4 fw-bold mb-4" style={{ color: "#1e1b4b" }}>
                My Applications
              </h1>
              {isLoading ? (
                <div className="alert alert-light border">Loading...</div>
              ) : applications.length === 0 ? (
                <div className="alert alert-light border">
                  Data belum tersedia
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {applications.map((item) => (
                    <div key={item.id} className="border-bottom pb-3">
                      <div className="row align-items-center g-3">
                        <div className="col-12 col-lg-5">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={
                                item.resumeUrl
                                  ? "/assets/icons/brifecase-tick.svg"
                                  : "/assets/icons/briefcase.svg"
                              }
                              alt=""
                              width="70"
                              height="70"
                              className="rounded-3 p-2 border"
                            />
                            <div>
                              <h2
                                className="h5 fw-bold mb-1"
                                style={{ color: "#1e1b4b" }}
                              >
                                {item.jobName}
                              </h2>
                              <p className="text-secondary small mb-0">
                                {item.companyName}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-4 col-lg-3">
                          <div className="text-secondary small">Status</div>
                          <span
                            className="badge rounded-pill px-3 py-2 mt-1"
                            style={{
                              backgroundColor: item.isHired
                                ? "#22C55E"
                                : "#F97316",
                              color: "#fff",
                            }}
                          >
                            {item.isHired ? "HIRED" : "WAITING"}
                          </span>
                        </div>
                        <div className="col-12 col-md-8 col-lg-4 d-flex justify-content-md-end">
                          <Link
                            to={`/applications/${item.id}`}
                            className="btn rounded-pill px-4 py-2 text-white fw-bold"
                            style={{ backgroundColor: "#4338CA" }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Link
                  to="/jobs"
                  className="btn rounded-pill px-4 py-2 text-white"
                  style={{ backgroundColor: "#6366F1" }}
                >
                  Explore Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
