import { appInstance } from "@/app";
import { AuthModel } from "@/modules/auth/v1/auth.model";
import { UserModel } from "@/modules/user/v1/user.model";
import request from "supertest";

const describeDbIntegration =
  process.env.RUN_DB_INTEGRATION === "true" ? describe : describe.skip;

const createEmail = () => `integration-${Date.now()}-${Math.random()}@test.com`;

describeDbIntegration("POST /api/v1/auth/register", () => {
  it("creates auth and user records in the database", async () => {
    const email = createEmail();

    const response = await request(appInstance.app)
      .post("/api/v1/auth/register")
      .send({
        email,
        password: "Password123!",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          user: expect.objectContaining({
            id: expect.any(String),
            authId: expect.any(String),
          }),
          accessToken: expect.any(String),
        }),
      }),
    );

    const auth = await AuthModel.findOne({ email }).exec();
    const user = await UserModel.findOne({
      authId: auth?._id.toString(),
    }).exec();

    expect(auth).not.toBeNull();
    expect(user).not.toBeNull();
    expect(user?.authId).toBe(auth?._id.toString());
    expect(auth?.refreshTokens).toHaveLength(1);
  });
});
