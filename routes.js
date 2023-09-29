const express = require("express");
const router = express.Router();
const productController = require("./controller");

router.get("/", productController.index);

router.post("/products", productController.createProduct);

router.put("/products/:id", productController.updateProduct);

router.get("/products", productController.listProducts);

router.get("/products/:idOrName", productController.getProduct);

router.post("/products/:id/toggle", productController.toggleProductStatus);

router.post("/upload-products", productController.uploadProducts);

router.get("/products-all", productController.allProducts);

module.exports = router;
