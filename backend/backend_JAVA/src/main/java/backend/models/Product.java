package backend.models;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    
    @NotBlank(message = "ProductId is required")
    @Indexed(unique = true)
    private String productId;
    
    @NotBlank(message = "Product name is required")
    private String productName;
    
    @NotEmpty(message = "At least one product image is required")
    private List<String> images;
    
    @NotBlank(message = "SellerId is required")
    @Indexed
    private String sellerId;
    
    @NotNull(message = "Price information is required")
    @Valid
    private Price price;
    
    @NotNull(message = "Product details are required")
    @Valid
    private ProductDetails details;
    
    @NotNull(message = "Shipping details are required")
    @Valid
    private ShippingDetails shipping;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Price {
        private double current;
        
        @NotNull(message = "Price range is required")
        @Valid
        private PriceRange range;
        
        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PriceRange {
            private double min;
            private double max;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductDetails {
        @NotBlank(message = "Product name is required")
        private String name;
        
        @NotBlank(message = "Product type is required")
        private String product;
        
        @NotBlank(message = "Origin country is required")
        private String origin;
        
        @NotBlank(message = "Production capacity is required")
        private String productionCapacity;
        
        @NotBlank(message = "Export volume is required")
        private String exportVolume;
        
        @NotBlank(message = "Form and cut information is required")
        private String formAndCut;
        
        @NotBlank(message = "Color information is required")
        private String color;
        
        @NotBlank(message = "Cultivation type is required")
        private String cultivationType;
        
        private String moisture;
        private String forecast;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingDetails {
        @NotBlank(message = "HS code is required")
        private String hsCode;
        
        @NotBlank(message = "Minimum quantity is required")
        private String minQuantity;
        
        @NotBlank(message = "Packaging information is required")
        private String packaging;
        
        @NotBlank(message = "Transport mode is required")
        private String transportMode;
        
        @NotBlank(message = "Incoterms are required")
        private String incoterms;
        
        @NotBlank(message = "Shelf life is required")
        private String shelfLife;
    }
} 
