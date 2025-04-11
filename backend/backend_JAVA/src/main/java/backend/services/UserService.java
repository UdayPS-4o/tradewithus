package backend.services;

import backend.exceptions.ResourceNotFoundException;
import backend.models.User;
import backend.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public User createUser(User userDetails) {
        // Check if user already exists
        if (userRepository.existsByEmail(userDetails.getEmail())) {
            throw new IllegalArgumentException("User already exists with this email");
        }
        
        // Hash password
        userDetails.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        
        // Set creation and update timestamps
        Date now = new Date();
        userDetails.setCreatedAt(now);
        userDetails.setUpdatedAt(now);
        
        return userRepository.save(userDetails);
    }
    
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
    
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        return user;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public boolean deleteUser(String userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }
} 
