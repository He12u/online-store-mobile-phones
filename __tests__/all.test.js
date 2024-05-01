const { describe, expect, test, it, beforeAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");
const { queryInterface } = sequelize;
const path = require("path");
const fs = require("fs");

const filePath = path.resolve(__dirname, "../assets/earth.png");
const imageBuffer = fs.readFileSync(filePath);

let findTokenAdmin;
let findTokenClient;
const kirimImage = "../assets/satu.png";
beforeAll(async () => {
  const users = require("../data/user.json").map((el) => {
    el.password = hashPassword(el.password);
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el;
  });

  const products = require("../data/product.json").map((el) => {
    delete el.id;
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el;
  });

  await queryInterface.bulkInsert("Users", users);
  await queryInterface.bulkInsert("Cuisines", products);

  const admin = {
    email: "alice@example.com",
    password: "123456789",
  };

  const findAdmin = await request(app).post("/users/login").send(admin);
  // console.log(findAdmin.body.access_token,'<<<<<<<<<<<<<<<<<');
  findTokenAdmin = findAdmin.body.access_token;

  const client = {
    email: "bob@example.com",
    password: "123456789",
  };

  const findClient = await request(app).post("/users/login").send(client);
  findTokenClient = findClient.body.access_token;
});

afterAll(async () => {
  await queryInterface.bulkDelete("Products", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("POST /user/registration", () => {
  it("should response with status code 201", async () => {
    const newUser = {
      email: "welcome.test@example.com",
      password: "123456789",
    };

    const response = await request(app)
      .post("/user/registration")
      .send(newUser);
    // console.log(response,'<<<<');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("email", expect.any(String));
    expect(response.body).toHaveProperty("full_name", expect.any(String));
    expect(response.body).toHaveProperty("password", expect.any(String));
  });

  it("should response with status code 400", async () => {
    const newUser = {
      email: "welcome.testexample.com",
      password: "123456789",
    };

    const response = await request(app)
      .post("/user/registration")
      .send(newUser);
    // console.log(response,'<<<<');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "The email is not in the correct format"
    );
  });

  it("should response with status code 400", async () => {
    const newUser = {
      email: "alice@example.com",
      password: "123456789",
    };

    const response = await request(app)
      .post("/user/registration")
      .send(newUser);
    // console.log(response,'<<<<');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("The email is already registered");
  });
});
