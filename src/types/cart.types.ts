import { Document, ObjectId } from "mongoose";

export interface ICartItem {
  product: ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ICart extends Document {
  user: ObjectId;
  items: ICartItem[];
  totalPrice: number;
  updatedAt: Date;
}

export interface IAddToCartDto {
  productId: string;
  quantity: number;
}

export interface IUpdateCartItemDto {
  productId: string;
  quantity: number;
}

export interface IProductDetails {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

export enum ROLES {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
}
