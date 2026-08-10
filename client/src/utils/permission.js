const permissions = {
  admin: [
    "dashboard",
    "profile",
    "employee",
    "attendance",
    "leave",
    "payroll",
    "reports",
    "settings",
    "users"
  ],

  hr: [
    "dashboard",
    "profile",
    "employee",
    "attendance",
    "leave",
    "payroll",
    "reports",
    "settings",
    "users"
  ],

  employee: [
    "dashboard",
    "profile",
    "employee",
    "attendance",
    "leave",
    "settings"
  ]
};

export const canAccessFeature = (role, feature) => {
  if (!role) return false;
  const normalizedRole = role.toLowerCase();
  return permissions[normalizedRole]?.includes(feature) || false;
};