const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const app = express();
const routes = require("./routes");
require("dotenv").config();
const fileUpload = require("express-fileupload");

const port = 3000 || process.env.PORT;

app.use(express.json());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(routes);

testDatabaseConnection(); 

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error connecting to the DB", error);
    process.exit(1);
  }
}
