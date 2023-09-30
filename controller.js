const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const productQueue = require("./queue"); 

module.exports = {
  index: async (req, res) => {
    res.send("Andisor Corp : server up and running!");
  },

  createProduct: async (req, res) => {
    const { name, description, stock, quantity, category } = req.body;
    try {
      const product = await prisma.product.create({
        data: { name, description, stock, quantity, category },
      });
      res.json(product);
    } catch (error) {
      if (
        error.code === "P2002" &&
        error.meta &&
        error.meta.target.includes("name")
      ) {
        return res
          .status(400)
          .json({ error: "Product name should be unique." });
      }
      return res
        .status(500)
        .json({ error: "An error occurred while creating the product." });
    }
  },

  updateProduct: async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, stock, quantity, category, isActive } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (stock !== undefined) data.stock = Number(stock);
    if (quantity !== undefined) data.quantity = Number(quantity);
    if (category !== undefined) data.category = category;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    try {
      const product = await prisma.product.update({
        where: { id },
        data: data,
      });
      res.json(product);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the product." });
    }
  },

  listProducts: async (req, res) => {
    const { name, quantity, stock, category, isActive, page } = req.query;
    let where = {};

    if (name) where.name = { contains: name };
    if (quantity) where.quantity = { equals: Number(quantity) };
    if (stock) where.stock = { equals: Number(stock) };
    if (category) where.category = { equals: category };
    if (isActive !== undefined)
      where.isActive = { equals: isActive === "true" };

    const pageNum = Number(page);
    const products = await prisma.product.findMany({
      where: where,
      skip: pageNum > 0 ? (pageNum - 1) * 10 : 0,
      take: 10,
    });

    res.json(products);
  },

  getProduct: async (req, res) => {
    const idOrName = req.params.idOrName;
    let product;
    if (isNaN(idOrName)) {
      product = await prisma.product.findUnique({
        where: { name: idOrName },
      });
    } else {
      product = await prisma.product.findUnique({
        where: { id: Number(idOrName) },
      });
    }
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  },

  toggleProductStatus: async (req, res) => {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
    res.json(updatedProduct);
  },

  // uploadProducts: async (req, res) => {
  //   if (!req.files) {
  //     return res.status(400).json({ error: "No file uploaded" });
  //   }

  //   try {
  //     const productsFile = req.files.products;
  //     let content = productsFile.data.toString();
  //     if (content.charCodeAt(0) === 0xfeff) {
  //       content = content.slice(1);
  //     }
  //     const products = JSON.parse(content);
  //     await productQueue.add("Create products", { products });

  //     res.status(202).json({
  //       message: "Products are being processed",
  //       uploadedProducts: products,
  //     });
  //   } catch (error) {
  //     console.log("error:", error);
  //     res.status(500).json({ error: "Failed to process products" });
  //   }
  // },
  allProducts: async (req, res) => {
        try{
        let products = await prisma.product.findMany({});
        res.json(products)
        } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
};





