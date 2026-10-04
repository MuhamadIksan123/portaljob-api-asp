import { useGetBookmarksQuery } from "./bookmarkApi";
import JobCard from "../job/JobCard";

export default function BookmarksPage() {
  const { data = [], isLoading } = useGetBookmarksQuery();

  return (
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
        <h1 className="fw-bold text-white mb-4" style={{ fontSize: "28px" }}>
          Bookmarks Result:
        </h1>
      </header>

      <section
        className="container position-relative mt-2"
        style={{ maxWidth: 1130, zIndex: 1 }}
      >
        {isLoading ? (
          <div className="alert alert-light border">Loading...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-white py-5">
            <h5 className="fw-semibold mb-2">Tidak ada bookmark</h5>
            <p className="mb-0 text-secondary">
              Anda belum menyimpan lowongan pekerjaan apa pun.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {data.map((item) => {
              const jobSummary = {
                id: item.jobId,
                name: item.jobName,
                slug: item.jobSlug,
                companyName: item.companyName,
                thumbnailUrl: item.thumbnailUrl,
                location: item.location,
                type: item.type,
                salary: item.salary,
                isOpen: item.isOpen,
              };

              return (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={item.id}
                >
                  <JobCard job={jobSummary} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
