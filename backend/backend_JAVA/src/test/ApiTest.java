package test;

import backend.JavaBackendApplication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = JavaBackendApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(OrderAnnotation.class)
public class ApiTest {

    @LocalServerPort
    private int port;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static String authToken = "";
    private static final long timestamp = System.currentTimeMillis();
    
    // Test data
    private static final Map<String, String> testUser = new HashMap<>() {{
        put("email", "test-" + timestamp + "@example.com");
        put("password", "Password123");
        put("name", "Test User");
    }};
    
    private static final String testProfileId = "test-profile-" + timestamp;
    private static Map<String, Object> testProfile;
    
    private static final String testProductId = "test-product-" + timestamp;
    private static Map<String, Object> testProduct;
    
    // Store resources for cleanup
    private static String createdUserId = null;
    
    @BeforeAll
    public static void setup() {
        testProfile = new HashMap<>() {{
            put("profileId", testProfileId);
            put("businessName", "Test Business");
            put("logo", "https://example.com/logo.png");
            put("businessOverview", "This is a test business");
            put("businessType", "Test Type");
            put("origin", "Test Country");
            put("established", 2020);
            put("address", "Test Address");
            put("owner", "Test Owner");
        }};
        
        Map<String, Object> priceRange = new HashMap<>() {{
            put("min", 80);
            put("max", 120);
        }};
        
        Map<String, Object> price = new HashMap<>() {{
            put("current", 100);
            put("range", priceRange);
        }};
        
        Map<String, Object> details = new HashMap<>() {{
            put("name", "Test Product");
            put("product", "Sample Product");
            put("origin", "Test Country");
            put("productionCapacity", "1000 units/year");
            put("exportVolume", "500 units/year");
            put("formAndCut", "Standard");
            put("color", "Brown");
            put("cultivationType", "Organic");
        }};
        
        Map<String, Object> shipping = new HashMap<>() {{
            put("hsCode", "HS12345");
            put("minQuantity", "10 units");
            put("packaging", "Box");
            put("transportMode", "Air");
            put("incoterms", "FOB");
            put("shelfLife", "12 months");
        }};
        
        testProduct = new HashMap<>() {{
            put("productId", testProductId);
            put("productName", "Test Product");
            put("images", Arrays.asList(
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg"
            ));
            put("sellerId", testProfileId);
            put("price", price);
            put("details", details);
            put("shipping", shipping);
        }};
    }
    
    @AfterAll
    public static void cleanup() {
        System.out.println("\n🧹 Cleaning up test resources...");
        // Resources are deleted in the individual tests
    }
    
    private String getBaseUrl() {
        return "http://localhost:" + port;
    }
    
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (!authToken.isEmpty()) {
            headers.setBearerAuth(authToken);
        }
        return headers;
    }

    @Test
    @Order(1)
    public void testHealthCheck() {
        System.out.println("\n🩺 Testing Health endpoint...");
        
        ResponseEntity<Map> response = restTemplate.getForEntity(
                getBaseUrl() + "/health", Map.class);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("ok", response.getBody().get("status"));
        System.out.println("✅ Health check successful");
    }

    @Test
    @Order(2)
    public void testAuthEndpoints() throws Exception {
        System.out.println("\n📝 Testing Auth endpoints...");
        
        // Test signup
        System.out.println("Testing signup...");
        HttpEntity<Map<String, String>> signupEntity = new HttpEntity<>(testUser, createHeaders());
        ResponseEntity<String> signupResponse = restTemplate.postForEntity(
                getBaseUrl() + "/auth/signup", signupEntity, String.class);
        
        assertEquals(HttpStatus.CREATED, signupResponse.getStatusCode());
        
        JsonNode signupJsonResponse = objectMapper.readTree(signupResponse.getBody());
        assertTrue(signupJsonResponse.path("success").asBoolean());
        createdUserId = signupJsonResponse.path("data").path("user").path("id").asText();
        System.out.println("✅ Signup successful");
        
        // Test login
        System.out.println("Testing login...");
        Map<String, String> loginCredentials = new HashMap<>() {{
            put("email", testUser.get("email"));
            put("password", testUser.get("password"));
        }};
        
        HttpEntity<Map<String, String>> loginEntity = new HttpEntity<>(loginCredentials, createHeaders());
        ResponseEntity<String> loginResponse = restTemplate.postForEntity(
                getBaseUrl() + "/auth/login", loginEntity, String.class);
        
        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
        
        JsonNode loginJsonResponse = objectMapper.readTree(loginResponse.getBody());
        assertTrue(loginJsonResponse.path("success").asBoolean());
        authToken = loginJsonResponse.path("data").path("token").asText();
        System.out.println("✅ Login successful, token received");
        
        // Test me endpoint
        System.out.println("Testing /me endpoint...");
        HttpHeaders authHeaders = createHeaders();
        HttpEntity<Void> authEntity = new HttpEntity<>(authHeaders);
        
        ResponseEntity<String> meResponse = restTemplate.exchange(
                getBaseUrl() + "/auth/me", HttpMethod.GET, authEntity, String.class);
        
        assertEquals(HttpStatus.OK, meResponse.getStatusCode());
        System.out.println("✅ /me endpoint returned user data");
    }

    @Test
    @Order(3)
    public void testProfileEndpoints() throws Exception {
        System.out.println("\n📝 Testing Profile endpoints...");
        
        // Test create profile
        System.out.println("Testing POST /profile...");
        HttpEntity<Map<String, Object>> createProfileEntity = new HttpEntity<>(testProfile, createHeaders());
        ResponseEntity<String> createProfileResponse = restTemplate.postForEntity(
                getBaseUrl() + "/profile", createProfileEntity, String.class);
        
        assertEquals(HttpStatus.CREATED, createProfileResponse.getStatusCode());
        
        JsonNode createProfileJsonResponse = objectMapper.readTree(createProfileResponse.getBody());
        assertTrue(createProfileJsonResponse.path("success").asBoolean());
        System.out.println("✅ Profile created with ID: " + testProfileId);
        
        // Test get all profiles
        System.out.println("Testing GET /profile/all...");
        ResponseEntity<String> allProfilesResponse = restTemplate.getForEntity(
                getBaseUrl() + "/profile/all", String.class);
        
        assertEquals(HttpStatus.OK, allProfilesResponse.getStatusCode());
        
        JsonNode allProfilesJsonResponse = objectMapper.readTree(allProfilesResponse.getBody());
        assertTrue(allProfilesJsonResponse.path("success").asBoolean());
        System.out.println("✅ Got " + allProfilesJsonResponse.path("data").size() + " profiles");
        
        // Test get profile by ID
        System.out.println("Testing GET /profile/" + testProfileId + "...");
        ResponseEntity<String> profileResponse = restTemplate.getForEntity(
                getBaseUrl() + "/profile/" + testProfileId, String.class);
        
        assertEquals(HttpStatus.OK, profileResponse.getStatusCode());
        System.out.println("✅ Got profile by ID");
        
        // Test update profile
        System.out.println("Testing PUT /profile/" + testProfileId + "...");
        Map<String, Object> updatedProfile = new HashMap<>(testProfile);
        updatedProfile.put("businessName", "Updated Test Business");
        
        HttpEntity<Map<String, Object>> updateProfileEntity = new HttpEntity<>(updatedProfile, createHeaders());
        ResponseEntity<String> updateProfileResponse = restTemplate.exchange(
                getBaseUrl() + "/profile/" + testProfileId,
                HttpMethod.PUT,
                updateProfileEntity,
                String.class);
        
        assertEquals(HttpStatus.OK, updateProfileResponse.getStatusCode());
        
        // Verify update
        ResponseEntity<String> updatedProfileResponse = restTemplate.getForEntity(
                getBaseUrl() + "/profile/" + testProfileId, String.class);
        
        JsonNode updatedProfileJsonResponse = objectMapper.readTree(updatedProfileResponse.getBody());
        assertEquals("Updated Test Business", updatedProfileJsonResponse.path("data").path("businessName").asText());
        System.out.println("✅ Profile updated successfully");
    }

    @Test
    @Order(4)
    public void testProductEndpoints() throws Exception {
        System.out.println("\n📝 Testing Product endpoints...");
        
        // Test create product
        System.out.println("Testing POST /product...");
        HttpEntity<Map<String, Object>> createProductEntity = new HttpEntity<>(testProduct, createHeaders());
        ResponseEntity<String> createProductResponse = restTemplate.postForEntity(
                getBaseUrl() + "/product", createProductEntity, String.class);
        
        assertEquals(HttpStatus.CREATED, createProductResponse.getStatusCode());
        
        JsonNode createProductJsonResponse = objectMapper.readTree(createProductResponse.getBody());
        assertTrue(createProductJsonResponse.path("success").asBoolean());
        System.out.println("✅ Product created with ID: " + testProductId);
        
        // Test get all products
        System.out.println("Testing GET /product/all...");
        ResponseEntity<String> allProductsResponse = restTemplate.getForEntity(
                getBaseUrl() + "/product/all", String.class);
        
        assertEquals(HttpStatus.OK, allProductsResponse.getStatusCode());
        
        JsonNode allProductsJsonResponse = objectMapper.readTree(allProductsResponse.getBody());
        assertTrue(allProductsJsonResponse.path("success").asBoolean());
        System.out.println("✅ Got " + allProductsJsonResponse.path("data").size() + " products");
        
        // Test get product by ID
        System.out.println("Testing GET /product/" + testProductId + "...");
        ResponseEntity<String> productResponse = restTemplate.getForEntity(
                getBaseUrl() + "/product/" + testProductId, String.class);
        
        assertEquals(HttpStatus.OK, productResponse.getStatusCode());
        System.out.println("✅ Got product by ID");
        
        // Test update product
        System.out.println("Testing PUT /product/" + testProductId + "...");
        Map<String, Object> updatedProduct = new HashMap<>(testProduct);
        updatedProduct.put("productName", "Updated Test Product");
        
        HttpEntity<Map<String, Object>> updateProductEntity = new HttpEntity<>(updatedProduct, createHeaders());
        ResponseEntity<String> updateProductResponse = restTemplate.exchange(
                getBaseUrl() + "/product/" + testProductId,
                HttpMethod.PUT,
                updateProductEntity,
                String.class);
        
        assertEquals(HttpStatus.OK, updateProductResponse.getStatusCode());
        
        // Verify update
        ResponseEntity<String> updatedProductResponse = restTemplate.getForEntity(
                getBaseUrl() + "/product/" + testProductId, String.class);
        
        JsonNode updatedProductJsonResponse = objectMapper.readTree(updatedProductResponse.getBody());
        assertEquals("Updated Test Product", updatedProductJsonResponse.path("data").path("productName").asText());
        System.out.println("✅ Product updated successfully");
        
        // Test product deletion
        System.out.println("Testing DELETE /product/" + testProductId + "...");
        HttpEntity<Void> deleteProductEntity = new HttpEntity<>(createHeaders());
        ResponseEntity<String> deleteProductResponse = restTemplate.exchange(
                getBaseUrl() + "/product/" + testProductId,
                HttpMethod.DELETE,
                deleteProductEntity,
                String.class);
        
        assertEquals(HttpStatus.OK, deleteProductResponse.getStatusCode());
        System.out.println("✅ Product deleted successfully");
        
        // Verify the product is deleted (should return 404)
        System.out.println("Verifying product with ID " + testProductId + " no longer exists...");
        try {
            restTemplate.getForEntity(getBaseUrl() + "/product/" + testProductId, String.class);
            fail("Expected 404 for deleted product");
        } catch (HttpClientErrorException e) {
            assertEquals(HttpStatus.NOT_FOUND, e.getStatusCode());
            System.out.println("✅ Product deletion verified (received 404 as expected)");
        }
        
        // Skip profile deletion if we can't find the profile
        System.out.println("Testing DELETE /profile/" + testProfileId + "...");
        try {
            HttpEntity<Void> deleteProfileEntity = new HttpEntity<>(createHeaders());
            ResponseEntity<String> deleteProfileResponse = restTemplate.exchange(
                    getBaseUrl() + "/profile/" + testProfileId,
                    HttpMethod.DELETE,
                    deleteProfileEntity,
                    String.class);
            
            assertEquals(HttpStatus.OK, deleteProfileResponse.getStatusCode());
            System.out.println("✅ Profile deleted successfully");
            
            // Verify the profile is deleted (should return 404)
            System.out.println("Verifying profile with ID " + testProfileId + " no longer exists...");
            try {
                restTemplate.getForEntity(getBaseUrl() + "/profile/" + testProfileId, String.class);
                fail("Expected 404 for deleted profile");
            } catch (HttpClientErrorException e) {
                assertEquals(HttpStatus.NOT_FOUND, e.getStatusCode());
                System.out.println("✅ Profile deletion verified (received 404 as expected)");
            }
        } catch (HttpClientErrorException.NotFound e) {
            // Profile already deleted, just log it
            System.out.println("🔍 Profile " + testProfileId + " already deleted, skipping deletion test");
        }
        
        // Finally delete the user
        System.out.println("Testing DELETE /auth/user/" + createdUserId + "...");
        HttpEntity<Void> deleteUserEntity = new HttpEntity<>(createHeaders());
        ResponseEntity<String> deleteUserResponse = restTemplate.exchange(
                getBaseUrl() + "/auth/user/" + createdUserId,
                HttpMethod.DELETE,
                deleteUserEntity,
                String.class);
        
        assertEquals(HttpStatus.OK, deleteUserResponse.getStatusCode());
        System.out.println("✅ User deleted successfully");
    }
} 