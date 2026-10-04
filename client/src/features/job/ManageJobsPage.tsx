import { useState } from "react";
import { Link } from "react-router";
import { useGetCompaniesQuery } from "../company/companyApi";
import { useGetCategoriesQuery } from "../categories/categoryApi";
import {
  useCreateJobMutation,
  useDeleteJobMutation,
  useGetJobQuery,
  useGetMyJobsQuery,
  useUpdateJobMutation,
} from "./jobApi";
import type { JobSummary } from "../../app/models/job";
import { toast } from "react-toastify";

export default function ManageJobsPage() {
  const { data: companies = [] } = useGetCompaniesQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: jobs = [] } = useGetMyJobsQuery();

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: editingJob } = useGetJobQuery(editingSlug ?? "", {
    skip: !editingSlug,
  });

  const [createJob] = useCreateJobMutation();
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  const handleEdit = (job: JobSummary) => {
    setEditingId(job.id);
    setEditingSlug(job.slug);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted successfully.");
    } catch (error) {
      console.error("Job delete failed:", error);
      toast.error("Failed to delete job.");
    }
  };

  const reset = () => {
    setEditingId(null);
    setEditingSlug(null);
  };

  const handleSubmit = async (form: FormData) => {
    try {
      if (editingId === null) {
        await createJob(form).unwrap();
        toast.success("Job created successfully.");
      } else {
        await updateJob({
          id: editingId,
          body: form,
        }).unwrap();
        toast.success("Job updated successfully.");
      }

      reset();
    } catch (error) {
      console.error("Job save failed:", error);
      toast.error("Failed to save job.");
      throw error;
    }
  };

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <main className="py-5">
        <div className="container" style={{ maxWidth: 1140 }}>
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: 8 }}
          >
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <h1 className="h3 fw-bold mb-0" style={{ color: "#1e1b4b" }}>
                  {editingId === null ? "New Job Listing" : "Edit Job Listing"}
                </h1>
                {editingId !== null && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill"
                    onClick={reset}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <JobForm
                key={editingJob?.id ?? "create"}
                companies={companies}
                categories={categories}
                editingJob={editingJob}
                onSubmit={handleSubmit}
                onCancel={reset}
                isEditing={editingId !== null}
              />
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: 8 }}>
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="h4 fw-bold mb-0" style={{ color: "#1e1b4b" }}>
                  Manage Job Listing
                </h2>
                <span className="text-secondary small">{jobs.length} jobs</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {jobs.length === 0 && (
                  <div className="alert alert-light border mb-0">
                    Data Belum Tersedia
                  </div>
                )}
                {jobs.map((job) => (
                  <div key={job.id} className="border-bottom pb-3">
                    <div className="row align-items-center g-3">
                      <div className="col-12 col-lg-5">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={job.thumbnailUrl || "/assets/logos/Logo.svg"}
                            alt={job.name}
                            className="rounded-3 flex-shrink-0"
                            width="120"
                            height="90"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <h3
                              className="h5 fw-bold mb-1"
                              style={{ color: "#1e1b4b" }}
                            >
                              {job.name}
                            </h3>
                            <p className="text-secondary small mb-0">
                              {"catagory name"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-lg-2">
                        <div className="text-secondary small">Salary</div>
                        <div className="fw-bold" style={{ color: "#1e1b4b" }}>
                          Rp {job.salary.toLocaleString("id-ID")}/mo
                        </div>
                      </div>
                      <div className="col-6 col-lg-2">
                        <div className="text-secondary small">Level</div>
                        <div className="fw-bold" style={{ color: "#1e1b4b" }}>
                          {"skill level"}
                        </div>
                      </div>
                      <div className="col-12 col-lg-3">
                        <div className="d-flex justify-content-lg-end flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn rounded-pill px-3 text-white fw-bold"
                            style={{ backgroundColor: "#4338CA" }}
                            onClick={() => handleEdit(job)}
                          >
                            Edit
                          </button>
                          <Link
                            to={`/candidates/${job.id}`}
                            className="btn rounded-pill px-3 fw-bold"
                            style={{
                              border: "1px solid #4338CA",
                              color: "#4338CA",
                            }}
                          >
                            Candidates
                          </Link>
                          <button
                            type="button"
                            className="btn rounded-pill px-3 text-white fw-bold"
                            style={{ backgroundColor: "#B91C1C" }}
                            onClick={() => void handleDelete(job.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

type JobFormProps = {
  companies: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  editingJob:
    | {
        id: number;
        name: string;
        companyId: number;
        categoryId: number;
        skillLevel: string;
        location: string;
        type: string;
        salary: number;
        about: string;
        thumbnailUrl: string;
        responsibilities: string[];
        qualifications: string[];
        isOpen: boolean;
      }
    | undefined;
  onSubmit: (form: FormData) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
};

function JobForm({
  companies,
  categories,
  editingJob,
  onSubmit,
  onCancel,
  isEditing,
}: JobFormProps) {
  const [name, setName] = useState(editingJob?.name ?? "");
  const [companyId, setCompanyId] = useState(
    String(editingJob?.companyId ?? ""),
  );
  const [categoryId, setCategoryId] = useState(
    String(editingJob?.categoryId ?? ""),
  );
  const [type, setType] = useState(editingJob?.type ?? "");
  const [location, setLocation] = useState(editingJob?.location ?? "");
  const [skillLevel, setSkillLevel] = useState(editingJob?.skillLevel ?? "");
  const [salary, setSalary] = useState(String(editingJob?.salary ?? ""));
  const [about, setAbout] = useState(editingJob?.about ?? "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [responsibilities, setResponsibilities] = useState(
    editingJob?.responsibilities.join("\n") ?? "",
  );
  const [qualifications, setQualifications] = useState(
    editingJob?.qualifications.join("\n") ?? "",
  );
  const [isOpen, setIsOpen] = useState(editingJob?.isOpen ?? true);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    editingJob?.thumbnailUrl ?? "",
  );

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnail(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } else {
      setThumbnailPreview(editingJob?.thumbnailUrl ?? "");
    }
  };

  const submit = async () => {
    const form = new FormData();
    form.append("CompanyId", companyId);
    form.append("CategoryId", categoryId);
    form.append("Name", name);
    form.append("SkillLevel", skillLevel);
    form.append("Location", location);
    form.append("Type", type);
    form.append("Salary", salary);
    form.append("About", about);
    form.append("IsOpen", String(isOpen));

    if (thumbnail) form.append("Thumbnail", thumbnail);

    responsibilities
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => form.append("Responsibilities", x));

    qualifications
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => form.append("Qualifications", x));

    await onSubmit(form);
  };

  return (
    <form
      className="d-flex flex-column gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div className="row g-4">
        <div className="col-12">
          <label className="form-label fw-semibold">Job name</label>
          <input
            className="form-control form-control-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Company</label>
          <select
            className="form-select form-select-lg"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Company</option>
            {companies.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Category</label>
          <select
            className="form-select form-select-lg"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Category</option>
            {categories.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Type</label>
          <input
            className="form-control form-control-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Location</label>
          <input
            className="form-control form-control-lg"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Skill level</label>
          <input
            className="form-control form-control-lg"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Salary</label>
          <input
            className="form-control form-control-lg"
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label fw-semibold">About</label>
          <textarea
            className="form-control"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label fw-semibold">
            Responsibilities (one per line)
          </label>
          <textarea
            className="form-control"
            rows={6}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label fw-semibold">
            Qualifications (one per line)
          </label>
          <textarea
            className="form-control"
            rows={6}
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label fw-semibold">Thumbnail</label>
          {thumbnailPreview && (
            <div className="mb-3">
              <img
                src={thumbnailPreview}
                alt="Job thumbnail"
                className="rounded-3 border"
                width="200"
                height="120"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            accept="image/png,image/jpeg"
            onChange={handleThumbnailChange}
          />
        </div>
        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="job-open"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="job-open">
              Open for applications
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-end gap-2">
        {isEditing && (
          <button
            type="button"
            className="btn btn-light rounded-pill px-4"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn rounded-pill px-4 py-3 text-white fw-bold"
          style={{ backgroundColor: "#4338CA" }}
        >
          {isEditing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
