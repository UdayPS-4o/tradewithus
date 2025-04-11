import Product, { IProduct } from '../models/Product';

class ProductService {
  /**
   * Get a product by ID
   */
  async getProductById(productId: string): Promise<IProduct | null> {
    try {
      return await Product.findOne({ productId: productId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all products
   */
  async getAllProducts(): Promise<IProduct[]> {
    try {
      return await Product.find();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    try {
      if (!productData.productId) {
        throw new Error('productId is required to create a product.');
      }
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { productId: productId },
        productData,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const result = await Product.deleteOne({ productId: productId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if any products exist in the database
   */
  async productsExist(): Promise<boolean> {
    try {
      const count = await Product.countDocuments();
      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get products by seller ID
   */
  async getProductsBySellerId(sellerId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ sellerId });
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService(); 