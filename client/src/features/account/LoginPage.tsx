import { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useLoginMutation } from "./accountApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();

  const submit = async () => {
    try {
      await login({ email, password }).unwrap();

      navigate("/categories");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Email atau password salah.");
    }
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 420, mx: "auto", p: 4 }}>
      <Typography variant="h4">Sign In</Typography>

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button variant="contained" onClick={submit} disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </Stack>
  );
}
