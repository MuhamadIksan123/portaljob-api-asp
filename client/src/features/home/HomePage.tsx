import { Link } from "react-router";
import { useGetCategoriesQuery } from "../categories/categoryApi";
import { useGetJobsQuery } from "../job/jobApi";
import JobCard from "../job/JobCard";

export default function HomePage() {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: jobs } = useGetJobsQuery({});

  return (
    <>
      <main
        className="min-vh-100 pb-5 overflow-x-hidden position-relative"
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
            alt="background"
            className="w-100 h-100"
            style={{ objectFit: "fill" }}
          />
        </div>

        {/* Hero Section */}
        <header
          className="container mt-4 pt-4 position-relative"
          style={{ maxWidth: 1130, zIndex: 1 }}
        >
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="d-inline-flex align-items-center rounded-pill bg-white py-2 px-3 gap-2 mb-4">
                <img
                  src="/assets/icons/crown-orange.svg"
                  alt="icon"
                  width="24"
                  height="24"
                />
                <span
                  className="fw-semibold small"
                  style={{ color: "#0C0039" }}
                >
                  Helped 5 Million People Worldwide Grow Career
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                <h1
                  className="text-white fw-bold mb-0"
                  style={{ fontSize: 52, lineHeight: "64px", fontWeight: 900 }}
                >
                  We Help You
                  <br />
                  Get Dream Job
                </h1>
                <p
                  className="text-white fs-5 mb-0 opacity-75"
                  style={{ lineHeight: "30px" }}
                >
                  Must trusted platform to build new career and
                  <br className="d-none d-md-block" />
                  get an happy job better than before
                </p>
              </div>

              <div className="mt-4">
                <a
                  href="#Latest"
                  className="btn text-white rounded-pill px-4 py-3 fw-semibold text-decoration-none shadow"
                  style={{ backgroundColor: "#ff6b35", fontSize: "15px" }}
                >
                  Explore Now
                </a>
              </div>
            </div>

            <div className="col-12 col-lg-6 text-center position-relative">
              <img
                src="/assets/backgrounds/hero illustration v2.png"
                alt="banner"
                className="img-fluid"
                style={{ maxWidth: 548 }}
              />
            </div>
          </div>
        </header>

        {/* Browse by Job Categories */}
        <section
          id="Categories"
          className="container mt-5 pt-5 position-relative"
          style={{ maxWidth: 1130, zIndex: 1 }}
        >
          <h2
            className="text-white fw-bold mb-4"
            style={{ fontSize: "28px", lineHeight: "36px" }}
          >
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
                      <div className="card-body p-4 d-flex flex-column justify-content-between gap-4">
                        <img
                          src="/assets/icons/Web Development 1-2.png"
                          alt="icon"
                          width="50"
                          height="50"
                          style={{ objectFit: "contain" }}
                        />
                        <div className="d-flex align-items-end justify-content-between gap-3">
                          <div>
                            <p className="fw-bold fs-6 mb-1 text-dark">
                              {category.name}
                            </p>
                            {/* Menampilkan jumlah total lowongan jika tersedia dari API */}
                            <span
                              className="text-muted"
                              style={{ fontSize: "13px" }}
                            >
                              {category.totalJobs ?? 0}
                            </span>
                          </div>
                          <img
                            src="/assets/icons/arrow-circle-right.svg"
                            alt="icon"
                            width="30"
                            height="30"
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

        {/* Latest Jobs Grid */}
        <section
          id="Latest"
          className="container mt-5 pt-5 position-relative"
          style={{ maxWidth: 1130, zIndex: 1 }}
        >
          <h2
            className="fw-bold mb-4 text-white"
            style={{ fontSize: "28px", lineHeight: "36px" }}
          >
            Latest Jobs
            <br />
            Get Them Now
          </h2>

          {/* Grid Layout 4 Kolom (Menyesuaikan gambar referensi) */}
          <div className="row g-4">
            {(jobs?.items ?? []).slice(0, 12).map((job) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {/* Tombol View More Jobs di bawah */}
          <div className="text-center mt-5">
            <Link
              to="/search/jobs"
              className="btn text-white rounded-pill px-4 py-3 fw-semibold border border-light bg-transparent"
              style={{ fontSize: "14px" }}
            >
              View More Jobs <span className="ms-2">→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
