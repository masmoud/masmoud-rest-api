import { logs } from "@/common/logger/pino-logger";
import { Role } from "@/common/types";
import { config } from "@/config";
import { AuthModel } from "../auth/v1";

export async function seedAdmins() {
  const adminUsers = config.auth.adminUsers;

  if (!adminUsers?.length) {
    logs.db.info("No admin users configured");
    return;
  }

  for (const admin of adminUsers) {
    const existingAdmin = await AuthModel.findOne({
      email: admin.email,
    });

    if (existingAdmin) {
      logs.db.info(`Admin already exists: ${admin.email}`);
      logs.db.info(`Admin already exists: ${admin.email}`);

      continue;
    }

    await AuthModel.create({
      email: admin.email,
      password: admin.password,
      role: Role.ADMIN,
    });

    logs.db.info(`Admin created: ${admin.email}`);
  }
  logs.db.info("Admin seeding completed.");
}
