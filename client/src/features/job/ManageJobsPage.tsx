import { Button, Stack, TextField, Typography } from "@mui/material";
import { Link } from "react-router";
import { useState } from "react";
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

  const reset = () => {
    setEditingId(null);
    setEditingSlug(null);
  };

  const handleSubmit = async (form: FormData) => {
    if (editingId === null) {
      await createJob(form).unwrap();
    } else {
      await updateJob({
        id: editingId,
        body: form,
      }).unwrap();
    }

    reset();
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
      <Typography variant="h4">
        {editingId === null ? "Create Job" : "Edit Job"}
      </Typography>

      <JobForm
        key={editingJob?.id ?? "create"}
        companies={companies}
        categories={categories}
        editingJob={editingJob}
        onSubmit={handleSubmit}
        onCancel={reset}
        isEditing={editingId !== null}
      />

      {jobs.map((job) => (
        <Stack
          key={job.id}
          spacing={1}
          sx={{
            border: "1px solid #ddd",
            p: 2,
          }}
        >
          <Typography variant="h6">{job.name}</Typography>

          <Button onClick={() => handleEdit(job)}>Edit</Button>

          <Button component={Link} to={`/candidates/${job.id}`}>
            Candidates
          </Button>

          <Button color="error" onClick={() => deleteJob(job.id)}>
            Delete
          </Button>
        </Stack>
      ))}
    </Stack>
  );
}

type JobFormProps = {
  companies: {
    id: number;
    name: string;
  }[];

  categories: {
    id: number;
    name: string;
  }[];

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

    if (thumbnail) {
      form.append("Thumbnail", thumbnail);
    }

    responsibilities
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => {
        form.append("Responsibilities", x);
      });

    qualifications
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => {
        form.append("Qualifications", x);
      });

    await onSubmit(form);
  };

  return (
    <>
      <TextField
        label="Job name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        select
        slotProps={{
          select: {
            native: true,
          },
        }}
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      >
        <option value="">Company</option>

        {companies.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </TextField>

      <TextField
        select
        slotProps={{
          select: {
            native: true,
          },
        }}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Category</option>

        {categories.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </TextField>

      <TextField
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />

      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <TextField
        label="Skill level"
        value={skillLevel}
        onChange={(e) => setSkillLevel(e.target.value)}
      />

      <TextField
        label="Salary"
        type="number"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />

      <TextField
        label="About"
        multiline
        minRows={4}
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />

      <TextField
        label="Responsibilities (one per line)"
        multiline
        minRows={4}
        value={responsibilities}
        onChange={(e) => setResponsibilities(e.target.value)}
      />

      <TextField
        label="Qualifications (one per line)"
        multiline
        minRows={4}
        value={qualifications}
        onChange={(e) => setQualifications(e.target.value)}
      />

      {/* THUMBNAIL PREVIEW */}
      {thumbnailPreview && (
        <Stack spacing={1}>
          <Typography variant="subtitle1">Thumbnail</Typography>

          <img
            src={thumbnailPreview}
            alt="Job thumbnail"
            style={{
              width: 200,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </Stack>
      )}

      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleThumbnailChange}
      />

      <label>
        <input
          type="checkbox"
          checked={isOpen}
          onChange={(e) => setIsOpen(e.target.checked)}
        />{" "}
        Open for applications
      </label>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={submit}>
          {isEditing ? "Update" : "Create"}
        </Button>

        {isEditing && <Button onClick={onCancel}>Cancel</Button>}
      </Stack>
    </>
  );
}
