import { useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import {
  useCreateCompanyMutation,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
} from "./companyApi";

export default function CompanyPage() {
  const { data: companies = [], isLoading } = useGetCompaniesQuery();

  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const company = companies[0];

  const submit = async () => {
    const form = new FormData();

    form.append("Name", name);
    form.append("About", about);

    if (logo) {
      form.append("Logo", logo);
    }

    if (company) {
      await updateCompany({
        id: company.id,
        body: form,
      }).unwrap();
    } else {
      await createCompany(form).unwrap();
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h4">Company</Typography>

      {company?.logoUrl && (
        <img
          src={company.logoUrl}
          alt={company.name}
          style={{
            width: 120,
            height: 120,
            objectFit: "contain",
          }}
        />
      )}

      <TextField
        label="Name"
        value={name || company?.name || ""}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />

      <TextField
        label="About"
        multiline
        minRows={4}
        value={about || company?.about || ""}
        onChange={(e) => setAbout(e.target.value)}
        fullWidth
      />

      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
      />

      <Button
        variant="contained"
        onClick={submit}
        disabled={
          !(name || company?.name)?.trim() || !(about || company?.about)?.trim()
        }
      >
        {company ? "Update Company" : "Create Company"}
      </Button>
    </Stack>
  );
}
