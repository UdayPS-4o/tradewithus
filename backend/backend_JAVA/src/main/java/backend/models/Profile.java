package backend.models;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Year;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "profiles")
public class Profile {
    
    @Id
    private String id;
    
    @NotBlank(message = "ProfileId is required")
    @Indexed(unique = true)
    private String profileId;
    
    @NotBlank(message = "Business name is required")
    private String businessName;
    
    @NotBlank(message = "Logo URL is required")
    private String logo;
    
    private String coverImage;
    
    private Boolean isPro;
    
    private Boolean isVerified;
    
    private String revenue;
    
    private String employeeCount;
    
    @NotBlank(message = "Business overview is required")
    private String businessOverview;
    
    @NotBlank(message = "Business type is required")
    private String businessType;
    
    @NotBlank(message = "Origin country is required")
    private String origin;
    
    @NotNull(message = "Established year is required")
    @Max(value = 2100, message = "Established year must not be in the far future")
    private Integer established;
    
    private String exportVolume;
    
    private String website;
    
    @NotBlank(message = "Business address is required")
    private String address;
    
    private String mobile;
    
    @NotBlank(message = "Owner name is required")
    private String owner;
    
    private Verification verifications;
    
    private List<Certification> certifications;
    
    private ImportExport importExport;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Verification {
        private Boolean businessEmail;
        private Boolean businessRegistration;
        private Boolean representativeProfile;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Certification {
        @NotBlank(message = "Certification name is required")
        private String name;
        private String icon;
        private String validFrom;
        private String validTo;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportExport {
        private Integer shipments;
        private Integer suppliers;
        private String volume;
        private Integer exportShipments;
        private Integer exportSuppliers;
        private String exportVolume;
    }
    
    // Virtual getter for age
    public String getAge() {
        int currentYear = Year.now().getValue();
        
        // Validate that established is not in the future during getter call
        if (established != null && established > currentYear) {
            throw new IllegalStateException("Established year cannot be in the future");
        }
        
        int companyAge = currentYear - (established != null ? established : currentYear);
        return companyAge + " Years Old";
    }
} 
