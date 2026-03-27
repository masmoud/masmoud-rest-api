import { appInstance } from "@/app";
import request from "supertest";

describe("GET /api/v1/system/health", () => {
  it("returns service health without authentication", async () => {
    const response = await request(appInstance.app).get(
      "/api/v1/system/health",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "ok",
        timestamp: expect.any(String),
      }),
    );
    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
  });
});
