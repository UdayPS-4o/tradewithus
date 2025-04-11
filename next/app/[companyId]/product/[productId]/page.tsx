import { notFound } from 'next/navigation';
import { fetchProductById, fetchCompanyById } from '../../../api';
import ProductView from './ProductView';

export default async function ProductPage({ 
  params 
}: { 
  params: { companyId: string; productId: string } 
}) {
  try {
    const product = await fetchProductById(params.productId);
    const company = await fetchCompanyById(params.companyId);

    if (!product || !company) {
      notFound();
    }

    // Ensure product has seller details
    const productWithSeller = {
      ...product,
      seller: company
    };

    return (
      <>
        <ProductView product={productWithSeller} />
      </>
    );
  } catch (error) {
    console.error('Error fetching product data:', error);
    notFound();
  }
}