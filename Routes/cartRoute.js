const express = require("express");
const cartController = require("../controller/cartController");

const router = express.Router();
router.post("/", cartController.addProductToCart);
