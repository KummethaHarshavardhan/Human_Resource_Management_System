import React, { useState } from "react";
import { applyLeave } from "../../services/leaveService";

const ApplyLeaveForm = ({ refreshLeaves }) => {

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await applyLeave(formData);

      alert("Leave Applied Successfully");


      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });


      if (refreshLeaves) {
        refreshLeaves();
      }


    } catch (error) {

      console.error(
        "Apply Leave Error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to apply leave"
      );

    }
  };


  return (

    <div className="leave-form">

      <h2>
        Apply Leave
      </h2>


      <form onSubmit={handleSubmit}>


        <select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          required
        >

          <option value="">
            Select Leave Type
          </option>


          <option value="Sick">
            Sick Leave
          </option>


          <option value="Casual">
            Casual Leave
          </option>


          <option value="Emergency">
            Emergency Leave
          </option>


        </select>



        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />



        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />



        <textarea
          name="reason"
          placeholder="Enter reason"
          value={formData.reason}
          onChange={handleChange}
          required
        />


        <button type="submit">
          Apply Leave
        </button>


      </form>


    </div>

  );
};


export default ApplyLeaveForm;