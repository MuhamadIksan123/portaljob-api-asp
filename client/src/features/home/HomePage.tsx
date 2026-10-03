import { Link } from "react-router";
import PublicHeader from "../../app/layout/PublicHeader";
import { useGetCategoriesQuery } from "../categories/categoryApi";
import { useGetJobsQuery } from "../job/jobApi";

export default function HomePage() {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: jobs } = useGetJobsQuery({});

  return (
    <main
      className="min-vh-100 pb-5 overflow-x-hidden"
      style={{ fontFamily: "Poppins, sans-serif", color: "#0E0140" }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 overflow-hidden"
        style={{ height: 1330, zIndex: -1 }}
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
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6">
            <div className="d-inline-flex align-items-center rounded-pill bg-white py-2 px-3 gap-2 mb-4">
              <img
                src="/assets/icons/crown-orange.svg"
                alt="icon"
                width="24"
                height="24"
              />
              <span className="fw-semibold small" style={{ color: "#0C0039" }}>
                Helped 5 Million People Worldwide Grow Career
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              <h1
                className="text-white fw-bold mb-0"
                style={{ fontSize: 60, lineHeight: "70px", fontWeight: 900 }}
              >
                We Help You
                <br />
                Get Dream Job
              </h1>
              <p
                className="text-white fs-5 mb-0"
                style={{ lineHeight: "34px" }}
              >
                Must trusted platform to build new career and
                <br className="d-none d-md-block" />
                get an happy job better than befooore
              </p>
            </div>

            <form
              className="d-flex align-items-center bg-white rounded-pill mt-4 p-1 ps-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const keyword = String(form.get("keyword") ?? "").trim();
                window.location.href = keyword
                  ? `/search/jobs?keyword=${encodeURIComponent(keyword)}`
                  : "/search/jobs";
              }}
            >
              <div className="d-flex align-items-center gap-2 flex-grow-1 me-2">
                <img
                  src="/assets/icons/search-normal.svg"
                  alt="icon"
                  width="24"
                  height="24"
                />
                <input
                  type="text"
                  name="keyword"
                  autoComplete="off"
                  className="form-control border-0 shadow-none rounded-pill fw-semibold"
                  placeholder="Quick search your dream job..."
                  style={{ color: "#0E0140" }}
                />
              </div>
              <button
                type="submit"
                className="btn rounded-pill px-4 py-3 text-white fw-semibold flex-shrink-0"
                style={{ backgroundColor: "#FF6B2C" }}
              >
                Explore Now
              </button>
            </form>
          </div>

          <div className="col-12 col-lg-6 text-center">
            <img
              src="/assets/backgrounds/hero illustration v2.png"
              alt="banner"
              className="img-fluid"
              style={{ maxWidth: 548 }}
            />
          </div>
        </div>
      </header>

      <section
        id="Categories"
        className="container mt-5 pt-3"
        style={{ maxWidth: 1130 }}
      >
        <h2 className="text-white fw-bold mb-4" style={{ lineHeight: "36px" }}>
          Browse by
          <br />
          Job Categories
        </h2>

        <div className="row g-4">
          {categories.length === 0 ? (
            <div className="col-12">
              <p className="text-white mb-0">Belum Ada Kategori</p>
            </div>
          ) : (
            categories.map((category) => (
              <div className="col-12 col-sm-6 col-lg-3" key={category.id}>
                <Link
                  to={`/jobs?categorySlug=${encodeURIComponent(category.slug)}`}
                  className="text-decoration-none"
                >
                  <div
                    className="card h-100 border bg-white shadow-sm"
                    style={{ borderColor: "#E8E4F8", borderRadius: 20 }}
                  >
                    <div className="card-body p-4 d-flex flex-column gap-4">
                      <img
                        src="/assets/icons/Web Development 1-2.png"
                        alt="icon"
                        width="60"
                        height="60"
                        style={{ objectFit: "contain" }}
                      />
                      <div className="d-flex align-items-end justify-content-between gap-3">
                        <div>
                          <p className="fw-bold fs-5 mb-1">{category.name}</p>
                          <p className="fw-medium mb-0">Browse jobs</p>
                        </div>
                        <img
                          src="/assets/icons/arrow-circle-right.svg"
                          alt="icon"
                          width="34"
                          height="34"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      <section
        id="Latest"
        className="container mt-5 pt-3"
        style={{ maxWidth: 1130 }}
      >
        <h2 className="fw-bold fs-3 mb-4">
          Latest Jobs
          <br />
          Get Them Now
        </h2>

        <div className="d-flex gap-3 overflow-auto pb-3">
          {(jobs?.items ?? []).slice(0, 6).map((job) => (
            <div
              key={job.id}
              className="card flex-shrink-0 border shadow-sm"
              style={{ width: 300, borderColor: "#E8E4F8", borderRadius: 20 }}
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
                    <p className="small mb-0">Posted at latest</p>
                  </div>
                </div>

                <hr className="my-1" style={{ borderColor: "#E8E4F8" }} />

                <p
                  className="fw-bold fs-5 mb-0"
                  style={{ height: 54, overflow: "hidden", lineHeight: "27px" }}
                >
                  {job.name}
                </p>

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

                <hr className="my-1" style={{ borderColor: "#E8E4F8" }} />

                <div className="d-flex align-items-end justify-content-between gap-2">
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
          ))}
        </div>
      </section>
    </main>
  );
}
