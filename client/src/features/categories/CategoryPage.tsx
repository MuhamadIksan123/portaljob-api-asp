import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "./categoryApi";
import type { Category } from "../../app/models/category";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../account/accountApi";

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

    if (editing) {
      await updateCategory({ id: editing.id, body: form }).unwrap();
    } else {
      if (!icon) return;
      await createCategory(form).unwrap();
    }

    setOpen(false);
  };

  const navigate = useNavigate();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h4">Manage Categories</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={openCreate}
        >
          Add New
        </Button>
        <Button
          variant="outlined"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging Out..." : "Logout"}
        </Button>
      </Stack>

      {isLoading && <Typography>Loading</Typography>}

      {data.map((category) => (
        <Card key={category.id}>
          <CardContent>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <img
                src={category.iconUrl}
                alt={category.name}
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: 16 }}
              />
              <Stack sx={{ flex: 1 }}>
                <Typography variant="h6">{category.name}</Typography>
                <Typography color="text.secondary">{category.slug}</Typography>
              </Stack>
              <IconButton onClick={() => openEdit(category)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteCategory(category.id)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => setIcon(event.target.files?.[0] ?? null)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
