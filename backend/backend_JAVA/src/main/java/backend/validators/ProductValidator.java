package backend.validators;

import backend.models.Product;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class ProductValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return Product.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Product product = (Product) target;
        
        if (product.getProductId() == null || product.getProductId().trim().isEmpty()) {
            errors.rejectValue("productId", "product.productId.required", "ProductId is required");
        }
        
        if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
            errors.rejectValue("productName", "product.productName.required", "Product name is required");
        }
        
        if (product.getImages() == null || product.getImages().isEmpty()) {
            errors.rejectValue("images", "product.images.required", "At least one product image is required");
        }
        
        if (product.getSellerId() == null || product.getSellerId().trim().isEmpty()) {
            errors.rejectValue("sellerId", "product.sellerId.required", "SellerId is required");
        }
        
        // Validate price
        if (product.getPrice() == null) {
            errors.rejectValue("price", "product.price.required", "Price information is required");
        } else {
            if (product.getPrice().getRange() == null) {
                errors.rejectValue("price.range", "product.price.range.required", "Price range is required");
            } else {
                try {
                    if (product.getPrice().getRange().getMin() <= 0) {
                        errors.rejectValue("price.range.min", "product.price.range.min.invalid", "Minimum price must be greater than zero");
                    }
                    if (product.getPrice().getRange().getMax() <= 0) {
                        errors.rejectValue("price.range.max", "product.price.range.max.invalid", "Maximum price must be greater than zero");
                    }
                    if (product.getPrice().getRange().getMax() < product.getPrice().getRange().getMin()) {
                        errors.rejectValue("price.range", "product.price.range.invalid", "Maximum price cannot be less than minimum price");
                    }
                } catch (Exception e) {
                    errors.rejectValue("price.range", "product.price.range.invalid", "Invalid price range values");
                }
            }
        }
        
        // Validate details
        if (product.getDetails() == null) {
            errors.rejectValue("details", "product.details.required", "Product details are required");
        } else {
            if (product.getDetails().getName() == null || product.getDetails().getName().trim().isEmpty()) {
                errors.rejectValue("details.name", "product.details.name.required", "Product detail name is required");
            }
            if (product.getDetails().getProduct() == null || product.getDetails().getProduct().trim().isEmpty()) {
                errors.rejectValue("details.product", "product.details.product.required", "Product type is required");
            }
            if (product.getDetails().getOrigin() == null || product.getDetails().getOrigin().trim().isEmpty()) {
                errors.rejectValue("details.origin", "product.details.origin.required", "Origin is required");
            }
            if (product.getDetails().getProductionCapacity() == null || product.getDetails().getProductionCapacity().trim().isEmpty()) {
                errors.rejectValue("details.productionCapacity", "product.details.productionCapacity.required", "Production capacity is required");
            }
            if (product.getDetails().getExportVolume() == null || product.getDetails().getExportVolume().trim().isEmpty()) {
                errors.rejectValue("details.exportVolume", "product.details.exportVolume.required", "Export volume is required");
            }
            if (product.getDetails().getFormAndCut() == null || product.getDetails().getFormAndCut().trim().isEmpty()) {
                errors.rejectValue("details.formAndCut", "product.details.formAndCut.required", "Form and cut is required");
            }
            if (product.getDetails().getColor() == null || product.getDetails().getColor().trim().isEmpty()) {
                errors.rejectValue("details.color", "product.details.color.required", "Color is required");
            }
            if (product.getDetails().getCultivationType() == null || product.getDetails().getCultivationType().trim().isEmpty()) {
                errors.rejectValue("details.cultivationType", "product.details.cultivationType.required", "Cultivation type is required");
            }
        }
        
        // Validate shipping
        if (product.getShipping() == null) {
            errors.rejectValue("shipping", "product.shipping.required", "Shipping details are required");
        } else {
            if (product.getShipping().getHsCode() == null || product.getShipping().getHsCode().trim().isEmpty()) {
                errors.rejectValue("shipping.hsCode", "product.shipping.hsCode.required", "HS Code is required");
            }
            if (product.getShipping().getMinQuantity() == null || product.getShipping().getMinQuantity().trim().isEmpty()) {
                errors.rejectValue("shipping.minQuantity", "product.shipping.minQuantity.required", "Minimum quantity is required");
            }
            if (product.getShipping().getPackaging() == null || product.getShipping().getPackaging().trim().isEmpty()) {
                errors.rejectValue("shipping.packaging", "product.shipping.packaging.required", "Packaging information is required");
            }
            if (product.getShipping().getTransportMode() == null || product.getShipping().getTransportMode().trim().isEmpty()) {
                errors.rejectValue("shipping.transportMode", "product.shipping.transportMode.required", "Transport mode is required");
            }
            if (product.getShipping().getIncoterms() == null || product.getShipping().getIncoterms().trim().isEmpty()) {
                errors.rejectValue("shipping.incoterms", "product.shipping.incoterms.required", "Incoterms are required");
            }
            if (product.getShipping().getShelfLife() == null || product.getShipping().getShelfLife().trim().isEmpty()) {
                errors.rejectValue("shipping.shelfLife", "product.shipping.shelfLife.required", "Shelf life information is required");
            }
        }
    }
} 
