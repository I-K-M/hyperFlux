const request = require("supertest");
const { app, server } = require("../server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const API_URL = "/api/auth";

describe("🔐 Auth API Tests", () => {
  let token;

  beforeAll(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (server) server.close(); // Ensure server closes after tests
  });

  test("✅ Register passes", async () => {
    const res = await request(app).post(`${API_URL}/register`).send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User added to database.");
  });

  test("❌ Register fails for already existing email address", async () => {
    const res = await request(app).post(`${API_URL}/register`).send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("message", "Email address already used.");
  });

  test("✅ Login passes for valid email and password", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("auth", true);
    expect(res.headers["set-cookie"]).toBeDefined();
    token = res.headers["set-cookie"][0];
  });

  test("❌ Login fails for wrong password", async () => {
    const res = await request(app).post(`${API_URL}/login`).send({
      email: "test@example.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid password.");
  });

  test("✅ Logout passes for cookie destruction", async () => {
    const res = await request(app).post(`${API_URL}/logout`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Logout successful.");
  });
});
