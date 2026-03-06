import { Role } from "@/common/types";
import { logs } from "@/common/utils";
import { config } from "@/config";
import { UserModel } from "./user.model";

export async function seedAdmins() {
  const adminUsers = config.auth.adminUsers;

  if (!adminUsers?.length) {
    logs.db.info("No admin users configured");
    return;
  }

  for (const admin of adminUsers) {
    const existingAdmin = await UserModel.findOne({
      email: admin.email,
    });

    if (existingAdmin) {
      logs.db.info(`Admin already exists: ${admin.email}`);
      continue;
    }

    await UserModel.create({
      email: admin.email,
      password: admin.password,
      role: Role.ADMIN,
    });

    logs.db.info(`Admin created: ${admin.email}`);
  }
  logs.db.info("Admin seeding completed.");
}
