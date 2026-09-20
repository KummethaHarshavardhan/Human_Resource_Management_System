import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import UserModel from "../models/UserModel.js";
import Employee from "../models/Employee.js";
import transporter from "../config/mail.js";

/**
 * Create a new in-app notification for a specific recipient.
 */
export const createNotification = async ({
  recipient,
  type,
  message,
  relatedLeave = null,
  relatedTask = null,
  relatedAssignment = null,
  attachmentUrl = "",
  link = "",
}) => {
  try {
    // Suppress operational in-app notifications for relieved/inactive employees
    // while permitting offboarding status notifications
    if (recipient && type !== "offboarding_updated" && link !== "/employee/offboarding") {
      try {
        if (mongoose.connection?.readyState === 1) {
          const emp = await Employee.findOne({ user_id: recipient });
          if (emp && emp.employment_status === "Inactive") {
            return null;
          }
        }
      } catch (checkErr) {
        // Disconnected or unmocked DB in tests
      }
    }

    const notif = await Notification.create({
      recipient,
      type,
      message,
      relatedLeave,
      relatedTask,
      relatedAssignment,
      attachmentUrl,
      link,
    });
    return notif;
  } catch (err) {
    console.error("createNotification error:", err.message);
    return null;
  }
};

/**
 * Send an email using the existing Nodemailer transporter.
 * Fails silently if credentials are not configured — does NOT throw.
 */
export const sendLeaveEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    // Email credentials not configured — skip silently
    console.warn("sendLeaveEmail: EMAIL credentials not set in .env — skipping email.");
    return;
  }

  try {
    await transporter.sendMail({
      from: `HRMS Notifications <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    // Non-fatal — log but don't crash the main request
    console.error("sendLeaveEmail error:", err.message);
  }
};

export const sendEmail = sendLeaveEmail;

/**
 * Send an email notification to HR when an employee submits work/deliverable.
 */
export const sendTaskSubmissionEmail = async ({
  to,
  taskTitle,
  employeeName,
  employeeEmail,
  submissionText,
  attachmentUrl,
  version = 1,
}) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.warn("sendTaskSubmissionEmail: EMAIL credentials not set in .env — skipping email.");
    return;
  }

  try {
    const linkHtml = attachmentUrl
      ? `<p><strong>Deliverable Link:</strong> <a href="${attachmentUrl}" target="_blank" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">${attachmentUrl}</a></p>`
      : `<p><strong>Deliverable Link:</strong> <em>No link provided</em></p>`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff;">
        <h2 style="color: #4f46e5; margin-top: 0; display: flex; align-items: center; gap: 8px;">
          🚀 Task Submission for Review (v${version})
        </h2>
        <p style="font-size: 15px; color: #334155;">
          Employee <strong>${employeeName}</strong> (${employeeEmail}) has submitted a deliverable for the task:
        </p>
        <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 14px 18px; border-radius: 6px; margin: 16px 0;">
          <h3 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px;">${taskTitle}</h3>
          <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Submission Notes:</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #334155; white-space: pre-wrap;">${submissionText}</p>
        </div>
        ${linkHtml}
        <p style="font-size: 13px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          Please log in to your HRMS portal to review this submission, request rework, or approve the task.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `HRMS Task System <${process.env.EMAIL}>`,
      to,
      subject: `New Task Submission: ${taskTitle} by ${employeeName}`,
      html,
    });
  } catch (err) {
    console.error("sendTaskSubmissionEmail error:", err.message);
  }
};

/**
 * Send an email notification to employee when assigned a new task.
 */
export const sendTaskAssignmentEmail = async ({
  to,
  taskTitle,
  employeeName,
  assignedBy,
  deadline,
  priority,
  description,
  notes,
}) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.warn("sendTaskAssignmentEmail: EMAIL credentials not set in .env — skipping email.");
    return;
  }

  try {
    const formattedDeadline = deadline
      ? new Date(deadline).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not specified";

    const priorityBadgeColor =
      priority === "HIGH" || priority === "CRITICAL"
        ? "#dc2626"
        : priority === "MEDIUM"
        ? "#f59e0b"
        : "#10b981";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff;">
        <h2 style="color: #4f46e5; margin-top: 0; display: flex; align-items: center; gap: 8px;">
          📋 New Task Assigned
        </h2>
        <p style="font-size: 15px; color: #334155;">
          Hello <strong>${employeeName || "Team Member"}</strong>,
        </p>
        <p style="font-size: 15px; color: #334155;">
          A new task has been assigned to you by <strong>${assignedBy || "HR Manager"}</strong>.
        </p>
        <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px 20px; border-radius: 6px; margin: 18px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 17px;">${taskTitle}</h3>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569; line-height: 1.5;">${description || "No description provided."}</p>
          <div style="display: flex; gap: 16px; margin-top: 12px; font-size: 13px; color: #64748b;">
            <span><strong>Priority:</strong> <span style="color: ${priorityBadgeColor}; font-weight: 700;">${priority || "MEDIUM"}</span></span>
            &bull;
            <span><strong>Deadline:</strong> <strong style="color: #1e293b;">${formattedDeadline}</strong></span>
          </div>
          ${notes ? `<p style="margin: 12px 0 0 0; font-size: 13px; color: #64748b;"><strong>Notes:</strong> ${notes}</p>` : ""}
        </div>
        <p style="font-size: 14px; color: #334155;">
          Please log in to your HRMS portal to review the requirements, track your progress, and submit deliverables before the deadline.
        </p>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          HRMS Task Monitoring System &bull; Automated notification
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `HRMS Task System <${process.env.EMAIL}>`,
      to,
      subject: `New Task Assigned: ${taskTitle} [${priority || "MEDIUM"}]`,
      html,
    });
  } catch (err) {
    console.error("sendTaskAssignmentEmail error:", err.message);
  }
};

/**
 * Send an email notification to employee when their task submission is reviewed.
 */
export const sendTaskReviewEmail = async ({
  to,
  taskTitle,
  employeeName,
  reviewerName,
  decision,
  comments,
}) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.warn("sendTaskReviewEmail: EMAIL credentials not set in .env — skipping email.");
    return;
  }

  try {
    const isApproved = decision === "APPROVED";
    const headerColor = isApproved ? "#16a34a" : "#ea580c";
    const headerIcon = isApproved ? "✅" : "🔄";
    const headerTitle = isApproved ? "Task Approved!" : "Rework Requested on Task";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff;">
        <h2 style="color: ${headerColor}; margin-top: 0; display: flex; align-items: center; gap: 8px;">
          ${headerIcon} ${headerTitle}
        </h2>
        <p style="font-size: 15px; color: #334155;">
          Hello <strong>${employeeName || "Team Member"}</strong>,
        </p>
        <p style="font-size: 15px; color: #334155;">
          Your deliverable for <strong>${taskTitle}</strong> was reviewed by <strong>${reviewerName || "Reviewer"}</strong>.
        </p>
        <div style="background: #f8fafc; border-left: 4px solid ${headerColor}; padding: 14px 18px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;"><strong>Review Feedback:</strong></p>
          <p style="margin: 0; font-size: 14px; color: #1e293b; white-space: pre-wrap;">${comments || "No comments provided."}</p>
        </div>
        <p style="font-size: 14px; color: #334155;">
          ${
            isApproved
              ? "Great work! This task has been marked as COMPLETED."
              : "Please make the requested updates in the HRMS portal and resubmit your deliverable for review."
          }
        </p>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          HRMS Task Monitoring System &bull; Automated notification
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `HRMS Task System <${process.env.EMAIL}>`,
      to,
      subject: `${headerTitle}: ${taskTitle}`,
      html,
    });
  } catch (err) {
    console.error("sendTaskReviewEmail error:", err.message);
  }
};

/**
 * Send in-app notification when a document is verified or rejected.
 */
export const sendDocumentVerificationNotification = async ({
  recipient,
  category,
  decision,
  rejectionReason = "",
  link = "/profile",
  isPlatformAdmin = false,
  fileName = "",
}) => {
  const isVerified = decision === "Verified";
  const type = isVerified ? "document_verified" : "document_rejected";
  const docRef = fileName ? ` (${fileName})` : "";
  let message;

  if (isPlatformAdmin) {
    message = isVerified
      ? `Your uploaded ${category} document${docRef} has been verified by the platform admin.`
      : `Your uploaded ${category} document${docRef} was not verified. Reason: ${rejectionReason}.`;
  } else {
    message = isVerified
      ? `Your ${category} document${docRef} has been verified.`
      : `Your ${category} document${docRef} was not verified. Reason: ${rejectionReason}.`;
  }

  return createNotification({
    recipient,
    type,
    message,
    link,
  });
};

/**
 * Notify every admin and hr_manager in the employee's organization when a document is uploaded.
 */
export const notifyHrOnDocumentUpload = async ({ document, employee }) => {
  try {
    const orgId = document?.organizationId || employee?.organizationId;
    if (!orgId) return [];

    const hrUsers = await UserModel.find({
      organizationId: orgId,
      role: { $in: ["Admin", "HR Manager", "HR"] },
    }).select("_id name email role");

    const empName = employee?.user_id?.name || "An employee";
    const category = document?.category || "document";
    const message = `${empName} uploaded a new ${category} document for verification.`;

    const notifs = [];
    for (const hr of hrUsers) {
      const n = await createNotification({
        recipient: hr._id,
        type: "document_uploaded",
        message,
        link: "/hr/document-verification",
      });
      notifs.push(n);
    }
    return notifs;
  } catch (err) {
    console.error("notifyHrOnDocumentUpload error:", err.message);
    return [];
  }
};

/**
 * Notify employees when assigned or reassigned to a shift, or removed from one.
 */
export const notifyShiftAssignment = async ({
  employeeIds = [],
  employees = [],
  shift = null,
  isRemoval = false,
}) => {
  try {
    let targetEmployees = employees;

    if (employeeIds && employeeIds.length > 0 && targetEmployees.length === 0) {
      targetEmployees = await Employee.find({
        _id: { $in: employeeIds },
        employment_status: { $ne: "Inactive" },
      }).populate("user_id", "_id name email");
    }

    if (!targetEmployees || targetEmployees.length === 0) return [];

    const notifs = [];
    const shiftName = shift?.name || "your assigned shift";
    const timing = shift ? ` (${shift.start_time} \u2013 ${shift.end_time})` : "";

    const message = isRemoval
      ? `You have been removed from ${shiftName}. Contact HR for your updated schedule.`
      : `Your shift has been set to ${shiftName}${timing}, effective now.`;

    for (const emp of targetEmployees) {
      const recipientId = emp.user_id?._id || emp.user_id;
      if (!recipientId) continue;

      const n = await createNotification({
        recipient: recipientId,
        type: "shift_assigned",
        message,
        link: "/attendance-dashboard",
      });
      if (n) notifs.push(n);
    }

    return notifs;
  } catch (err) {
    console.error("notifyShiftAssignment error:", err.message);
    return [];
  }
};

/**
 * Notify HR/Admin in organization (viewers) and Super Admin (decision makers) when employee submits WFH request.
 */
export const notifyWFHSubmission = async ({
  employee,
  organization,
  startDate,
  endDate,
}) => {
  try {
    const notifs = [];
    const empName = employee?.user_id?.name || "An employee";
    const orgName = organization?.name || "the organization";
    const startStr = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const endStr = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const message = `${empName} from ${orgName} requested Work From Home from ${startStr} to ${endStr}.`;

    // 1. Notify HR/Admin in employee's organization
    const orgId = organization?._id || employee?.organizationId;
    if (orgId) {
      const hrUsers = await UserModel.find({
        organizationId: orgId,
        role: { $in: ["Admin", "HR Manager", "HR"] },
      }).select("_id");

      for (const hr of hrUsers) {
        const n = await createNotification({
          recipient: hr._id,
          type: "wfh_requested",
          message,
          link: "/wfh-requests",
        });
        if (n) notifs.push(n);
      }
    }

    // 2. Notify Super Admins
    const superAdmins = await UserModel.find({
      role: { $in: ["super_admin", "superadmin", "super admin", "Super Admin"] },
    }).select("_id");

    for (const sa of superAdmins) {
      const n = await createNotification({
        recipient: sa._id,
        type: "wfh_requested",
        message,
        link: "/super-admin/wfh-requests",
      });
      if (n) notifs.push(n);
    }

    return notifs;
  } catch (err) {
    console.error("notifyWFHSubmission error:", err.message);
    return [];
  }
};

/**
 * Notify employee when Super Admin approves or rejects their WFH request.
 */
export const notifyWFHDecision = async ({
  employee,
  startDate,
  endDate,
  decision,
  rejectionReason = "",
}) => {
  try {
    const recipientId = employee?.user_id?._id || employee?.user_id;
    if (!recipientId) return null;

    const startStr = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const endStr = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const isApproved = decision === "Approved";
    const message = isApproved
      ? `Your WFH request (${startStr} to ${endStr}) has been approved.`
      : `Your WFH request (${startStr} to ${endStr}) was rejected. Reason: ${rejectionReason}`;

    return await createNotification({
      recipient: recipientId,
      type: isApproved ? "wfh_approved" : "wfh_rejected",
      message,
      link: "/settings",
    });
  } catch (err) {
    console.error("notifyWFHDecision error:", err.message);
    return null;
  }
};

/**
 * Notify HR/Admin in organization and Super Admin when an employee withdraws their WFH request.
 */
export const notifyWFHWithdrawal = async ({
  employee,
  organization,
  startDate,
  endDate,
}) => {
  try {
    const notifs = [];
    const empName =
      employee?.user_id?.name || employee?.name || "An employee";
    const startStr = new Date(startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const endStr = new Date(endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const message = `${empName} withdrew their WFH request for ${startStr} to ${endStr}.`;

    // 1. Notify HR/Admin in employee's organization
    const orgId =
      organization?._id ||
      organization ||
      employee?.organizationId?._id ||
      employee?.organizationId;
    if (orgId) {
      const hrUsers = await UserModel.find({
        organizationId: orgId,
        role: { $in: ["Admin", "HR Manager", "HR"] },
      }).select("_id");

      for (const hr of hrUsers) {
        const n = await createNotification({
          recipient: hr._id,
          type: "wfh_withdrawn",
          message,
          link: "/wfh-requests",
        });
        if (n) notifs.push(n);
      }
    }

    // 2. Notify Super Admins
    const superAdmins = await UserModel.find({
      role: { $in: ["super_admin", "superadmin", "super admin", "Super Admin"] },
    }).select("_id");

    for (const sa of superAdmins) {
      const n = await createNotification({
        recipient: sa._id,
        type: "wfh_withdrawn",
        message,
        link: "/super-admin/wfh-requests",
      });
      if (n) notifs.push(n);
    }

    return notifs;
  } catch (err) {
    console.error("notifyWFHWithdrawal error:", err.message);
    return [];
  }
};
