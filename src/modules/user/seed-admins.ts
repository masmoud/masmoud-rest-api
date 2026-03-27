import { logs } from "@/common/logger/pino-logger";
import { Role } from "@/common/types";
import { config } from "@/config";
import { AuthModel } from "../auth/v1";
import { userRepository } from "./v1/user.repository";

export async function seedAdmins() {
  const adminUsers = config.auth.adminUsers;

  if (!adminUsers?.length) {
    logs.db.info("No admin users configured");
    return;
  }

  for (const admin of adminUsers) {
    let auth = await AuthModel.findOne({
      email: admin.email,
    });

    if (auth) {
      logs.db.info(`Admin already exists: ${admin.email}`);
    } else {
      auth = await AuthModel.create({
        email: admin.email,
        password: admin.password,
        role: Role.ADMIN,
      });

      logs.db.info(`Admin created: ${admin.email}`);
    }

    const existingProfile = await userRepository.findByAuthId(
      auth._id.toString(),
    );

    if (!existingProfile) {
      await userRepository.create({ authId: auth._id.toString() });
      logs.db.info(`Admin profile created: ${admin.email}`);
    }
  }
  logs.db.info("Admin seeding completed.");
}
