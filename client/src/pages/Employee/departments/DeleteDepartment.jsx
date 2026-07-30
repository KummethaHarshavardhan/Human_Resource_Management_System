import { useState } from "react";
import { deleteDepartment } from "../../../services/departmentService";

const DeleteDepartment = () => {
  // Temporary department ID
  const departmentId = 1;

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      const response = await deleteDepartment(departmentId);

      alert(response.message);

      setDeleted(true);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete department.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Delete Department</h2>

      {deleted ? (
        <p style={{ color: "green" }}>
          Department deleted successfully.
        </p>
      ) : (
        <>
          <p>
            Click the button below to delete this department.
          </p>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Department"}
          </button>
        </>
      )}
    </div>
  );
};

export default DeleteDepartment;