import { Request, Response } from 'express';
import ProductService from '../services/ProductService';

class ProductController {
  /**
   * Get a product by ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const product = await ProductService.getProductById(productId);
      
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Get all products
   */
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error('Error getting all products:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Create a new product
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      const product = await ProductService.createProduct(productData);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const productData = req.body;
      
      const updatedProduct = await ProductService.updateProduct(productId, productData);
      
      if (!updatedProduct) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      
      const result = await ProductService.deleteProduct(productId);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default new ProductController(); 