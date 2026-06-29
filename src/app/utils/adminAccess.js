export const ADMIN_ROUTES = [
  { path: "/Dashboard", permission: ["user", "view"] },
  { path: "/Bulk-SMS", permission: ["user", "view"] },
  { path: "/Compounds", permission: ["compounds", "view"] },
  { path: "/Approved-Users", permission: ["user", "view"] },
  { path: "/Pending-Users", permission: ["user", "view"] },
  { path: "/Rejected-Users", permission: ["user", "view"] },
  { path: "/Generate-Report", permission: ["reports", "generate"] },
  { path: "/Report-Summary", permission: ["reports", "view"] },
  { path: "/Admin-Management", superadminOnly: true },
  { path: "/Action-Logs", permission: ["audit", "view"] },
];

export const isCompleteAdmin = (admin) =>
  Boolean(
    admin?.id &&
      (admin.adminType === "superadmin" ||
        (admin.adminType === "operator" && admin.permissions))
  );

export const canAccessRoute = (admin, path) => {
  if (!isCompleteAdmin(admin)) return false;
  if (admin.adminType === "superadmin") return true;
  if (admin.adminType !== "operator") return false;

  const route = ADMIN_ROUTES.find(
    ({ path: routePath }) =>
      path === routePath || path.startsWith(`${routePath}/`)
  );

  if (!route || route.superadminOnly) return false;

  const [category, action] = route.permission;
  return admin.permissions?.[category]?.[action] === true;
};

export const getFirstAccessibleRoute = (admin) =>
  ADMIN_ROUTES.find(({ path }) => canAccessRoute(admin, path))?.path || "/";
