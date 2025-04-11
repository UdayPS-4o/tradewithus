import { connectDB, disconnectDB } from '../config/database';
import Product from '../models/Product';
import Profile from '../models/Profile';
import User from '../models/User';
import ProductService from '../services/ProductService';
import ProfileService from '../services/ProfileService';
import UserService from '../services/UserService';

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
        profileId: 'kmg-robust',
        businessName: 'KMG Robust',
        logo: '/companies/kmg-robust/logo.png',
        coverImage: '/companies/kmg-robust/cover.png',
        isPro: true,
        isVerified: true,
        revenue: '24 M',
        employeeCount: '1-10 Employees',
        businessOverview: 'KMG Robust is a Planet-Friendly artisan company, which produces 100% organic wine in southern Italy in Puglia, on its own estates divided into 7 biodiverse and exceptional terroirs. The production philosophy is based on the Perrini® Method, a complex system of knowledge, very well articulated, which applies innovative and ancient methods, respects the environment and health, preserves biodiversity, researches and experiments with varieties at risk of extinction.',
        businessType: 'Food manufacturing / Farming / Production / Processing / Packing',
        origin: 'India',
        established: 1998,
        exportVolume: '50 metric ton / Annually',
        website: 'http://www.kmgrobust.it',
        address: 'Building no. 123, Whitefield, Bangalore',
        mobile: '+91 1234567890',
        owner: 'John Doe',
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
    },
    {
        profileId: 'spice-traders-inc',
        businessName: 'Spice Traders Inc.',
        logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=100&h=100&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=200&fit=crop',
        isPro: false,
        isVerified: true,
        revenue: '15 M',
        employeeCount: '11-50 Employees',
        businessOverview: 'Leading importer and distributor of high-quality spices from around the globe. Committed to sustainable sourcing.',
        businessType: 'Wholesale / Distribution / Import',
        origin: 'India',
        established: 2005,
        exportVolume: '100 metric ton / Annually',
        website: 'http://www.spicetraders.com',
        address: '456 Spice Avenue, Mumbai',
        mobile: '+91 9876543210',
        owner: 'Priya Sharma',
        verifications: { businessEmail: true, businessRegistration: true, representativeProfile: false },
        certifications: [{ name: 'ISO 9001', icon: '/assets/num1.svg', validFrom: '1 Mar 2023', validTo: '28 Feb 2025' }],
        importExport: { shipments: 800, suppliers: 60, volume: '100 metric ton / Annually', exportShipments: 150, exportSuppliers: 20, exportVolume: '30 metric ton / Annually' }
    },
    {
        profileId: 'global-foods-ltd',
        businessName: 'Global Foods Ltd.',
        logo: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17a?w=100&h=100&fit=crop',
        coverImage: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop',
        isPro: true,
        isVerified: false,
        revenue: '50 M',
        employeeCount: '51-200 Employees',
        businessOverview: 'A major player in the international food market, specializing in processed goods and packaged meals. Innovation focused.',
        businessType: 'Food manufacturing / Processing / Packing',
        origin: 'USA',
        established: 1990,
        exportVolume: '500 metric ton / Annually',
        website: 'http://www.globalfoods.com',
        address: '789 Commerce Drive, Chicago',
        mobile: '+1 1234567890',
        owner: 'Robert Johnson',
        verifications: { businessEmail: true, businessRegistration: false, representativeProfile: true },
        certifications: [],
        importExport: { shipments: 2500, suppliers: 150, volume: '500 metric ton / Annually', exportShipments: 1800, exportSuppliers: 100, exportVolume: '400 metric ton / Annually' }
    },
    {
        profileId: 'sunrise-organics',
        businessName: 'Sunrise Organics',
        logo: 'https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?w=100&h=100&fit=crop',
        coverImage: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=800&h=200&fit=crop',
        isPro: false,
        isVerified: true,
        revenue: '8 M',
        employeeCount: '1-10 Employees',
        businessOverview: 'Family-owned farm dedicated to organic vegetable production using sustainable agriculture practices. Local focus, expanding.',
        businessType: 'Farming / Production',
        origin: 'Canada',
        established: 2012,
        exportVolume: '10 metric ton / Annually',
        website: 'http://www.sunriseorganics.ca',
        address: '123 Farm Road, Ontario',
        mobile: '+1 9876543210',
        owner: 'Alice Green',
        verifications: { businessEmail: true, businessRegistration: true, representativeProfile: true },
        certifications: [{ name: 'Canada Organic', icon: '/assets/num2.svg', validFrom: '1 Jun 2023', validTo: '31 May 2025' }],
        importExport: { shipments: 50, suppliers: 5, volume: '10 metric ton / Annually', exportShipments: 5, exportSuppliers: 2, exportVolume: '2 metric ton / Annually' }
    },
    {
        profileId: 'tech-innovate-sol',
        businessName: 'Tech Innovate Solutions',
        logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&h=100&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=200&fit=crop',
        isPro: true,
        isVerified: true,
        revenue: '100 M',
        employeeCount: '201-500 Employees',
        businessOverview: 'Provides cutting-edge technology solutions for supply chain management and logistics optimization in the food industry.',
        businessType: 'Technology / Software / Consulting',
        origin: 'Germany',
        established: 2008,
        exportVolume: 'N/A', 
        website: 'http://www.techinnovate.de',
        address: '1 Tech Park, Berlin',
        mobile: '+49 123456789',
        owner: 'Klaus Schmidt',
        verifications: { businessEmail: true, businessRegistration: true, representativeProfile: true },
        certifications: [{ name: 'ISO 27001', icon: '/assets/num3.svg', validFrom: '1 Jan 2024', validTo: '31 Dec 2025' }],
        importExport: { shipments: 0, suppliers: 0, volume: 'N/A', exportShipments: 0, exportSuppliers: 0, exportVolume: 'N/A' }
    }
];

const products = [
    {
        productId: 'black-pepper',
        productName: 'Black Pepper',
        images: [
            'https://images.unsplash.com/photo-1649951806971-ad0e00408773?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.pexels.com/photos/8469267/pexels-photo-8469267.jpeg?auto=compress&cs=tinysrgb&w=800&h=800',
            'https://images.pexels.com/photos/6157011/pexels-photo-6157011.jpeg?auto=compress&cs=tinysrgb&w=800&h=800',
            'https://images.pexels.com/photos/4197445/pexels-photo-4197445.jpeg?auto=compress&cs=tinysrgb&w=800&h=800',
            'https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=800&h=800'
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
            cultivationType: 'Organic',
            moisture: '12% max',
            forecast: 'Stable supply throughout the year'
        },
        shipping: {
            hsCode: 'PQ3-QL123',
            minQuantity: '100 Kgs',
            packaging: 'Cartons',
            transportMode: 'Air Freight',
            incoterms: 'Free on Board',
            shelfLife: '60-80 Days'
        }
    },
    {
        productId: 'turmeric-powder',
        productName: 'Turmeric Powder (Organic)',
        images: [
            'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1602470524676-a73f87e13250?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505714091403-fae9a1db3b35?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1522336583284-12dd32bbc296?w=800&h=600&fit=crop'
        ],
        sellerId: 'spice-traders-inc',
        price: { current: 400, range: { min: 250, max: 500 } },
        details: { 
            name: 'Turmeric', 
            product: 'Ground Turmeric', 
            origin: 'India', 
            productionCapacity: '500,000 kg / Annually', 
            exportVolume: '80 metric ton / Annually', 
            formAndCut: 'Ground', 
            color: 'Yellow', 
            cultivationType: 'Organic',
            moisture: '8-10%',
            forecast: 'Increased demand expected in Q3 2024'
        },
        shipping: { hsCode: '091030', minQuantity: '200 Kgs', packaging: 'PP Bags', transportMode: 'Sea Freight', incoterms: 'CIF', shelfLife: '18 Months' }
    },
    {
        productId: 'canned-tomatoes-diced',
        productName: 'Diced Canned Tomatoes',
        images: [
            'https://images.pexels.com/photos/5486848/pexels-photo-5486848.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/5342175/pexels-photo-5342175.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/7811411/pexels-photo-7811411.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
        ],
        sellerId: 'global-foods-ltd',
        price: { current: 150, range: { min: 100, max: 200 } }, 
        details: { 
            name: 'Tomatoes', 
            product: 'Canned Diced Tomatoes', 
            origin: 'USA', 
            productionCapacity: '2,000,000 cases / Annually', 
            exportVolume: '200 metric ton / Annually', 
            formAndCut: 'Diced', 
            color: 'Red', 
            cultivationType: 'Conventional',
            moisture: '90-92%',
            forecast: 'Year-round availability with peak production in summer'
        },
        shipping: { hsCode: '200210', minQuantity: '1 Pallet', packaging: 'Cases (24 cans/case)', transportMode: 'Truck/Sea', incoterms: 'EXW', shelfLife: '24 Months' }
    },
    {
        productId: 'organic-carrots-fresh',
        productName: 'Fresh Organic Carrots',
        images: [
            'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1590081784031-aa38e6be44a8?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop'
        ],
        sellerId: 'sunrise-organics',
        price: { current: 200, range: { min: 150, max: 250 } }, 
        details: { 
            name: 'Carrots', 
            product: 'Fresh Carrots', 
            origin: 'Canada', 
            productionCapacity: '50,000 kg / Annually', 
            exportVolume: '5 metric ton / Annually', 
            formAndCut: 'Whole', 
            color: 'Orange', 
            cultivationType: 'Organic',
            moisture: '85-90%',
            forecast: 'Best quality and availability from July to November'
        },
        shipping: { hsCode: '070610', minQuantity: '50 Kgs', packaging: 'Crates', transportMode: 'Refrigerated Truck', incoterms: 'FCA', shelfLife: '14 Days' }
    },
    {
        productId: 'red-lentils',
        productName: 'Red Lentils (Split)',
        images: [
            'https://images.pexels.com/photos/8109148/pexels-photo-8109148.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/7421202/pexels-photo-7421202.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/6316515/pexels-photo-6316515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 
            'https://images.pexels.com/photos/4198928/pexels-photo-4198928.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
        ],
        sellerId: 'spice-traders-inc',
        price: { current: 300, range: { min: 200, max: 400 } },
        details: { 
            name: 'Lentils', 
            product: 'Split Red Lentils', 
            origin: 'Turkey', 
            productionCapacity: '1,000,000 kg / Annually', 
            exportVolume: '150 metric ton / Annually', 
            formAndCut: 'Split', 
            color: 'Red', 
            cultivationType: 'Conventional',
            moisture: '14% max',
            forecast: 'Prices expected to fluctuate due to weather conditions in growing regions'
        },
        shipping: { hsCode: '071340', minQuantity: '500 Kgs', packaging: 'Bulk Bags', transportMode: 'Sea Freight', incoterms: 'FOB', shelfLife: '12 Months' }
    },
    {
        productId: 'extra-virgin-olive-oil',
        productName: 'Extra Virgin Olive Oil',
        images: [
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1601505418470-ac8e97b9b404?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1626439756291-f0a4a3d46869?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1620626008844-4f3675289761?w=800&h=600&fit=crop'
        ],
        sellerId: 'kmg-robust',
        price: { current: 1200, range: { min: 900, max: 1500 } }, 
        details: { 
            name: 'Olive Oil', 
            product: 'Extra Virgin Olive Oil', 
            origin: 'Italy', 
            productionCapacity: '100,000 liters / Annually', 
            exportVolume: '10 metric ton / Annually', 
            formAndCut: 'Liquid', 
            color: 'Green-Gold', 
            cultivationType: 'Organic',
            moisture: '0.2% max',
            forecast: 'Premium quality from this year\'s harvest with excellent taste profile'
        },
        shipping: { hsCode: '150910', minQuantity: '100 Liters', packaging: 'Bottles/Tins', transportMode: 'Sea/Air', incoterms: 'CIF', shelfLife: '18 Months' }
    },
    {
        productId: 'frozen-peas',
        productName: 'Frozen Green Peas',
        images: [
            'https://images.pexels.com/photos/8844387/pexels-photo-8844387.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/3298064/pexels-photo-3298064.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/255469/pexels-photo-255469.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/8844359/pexels-photo-8844359.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
        ],
        sellerId: 'global-foods-ltd',
        price: { current: 180, range: { min: 120, max: 220 } }, 
        details: { 
            name: 'Peas', 
            product: 'Frozen Green Peas', 
            origin: 'Belgium', 
            productionCapacity: '3,000,000 kg / Annually', 
            exportVolume: '300 metric ton / Annually', 
            formAndCut: 'Whole, Frozen', 
            color: 'Green', 
            cultivationType: 'Conventional',
            moisture: '75-78% when frozen',
            forecast: 'Consistent supply with potential price increase in off-season months'
        },
        shipping: { hsCode: '071021', minQuantity: '1 Tonne', packaging: 'Bags', transportMode: 'Refrigerated Container (Sea)', incoterms: 'CFR', shelfLife: '24 Months' }
    },
    {
        productId: 'organic-kale-fresh',
        productName: 'Fresh Organic Kale',
        images: [
            'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566566083221-6f42c7c4a591?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1553536645-8721721ba926?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1596115367871-d8e15140629a?w=800&h=600&fit=crop'
        ],
        sellerId: 'sunrise-organics',
        price: { current: 250, range: { min: 200, max: 300 } }, 
        details: { 
            name: 'Kale', 
            product: 'Fresh Kale', 
            origin: 'Canada', 
            productionCapacity: '20,000 kg / Annually', 
            exportVolume: '2 metric ton / Annually', 
            formAndCut: 'Leaves', 
            color: 'Green', 
            cultivationType: 'Organic',
            moisture: '80-85%',
            forecast: 'Best crop expected from spring to fall with potential gaps in winter months'
        },
        shipping: { hsCode: '070490', minQuantity: '30 Kgs', packaging: 'Boxes', transportMode: 'Refrigerated Truck', incoterms: 'FCA', shelfLife: '10 Days' }
    },
    {
        productId: 'cinnamon-sticks',
        productName: 'Cinnamon Sticks (Ceylon)',
        images: [
            'https://images.pexels.com/photos/4919737/pexels-photo-4919737.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/6412833/pexels-photo-6412833.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/4226805/pexels-photo-4226805.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
            'https://images.pexels.com/photos/5765838/pexels-photo-5765838.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
        ],
        sellerId: 'spice-traders-inc',
        price: { current: 800, range: { min: 600, max: 1000 } }, 
        details: { 
            name: 'Cinnamon', 
            product: 'Cinnamon Sticks', 
            origin: 'Sri Lanka', 
            productionCapacity: '200,000 kg / Annually', 
            exportVolume: '30 metric ton / Annually', 
            formAndCut: 'Sticks', 
            color: 'Brown', 
            cultivationType: 'Conventional',
            moisture: '13% max',
            forecast: 'Premium Ceylon quality currently in high demand due to limited harvest'
        },
        shipping: { hsCode: '090611', minQuantity: '50 Kgs', packaging: 'Boxes', transportMode: 'Air/Sea', incoterms: 'FOB', shelfLife: '2 Years' }
    },
    {
        productId: 'organic-wine-red',
        productName: 'Organic Red Wine (Sangiovese)',
        images: [
            'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1553361371-9a644776679c?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1558346648-9757f2fa4474?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=800&h=600&fit=crop'
        ],
        sellerId: 'kmg-robust',
        price: { current: 1500, range: { min: 1200, max: 1800 } }, 
        details: { 
            name: 'Wine', 
            product: 'Red Wine', 
            origin: 'Italy', 
            productionCapacity: '50,000 bottles / Annually', 
            exportVolume: '5 metric ton / Annually', 
            formAndCut: 'Liquid', 
            color: 'Red', 
            cultivationType: 'Organic',
            moisture: 'N/A for wine (13.5% alcohol content)',
            forecast: 'Award-winning 2022 vintage, with limited quantities remaining'
        },
        shipping: { hsCode: '220421', minQuantity: '1 Pallet (600 bottles)', packaging: 'Bottles in Cases', transportMode: 'Sea/Truck', incoterms: 'EXW', shelfLife: '5+ Years' }
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Connected to database');

        console.log('Seeding users...');
        await User.deleteMany({});
        for (const userData of users) {
            await UserService.createUser(userData);
        }
        console.log(`${users.length} users seeded successfully`);

        console.log('Seeding profiles...');
        await Profile.deleteMany({});
        for (const company of companies) {
            await ProfileService.createProfile(company);
        }
        console.log(`${companies.length} profiles seeded successfully`);

        console.log('Seeding products...');
        await Product.deleteMany({});
        for (const product of products) {
            await ProductService.createProduct(product);
        }
        console.log(`${products.length} products seeded successfully`);

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