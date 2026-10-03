import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useChangePasswordMutation, useDeleteProfileMutation, useGetProfileQuery, useUpdateProfileMutation } from "./profileApi";

export default function ProfilePage() {
  const { data: profile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [deleteProfile] = useDeleteProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [experience, setExperience] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const save = async () => {
    const form = new FormData();

    form.append("Name", name || profile?.name || "");
    form.append("Email", email || profile?.email || "");
    form.append("Occupation", occupation || profile?.occupation || "");
    form.append("Experience", experience || String(profile?.experience ?? 0));

    if (avatar) form.append("Avatar", avatar);

    await updateProfile(form).unwrap();
  };

  const change = async () => {
    const currentPassword = window.prompt("Current password") ?? "";
    const newPassword = window.prompt("New password") ?? "";

    if (currentPassword && newPassword)
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();
  };

  const remove = async () => {
    const password = window.prompt("Password to delete account") ?? "";

    if (password) await deleteProfile({ password }).unwrap();
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
      <Typography variant="h4">Profile</Typography>
      <TextField
        label="Name"
        value={name}
        placeholder={profile?.name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
        value={email}
        placeholder={profile?.email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Occupation"
        value={occupation}
        placeholder={profile?.occupation}
        onChange={(e) => setOccupation(e.target.value)}
      />
      <TextField
        label="Experience"
        type="number"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
      />
      <Button variant="contained" onClick={save}>
        Save Profile
      </Button>
      <Button onClick={change}>Change Password</Button>
      <Button color="error" onClick={remove}>
        Delete Account
      </Button>
    </Stack>
  );
}
