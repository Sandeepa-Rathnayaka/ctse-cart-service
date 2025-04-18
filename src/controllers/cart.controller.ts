import { Request, Response } from "express";
import * as CartService from "../services/cart.service";
import logger from "../config/logger.config";
import { checkProductStock } from "../utils/product-service";

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const cart = await CartService.getCart(userId);

    return res.status(200).json({
      message: "Cart retrieved successfully",
      cart,
    });
  } catch (error: any) {
    logger.error(`Error retrieving cart: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const token = req.headers.authorization?.split(" ")[1] || "";

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const { productId, quantity } = req.body;

    const cart = await CartService.addToCart(
      userId,
      { productId, quantity },
      token
    );

    return res.status(200).json({
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error: any) {
    logger.error(`Error adding to cart: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const token = req.headers.authorization?.split(" ")[1] || "";

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const { productId, quantity } = req.body;

    const cart = await CartService.updateCartItem(
      userId,
      { productId, quantity },
      token
    );

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error: any) {
    logger.error(`Error updating cart item: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// export const updateCartItem = async (req: Request, res: Response) => {
//   const userId = req.user?.id;

//   if (!userId) {
//     return res.status(401).json({ message: "User not authenticated" });
//   }

//   try {
//     const { productId, quantity } = req.body;

//     const cart = await CartService.updateCartItem(userId, {
//       productId,
//       quantity,
//     });

//     return res.status(200).json({
//       message: "Cart item updated successfully",
//       cart,
//     });
//   } catch (error: any) {
//     logger.error(`Error updating cart item: ${error.message}`);
//     return res.status(400).json({ message: error.message });
//   }
// };

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const { productId } = req.params;

    const cart = await CartService.removeFromCart(userId, productId);

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error: any) {
    logger.error(`Error removing from cart: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const result = await CartService.clearCart(userId);

    return res.status(200).json({
      message: result.message,
    });
  } catch (error: any) {
    logger.error(`Error clearing cart: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

export const getCartSummary = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const summary = await CartService.getCartSummary(userId);

    return res.status(200).json({
      message: "Cart summary retrieved successfully",
      summary,
    });
  } catch (error: any) {
    logger.error(`Error retrieving cart summary: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};
