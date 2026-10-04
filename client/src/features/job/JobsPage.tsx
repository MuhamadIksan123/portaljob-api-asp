import { useState } from "react";
import { useSearchParams } from "react-router";
import { useGetJobsQuery } from "./jobApi";
import JobCard from "./JobCard";

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
          style={{ height: 700, zIndex: 0, pointerEvents: "none" }}
        >
          <img
            src="/assets/backgrounds/Group 2009.png"
            alt=""
            className="w-100 h-100"
            style={{ objectFit: "fill" }}
          />
        </div>

        <header
          className="container position-relative mt-3 pt-4"
          style={{ maxWidth: 1130, zIndex: 1 }}
        >
          <div className="text-center">
            <h1 className="display-5 fw-bold text-white">
              Explore 10,000 Most Popular Jobs
            </h1>

            <form
              className="d-flex justify-content-center mt-3"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Tambahkan style box-shadow / border agar tidak ada garis biru bawaan bootstrap */}
              <div
                className="input-group bg-white rounded-pill overflow-hidden p-1 shadow-sm"
                style={{ maxWidth: 650 }}
              >
                <span className="input-group-text bg-white border-0 ps-3">
                  <img
                    src="/assets/icons/search-normal.svg"
                    alt=""
                    width="24"
                    height="24"
                  />
                </span>
                <input
                  id="keyword"
                  type="text"
                  // 2. Tambahkan shadow-none agar saat diketik/focus tidak ada border biru
                  className="form-control border-0 shadow-none bg-transparent"
                  value={keyword}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Quick search your dream job..."
                />
                <button
                  type="submit"
                  className="btn text-white rounded-pill px-4"
                  style={{ backgroundColor: "#ff6b35", borderColor: "#ff6b35" }}
                >
                  Explore Now
                </button>
              </div>
            </form>
          </div>
        </header>

        <section
          className="container position-relative mt-5"
          style={{ maxWidth: 1130, zIndex: 1 }}
        >
          <h2 className="mb-4 text-white">
            {keyword ? "Search Result" : "Latest Jobs"}
          </h2>

          {categorySlug && (
            <div className="badge text-bg-light mb-4 px-3 py-2">
              Category: {categorySlug}
            </div>
          )}

          {isLoading ? (
            <div className="alert alert-light border">Loading...</div>
          ) : (data?.items ?? []).length === 0 ? (
            <div className="text-center text-white py-5">
              <h5 className="fw-semibold mb-2">Tidak ada hasil</h5>
              <p className="mb-0">Pekerjaan yang Anda cari belum tersedia.</p>
            </div>
          ) : (
            <div className="row g-4">
              {(data?.items ?? []).map((job) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={job.id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
