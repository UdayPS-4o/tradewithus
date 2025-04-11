package backend.validators;

import backend.models.Profile;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.time.Year;

@Component
public class ProfileValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return Profile.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Profile profile = (Profile) target;
        
        if (profile.getProfileId() == null || profile.getProfileId().trim().isEmpty()) {
            errors.rejectValue("profileId", "profile.profileId.required", "ProfileId is required");
        }
        
        if (profile.getBusinessName() == null || profile.getBusinessName().trim().isEmpty()) {
            errors.rejectValue("businessName", "profile.businessName.required", "Business name is required");
        }
        
        if (profile.getLogo() == null || profile.getLogo().trim().isEmpty()) {
            errors.rejectValue("logo", "profile.logo.required", "Logo URL is required");
        }
        
        if (profile.getBusinessOverview() == null || profile.getBusinessOverview().trim().isEmpty()) {
            errors.rejectValue("businessOverview", "profile.businessOverview.required", "Business overview is required");
        }
        
        if (profile.getBusinessType() == null || profile.getBusinessType().trim().isEmpty()) {
            errors.rejectValue("businessType", "profile.businessType.required", "Business type is required");
        }
        
        if (profile.getOrigin() == null || profile.getOrigin().trim().isEmpty()) {
            errors.rejectValue("origin", "profile.origin.required", "Origin country is required");
        }
        
        if (profile.getEstablished() == null) {
            errors.rejectValue("established", "profile.established.required", "Established year is required");
        } else {
            int currentYear = Year.now().getValue();
            if (profile.getEstablished() > currentYear) {
                errors.rejectValue("established", "profile.established.future", 
                        "Established year cannot be in the future");
            }
        }
        
        if (profile.getAddress() == null || profile.getAddress().trim().isEmpty()) {
            errors.rejectValue("address", "profile.address.required", "Business address is required");
        }
        
        if (profile.getOwner() == null || profile.getOwner().trim().isEmpty()) {
            errors.rejectValue("owner", "profile.owner.required", "Owner name is required");
        }
        
        // Validate certifications if present
        if (profile.getCertifications() != null && !profile.getCertifications().isEmpty()) {
            for (int i = 0; i < profile.getCertifications().size(); i++) {
                Profile.Certification cert = profile.getCertifications().get(i);
                
                if (cert.getName() == null || cert.getName().isBlank()) {
                    errors.rejectValue("certifications[" + i + "].name", "profile.certification.name.required", 
                            "Certification name is required");
                }
            }
        }
    }
} 
