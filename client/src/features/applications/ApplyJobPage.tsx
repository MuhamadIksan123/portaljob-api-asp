import { Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { useApplyMutation } from "./applicationApi";

export default function ApplyJobPage() {
  const { slug = "" } = useParams();
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [apply, { isLoading }] = useApplyMutation();
  const navigate = useNavigate();

  const submit = async () => {
    if (!resume || !message.trim()) return;

    const form = new FormData();
    form.append("Resume", resume);
    form.append("Message", message);

    await apply({ slug, body: form }).unwrap();
    navigate("/apply/success");
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
      <Typography variant="h4">Apply Job</Typography>
      <TextField
        label="Message"
        multiline
        minRows={8}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setResume(e.target.files?.[0] ?? null)}
      />
      <Button
        variant="contained"
        onClick={submit}
        disabled={isLoading || !resume || !message.trim()}
      >
        Submit Application
      </Button>
    </Stack>
  );
}
