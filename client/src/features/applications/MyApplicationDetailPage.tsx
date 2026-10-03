import { Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useGetMineByIdQuery } from "./applicationApi";

export default function MyApplicationDetailPage() {
  const { id } = useParams();
  const applicationId = Number(id);
  const { data: application, isLoading } = useGetMineByIdQuery(applicationId, {
    skip: !Number.isInteger(applicationId),
  });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!application) return <Typography>Application not found.</Typography>;

  return (
    <Stack spacing={2} sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h4">{application.jobName}</Typography>
      <Typography>{application.companyName}</Typography>
      <Typography>
        Status: {application.isHired ? "Hired" : "Submitted"}
      </Typography>
      <Typography>{application.message}</Typography>
      <a href={application.resumeUrl} target="_blank" rel="noreferrer">
        Open resume
      </a>
    </Stack>
  );
}
