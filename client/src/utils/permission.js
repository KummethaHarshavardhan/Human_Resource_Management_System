const permissions = {
  admin: [
    "dashboard",
    "profile",
    "employee",
    "attendance",
    "leave",
    "payroll",
    "reports",
    "settings"
  ],

  hr: [
    "dashboard",
    "profile",
    "employee",
    "attendance",
    "leave",
    "reports",
    "settings"
  ],

  employee: [
    "dashboard",
    "profile",
    "attendance",
    "leave"
  ]
};


export const canAccessFeature = (role, feature) => {
  if (!role) return false;

  const normalizedRole = role.toLowerCase();

  return permissions[normalizedRole]?.includes(feature) || false;
};