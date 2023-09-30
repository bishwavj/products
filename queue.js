// const { Queue, Worker } = require('bullmq');
// const { PrismaClient } = require('@prisma/client');
// require("dotenv").config();

// const prisma = new PrismaClient();
// const REDIS_URL = process.env.REDIS_URL;

// const productQueue = new Queue('product', { connection: { url: REDIS_URL } });

// new Worker('product', async job => {
//   const products = job.data.products;
//   for (const product of products) {
//     await prisma.product.create({ data: product });
//   }
// }, { connection: { url: REDIS_URL } });

// module.exports = productQueue;
