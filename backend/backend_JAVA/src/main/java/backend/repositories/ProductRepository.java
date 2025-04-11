package backend.repositories;

import backend.models.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    Optional<Product> findByProductId(String productId);
    
    List<Product> findBySellerId(String sellerId);
    
    boolean existsByProductId(String productId);
    
    void deleteByProductId(String productId);
    
    long count();
} 
