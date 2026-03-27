import { Role } from "@/common/types";
import { UserController } from "./user.controller";

const createUserDoc = (overrides: Record<string, unknown> = {}) => ({
  _id: {
    toString: () => "user-1",
  },
  firstName: "Ada",
  lastName: "Lovelace",
  authId: "auth-1",
  ...overrides,
});

const createRequest = (overrides: Record<string, unknown> = {}) =>
  ({
    requestId: "req-1",
    params: {},
    body: {},
    auth: {
      id: "auth-1",
      email: "user@test.com",
      role: Role.USER,
    },
    user: {
      id: "user-1",
      firstName: "Ada",
      lastName: "Lovelace",
    },
    ...overrides,
  }) as any;

const createResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res as any;
};

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("allows a user to fetch their own record", async () => {
    const service = {
      getUserById: jest.fn().mockResolvedValue(createUserDoc()),
    };
    const controller = new UserController(service as any, {} as any);
    const req = createRequest({ params: { id: "user-1" } });
    const res = createResponse();
    const next = jest.fn();

    await controller.getUserById(req, res, next);

    expect(service.getUserById).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "User fetched",
        data: {
          id: "user-1",
          firstName: "Ada",
          lastName: "Lovelace",
        },
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a non-admin user reading another user record", async () => {
    const service = {
      getUserById: jest.fn(),
    };
    const controller = new UserController(service as any, {} as any);
    const req = createRequest({ params: { id: "user-2" } });
    const res = createResponse();
    const next = jest.fn();

    await controller.getUserById(req, res, next);

    expect(service.getUserById).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: "Insufficient permission",
      }),
    );
  });

  it("allows an admin to update another user record", async () => {
    const service = {
      updateUser: jest.fn().mockResolvedValue(
        createUserDoc({
          _id: { toString: () => "user-2" },
          firstName: "Grace",
        }),
      ),
    };
    const controller = new UserController(service as any, {} as any);
    const req = createRequest({
      auth: {
        id: "auth-admin",
        email: "admin@test.com",
        role: Role.ADMIN,
      },
      params: { id: "user-2" },
      body: { firstName: "Grace" },
    });
    const res = createResponse();
    const next = jest.fn();

    await controller.updateUser(req, res, next);

    expect(service.updateUser).toHaveBeenCalledWith("user-2", {
      firstName: "Grace",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User updated successfully",
        data: expect.objectContaining({
          id: "user-2",
          firstName: "Grace",
        }),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("updates the authenticated user through the profile endpoint", async () => {
    const service = {
      updateUser: jest.fn().mockResolvedValue(
        createUserDoc({
          firstName: "Updated",
        }),
      ),
    };
    const controller = new UserController(service as any, {} as any);
    const req = createRequest({
      body: { firstName: "Updated" },
    });
    const res = createResponse();
    const next = jest.fn();

    await controller.updateProfile(req, res, next);

    expect(service.updateUser).toHaveBeenCalledWith("user-1", {
      firstName: "Updated",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Profile updated successfully",
        data: expect.objectContaining({
          id: "user-1",
          firstName: "Updated",
        }),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects profile update when no authenticated user is attached", async () => {
    const service = {
      updateUser: jest.fn(),
    };
    const controller = new UserController(service as any, {} as any);
    const req = createRequest({ user: undefined });
    const res = createResponse();
    const next = jest.fn();

    await controller.updateProfile(req, res, next);

    expect(service.updateUser).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: "User is not authenticated",
      }),
    );
  });
});
