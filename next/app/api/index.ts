import { Profile, Product } from '@/app/types/index';

/**
 * Fetch all companies from the backend
 */
export const fetchCompanies = async (): Promise<Profile[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data as Profile[];
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

/**
 * Fetch a single company by ID
 */
export const fetchCompanyById = async (companyId: string): Promise<Profile> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data as Profile;
  } catch (error) {
    console.error(`Error fetching company with ID ${companyId}:`, error);
    throw error;
  }
};

/**
 * Fetch all products from the backend
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data as Product;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
}; 