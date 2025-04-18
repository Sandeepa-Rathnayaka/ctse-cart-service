import { z } from "zod";
import mongoose from "mongoose";

// Helper function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const addToCartSchema = z.object({
  body: z.object({
    productId: z
      .string()
      .refine(isValidObjectId, { message: "Invalid product ID format" }),
    quantity: z
      .number()
      .int()
      .positive({ message: "Quantity must be a positive integer" }),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    productId: z
      .string()
      .refine(isValidObjectId, { message: "Invalid product ID format" }),
    quantity: z
      .number()
      .int()
      .positive({ message: "Quantity must be a positive integer" }),
  }),
});

export const removeFromCartSchema = z.object({
  params: z.object({
    productId: z
      .string()
      .refine(isValidObjectId, { message: "Invalid product ID format" }),
  }),
});
