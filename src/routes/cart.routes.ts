import express from "express";
import { validateUserRoleAndToken } from "../middleware/auth.middleware";
import validate from "../middleware/schemavalidator.middleware";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
} from "../schema/cart.schema";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
} from "../controllers/cart.controller";

const router = express.Router();

// All routes require authentication
router.use(validateUserRoleAndToken());

// Get cart
router.get("/", getCart);

// Add item to cart
router.post("/add", validate(addToCartSchema), addToCart);

// Update cart item
router.patch("/update", validate(updateCartItemSchema), updateCartItem);

// Remove item from cart
router.delete(
  "/remove/:productId",
  validate(removeFromCartSchema),
  removeFromCart
);

// Clear cart
router.delete("/clear", clearCart);

// Get cart summary
router.get("/summary", getCartSummary);

export default router;
