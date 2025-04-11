package backend.config;

import backend.models.Product;
import backend.models.Profile;
import backend.models.User;
import backend.repositories.ProductRepository;
import backend.repositories.ProfileRepository;
import backend.repositories.UserRepository;
import backend.services.ProductService;
import backend.services.ProfileService;
import backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedProfiles();
        seedProducts();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            System.out.println("Seeding users...");
            User user1 = new User();
            user1.setEmail("admin@example.com");
            user1.setPassword("admin123");
            user1.setName("Admin User");
            user1.setCreatedAt(new Date());
            user1.setUpdatedAt(new Date());
            userService.createUser(user1);

            User user2 = new User();
            user2.setEmail("user@example.com");
            user2.setPassword("user123");
            user2.setName("Regular User");
            user2.setCreatedAt(new Date());
            user2.setUpdatedAt(new Date());
            userService.createUser(user2);
            
            System.out.println("2 users seeded successfully");
        } else {
            System.out.println("Users already exist, skipping user seeding");
        }
    }

    private void seedProfiles() {
        if (profileRepository.count() == 0 && userRepository.count() > 0) {
            System.out.println("Seeding profiles...");
            
            List<User> users = userRepository.findAll();
            if (users.size() < 2) {
                System.out.println("Not enough users to seed profiles.");
                return;
            }
            User user1 = users.get(0);
            User user2 = users.get(1);

            Profile kmgRobust = new Profile();
            kmgRobust.setProfileId(user1.getId());
            kmgRobust.setBusinessName("KMG Robust");
            kmgRobust.setLogo("/companies/kmg-robust/logo.png");
            kmgRobust.setCoverImage("/companies/kmg-robust/cover.png");
            kmgRobust.setIsPro(true);
            kmgRobust.setIsVerified(true);
            kmgRobust.setRevenue("24 M");
            kmgRobust.setEmployeeCount("1-10 Employees");
            kmgRobust.setBusinessOverview("KMG Robust is a Planet-Friendly artisan company, which produces 100% organic wine in southern Italy in Puglia, on its own estates divided into 7 biodiverse and exceptional terroirs. The production philosophy is based on the Perrini® Method, a complex system of knowledge, very well articulated, which applies innovative and ancient methods, respects the environment and health, preserves biodiversity, researches and experiments with varieties at risk of extinction.");
            kmgRobust.setBusinessType("Food manufacturing / Farming / Production / Processing / Packing");
            kmgRobust.setOrigin("India");
            kmgRobust.setEstablished(1998);
            kmgRobust.setExportVolume("50 metric ton / Annually");
            kmgRobust.setWebsite("http://www.kmgrobust.it");
            kmgRobust.setAddress("Building no. 123, Whitefield, Bangalore");
            kmgRobust.setMobile("+91 1234567890");
            kmgRobust.setOwner("John Doe");
            
            Profile.Verification verifications = new Profile.Verification();
            verifications.setBusinessEmail(true);
            verifications.setBusinessRegistration(true);
            verifications.setRepresentativeProfile(true);
            kmgRobust.setVerifications(verifications);
            
            Profile.Certification cert1 = new Profile.Certification();
            cert1.setName("FairTrade");
            cert1.setIcon("/assets/num1.svg");
            cert1.setValidFrom("1 Jan 2024");
            cert1.setValidTo("31 Dec 2024");
            
            Profile.Certification cert2 = new Profile.Certification();
            cert2.setName("Organic");
            cert2.setIcon("/assets/num2.svg");
            cert2.setValidFrom("1 Jan 2024");
            cert2.setValidTo("31 Dec 2024");
            
            Profile.Certification cert3 = new Profile.Certification();
            cert3.setName("Certificate name");
            cert3.setIcon("/assets/num3.svg");
            cert3.setValidFrom("1 Jan 2024");
            cert3.setValidTo("31 Dec 2024");
            
            kmgRobust.setCertifications(Arrays.asList(cert1, cert2, cert3));
            
            Profile.ImportExport importExport = new Profile.ImportExport();
            importExport.setShipments(425);
            importExport.setSuppliers(41);
            importExport.setVolume("50 metric ton / Annually");
            importExport.setExportShipments(340);
            importExport.setExportSuppliers(28);
            importExport.setExportVolume("40 metric ton / Annually");
            kmgRobust.setImportExport(importExport);
            
            profileService.createProfile(kmgRobust);
            System.out.println("1 profile seeded successfully");
        } else {
            System.out.println("Profiles already exist or no users found, skipping profile seeding");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0 && profileRepository.count() > 0 && userRepository.count() > 0) {
            System.out.println("Seeding products...");
            
            User firstUser = userRepository.findAll().stream().findFirst().orElse(null);
            if (firstUser == null) {
                System.out.println("No users found, cannot seed product.");
                return;
            }

            Profile userProfile = profileRepository.findByProfileId(firstUser.getId()).orElse(null);
            if (userProfile == null) {
                System.out.println("Profile for the first user not found, cannot seed product.");
                return;
            }
            
            Product blackPepper = new Product();
            blackPepper.setProductId("black-pepper");
            blackPepper.setProductName("Black Pepper");
            blackPepper.setImages(Arrays.asList(
                "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1599909331060-b6f5a9b8229e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            ));
            blackPepper.setSellerId(userProfile.getProfileId());
            
            Product.Price price = new Product.Price();
            price.setCurrent(500);
            Product.Price.PriceRange priceRange = new Product.Price.PriceRange();
            priceRange.setMin(300);
            priceRange.setMax(600);
            price.setRange(priceRange);
            blackPepper.setPrice(price);
            
            Product.ProductDetails details = new Product.ProductDetails();
            details.setName("Blackpepper");
            details.setProduct("Whole Black Peppercorn");
            details.setOrigin("Tanzania");
            details.setProductionCapacity("1,000,000 kg / Annually");
            details.setExportVolume("50 metric ton / Annually");
            details.setFormAndCut("Ground - Coarse Ground, Ground, Whole");
            details.setColor("Black");
            details.setCultivationType("Organic");
            blackPepper.setDetails(details);
            
            Product.ShippingDetails shipping = new Product.ShippingDetails();
            shipping.setHsCode("PQ3-QL123");
            shipping.setMinQuantity("100 Kgs");
            shipping.setPackaging("Cartons");
            shipping.setTransportMode("Air Freight");
            shipping.setIncoterms("Free on Board");
            shipping.setShelfLife("60-80 Days");
            blackPepper.setShipping(shipping);
            
            productService.createProduct(blackPepper);
            System.out.println("1 product seeded successfully");
        } else {
            System.out.println("Products already exist or no profiles found, skipping product seeding");
        }
    }
} 
