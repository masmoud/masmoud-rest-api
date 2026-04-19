import { logs } from "@/common/logger/pino-logger";
import { Role } from "@/common/types";
import { config } from "@/config";
import { authRepo, authService } from "@/context";

/**
 * Seeds admin accounts defined in config on app startup.
 * Creates both the auth record and user profile if they don't already exist.
 */
export async function seedAdmins() {
  const log = logs.child("SEED_ADMIN");
  log.info("Starting admin seeding process...");
  const adminUsers = config.auth.adminUsers;

  if (!adminUsers?.length) {
    log.info("No admin users configured");
    return;
  }

  for (const admin of adminUsers) {
    const existing = await authRepo.findByEmail(admin.email);

    if (existing) {
      log.info(`Admin already exists: ${admin.email}`);
      continue;
    }

    await authService.register(admin.email, admin.password, Role.ADMIN, {
      issueTokens: false,
    });

    log.info(`Admin created: ${admin.email}`);
  }

  log.info("Admin seeding completed.");
}
