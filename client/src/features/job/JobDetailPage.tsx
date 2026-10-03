import { Button, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router";
import { useGetJobQuery } from "./jobApi";

export default function JobDetailPage() {
  const { slug = "" } = useParams();
  const { data: job, isLoading } = useGetJobQuery(slug);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!job) return <Typography>Job not found.</Typography>;

  return (
    <Stack spacing={2} sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <Typography variant="h4">{job.name}</Typography>
      <Typography>
        {job.companyName} · {job.location} · {job.type}
      </Typography>
      <Typography>{job.about}</Typography>

      <Typography variant="h6">Responsibilities</Typography>
      {job.responsibilities.map((item) => (
        <Typography key={item}>• {item}</Typography>
      ))}

      <Typography variant="h6">Qualifications</Typography>
      {job.qualifications.map((item) => (
        <Typography key={item}>• {item}</Typography>
      ))}

      {job.isOpen && (
        <Button
          component={Link}
          to={`/jobs/${job.slug}/apply`}
          variant="contained"
        >
          Apply
        </Button>
      )}
    </Stack>
  );
}
