const app = require("../app");
const request = require("supertest");
const products = require("../data/product.json");
const users = require("../data/user.json");
const { hashPassword } = require("../helpers/bcrypt");

// const { User, Product } = require("../models");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

const fs = require("fs");
const path = require("path");
const filePath = path.resolve(__dirname, "../assets/earth.jpg");
const imageBuffer = fs.readFileSync(filePath);

let TokenAdmin;
let TokenClient;

beforeAll(async () => {
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

  const user = {
    email: "alice@example.com",
    password: "123456789",
  };

  const findLogin = await request(app).post("/user/login").send(user);
  // console.log(findLogin.body.access_token, "<<<<<<<<<<<<<<<<<");
  TokenAdmin = findLogin.body.access_token;
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
    expect(response.status).toBe(201);
    expect(response.body.message).toContain("Registration Successfully");
  });

  it("should response with status code 400", async () => {
    const newUser = {
      email: "welcome.testexample.com",
      full_name: "welcome test",
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
      full_name: "welcome test",
      password: "123456789",
    };

    const response = await request(app)
      .post("/user/registration")
      .send(newUser);
    // console.log(response,'<<<<');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("The email is already registered");
  });

  it("should response with status code 400", async () => {
    const newUser = {
      email: "welcome.test@example.com",
      full_name: "welcome test",
      password: "1234567",
    };

    const response = await request(app)
      .post("/user/registration")
      .send(newUser);
    // console.log(response,'<<<<');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "The minimum password length is 8 characters"
    );
  });
});

describe("POST /user/login", () => {
  it("should response with status code 200", async () => {
    const user = {
      email: "alice@example.com",
      password: "123456789",
    };
    const response = await request(app).post("/user/login").send(user);
    // console.log(response,'<<<<<<<<<<<<<<<<<<');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("message", expect.any(String));
  });

  it("should response with status code 400", async () => {
    const user = {
      email: "aliceexample.com",
      password: "123456789",
    };
    const response = await request(app).post("/user/login").send(user);
    // console.log(response,'<<<<<<<<<<<<<<<<<<');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "The email is not in the correct format"
    );
  });

  it("should response with status code 400", async () => {
    const user = {
      email: "alice@example.com",
      password: "",
    };
    const response = await request(app).post("/user/login").send(user);
    // console.log(response,'<<<<<<<<<<<<<<<<<<');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "The email and password cannot be empty"
    );
  });

  it("should response with status code 400", async () => {
    const user = {
      email: "",
      password: "123456789",
    };
    const response = await request(app).post("/user/login").send(user);
    // console.log(response,'<<<<<<<<<<<<<<<<<<');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "The email and password cannot be empty"
    );
  });

  it("should response with status code 401", async () => {
    const user = {
      email: "alice@example.com",
      password: "wrongPassword",
    };
    const response = await request(app).post("/user/login").send(user);
    // console.log(response,'<<<<<<<<<<<<<<<<<<');
    expect(response.status).toBe(401);
    expect(response.body.message).toContain(
      "The email or password is incorrect"
    );
  });
});

describe("GET /user/profile", () => {
  it("should response with status code 200", async () => {
    const user = {
      email: "",
      password: "123456789",
    };
    const response = await request(app)
      .get("/user/profile")
      .set("authorization", `Bearer ${TokenAdmin}`);
    // console.log(response,'<<<<<<<<<<<<<<<');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should response with status code 401", async () => {
    const response = await request(app)
      .get("/user/profile")
      .set("authorization", `Bearer WrongToken`);
    // console.log(response,'<<<<<<<<<<<<<<<');
    expect(response.status).toBe(401);
    expect(response.body.message).toContain("The token is invalid or expired");
  });
});

describe("PUT /user/profile/update", () => {
  const updateUser = {
    full_name: "admin alice",
    password: "987654321",
  };

  it("should response with status code 200", async () => {
    const response = await request(app)
      .put("/user/profile/update")
      .set("authorization", `Bearer ${TokenAdmin}`)
      .send(updateUser);
    // console.log(response, "<<<<<<<<<<<<<<<");
    expect(response.status).toBe(200);
  });

  it("should response with status code 401", async () => {
    const response = await request(app)
      .put("/user/profile/update")
      .set("authorization", `Bearer WrongToken`)
      .send(updateUser);
    // console.log(response, "<<<<<<<<<<<<<<<");
    expect(response.status).toBe(401);
    expect(response.body.message).toContain("The token is invalid or expired");
  });
});

describe("PATCH /user/profile/image", () => {
  it("should response with status code 200", async () => {
    const response = await request(app)
      .patch("/user/profile/image")
      .set("authorization", `Bearer ${TokenAdmin}`)
      .attach("profile_image", imageBuffer, {
        filename: "earth.jpg",
      });
    // console.log(response, "<<<<<<<<<<<<<<<");
    expect(response.status).toBe(200);
  });

  it("should response with status code 400", async () => {
    const response = await request(app)
      .patch("/user/profile/image")
      .set("authorization", `Bearer ${TokenAdmin}`)
      .attach("profile_image", imageBuffer, {
        filename: "earth.bat",
      });
    // console.log(response, "<<<<<<<<<<<<<<<");
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "The image cannot be empty or is in the wrong file format"
    );
  });

  it("should response with status code 400", async () => {
    const response = await request(app)
      .patch("/user/profile/image")
      .set("authorization", `Bearer ${TokenAdmin}`)
      .attach("profile_image", undefined, {
        filename: "earth.jpg",
      });
    // console.log(response, "<<<<<<<<<<<<<<<");
    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "The image cannot be empty or is in the wrong file format"
    );
  });

  it("should response with status code 401", async () => {
    const response = await request(app)
      .patch("/user/profile/image")
      .set("authorization", `Bearer WrongToken`)
      .attach("profile_image", imageBuffer, {
        filename: "earth.jpg",
      });
    // console.log(response, "<<<<<<<<<<<<<<<");
    expect(response.status).toBe(401);
    expect(response.body.message).toContain("The token is invalid or expired");
  });
});
