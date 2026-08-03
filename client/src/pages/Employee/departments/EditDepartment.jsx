import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DepartmentForm from "../../../components/department/DepartmentForm";

import {
  getDepartmentById,
  updateDepartment,
} from "../../../services/departmentService";

import "../department-role.css";

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await getDepartmentById(id);
        setDepartment(res.data || res);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSaving(true);

      await updateDepartment(id, formData);

      alert("Department updated successfully.");

      navigate("/employee/departments");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h2>Edit Department</h2>
          <p>Update department information.</p>
        </div>
      </div>

      <DepartmentForm
        title="Edit Department"
        initialData={department}
        loading={saving}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/employee/departments")}
      />

    </div>
  );
}