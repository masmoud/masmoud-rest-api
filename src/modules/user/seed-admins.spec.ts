import { logs } from "@/common/logger/pino-logger";
import { config } from "@/config";
import { AuthModel } from "../auth/v1";
import { userRepository } from "./v1/user.repository";
import { seedAdmins } from "./seed-admins";

describe("seedAdmins", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("creates a user profile for an existing admin auth record", async () => {
    const admin = config.auth.adminUsers[0];

    jest.spyOn(logs.db, "info").mockImplementation(() => undefined as never);
    jest.spyOn(AuthModel, "findOne").mockResolvedValue({
      _id: {
        toString: () => "auth-1",
      },
    } as any);
    jest.spyOn(AuthModel, "create").mockResolvedValue({} as any);
    jest.spyOn(userRepository, "findByAuthId").mockResolvedValue(null);
    jest.spyOn(userRepository, "create").mockResolvedValue({} as any);

    await seedAdmins();

    expect(AuthModel.findOne).toHaveBeenCalledWith({ email: admin.email });
    expect(AuthModel.create).not.toHaveBeenCalled();
    expect(userRepository.findByAuthId).toHaveBeenCalledWith("auth-1");
    expect(userRepository.create).toHaveBeenCalledWith({ authId: "auth-1" });
  });

  it("creates both auth and user profile when the admin does not exist", async () => {
    const admin = config.auth.adminUsers[0];

    jest.spyOn(logs.db, "info").mockImplementation(() => undefined as never);
    jest.spyOn(AuthModel, "findOne").mockResolvedValue(null);
    jest.spyOn(AuthModel, "create").mockResolvedValue({
      _id: {
        toString: () => "auth-2",
      },
    } as any);
    jest.spyOn(userRepository, "findByAuthId").mockResolvedValue(null);
    jest.spyOn(userRepository, "create").mockResolvedValue({} as any);

    await seedAdmins();

    expect(AuthModel.create).toHaveBeenCalledWith({
      email: admin.email,
      password: admin.password,
      role: "admin",
    });
    expect(userRepository.findByAuthId).toHaveBeenCalledWith("auth-2");
    expect(userRepository.create).toHaveBeenCalledWith({ authId: "auth-2" });
  });
});
