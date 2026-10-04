import { toast } from "react-toastify";
import { useDeleteContactMutation, useGetContactsQuery } from "./contactApi";

export default function SuperAdminContactPage() {
  const { data: contacts, isLoading } = useGetContactsQuery();
  const [deleteContact] = useDeleteContactMutation();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    try {
      await deleteContact(id).unwrap();
      toast.success("Contact deleted successfully.");
    } catch {
      toast.error("Failed to delete contact.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Manage Contact</h2>
          <p className="text-muted mb-0">
            Manage messages submitted from the Contact page.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">Loading...</div>
      ) : !contacts || contacts.length === 0 ? (
        <div className="alert alert-light border">
          No contact messages found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Created At</th>
                <th style={{ width: 100 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td style={{ minWidth: 300 }}>{contact.message}</td>
                  <td>{new Date(contact.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => void handleDelete(contact.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
