import { useState } from "react";
import AppHeader from "../../app/layout/AppHeader";
import { toast } from "react-toastify";
import {
  useChangePasswordMutation,
  useDeleteProfileMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "./profileApi";

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

    try {
      await updateProfile(form).unwrap();
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile.");
    }
  };

  const change = async () => {
    const currentPassword = window.prompt("Current password") ?? "";
    const newPassword = window.prompt("New password") ?? "";

    if (currentPassword && newPassword) {
      try {
        await changePassword({
          currentPassword,
          newPassword,
        }).unwrap();
        toast.success("Password changed successfully.");
      } catch (error) {
        console.error("Password change failed:", error);
        toast.error("Failed to change password.");
      }
    }
  };

  const remove = async () => {
    const password = window.prompt("Password to delete account") ?? "";

    if (password) {
      try {
        await deleteProfile({ password }).unwrap();
        toast.success("Account deleted successfully.");
      } catch (error) {
        console.error("Account deletion failed:", error);
        toast.error("Failed to delete account.");
      }
    } else {
      toast.error("Password is required to delete the account.");
    }
  };

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <AppHeader title="Profile" />
      <main className="py-5">
        <div className="container" style={{ maxWidth: 1140 }}>
          <div className="row g-4">
            <div className="col-12">
              <section
                className="card border-0 shadow-sm"
                style={{ borderRadius: 8 }}
              >
                <div className="card-body p-4 p-lg-5">
                  <div className="mb-4">
                    <h2
                      className="h5 fw-bold mb-2"
                      style={{ color: "#111827" }}
                    >
                      Profile Information
                    </h2>
                    <p className="text-secondary mb-0">
                      Update your account's profile information and email
                      address.
                    </p>
                  </div>

                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Name</label>
                      <input
                        className="form-control"
                        value={name}
                        placeholder={profile?.name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        value={email}
                        placeholder={profile?.email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Occupation
                      </label>
                      <input
                        className="form-control"
                        value={occupation}
                        placeholder={profile?.occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Experience
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Avatar</label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 mt-4">
                    <button
                      type="button"
                      className="btn rounded-pill px-4 text-white fw-bold"
                      style={{ backgroundColor: "#4338CA" }}
                      onClick={() => void save()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div className="col-12">
              <section
                className="card border-0 shadow-sm"
                style={{ borderRadius: 8 }}
              >
                <div className="card-body p-4 p-lg-5">
                  <h2 className="h5 fw-bold mb-2" style={{ color: "#111827" }}>
                    Update Password
                  </h2>
                  <p className="text-secondary mb-4">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-pill px-4"
                    onClick={() => void change()}
                  >
                    Change Password
                  </button>
                </div>
              </section>
            </div>

            <div className="col-12">
              <section
                className="card border-0 shadow-sm"
                style={{ borderRadius: 8 }}
              >
                <div className="card-body p-4 p-lg-5">
                  <h2 className="h5 fw-bold mb-2 text-danger">
                    Delete Account
                  </h2>
                  <p className="text-secondary mb-4">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted.
                  </p>
                  <button
                    type="button"
                    className="btn btn-danger rounded-pill px-4"
                    onClick={() => void remove()}
                  >
                    Delete Account
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
