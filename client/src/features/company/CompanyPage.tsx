import { useState } from "react";
import {
  useCreateCompanyMutation,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
} from "./companyApi";
import { toast } from "react-toastify";

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

    try {
      if (company) {
        await updateCompany({
          id: company.id,
          body: form,
        }).unwrap();
        toast.success("Company updated successfully.");
      } else {
        await createCompany(form).unwrap();
        toast.success("Company created successfully.");
      }
    } catch (error) {
      console.error("Company save failed:", error);
      toast.error("Failed to save company.");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-vh-100 bg-light"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <main className="py-5">
          <div className="container" style={{ maxWidth: 1140 }}>
            <div className="alert alert-light border">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <main className="py-5">
        <div className="container" style={{ maxWidth: 1140 }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 8 }}>
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-4 mb-4">
                <div className="d-flex align-items-center gap-3">
                  {company?.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="rounded-3"
                      width="90"
                      height="90"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-3 bg-light d-flex align-items-center justify-content-center"
                      style={{ width: 90, height: 90 }}
                    >
                      <img
                        src="/assets/logos/Logo-black.svg"
                        alt="logo"
                        style={{ width: 60 }}
                      />
                    </div>
                  )}
                  <div>
                    <h1
                      className="h4 fw-bold mb-1"
                      style={{ color: "#1e1b4b" }}
                    >
                      {company?.name || "New Company"}
                    </h1>
                    <p className="text-secondary mb-0">My Company</p>
                  </div>
                </div>
              </div>

              <form
                className="d-flex flex-column gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <div>
                  <label
                    className="form-label fw-semibold"
                    htmlFor="company-name"
                  >
                    Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    className="form-control form-control-lg"
                    value={name || company?.name || ""}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="form-label fw-semibold"
                    htmlFor="company-about"
                  >
                    about
                  </label>
                  <textarea
                    id="company-about"
                    className="form-control"
                    rows={5}
                    value={about || company?.about || ""}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="form-label fw-semibold"
                    htmlFor="company-logo"
                  >
                    logo
                  </label>
                  <input
                    id="company-logo"
                    type="file"
                    className="form-control"
                    accept="image/png,image/jpeg"
                    onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn rounded-pill px-4 py-3 fw-bold text-white"
                    style={{ backgroundColor: "#4338CA" }}
                    disabled={
                      !(name || company?.name)?.trim() ||
                      !(about || company?.about)?.trim()
                    }
                  >
                    {company ? "Update Company" : "Add New Company"}
                  </button>
                </div>
              </form>

              {company?.about && (
                <div className="border-top mt-5 pt-4">
                  <h2 className="h5 fw-bold" style={{ color: "#1e1b4b" }}>
                    About
                  </h2>
                  <p className="mb-0">{company.about}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
