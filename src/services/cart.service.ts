import mongoose from "mongoose";
import Cart from "../models/cart.model";
import { BadRequestError } from "../errors";
import { IAddToCartDto, IUpdateCartItemDto, ICart } from "../types/cart.types";
import { getProductDetails, checkProductStock } from "../utils/product-service";
import logger from "../config/logger.config";

export async function getCart(userId: string): Promise<ICart> {
  let cart = await Cart.findOne({ user: userId });

  // If no cart exists, create a new one
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalPrice: 0,
    });
  }

  return cart;
}

export async function addToCart(
  userId: string,
  dto: IAddToCartDto,
  token: string
): Promise<ICart> {
  const { productId, quantity } = dto;

  // Validate product stock
  await checkProductStock(productId, quantity, token);

  // Get product details
  const product = await getProductDetails(productId, token);

  // Find user's cart
  let cart: any = await Cart.findOne({ user: userId });

  // If no cart exists, create a new one
  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
      totalPrice: 0,
    });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    // Check if new quantity exceeds stock
    await checkProductStock(productId, newQuantity, token);

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item to cart
    cart.items.push({
      product: new mongoose.Types.ObjectId(productId),
      name: product.name,
      price: product.price,
      image: product.images[0] || "https://via.placeholder.com/150",
      quantity,
    });
  }

  // Save cart and return
  await cart.save();
  return cart;
}

export async function updateCartItem(
  userId: string,
  dto: IUpdateCartItemDto,
  token: string
): Promise<ICart> {
  const { productId, quantity } = dto;

  // Validate quantity
  if (quantity <= 0) {
    throw new BadRequestError("Quantity must be greater than 0");
  }

  // Validate product stock
  await checkProductStock(productId, quantity, token);

  // Find user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new BadRequestError("Cart not found");
  }

  // Find the item in the cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex === -1) {
    throw new BadRequestError("Item not found in cart");
  }

  // Update item quantity
  cart.items[existingItemIndex].quantity = quantity;

  // Save cart and return
  await cart.save();
  return cart;
}

// export async function addToCart(
//   userId: string,
//   dto: IAddToCartDto
// ): Promise<ICart> {
//   const { productId, quantity } = dto;

//   // Validate product stock
//   await checkProductStock(productId, quantity);

//   // Get product details
//   const product = await getProductDetails(productId);

//   // Find user's cart
//   let cart: any = await Cart.findOne({ user: userId });

//   // If no cart exists, create a new one
//   if (!cart) {
//     cart = new Cart({
//       user: userId,
//       items: [],
//       totalPrice: 0,
//     });
//   }

//   // Check if item already exists in cart
//   const existingItemIndex = cart.items.findIndex(
//     (item: any) => item.product.toString() === productId
//   );

//   if (existingItemIndex > -1) {
//     // Update existing item quantity
//     const newQuantity = cart.items[existingItemIndex].quantity + quantity;

//     // Check if new quantity exceeds stock
//     await checkProductStock(productId, newQuantity);

//     cart.items[existingItemIndex].quantity = newQuantity;
//   } else {
//     // Add new item to cart
//     cart.items.push({
//       product: new mongoose.Types.ObjectId(productId),
//       name: product.name,
//       price: product.price,
//       image: product.images[0] || "https://via.placeholder.com/150",
//       quantity,
//     });
//   }

//   // Save cart and return
//   await cart.save();
//   return cart;
// }

// export async function updateCartItem(
//   userId: string,
//   dto: IUpdateCartItemDto
// ): Promise<ICart> {
//   const { productId, quantity } = dto;

//   // Validate quantity
//   if (quantity <= 0) {
//     throw new BadRequestError("Quantity must be greater than 0");
//   }

//   // Validate product stock
//   await checkProductStock(productId, quantity);

//   // Find user's cart
//   const cart = await Cart.findOne({ user: userId });

//   if (!cart) {
//     throw new BadRequestError("Cart not found");
//   }

//   // Find the item in the cart
//   const existingItemIndex = cart.items.findIndex(
//     (item) => item.product.toString() === productId
//   );

//   if (existingItemIndex === -1) {
//     throw new BadRequestError("Item not found in cart");
//   }

//   // Update item quantity
//   cart.items[existingItemIndex].quantity = quantity;

//   // Save cart and return
//   await cart.save();
//   return cart;
// }

export async function removeFromCart(
  userId: string,
  productId: string
): Promise<ICart> {
  // Find user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new BadRequestError("Cart not found");
  }

  // Remove the item from the cart
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  // Save cart and return
  await cart.save();
  return cart;
}

export async function clearCart(userId: string): Promise<{ message: string }> {
  // Find user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return { message: "Cart already empty" };
  }

  // Clear all items
  cart.items = [];

  // Save cart
  await cart.save();

  return { message: "Cart cleared successfully" };
}

export async function getCartSummary(userId: string): Promise<{
  itemCount: number;
  totalPrice: number;
}> {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    return { itemCount: 0, totalPrice: 0 };
  }

  const itemCount = cart.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return {
    itemCount,
    totalPrice: cart.totalPrice,
  };
}
