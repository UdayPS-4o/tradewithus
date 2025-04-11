package backend.controllers;

import backend.exceptions.ResourceNotFoundException;
import backend.models.ApiResponse;
import backend.models.Profile;
import backend.services.ProfileService;
import backend.validators.ProfileValidator;
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
@RequestMapping("/profile")
public class ProfileController {
    
    private final ProfileService profileService;
    private final ProfileValidator profileValidator;
    
    public ProfileController(ProfileService profileService, ProfileValidator profileValidator) {
        this.profileService = profileService;
        this.profileValidator = profileValidator;
    }
    
    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(profileValidator);
    }
    
    @GetMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Profile>> getProfileById(@PathVariable String profileId) {
        try {
            Profile profile = profileService.getProfileById(profileId);
            return new ResponseEntity<>(ApiResponse.success(profile), HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(ApiResponse.error("Profile not found"), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Profile>>> getAllProfiles() {
        try {
            List<Profile> profiles = profileService.getAllProfiles();
            return new ResponseEntity<>(ApiResponse.success(profiles), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> createProfile(@Valid @RequestBody Profile profile, BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(err -> {
                    errors.put(err.getField(), err.getDefaultMessage());
                });
                return new ResponseEntity<>(ApiResponse.error("Missing required profile fields", errors), HttpStatus.BAD_REQUEST);
            }
            
            Profile createdProfile = profileService.createProfile(profile);
            return new ResponseEntity<>(ApiResponse.success(createdProfile), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Object>> updateProfile(@PathVariable String profileId, 
                                                           @Valid @RequestBody Profile profile, 
                                                           BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(err -> {
                    errors.put(err.getField(), err.getDefaultMessage());
                });
                return new ResponseEntity<>(ApiResponse.error("Invalid profile data", errors), HttpStatus.BAD_REQUEST);
            }
            
            Profile updatedProfile = profileService.updateProfile(profileId, profile);
            return new ResponseEntity<>(ApiResponse.success(updatedProfile), HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(ApiResponse.error("Profile not found"), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Object>> deleteProfile(@PathVariable String profileId) {
        try {
            boolean result = profileService.deleteProfile(profileId);
            
            if (result) {
                return new ResponseEntity<>(ApiResponse.success(null, "Profile deleted successfully"), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ApiResponse.error("Profile not found"), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.error("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 
