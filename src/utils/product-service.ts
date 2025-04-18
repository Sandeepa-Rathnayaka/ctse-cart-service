import axios from "axios";
import logger from "../config/logger.config";
import { IProductDetails } from "../types/cart.types";
import { BadRequestError } from "../errors";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:8003";

export async function getProductDetails(
  productId: string,
  token: string
): Promise<IProductDetails> {
  try {
    const response = await axios.get(
      `${PRODUCT_SERVICE_URL}/api/v1/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new BadRequestError(
        `Failed to fetch product details: ${response.statusText}`
      );
    }

    const product = response.data.product;

    // Extract only the needed fields
    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      stock: product.stock,
    };
  } catch (error: any) {
    logger.error(`Error fetching product details: ${error.message}`);
    if (error.response) {
      throw new BadRequestError(
        error.response.data.error || "Failed to fetch product details"
      );
    }
    throw new BadRequestError("Failed to connect to Product Service");
  }
}

export async function checkProductStock(
  productId: string,
  quantity: number,
  token: string
): Promise<boolean> {
  const product = await getProductDetails(productId, token);

  if (product.stock < quantity) {
    throw new BadRequestError(
      `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
    );
  }

  return true;
}
