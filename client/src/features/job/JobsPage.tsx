import { Stack, TextField, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router";
import { useState } from "react";
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
    <Stack spacing={2} sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
      <Typography variant="h4">Jobs</Typography>

      <TextField
        label="Search job"
        value={keyword}
        onChange={(e) => search(e.target.value)}
      />

      {categorySlug && <Typography>Category: {categorySlug}</Typography>}

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        data?.items.map((job) => (
          <Stack
            key={job.id}
            spacing={1}
            sx={{ border: "1px solid #ddd", p: 2 }}
          >
            <Typography variant="h6">{job.name}</Typography>
            <Typography>
              {job.companyName} · {job.location} · {job.type}
            </Typography>
            <Typography>Salary: {job.salary}</Typography>
            <Link to={`/jobs/${job.slug}`}>View detail</Link>
          </Stack>
        ))
      )}
    </Stack>
  );
}
