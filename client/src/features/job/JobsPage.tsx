import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import PublicHeader from "../../app/layout/PublicHeader";
import { useGetJobsQuery } from "./jobApi";

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") ?? "";
  const categorySlug = searchParams.get("categorySlug") ?? undefined;
  const [keyword, setKeyword] = useState(initialKeyword);

  const { data, isLoading } = useGetJobsQuery({
    keyword: initialKeyword || undefined,
    categorySlug,
  });

  const search = (value: string) => {
    setKeyword(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("keyword", value.trim());
    else next.delete("keyword");
    setSearchParams(next);
  };

  return (
    <main
      className="min-vh-100 pb-5 overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif", color: "#0E0140" }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 overflow-hidden"
        style={{ height: 863, zIndex: -1 }}
      >
        <img
          src="/assets/backgrounds/Group 2009.png"
          alt="background"
          className="w-100 h-100"
          style={{ objectFit: "fill" }}
        />
      </div>

      <PublicHeader />

      <header className="container mt-5 pt-4" style={{ maxWidth: 1130 }}>
        <div className="d-flex flex-column align-items-center gap-4">
          <h1
            className="text-white fw-bold text-center mb-0"
            style={{ fontSize: 36, lineHeight: "50px", fontWeight: 900 }}
          >
            Explore 10,000
            <br />
            Most Popular Jobs
          </h1>

          <div className="w-100" style={{ maxWidth: 579 }}>
            <label className="visually-hidden" htmlFor="keyword">
              Search jobs
            </label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white border-end-0 rounded-start-pill ps-4">
                <img
                  src="/assets/icons/search-normal.svg"
                  alt="icon"
                  width="24"
                  height="24"
                />
              </span>
              <input
                id="keyword"
                type="text"
                className="form-control border-start-0 border-end-0 shadow-none"
                value={keyword}
                onChange={(e) => search(e.target.value)}
                placeholder="Quick search your dream job..."
              />
              <span className="input-group-text bg-white border-start-0 rounded-end-pill pe-2">
                <span
                  className="d-flex align-items-center justify-content-center rounded-pill text-white fw-semibold"
                  style={{
                    backgroundColor: "#FF6B2C",
                    minWidth: 120,
                    minHeight: 50,
                  }}
                >
                  Explore Now
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="container mt-5 pt-4" style={{ maxWidth: 1130 }}>
        <h2 className="text-white fw-bold fs-3 mb-4">
          {keyword ? `Search Result: ${keyword}` : "Latest Jobs"}
        </h2>

        {categorySlug && (
          <div className="badge text-bg-light mb-4 px-3 py-2">
            Category: {categorySlug}
          </div>
        )}

        {isLoading ? (
          <div className="alert alert-light border">Loading...</div>
        ) : (
          <div className="row g-4">
            {(data?.items ?? []).map((job) => (
              <div className="col-12 col-md-6 col-lg-4" key={job.id}>
                <div
                  className="card h-100 border shadow-sm"
                  style={{ borderColor: "#E8E4F8", borderRadius: 20 }}
                >
                  <div className="card-body p-4 d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="flex-shrink-0"
                        style={{ width: 70, height: 70 }}
                      >
                        <img
                          src={job.thumbnailUrl || "/assets/logos/Logo.svg"}
                          alt={job.companyName}
                          className="w-100 h-100"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="fw-semibold mb-1 text-truncate">
                          {job.companyName}
                        </p>
                        <p className="small mb-0">Posted job</p>
                      </div>
                    </div>
                    <hr style={{ borderColor: "#E8E4F8" }} />
                    <p className="fw-bold fs-5 mb-0">{job.name}</p>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src="/assets/icons/note-favorite-orange.svg"
                          alt="icon"
                          width="24"
                          height="24"
                        />
                        <span className="fw-medium">{job.type}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src="/assets/icons/moneys-cyan.svg"
                          alt="icon"
                          width="24"
                          height="24"
                        />
                        <span className="fw-medium">Guaranteed</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src="/assets/icons/location-purple.svg"
                          alt="icon"
                          width="24"
                          height="24"
                        />
                        <span className="fw-medium">{job.location}</span>
                      </div>
                    </div>
                    <hr style={{ borderColor: "#E8E4F8" }} />
                    <div className="d-flex align-items-end justify-content-between gap-2 mt-auto">
                      <div>
                        <p className="fw-bold fs-5 mb-0">
                          Rp {job.salary.toLocaleString("id-ID")}
                        </p>
                        <p className="small mb-0">/month</p>
                      </div>
                      <Link
                        to={`/jobs/${job.slug}`}
                        className="btn rounded-pill px-4 py-2 text-white fw-semibold"
                        style={{ backgroundColor: "#FF6B2C" }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
