import { Stack, Typography } from "@mui/material";
import { Link } from "react-router";
import { useGetCategoriesQuery } from "../categories/categoryApi";
import { useGetJobsQuery } from "../job/jobApi";

export default function HomePage() {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: jobs } = useGetJobsQuery({});

  return (
    <Stack spacing={3} sx={{ maxWidth: 1100, mx: "auto", p: 4 }}>
      <Typography variant="h3">Job Portal</Typography>

      <Typography variant="h5">Categories</Typography>
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/jobs?categorySlug=${encodeURIComponent(category.slug)}`}
        >
          {category.name}
        </Link>
      ))}

      <Typography variant="h5">Latest Jobs</Typography>
      {jobs?.items.slice(0, 6).map((job) => (
        <Stack key={job.id} spacing={1} sx={{ border: "1px solid #ddd", p: 2 }}>
          <Typography variant="h6">{job.name}</Typography>
          <Typography>
            {job.companyName} · {job.location}
          </Typography>
          <Link to={`/jobs/${job.slug}`}>View detail</Link>
        </Stack>
      ))}
    </Stack>
  );
}
