import { createRouteHandler, createUploadthing } from "uploadthing/next";

const f = createUploadthing();

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://octopus-app-8k2vt.ondigitalocean.app";

const ourFileRouter = {
  userSignature: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const authorization = req.headers.get("authorization");

      if (!authorization?.startsWith("Bearer ")) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/get-logged-in-admin`,
        {
          headers: { Authorization: authorization },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("You are not authorized to upload signatures");
      }

      const data = await response.json();
      const admin = data?.admin;
      if (!admin?.id) {
        throw new Error("Admin account not found");
      }
      const canEditUsers =
        admin.adminType === "superadmin" ||
        admin.permissions?.user?.edit === true;
      if (!canEditUsers) {
        throw new Error("User edit permission is required");
      }

      return {
        adminId: String(admin.id),
        adminEmail: admin.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.adminId,
      url: file.ufsUrl || file.url,
    })),
};

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
