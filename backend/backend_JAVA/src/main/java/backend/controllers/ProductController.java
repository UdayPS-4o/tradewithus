package backend.controllers;

import backend.exceptions.ResourceNotFoundException;
import backend.models.ApiResponse;
import backend.models.Product;
import backend.services.ProductService;
import backend.validators.ProductValidator;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/product")
public class ProductController {
    
    private final ProductService productService;
    private final ProductValidator productValidator;
    
    public ProductController(ProductService productService, ProductValidator productValidator) {
        this.productService = productService;
        this.productValidator = productValidator;
    }
    
    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(productValidator);
    }
    
    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String productId) {
        try {
            Product product = productService.getProductById(productId);
            return new ResponseEntity<>(ApiResponse.success(product), HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(ApiResponse.error("Product not found"), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return new ResponseEntity<>(ApiResponse.success(products), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> createProduct(@Valid @RequestBody Product product, BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(err -> {
                    errors.put(err.getField(), err.getDefaultMessage());
                });
                return new ResponseEntity<>(ApiResponse.error("Missing required product fields", errors), HttpStatus.BAD_REQUEST);
            }
            
            Product createdProduct = productService.createProduct(product);
            return new ResponseEntity<>(ApiResponse.success(createdProduct), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<Object>> updateProduct(@PathVariable String productId, 
                                                            @Valid @RequestBody Product product, 
                                                            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(err -> {
                    errors.put(err.getField(), err.getDefaultMessage());
                });
                return new ResponseEntity<>(ApiResponse.error("Invalid product data", errors), HttpStatus.BAD_REQUEST);
            }
            
            Product updatedProduct = productService.updateProduct(productId, product);
            return new ResponseEntity<>(ApiResponse.success(updatedProduct), HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(ApiResponse.error("Product not found"), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(@PathVariable String productId) {
        try {
            boolean result = productService.deleteProduct(productId);
            
            if (result) {
                return new ResponseEntity<>(ApiResponse.success(null, "Product deleted successfully"), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ApiResponse.error("Product not found"), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 
