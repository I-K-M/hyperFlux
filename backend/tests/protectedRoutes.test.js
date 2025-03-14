const request = require("supertest");
const { app, server } = require("../server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const API_URL = "/api/auth";
const DASHBOARD_URL = "/api/protected/dashboard"; // Adjust based on your actual route

describe("🔐 Protected Routes API Tests", () => {
  let token;

  beforeAll(async () => {
    await prisma.user.deleteMany({});

    // Create a test user
    await request(app).post(`${API_URL}/register`).send({
      email: "secure@example.com",
      password: "securepassword",
    });

    // Login and store the token
    const loginRes = await request(app)
      .post(`${API_URL}/login`)
      .send({
        email: "secure@example.com",
        password: "securepassword",
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    // Extract token from Set-Cookie header
    token = loginRes.headers["set-cookie"][0]
      .split(";")[0]
      .replace("token=", ""); // Ensure correct token format
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (server) server.close();
  });

  test("❌ Access refused without token", async () => {
    const res = await request(app).get(DASHBOARD_URL);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  });

  test("❌ Invalid token", async () => {
    const res = await request(app)
      .get(DASHBOARD_URL)
      .set("Cookie", "token=invalid_token");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  });

  test("✅ Access successful for valid token", async () => {
    const res = await request(app)
      .get(DASHBOARD_URL)
      .set("Cookie", `token=${token}`);

    console.log("Debug Response:", res.body); // Add this for debugging

    expect(res.statusCode).toBe(200);
  });
});
