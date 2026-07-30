import { useState } from "react";
import { removeRole } from "../../../services/roleService";

const RemoveRole = () => {
  // Temporary ID (later this will come from route params)
  const roleId = 1;

  const [isRemoving, setIsRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleRemove = async () => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this role assignment?"
    );

    if (!confirmRemove) return;

    try {
      setIsRemoving(true);

      const response = await removeRole(roleId);

      alert(response.message);
      setRemoved(true);
    } catch (error) {
      console.error(error);
      alert("Failed to remove role.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Remove Employee Role</h2>

      {removed ? (
        <p style={{ color: "green" }}>
          Role removed successfully.
        </p>
      ) : (
        <>
          <p>
            Click the button below to remove the assigned role from the employee.
          </p>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove Role"}
          </button>
        </>
      )}
    </div>
  );
};

export default RemoveRole;