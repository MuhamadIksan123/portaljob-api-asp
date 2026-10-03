import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "./accountApi";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState("employee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const submit = async () => {
    const form = new FormData();
    form.append("AccountType", accountType);
    form.append("Name", name);
    form.append("Email", email);
    form.append("Password", password);

    await register(form).unwrap();
    navigate("/login");
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 420, mx: "auto", p: 4 }}>
      <Typography variant="h4">Register</Typography>

      <TextField
        select
        slotProps={{ select: { native: true } }}
        value={accountType}
        onChange={(e) => setAccountType(e.target.value)}
      >
        <option value="employee">Employee</option>
        <option value="employer">Employer</option>
      </TextField>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        Register
      </Button>
    </Stack>
  );
}
