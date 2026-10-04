export default function AboutPage() {
  return (
    <>
      <main
        className="min-vh-100 pb-5 overflow-x-hidden position-relative d-flex flex-column justify-content-center align-items-center"
        style={{
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#0B0436",
        }}
      >
        {/* Background illustration jika ada */}
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

        <div
          className="container position-relative py-5"
          style={{ zIndex: 1, maxWidth: 850 }}
        >
          {/* Card Utama Pembungkus */}
          <div
            className="p-5 shadow-lg text-white text-center"
            style={{
              backgroundColor: "#13084C",
              borderRadius: "32px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Header Title & Subtitle */}
            <section className="mb-5">
              <h1
                className="fw-bold mb-3"
                style={{ fontSize: "36px", letterSpacing: "-0.5px" }}
              >
                We Help You Build Your Dream Career
              </h1>
              <p
                className="text-white-50 mx-auto"
                style={{
                  fontSize: "15px",
                  maxWidth: "600px",
                  lineHeight: "24px",
                }}
              >
                JOBANK is a modern job portal platform designed to connect job
                seekers with trusted companies efficiently, securely, and
                seamlessly.
              </p>
            </section>

            {/* Banner Misi (Oranye) */}
            <div
              className="p-4 mb-4 text-start shadow-sm"
              style={{
                backgroundColor: "#FF6B35",
                borderRadius: "20px",
              }}
            >
              <h2
                className="fw-bold mb-2 text-white"
                style={{ fontSize: "20px" }}
              >
                Our Mission
              </h2>
              <p
                className="text-white mb-0"
                style={{ fontSize: "14px", lineHeight: "22px", opacity: 0.95 }}
              >
                To empower millions of people worldwide by providing access to
                meaningful job opportunities and helping them grow their careers
                with confidence.
              </p>
            </div>

            {/* 3 Grid Fitur di Bawah */}
            <div className="row g-3 text-start">
              {/* Smart Job Matching */}
              <div className="col-md-4">
                <div
                  className="p-4 h-100 d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: "#0B0436",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div>
                    <h2
                      className="fw-bold text-white mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Smart Job Matching
                    </h2>
                    <p
                      className="text-white-50 mb-0"
                      style={{ fontSize: "13px", lineHeight: "20px" }}
                    >
                      Discover job opportunities that truly match your skills,
                      experience, and preferred location.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Companies */}
              <div className="col-md-4">
                <div
                  className="p-4 h-100 d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: "#0B0436",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div>
                    <h2
                      className="fw-bold text-white mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Verified Companies
                    </h2>
                    <p
                      className="text-white-50 mb-0"
                      style={{ fontSize: "13px", lineHeight: "20px" }}
                    >
                      All companies are verified to ensure a safe and
                      trustworthy job application experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Career Growth */}
              <div className="col-md-4">
                <div
                  className="p-4 h-100 d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: "#0B0436",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div>
                    <h2
                      className="fw-bold text-white mb-2"
                      style={{ fontSize: "16px" }}
                    >
                      Career Growth
                    </h2>
                    <p
                      className="text-white-50 mb-0"
                      style={{ fontSize: "13px", lineHeight: "20px" }}
                    >
                      More than just finding a job, we help you grow, improve,
                      and achieve long-term success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
