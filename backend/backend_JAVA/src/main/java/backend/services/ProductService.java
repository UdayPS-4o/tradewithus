package backend.services;

import backend.exceptions.ResourceNotFoundException;
import backend.models.Product;
import backend.repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Product getProductById(String productId) {
        return productRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product createProduct(Product product) {
        if (product.getProductId() == null) {
            throw new IllegalArgumentException("productId is required to create a product");
        }
        
        return productRepository.save(product);
    }
    
    public Product updateProduct(String productId, Product productDetails) {
        Product product = productRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));
        
        // Update product fields
        product.setProductName(productDetails.getProductName());
        product.setImages(productDetails.getImages());
        product.setSellerId(productDetails.getSellerId());
        product.setPrice(productDetails.getPrice());
        product.setDetails(productDetails.getDetails());
        product.setShipping(productDetails.getShipping());
        
        return productRepository.save(product);
    }
    
    public boolean deleteProduct(String productId) {
        if (productRepository.findByProductId(productId).isPresent()) {
            productRepository.deleteByProductId(productId);
            return true;
        }
        return false;
    }
    
    public boolean productsExist() {
        return productRepository.count() > 0;
    }
    
    public List<Product> getProductsBySellerId(String sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
} 
