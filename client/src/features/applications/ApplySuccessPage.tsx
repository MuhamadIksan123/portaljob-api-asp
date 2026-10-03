import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router";

export default function ApplySuccessPage() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
      <Typography variant="h4">Application submitted</Typography>
      <Typography>Your application has been saved successfully.</Typography>
      <Button component={Link} to="/applications" variant="contained">
        My Applications
      </Button>
    </Stack>
  );
}
