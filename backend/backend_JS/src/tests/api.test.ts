import dotenv from 'dotenv';

dotenv.config();

// Config
const API_URL = process.env.API_URL || 'http://localhost:8000';
let authToken = '';

// Generate unique IDs for test data to avoid collisions
const timestamp = Date.now();
const testUser = {
  email: `test-${timestamp}@example.com`,
  password: 'Password123',
  name: 'Test User'
};

const testProfileId = `test-profile-${timestamp}`;
const testProfile = {
  profileId: testProfileId,
  businessName: 'Test Business',
  logo: 'https://example.com/logo.png',
  businessOverview: 'This is a test business',
  businessType: 'Test Type',
  origin: 'Test Country',
  established: 2020,
  address: 'Test Address',
  owner: 'Test Owner'
};

const testProductId = `test-product-${timestamp}`;
const testProduct = {
  productId: testProductId,
  productName: 'Test Product',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ],
  sellerId: testProfileId, // Use the profile ID as the seller ID
  price: {
    current: 100,
    range: {
      min: 80,
      max: 120
    }
  },
  details: {
    name: 'Test Product',
    product: 'Sample Product',
    origin: 'Test Country',
    productionCapacity: '1000 units/year',
    exportVolume: '500 units/year',
    formAndCut: 'Standard',
    color: 'Brown',
    cultivationType: 'Organic'
  },
  shipping: {
    hsCode: 'HS12345',
    minQuantity: '10 units',
    packaging: 'Box',
    transportMode: 'Air',
    incoterms: 'FOB',
    shelfLife: '12 months'
  }
};

// Store resources for cleanup
let createdResources = {
  user: null as string | null,
  profile: null as string | null,
  product: null as string | null
};

// Test runner
async function runTests() {
  console.log('🧪 Starting API tests...');
  
  try {
    // Health check to ensure API is running
    await testHealthCheck();

    // Auth tests
    await testAuth();
    
    // Profile tests
    await testProfileEndpoints();
    
    // Product tests
    await testProductEndpoints();
    
    console.log('✅ All tests passed!');
  } catch (error: unknown) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
    if (error instanceof Response) {
      console.error('Status:', error.status);
      try {
        const errorText = await error.text();
        console.error('Response data:', errorText);
        // Try to parse as JSON
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            console.error('Error message:', errorJson.message);
          }
        } catch (e) {
          // Not JSON, leave as is
        }
      } catch (e) {
        console.error('Could not read response text');
      }
    }
  } finally {
    // Clean up any resources that might not have been cleaned up during tests
    await cleanupResources();
  }
}

async function testHealthCheck() {
  console.log('\n🩺 Testing Health endpoint...');
  
  const healthResponse = await fetch(`${API_URL}/health`);
  if (!healthResponse.ok) throw healthResponse;
  console.log('✅ Health check successful');
}

async function testAuth() {
  console.log('\n📝 Testing Auth endpoints...');
  
  // Test signup
  console.log('Testing signup...');
  const signupResponse = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testUser)
  });
  if (!signupResponse.ok) throw signupResponse;
  const signupData = await signupResponse.json();
  createdResources.user = signupData.user?.id || null;
  console.log('✅ Signup successful');
  
  // Test login
  console.log('Testing login...');
  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  if (!loginResponse.ok) throw loginResponse;
  const loginData = await loginResponse.json();
  
  authToken = loginData.token;
  console.log('✅ Login successful, token received');
  
  // Test me endpoint
  console.log('Testing /me endpoint...');
  const meResponse = await fetch(`${API_URL}/auth/me`, {
    headers: { 
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!meResponse.ok) throw meResponse;
  console.log('✅ /me endpoint returned user data');
  
  // Note: We don't delete the user here because we need it for the remaining tests
  // It will be cleaned up in the cleanupResources function at the end
}

async function testProfileEndpoints() {
  console.log('\n📝 Testing Profile endpoints...');
  
  // Test create profile
  console.log('Testing POST /profile...');
  const createProfileResponse = await fetch(`${API_URL}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(testProfile)
  });
  if (!createProfileResponse.ok) throw createProfileResponse;
  const createProfileData = await createProfileResponse.json();
  createdResources.profile = testProfileId;
  console.log(`✅ Profile created with ID: ${testProfileId}`);
  
  // Test get all profiles
  console.log('Testing GET /profile/all...');
  const allProfilesResponse = await fetch(`${API_URL}/profile/all`);
  if (!allProfilesResponse.ok) throw allProfilesResponse;
  const allProfilesData = await allProfilesResponse.json();
  console.log(`✅ Got ${allProfilesData.data.length} profiles`);
  
  // Test get profile by ID
  console.log(`Testing GET /profile/${testProfileId}...`);
  const profileResponse = await fetch(`${API_URL}/profile/${testProfileId}`);
  if (!profileResponse.ok) throw profileResponse;
  console.log('✅ Got profile by ID');
  
  // Test update profile
  console.log(`Testing PUT /profile/${testProfileId}...`);
  const updatedProfilePayload = {
    ...testProfile,
    businessName: 'Updated Test Business'
  };
  
  const updateProfileResponse = await fetch(`${API_URL}/profile/${testProfileId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(updatedProfilePayload)
  });
  if (!updateProfileResponse.ok) throw updateProfileResponse;
  
  // Verify update
  const updatedProfileResponse = await fetch(`${API_URL}/profile/${testProfileId}`);
  if (!updatedProfileResponse.ok) throw updatedProfileResponse;
  const updatedProfileData = await updatedProfileResponse.json();
  const isUpdated = updatedProfileData.data.businessName === 'Updated Test Business';
  
  if (isUpdated) {
    console.log('✅ Profile updated successfully');
  } else {
    throw new Error('Profile update verification failed');
  }
  
  // Note: We don't delete the profile here as we need it for product tests
  // It will be deleted after product tests
}

async function testProductEndpoints() {
  console.log('\n📝 Testing Product endpoints...');
  
  // Test create product
  console.log('Testing POST /product...');
  const createProductResponse = await fetch(`${API_URL}/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(testProduct)
  });
  if (!createProductResponse.ok) throw createProductResponse;
  const createProductData = await createProductResponse.json();
  createdResources.product = testProductId;
  console.log(`✅ Product created with ID: ${testProductId}`);
  
  // Test get all products
  console.log('Testing GET /product/all...');
  const allProductsResponse = await fetch(`${API_URL}/product/all`);
  if (!allProductsResponse.ok) throw allProductsResponse;
  const allProductsData = await allProductsResponse.json();
  console.log(`✅ Got ${allProductsData.data.length} products`);
  
  // Test get product by ID
  console.log(`Testing GET /product/${testProductId}...`);
  const productResponse = await fetch(`${API_URL}/product/${testProductId}`);
  if (!productResponse.ok) throw productResponse;
  console.log('✅ Got product by ID');
  
  // Test update product
  console.log(`Testing PUT /product/${testProductId}...`);
  const updatedProductPayload = {
    ...testProduct,
    productName: 'Updated Test Product'
  };
  
  const updateProductResponse = await fetch(`${API_URL}/product/${testProductId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(updatedProductPayload)
  });
  if (!updateProductResponse.ok) throw updateProductResponse;
  
  // Verify update
  const updatedProductResponse = await fetch(`${API_URL}/product/${testProductId}`);
  if (!updatedProductResponse.ok) throw updatedProductResponse;
  const updatedProductData = await updatedProductResponse.json();
  
  const productNameUpdated = updatedProductData.data.productName === 'Updated Test Product';
  
  if (productNameUpdated) {
    console.log('✅ Product updated successfully');
  } else {
    throw new Error('Product update verification failed');
  }
  
  // Test product deletion
  console.log(`Testing DELETE /product/${testProductId}...`);
  const deleteProductResponse = await fetch(`${API_URL}/product/${testProductId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!deleteProductResponse.ok) throw deleteProductResponse;
  console.log('✅ Product deleted successfully');
  createdResources.product = null; // Mark as deleted
  
  // Verify the product is deleted (should return 404)
  console.log(`Verifying product with ID ${testProductId} no longer exists...`);
  const verifyDeletedProductResponse = await fetch(`${API_URL}/product/${testProductId}`);
  
  if (verifyDeletedProductResponse.status === 404) {
    console.log('✅ Product deletion verified (received 404 as expected)');
  } else {
    throw new Error('Product was not deleted properly');
  }
  
  // Now test profile deletion (since we're done with the product that used this profile)
  console.log(`Testing DELETE /profile/${testProfileId}...`);
  const deleteProfileResponse = await fetch(`${API_URL}/profile/${testProfileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  if (!deleteProfileResponse.ok) throw deleteProfileResponse;
  console.log('✅ Profile deleted successfully');
  createdResources.profile = null; // Mark as deleted
  
  // Verify the profile is deleted (should return 404)
  console.log(`Verifying profile with ID ${testProfileId} no longer exists...`);
  const verifyDeletedProfileResponse = await fetch(`${API_URL}/profile/${testProfileId}`);
  
  if (verifyDeletedProfileResponse.status === 404) {
    console.log('✅ Profile deletion verified (received 404 as expected)');
  } else {
    throw new Error('Profile was not deleted properly');
  }
}

// Clean up any resources that weren't deleted during tests
async function cleanupResources() {
  console.log('\n🧹 Cleaning up test resources...');
  
  // Clean up product if it wasn't already deleted
  if (createdResources.product) {
    try {
      console.log(`Cleaning up product ${createdResources.product}...`);
      await fetch(`${API_URL}/product/${createdResources.product}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    } catch (error) {
      console.error('Error cleaning up product:', error);
    }
  }
  
  // Clean up profile if it wasn't already deleted
  if (createdResources.profile) {
    try {
      console.log(`Cleaning up profile ${createdResources.profile}...`);
      await fetch(`${API_URL}/profile/${createdResources.profile}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    } catch (error) {
      console.error('Error cleaning up profile:', error);
    }
  }
  
  // Clean up user
  if (createdResources.user) {
    try {
      console.log(`Cleaning up user ${createdResources.user}...`);
      const deleteUserResponse = await fetch(`${API_URL}/auth/user/${createdResources.user}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      if (deleteUserResponse.ok) {
        console.log('✅ User deleted successfully');
      } else {
        console.error('❌ Failed to delete user:', deleteUserResponse.status);
      }
    } catch (error) {
      console.error('Error cleaning up user:', error);
    }
  }
}

// Run the tests
runTests();