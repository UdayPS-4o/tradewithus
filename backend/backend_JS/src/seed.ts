import { connectDB, disconnectDB } from './config/database';
import Product from './models/Product';
import Profile from './models/Profile';
import User from './models/User';
import ProductService from './services/ProductService';
import ProfileService from './services/ProfileService';
import UserService from './services/UserService';

// Sample data
const users = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User'
  },
  {
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User'
  }
];

const companies = [
  {
    ProfileId: 'kmg-robust',
    BusinessName: 'KMG Robust',
    Logo: '/companies/kmg-robust/logo.png',
    coverImage: '/companies/kmg-robust/cover.png',
    isPro: true,
    isVerified: true,
    revenue: '24 M',
    employeeCount: '1-10 Employees',
    BusinessOverview: 'KMG Robust is a Planet-Friendly artisan company, which produces 100% organic wine in southern Italy in Puglia, on its own estates divided into 7 biodiverse and exceptional terroirs. The production philosophy is based on the Perrini® Method, a complex system of knowledge, very well articulated, which applies innovative and ancient methods, respects the environment and health, preserves biodiversity, researches and experiments with varieties at risk of extinction.',
    BusinessType: 'Food manufacturing / Farming / Production / Processing / Packing',
    Origin: 'India',
    Established: 1998,
    exportVolume: '50 metric ton / Annually',
    website: 'http://www.kmgrobust.it',
    Address: 'Building no. 123, Whitefield, Bangalore',
    mobile: '+91 1234567890',
    Owner: 'John Doe',
    verifications: {
      businessEmail: true,
      businessRegistration: true,
      representativeProfile: true
    },
    certifications: [
      {
        name: 'FairTrade',
        icon: '/assets/num1.svg',
        validFrom: '1 Jan 2024',
        validTo: '31 Dec 2024'
      },
      {
        name: 'Organic',
        icon: '/assets/num2.svg',
        validFrom: '1 Jan 2024',
        validTo: '31 Dec 2024'
      },
      {
        name: 'Certificate name',
        icon: '/assets/num3.svg',
        validFrom: '1 Jan 2024',
        validTo: '31 Dec 2024'
      }
    ],
    importExport: {
      shipments: 425,
      suppliers: 41,
      volume: '50 metric ton / Annually',
      exportShipments: 340,
      exportSuppliers: 28,
      exportVolume: '40 metric ton / Annually'
    }
  }
];

const products = [
  {
    ProductId: 'black-pepper',
    ProductName: 'Black Pepper',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599909331060-b6f5a9b8229e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518110925495-b37e912bdf5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554030633-21e60fc565a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578867506052-0ddaa521ef0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590166774851-bc49b23a18fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'kmg-robust',
    price: {
      current: 500,
      range: {
        min: 300,
        max: 600
      }
    },
    details: {
      name: 'Blackpepper',
      product: 'Whole Black Peppercorn',
      origin: 'Tanzania',
      productionCapacity: '1,000,000 kg / Annually',
      exportVolume: '50 metric ton / Annually',
      formAndCut: 'Ground - Coarse Ground, Ground, Whole',
      color: 'Black',
      cultivationType: 'Organic'
    },
    shipping: {
      hsCode: 'PQ3-QL123',
      minQuantity: '100 Kgs',
      packaging: 'Cartons',
      transportMode: 'Air Freight',
      incoterms: 'Free on Board',
      shelfLife: '60-80 Days'
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Seed users
    console.log('Seeding users...');
    // Clear existing users
    await User.deleteMany({});
    
    // Insert new users
    for (const userData of users) {
      await UserService.createUser(userData);
    }
    console.log(`${users.length} users seeded successfully`);

    // Force reseeding of profiles
    console.log('Seeding profiles...');
    // Clear existing profiles
    await Profile.deleteMany({});
    
    // Insert new profiles
    for (const company of companies) {
      await ProfileService.createProfile(company);
    }
    console.log(`${companies.length} profiles seeded successfully`);

    // Check if products exist
    const productsExist = await ProductService.productsExist();

    if (!productsExist) {
      console.log('Seeding products...');
      // Clear existing products
      await Product.deleteMany({});
      
      // Insert new products
      for (const product of products) {
        await ProductService.createProduct(product);
      }
      console.log(`${products.length} products seeded successfully`);
    } else {
      console.log('Products already exist, skipping product seeding');
    }

    await disconnectDB();
    console.log('Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase(); 