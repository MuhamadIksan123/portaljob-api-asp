import { useState } from "react";
import { Link } from "react-router";
import type { Category } from "../../app/models/category";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "./categoryApi";
import { toast } from "react-toastify";

export default function CategoryPage() {
  const { data = [], isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<File | null>(null);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setIcon(null);
    setOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setIcon(null);
    setOpen(true);
  };

  const save = async () => {
    const form = new FormData();
    form.append("Name", name);
    if (icon) form.append("Icon", icon);

    try {
      if (editing) {
        await updateCategory({ id: editing.id, body: form }).unwrap();
        toast.success("Category updated successfully.");
      } else {
        if (!icon) {
          toast.error("Please select a category icon.");
          return;
        }

        await createCategory(form).unwrap();
        toast.success("Category created successfully.");
      }

      setOpen(false);
    } catch (error) {
      console.error("Category save failed:", error);
      toast.error("Failed to save category.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully.");
    } catch (error) {
      console.error("Category delete failed:", error);
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <main className="py-5">
        <div className="container" style={{ maxWidth: 1140 }}>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 8 }}>
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h1 className="h3 mb-1 fw-bold" style={{ color: "#1e1b4b" }}>
                    Manage Categories
                  </h1>
                  <p className="text-secondary mb-0">
                    Kelola kategori pekerjaan.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn rounded-pill px-4 py-3 fw-bold text-white"
                  style={{ backgroundColor: "#4338CA" }}
                  onClick={openCreate}
                >
                  Add New
                </button>
              </div>

              {isLoading && (
                <div className="alert alert-light border">Loading...</div>
              )}

              {!isLoading && data.length === 0 && (
                <div className="alert alert-light border mb-0">
                  Data belum tersedia
                </div>
              )}

              <div className="d-flex flex-column gap-3">
                {data.map((category) => (
                  <div
                    key={category.id}
                    className="border-bottom pb-3"
                    style={{ borderColor: "#e2e8f0" }}
                  >
                    <div className="row align-items-center g-3">
                      <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={category.iconUrl}
                            alt={category.name}
                            className="rounded-3 flex-shrink-0"
                            width="90"
                            height="90"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <h2
                              className="h5 mb-1 fw-bold"
                              style={{ color: "#1e1b4b" }}
                            >
                              {category.name}
                            </h2>
                            <div className="small text-secondary">
                              {category.slug}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-3">
                        <div className="small text-secondary">Date</div>
                        <div className="fw-bold" style={{ color: "#1e1b4b" }}>
                          {new Date(category.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-3">
                        <div className="d-flex flex-wrap justify-content-md-end gap-2">
                          <button
                            type="button"
                            className="btn rounded-pill px-4 py-2 fw-bold text-white"
                            style={{ backgroundColor: "#4338CA" }}
                            onClick={() => openEdit(category)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn rounded-pill px-4 py-2 fw-bold text-white"
                            style={{ backgroundColor: "#B91C1C" }}
                            onClick={() => void handleDelete(category.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link to="/" className="text-decoration-none">
                  <span className="text-secondary small">Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {open && (
        <>
          <div
            className="modal d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {editing ? "Edit Category" : "New Category"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="category-name"
                    >
                      Name
                    </label>
                    <input
                      id="category-name"
                      type="text"
                      className="form-control form-control-lg"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      className="form-label fw-semibold"
                      htmlFor="category-icon"
                    >
                      icon
                    </label>
                    <input
                      id="category-icon"
                      type="file"
                      className="form-control"
                      accept=".jpg,.jpeg,.png"
                      onChange={(event) =>
                        setIcon(event.target.files?.[0] ?? null)
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn rounded-pill px-4 fw-bold text-white"
                    style={{ backgroundColor: "#4338CA" }}
                    onClick={save}
                  >
                    {editing ? "Update Category" : "Add New Category"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}
