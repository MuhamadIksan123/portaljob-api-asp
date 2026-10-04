import { Link } from "react-router";
import { formatDate } from "../../lib/utils";

export interface JobItem {
  id: string | number;
  name: string;
  slug: string;
  companyName: string;
  thumbnailUrl?: string;
  type: string;
  location: string;
  salary: number;
  isOpen?: boolean;
  createdAt?: string;
}

interface JobCardProps {
  job: JobItem;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div
      className="bg-white text-dark p-3 shadow-sm h-100 d-flex flex-column justify-content-between"
      style={{ borderRadius: "18px", border: "1px solid #E8E4F8" }}
    >
      <div className="p-2">
        {/* Header: Logo & Nama Perusahaan */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <div
            className="flex-shrink-0 d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "30px", overflow: "hidden" }}
          >
            <img
              src={job.thumbnailUrl || "/assets/logos/Logo.svg"}
              alt={job.companyName}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div
            className="min-w-0 flex-grow-1"
            style={{ wordBreak: "break-word" }}
          >
            <p
              className="fw-semibold mb-0 text-dark"
              style={{
                fontSize: "13px",
                lineHeight: "1.2",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              title={job.companyName}
            >
              {job.companyName}
            </p>
            <small className="text-muted" style={{ fontSize: "11px" }}>
              Posted {formatDate(job.createdAt)}
            </small>
          </div>
        </div>

        <hr className="my-2 text-muted opacity-25" />

        {/* Judul Pekerjaan */}
        <h6
          className="fw-bold text-dark"
          style={{
            fontSize: "15px",
            lineHeight: "1.3",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "25px",
          }}
          title={job.name}
        >
          {job.name}
        </h6>

        {/* Tipe Pekerjaan & Lokasi */}
        <div className="mb-2 small d-flex flex-column gap-1 text-secondary">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/assets/icons/note-favorite-orange.svg"
              alt="type"
              width="15"
              height="15"
            />
            <span
              className="fw-medium text-dark text-truncate"
              style={{ fontSize: "13px" }}
            >
              {job.type}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <img
              src="/assets/icons/location-purple.svg"
              alt="location"
              width="15"
              height="15"
            />
            <span
              className="fw-medium text-dark text-truncate"
              style={{ fontSize: "13px" }}
            >
              {job.location}
            </span>
          </div>
        </div>
      </div>

      <div className="p-2">
        <hr className="my-2 text-muted opacity-25" />

        {/* Footer: Gaji & Tombol Details */}
        <div className="d-flex justify-content-between align-items-center gap-2">
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>
              Rp {job.salary.toLocaleString("id-ID")}
            </div>
            <div className="d-flex align-items-center gap-1 mt-1">
              <span className="text-muted" style={{ fontSize: "11px" }}>
                /month
              </span>
            </div>
          </div>
          <Link
            to={`/jobs/${job.slug}`}
            className="btn text-white rounded-pill px-3 py-1 fw-semibold flex-shrink-0"
            style={{
              backgroundColor: "#ffbc00",
              borderColor: "#ffbc00",
              fontSize: "12px",
            }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
