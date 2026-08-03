import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RoleForm from "../../../components/role/RoleForm";
import { addRole } from "../../../services/roleService";

import "../department-role.css";

export default function AddRole() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await addRole(formData);

      alert("Role added successfully.");

      navigate("/employee/roles");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <div className="page-header">

        <div className="page-title">

          <button
            className="btn-secondary"
            style={{ marginBottom: "15px", width: "fit-content" }}
            onClick={() => navigate("/employee/roles")}
          >
            ← Back to Roles
          </button>

          <h2>Add Role</h2>

          <p>Create a new company role.</p>

        </div>

      </div>

      <RoleForm
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/employee/roles")}
      />

    </div>
  );
}