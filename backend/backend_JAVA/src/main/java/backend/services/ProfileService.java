package backend.services;

import backend.exceptions.ResourceNotFoundException;
import backend.models.Profile;
import backend.repositories.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
    
    private final ProfileRepository profileRepository;
    
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }
    
    public Profile getProfileById(String profileId) {
        return profileRepository.findByProfileId(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "profileId", profileId));
    }
    
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }
    
    public Profile createProfile(Profile profile) {
        if (profile.getProfileId() == null) {
            throw new IllegalArgumentException("profileId is required to create a profile");
        }
        
        return profileRepository.save(profile);
    }
    
    public Profile updateProfile(String profileId, Profile profileDetails) {
        Profile profile = profileRepository.findByProfileId(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "profileId", profileId));
        
        // Update profile fields
        profile.setBusinessName(profileDetails.getBusinessName());
        profile.setLogo(profileDetails.getLogo());
        profile.setCoverImage(profileDetails.getCoverImage());
        profile.setIsPro(profileDetails.getIsPro());
        profile.setIsVerified(profileDetails.getIsVerified());
        profile.setRevenue(profileDetails.getRevenue());
        profile.setEmployeeCount(profileDetails.getEmployeeCount());
        profile.setBusinessOverview(profileDetails.getBusinessOverview());
        profile.setBusinessType(profileDetails.getBusinessType());
        profile.setOrigin(profileDetails.getOrigin());
        profile.setEstablished(profileDetails.getEstablished());
        profile.setExportVolume(profileDetails.getExportVolume());
        profile.setWebsite(profileDetails.getWebsite());
        profile.setAddress(profileDetails.getAddress());
        profile.setMobile(profileDetails.getMobile());
        profile.setOwner(profileDetails.getOwner());
        profile.setVerifications(profileDetails.getVerifications());
        profile.setCertifications(profileDetails.getCertifications());
        profile.setImportExport(profileDetails.getImportExport());
        
        return profileRepository.save(profile);
    }
    
    public boolean deleteProfile(String profileId) {
        if (profileRepository.findByProfileId(profileId).isPresent()) {
            profileRepository.deleteByProfileId(profileId);
            return true;
        }
        return false;
    }
    
    public boolean profilesExist() {
        return profileRepository.count() > 0;
    }
} 
