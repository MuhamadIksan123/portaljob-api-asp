import { Link } from "react-router";
import { Stack, Typography } from "@mui/material";
import { useGetMineQuery } from "./applicationApi";

export default function MyApplicationsPage() {
  const { data: applications = [], isLoading } = useGetMineQuery();

  return (
    <Stack spacing={2} sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <Typography variant="h4">My Applications</Typography>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        applications.map((item) => (
          <Stack
            key={item.id}
            spacing={1}
            sx={{ border: "1px solid #ddd", p: 2 }}
          >
            <Typography variant="h6">{item.jobName}</Typography>
            <Typography>{item.companyName}</Typography>
            <Typography>
              {item.isHired ? "Hired" : "Application sent"}
            </Typography>
            <Link to={`/applications/${item.id}`}>View detail</Link>
          </Stack>
        ))
      )}
    </Stack>
  );
}
