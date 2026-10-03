import { Button, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useGetJobApplicationsQuery, useHireMutation } from "./applicationApi";

export default function CandidatesPage() {
  const { jobId } = useParams();
  const id = Number(jobId);
  const { data: candidates = [] } = useGetJobApplicationsQuery(id, {
    skip: !Number.isInteger(id),
  });
  const [hire] = useHireMutation();

  return (
    <Stack spacing={2} sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <Typography variant="h5">Candidates</Typography>

      {candidates.map((candidate) => (
        <Stack key={candidate.id} sx={{ border: "1px solid #ddd", p: 2 }}>
          <Typography>
            {candidate.candidateName} — {candidate.candidateId}
          </Typography>
          <Typography>{candidate.message}</Typography>
          <Button href={candidate.resumeUrl} target="_blank" rel="noreferrer">
            Resume
          </Button>
          {!candidate.isHired && (
            <Button onClick={() => hire(candidate.id)}>Hire</Button>
          )}
        </Stack>
      ))}
    </Stack>
  );
}
