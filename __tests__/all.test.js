const app = require("../app");
const request = require("supertest");
const products = require("../data/product.json");
const users = require("../data/user.json");
const { hashPassword } = require("../helpers/bcrypt");

// const { User, Product } = require("../models");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

beforeAll(async () => {
  try {
    await queryInterface.bulkInsert(
      "Users",
      users.map((el) => {
        el.password = hashPassword(el.password);
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      })
    );

    await queryInterface.bulkInsert(
      "Products",
      products.map((el) => {
        delete el.id;
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      })
    );
  } catch (error) {
    console.log(error);
  }
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
      full_name: "welcome test",
      password: "123456789",
    };

    const response = await request(app)
      .post("/user/registration")
      .send(newUser);
    console.log(response, "<<<<");
    expect(response.status).toBe(201);
  });

  // it("should response with status code 400", async () => {
  //   const newUser = {
  //     email: "welcome.testexample.com",
  //     password: "123456789",
  //   };

  //   const response = await request(app)
  //     .post("/user/registration")
  //     .send(newUser);
  //   // console.log(response,'<<<<');
  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toContain(
  //     "The email is not in the correct format"
  //   );
  // });

  // it("should response with status code 400", async () => {
  //   const newUser = {
  //     email: "alice@example.com",
  //     password: "123456789",
  //   };

  //   const response = await request(app)
  //     .post("/user/registration")
  //     .send(newUser);
  //   // console.log(response,'<<<<');
  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toContain("The email is already registered");
  // });
});
