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

// describe("POST /users/login", () => {
//   it("should response with status code 200", async () => {
//     const user = {
//       email: "alice@example.com",
//       password: "123456",
//     };
//     const response = await request(app).post("/users/login").send(user);
//     // console.log(response,'<<<<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body).toHaveProperty("access_token", expect.any(String));
//     expect(response.body).toHaveProperty("username", expect.any(String));
//     expect(response.body).toHaveProperty("role", expect.any(String));
//   });

//   it("should response with status code 400", async () => {
//     const user = {
//       email: "",
//       password: "passwordsalah",
//     };
//     // .send untuk ngirim body
//     // .set untuk ngirim headers
//     const response = await request(app).post("/users/login").send(user);
//     // console.log(response);
//     expect(response.status).toBe(400);
//     expect(response.body.message).toContain("email and password required");
//   });

//   it("should response with status code 400", async () => {
//     const user = {
//       email: "alice@example.com",
//       password: "",
//     };
//     // .send untuk ngirim body
//     // .set untuk ngirim headers
//     const response = await request(app).post("/users/login").send(user);
//     // console.log(response);
//     expect(response.status).toBe(400);
//     expect(response.body.message).toContain("email and password required");
//   });

//   it("should response with status code 401", async () => {
//     const user = {
//       email: "emailsalah@example.com",
//       password: "123456",
//     };
//     // .send untuk ngirim body
//     // .set untuk ngirim headers
//     const response = await request(app).post("/users/login").send(user);
//     // console.log(response);
//     expect(response.status).toBe(401);
//     expect(response.body.message).toContain("error invalid email or password");
//   });

//   it("should response with status code 401", async () => {
//     const user = {
//       email: "alice@example.com",
//       password: "1234567",
//     };
//     // .send untuk ngirim body
//     // .set untuk ngirim headers
//     const response = await request(app).post("/users/login").send(user);
//     // console.log(response);
//     expect(response.status).toBe(401);
//     expect(response.body.message).toContain("error invalid email or password");
//   });
// });

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

// describe("POST /cuisines/add", () => {
//   it("should response with status code 201", async () => {
//     const newCuisine = {
//       name: "New Cuisine",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };

//     const response = await request(app)
//       .post("/cuisines/add")
//       .set("authorization", `Bearer ${findTokenStaff}`)
//       .send(newCuisine);
//     // console.log(response,'<<<<');
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id", expect.any(Number));
//     expect(response.body).toHaveProperty("name", expect.any(String));
//     expect(response.body).toHaveProperty("description", expect.any(String));
//     expect(response.body).toHaveProperty("price", expect.any(Number));
//     expect(response.body).toHaveProperty("imgUrl", expect.any(String));
//     expect(response.body).toHaveProperty("categoryId", expect.any(Number));
//     expect(response.body).toHaveProperty("authorId", expect.any(Number));
//   });

//   it("should response with status code 401", async () => {
//     const newCuisine = {
//       name: "New Cuisine",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };

//     const response = await request(app).post("/cuisines/add").send(newCuisine);
//     // console.log(response,'<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 401", async () => {
//     const newCuisine = {
//       name: "New Cuisine",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };

//     const response = await request(app)
//       .post("/cuisines/add")
//       .set("authorization", `Bearer ${findTokenStaff}w`)
//       .send(newCuisine);
//     // console.log(response,'<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 400", async () => {
//     const newCuisine = {
//       name: "",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };

//     const response = await request(app)
//       .post("/cuisines/add")
//       .set("authorization", `Bearer ${findTokenStaff}`)
//       .send(newCuisine);
//     // console.log(response,'<<<<');
//     expect(response.status).toBe(400);
//     expect(response.body).toBeInstanceOf(Array);
//   });
// });

// describe("GET /cuisines", () => {
//   it("should response with status code 200", async () => {
//     const response = await request(app)
//       .get("/cuisines")
//       .set("authorization", `Bearer ${findTokenStaff}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body).toHaveProperty("count", expect.any(Number));
//     expect(response.body).toHaveProperty("rows", expect.any(Array));
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app).get("/cuisines");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app)
//       .get("/cuisines")
//       .set("authorization", `Bearer ${findTokenStaff}w`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });
// });

// describe("GET /cuisines/:id", () => {
//   it("should response with status code 200", async () => {
//     const response = await request(app)
//       .get("/cuisines/1")
//       .set("authorization", `Bearer ${findTokenStaff}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app)
//       .get("/cuisines/1")
//       .set("authorization", `Bearer ${findTokenStaff}w`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app).get("/cuisines/1");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 404", async () => {
//     const response = await request(app)
//       .get("/cuisines/100")
//       .set("authorization", `Bearer ${findTokenStaff}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(404);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("error not found");
//   });
// });
// //===========PUT
// describe("PUT /cuisines/:id/update", () => {
//   it("should response with status code 200", async () => {
//     const updateCuisine = {
//       name: "DIUBAH OLEH STAFF YANG SESUAI",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };
//     const response = await request(app)
//       .put("/cuisines/4/update")
//       .set("authorization", `Bearer ${findTokenStaff}`)
//       .send(updateCuisine);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//   });

//   it("should response with status code 403", async () => {
//     const updateCuisine = {
//       name: "BUKAN ID YANG SESUAI",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };
//     const response = await request(app)
//       .put("/cuisines/1/update")
//       .set("authorization", `Bearer ${findTokenStaff}`)
//       .send(updateCuisine);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(403);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Forbiden Access");
//   });

//   it("should response with status code 401", async () => {
//     const updateCuisine = {
//       name: "TIDAK LOGIN",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };
//     const response = await request(app)
//       .put("/cuisines/1/update")
//       .send(updateCuisine);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 401", async () => {
//     const updateCuisine = {
//       name: "TOKEN SALAH",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };
//     const response = await request(app)
//       .put("/cuisines/1/update")
//       .set("authorization", `Bearer ${findTokenStaff}w`)
//       .send(updateCuisine);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 404", async () => {
//     const updateCuisine = {
//       name: "ID TIDAK DITEMUKAN",
//       description: "try add new cuisine",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };
//     const response = await request(app)
//       .put("/cuisines/100/update")
//       .set("authorization", `Bearer ${findTokenStaff}`)
//       .send(updateCuisine);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(404);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("error not found");
//   });

//   it("should response with status code 400", async () => {
//     const updateCuisine = {
//       name: "REQ BODY TIDAK SESUAI",
//       description: "",
//       price: 10000,
//       imgUrl: "asd",
//       categoryId: 1,
//     };
//     const response = await request(app)
//       .put("/cuisines/5/update")
//       .set("authorization", `Bearer ${findTokenStaff}`)
//       .send(updateCuisine);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(400);
//     expect(response.body).toBeInstanceOf(Array);
//   });
// });

// describe("DELETE /cuisines/:id/delete", () => {
//   it("should response with status code 200", async () => {
//     const response = await request(app)
//       .delete("/cuisines/5/delete")
//       .set("authorization", `Bearer ${findTokenStaff}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain(
//       "Cuisine with id 5 success to delete"
//     );
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app).delete("/cuisines/5/delete");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app)
//       .delete("/cuisines/5/delete")
//       .set("authorization", `Bearer ${findTokenStaff}w`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 404", async () => {
//     const response = await request(app)
//       .delete("/cuisines/100/delete")
//       .set("authorization", `Bearer ${findTokenStaff}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(404);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("error not found");
//   });

//   it("should response with status code 403", async () => {
//     const response = await request(app)
//       .delete("/cuisines/1/delete")
//       .set("authorization", `Bearer ${findTokenStaff}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(403);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body.message).toContain("Forbiden Access");
//   });
// });

// describe("PATCH /cuisines/:id/updateImgUrl", () => {
//   it("should response with status code 200", async () => {
//     const response = await request(app)
//       .patch("/cuisines/2/updateImgUrl")
//       .set("authorization", `Bearer ${findTokenAdmin}`)
//       .attach("image", imageBuffer, "satu.png");
//     console.log(response, "<<<<<<<<<<<<<<<");
//     expect(response.status).toBe(200);
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app)
//       .patch("/cuisines/4/updateImgUrl")
//       .attach("image", imageBuffer, "satu.png");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app)
//       .patch("/cuisines/4/updateImgUrl")
//       .set("authorization", `Bearer ${findTokenAdmin}w`)
//       .attach("image", imageBuffer, "satu.png");
//     console.log(response, "<<<<<<<<<<<<<<<");
//     expect(response.status).toBe(401);
//     expect(response.body.message).toContain("Unauthorized access");
//   });

//   it("should response with status code 404", async () => {
//     const response = await request(app)
//       .patch("/cuisines/100/updateImgUrl")
//       .set("authorization", `Bearer ${findTokenAdmin}`)
//       .attach("image", imageBuffer, "satu.png");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(404);
//   });

//   it("should response with status code 403", async () => {
//     const response = await request(app)
//       .patch("/cuisines/1/updateImgUrl")
//       .set("authorization", `Bearer ${findTokenStaff}`)
//       .attach("image", imageBuffer, "satu.png");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(403);
//     expect(response.body.message).toContain("Forbiden Access");
//   });

//   it("should response with status code 500", async () => {
//     const response = await request(app)
//       .patch("/cuisines/1/updateImgUrl")
//       .set("authorization", `Bearer ${findTokenAdmin}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(500);
//   });
// });

// describe("GET /categories", () => {
//   it("should response with status code 200", async () => {
//     const response = await request(app)
//       .get("/categories")
//       .set("authorization", `Bearer ${findTokenAdmin}`);
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app).get("/categories");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(401);
//   });

//   it("should response with status code 401", async () => {
//     const response = await request(app)
//       .get("/categories")
//       .set("authorization", `Bearer ${findTokenAdmin}w`);
//     console.log(response, "<<<<<<<<<<<<<<<");
//     expect(response.status).toBe(401);
//   });
// });

// describe("GET /pub/cuisines", () => {
//   it("should response with status code 200", async () => {
//     const response = await request(app).get("/pub/cuisines");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//   });

//   it("should response with status code 200", async () => {
//     const response = await request(app).get("/pub/cuisines/?filter=Drink");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//   });

//   it("should response with status code 200", async () => {
//     const response = await request(app).get("/pub/cuisines/?page=2");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//   });
// });

// describe("GET /pub/cuisines/:id", () => {
//   it("should response with status code 200", async () => {
//     const response = await request(app).get("/pub/cuisines/1");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(200);
//   });

//   it("should response with status code 404", async () => {
//     const response = await request(app).get("/pub/cuisines/100");
//     // console.log(response,'<<<<<<<<<<<<<<<');
//     expect(response.status).toBe(404);
//   });
// });
