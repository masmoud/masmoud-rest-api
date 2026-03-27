import { RegisterSchema } from "./auth.validator";

describe("RegisterSchema", () => {
  it("rejects a client-supplied role", () => {
    const result = RegisterSchema.safeParse({
      email: "user@test.com",
      password: "Password123!",
      role: "admin",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected schema validation to fail");
    }

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "unrecognized_keys",
        }),
      ]),
    );
  });

  it("accepts email and password only", () => {
    const result = RegisterSchema.safeParse({
      email: "user@test.com",
      password: "Password123!",
    });

    expect(result.success).toBe(true);
  });
});
