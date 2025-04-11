package backend.controllers;

import backend.models.ApiResponse;
import backend.models.User;
import backend.security.JwtTokenProvider;
import backend.security.UserJwtDetails;
import backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    
    public AuthController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signup(@RequestBody @Valid User userRequest) {
        User user = userService.createUser(userRequest);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail()
        ));
        
        return new ResponseEntity<>(ApiResponse.success(response, "User created successfully"), HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        User user = userService.authenticateUser(email, password);
        
        String token = jwtTokenProvider.generateToken(user);
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", userData);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserJwtDetails userDetails = (UserJwtDetails) authentication.getPrincipal();
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", userDetails.getUserId());
        userData.put("name", userDetails.getName());
        userData.put("email", userDetails.getUsername());
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", userData);
        
        return new ResponseEntity<>(ApiResponse.success(response), HttpStatus.OK);
    }
    
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserJwtDetails userDetails = (UserJwtDetails) authentication.getPrincipal();
        
        // Check if user is deleting their own account
        if (!userDetails.getUserId().equals(userId)) {
            return new ResponseEntity<>(ApiResponse.error("Not authorized to delete this user"), HttpStatus.FORBIDDEN);
        }
        
        boolean deleted = userService.deleteUser(userId);
        
        if (deleted) {
            return new ResponseEntity<>(ApiResponse.success(null, "User deleted successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(ApiResponse.error("Failed to delete user"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 
