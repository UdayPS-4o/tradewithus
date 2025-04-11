import { fetchCompanyById, fetchProducts } from '../api';
import CompanyProfileClient from './CompanyProfileClient';

export default async function CompanyProfilePage({ params }: { params: { companyId: string } }) {
  const company = await fetchCompanyById(params.companyId);
  const allProducts = await fetchProducts();
  const companyProducts = allProducts.filter(p => p.sellerId === company.profileId);
  
  return <CompanyProfileClient company={company} products={companyProducts} />;
}