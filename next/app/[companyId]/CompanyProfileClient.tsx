'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Profile } from '../types/index';

// Import our reusable components
import { 
  ProfileHeader, 
  TabNavigation,
  ContactFooter,
  ContactModal,
  VerificationCard,
  CertificationsSection,
  DetailsList
} from '@/app/components/main';

// Importing styles
import '../globals.css';

const transformVerifications = (verifications: any): Record<string, boolean> => {
  if (!verifications) return {};
  return {
    "Business Email Verified": !!verifications.businessEmail,
    "Business Registration Verified": !!verifications.businessRegistration,
    "Representative Profile Verified": !!verifications.representativeProfile,
  };
};

// Helper function to ensure certifications have icons
const ensureCertIcons = (certifications: any[] = []): any[] => {
  return certifications.map(cert => ({
    ...cert,
    icon: cert.icon || '/assets/default-cert-icon.svg'
  }));
};

export default function CompanyProfileClient({ company, products = [] }: { company: Profile, products?: any[] }) {
  const [activeTab, setActiveTab] = useState(0);
  const [importExportTab, setImportExportTab] = useState('import');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const tabs = ['Overview', 'Products', 'Posts', 'Certificates', 'Representatives', 'Ratings', 'News'];

  if (!company) {
    notFound();
  }

  // Map the data for the About section
  const aboutItems = {
    'Business Type': company.businessType,
    'Origin': company.origin,
    'Year Established': company.established,
    'Number of Employees': company.employeeCount,
    'Export Volume': company.exportVolume,
    'Company Website': company.website,
    'Company Address': company.address
  };

  // Import export data based on selected tab
  const getImportExportData = () => {
    const data = company.importExport || { 
      shipments: 0, 
      suppliers: 0, 
      volume: 'N/A',
      exportShipments: 0,
      exportSuppliers: 0,
      exportVolume: 'N/A'
    };
    
    if (importExportTab === 'import') {
      return [
        { label: 'Shipments', value: data.shipments, icon: '/assets/shipment-icon.svg' },
        { label: 'Suppliers', value: data.suppliers, icon: '/assets/suppliers-icon.svg' },
        { label: 'Volume', value: data.volume, icon: '/assets/volume-icon.svg' }
      ];
    } else {
      return [
        { label: 'Shipments', value: data.exportShipments, icon: '/assets/shipment-icon.svg' },
        { label: 'Suppliers', value: data.exportSuppliers, icon: '/assets/suppliers-icon.svg' },
        { label: 'Volume', value: data.exportVolume, icon: '/assets/volume-icon.svg' }
      ];
    }
  };

  return (
    <div className="flex flex-col items-start bg-white pb-[72px] min-h-screen relative max-w-[600px] mx-auto w-full">
      {/* Header */}
      <ProfileHeader 
        title={company.businessName || 'Company Name'}
        backHref="/"
        showWhatsapp={false}
      />
    
      {/* Hero Section */}
      <section className="w-full">
        <div className="w-full flex justify-center items-center bg-white relative h-64">
          <Image
            src={company.coverImage || "/placeholders/company-cover.jpg"}
            alt={`${company.businessName || 'Company Name'} cover`}
            width={600}
            height={300}
            className="w-full h-full object-cover"
            priority
          />
        </div>
    
        <div className="relative px-4 -mt-10">
          <Image 
            src={company.logo || `/placeholders/company-logo-${(company.businessName?.[0] || 'c').toLowerCase()}.jpg`}
            alt={`${company.businessName || 'Company Name'} logo`} 
            width={80} 
            height={80} 
            className="w-20 h-20 rounded-xl"
            priority
          />
        </div>
    
        <div className="flex flex-col gap-1 px-4 mt-2">
          <div className="flex gap-1 items-center">
            <h2 className="text-2xl font-bold text-black">{company.businessName || 'Company Name'}</h2>
            {company.isVerified && (
              <Image src="/assets/shield-check.svg" alt="Verified" width={24} height={24} />
            )}
            {company.isPro && (
              <span className="px-2 py-0.5 text-xs font-bold text-white uppercase rounded" 
                   style={{ background: 'linear-gradient(to bottom, #FBBB54, #C88110)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                Pro
              </span>
            )}
          </div>
    
          <div className="flex flex-wrap gap-1 items-center text-sm text-gray-600">
            <span>{company.revenue} Revenue</span>
            <div className="w-1 h-1 rounded-full bg-zinc-300"></div>
            <span>{company.employeeCount}</span>
            <div className="w-1 h-1 rounded-full bg-zinc-300"></div>
            <span>{new Date().getFullYear() - company.established} Years Old</span>
          </div>
        </div>
      </section>
    
      {/* Navigation Tabs */}
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={(index) => setActiveTab(index as number)}
        className="mt-3"
      />
    
      {/* Tab Content */}
      <div className="w-full">
        {/* Overview Tab */}
        {activeTab === 0 && (
          <>
            <section className="flex flex-col gap-6 items-start px-4 mt-8 w-full">
              <h2 className="text-2xl font-bold text-black">Overview</h2>
              <p className="text-base leading-6 text-gray-700">
                {company.businessOverview || 'No description available'}
              </p>
            </section>
            
            <div className="flex justify-center items-center mt-6 h-3 bg-neutral-100 w-full"></div>
            
            {/* About Section */}
            <section className="flex flex-col gap-4 items-start px-4 mt-6 w-full">
              <DetailsList 
                title="About"
                items={aboutItems}
              />
            </section>
            
            <div className="flex justify-center items-center mt-6 h-3 bg-neutral-100 w-full"></div>
            
            {/* Verification Details */}
            <section className="flex flex-col gap-4 items-start px-4 mt-6 w-full">
              <h2 className="text-2xl font-bold text-black">Verification Details</h2>
              <VerificationCard 
                verifications={transformVerifications(company.verifications)} 
              />
            </section>
            
            <div className="flex justify-center items-center mt-6 h-3 bg-neutral-100 w-full"></div>
            
            {/* Certifications Section */}
            <section className="px-4 mt-6">
              <CertificationsSection 
                certifications={ensureCertIcons(company.certifications)}
              />
            </section>
            
            <div className="flex justify-center items-center mt-6 h-3 bg-neutral-100 w-full"></div>
            
            {/* Import Export Data */}
            <section className="flex flex-col gap-4 items-start px-4 mt-6 w-full">
              <h2 className="text-2xl font-bold text-black">Import Export Data</h2>
              <div className="flex flex-col gap-4 items-start w-full">
                <div className="flex gap-5 items-center">
                  <button 
                    className={`${importExportTab === 'import' ? 'text-green-600 font-semibold border-b-2 border-green-600' : 'text-black text-opacity-50'} pb-1`}
                    onClick={() => setImportExportTab('import')}
                  >
                    Import
                  </button>
                  <button 
                    className={`${importExportTab === 'export' ? 'text-green-600 font-semibold border-b-2 border-green-600' : 'text-black text-opacity-50'} pb-1`}
                    onClick={() => setImportExportTab('export')}
                  >
                    Export
                  </button>
                </div>
                
                <div className="flex flex-col gap-4 items-start w-full">
                  {getImportExportData().map((item, index) => (
                    <div key={index} className="flex gap-2 items-start w-full">
                      <Image src={item.icon} alt={item.label} width={24} height={24} />
                      <div className="flex flex-col gap-1 items-start">
                        <dt className="text-sm leading-5 text-stone-500">{item.label}</dt>
                        <dd className="text-sm leading-5 text-neutral-950">{item.value}</dd>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        
        {/* Products Tab */}
        {activeTab === 1 && (
          <section className="flex flex-col gap-4 items-start px-4 mt-6 w-full">
            <h2 className="text-xl font-bold text-black">Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
              {products.length > 0 ? (
                products.map((product) => (
                  <Link 
                    key={product.productId} 
                    href={`/${company.profileId}/product/${product.productId}`}
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                  <div className="aspect-square bg-gray-100 relative">
                    <Image 
                        src={product.images?.[0] || "/placeholders/product.jpg"} 
                        alt={product.productName}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        style={{objectFit: "cover"}}
                        className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium line-clamp-1">{product.productName}</h3>
                      <p className="text-xs text-gray-500">
                        {product.price ? `$${product.price.range.min} - $${product.price.range.max}` : 'Price unavailable'}
                      </p>
                  </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-center py-4 text-gray-500">No products available</p>
              )}
            </div>
          </section>
        )}
        
        {/* Certificates Tab */}
        {activeTab === 3 && (
          <section className="px-4 mt-6">
            <CertificationsSection 
              certifications={ensureCertIcons(company.certifications)}
            />
          </section>
        )}
        
        {/* Other Tabs */}
        {(activeTab === 2 || activeTab > 3) && (
          <section className="flex flex-col gap-6 items-start px-4 mt-8 w-full">
            <h2 className="text-2xl font-bold text-black">{tabs[activeTab]}</h2>
            <p className="text-base leading-6 text-gray-700">
              This section is under development.
            </p>
          </section>
        )}
      </div>
      
      {/* Contact Footer */}
      <ContactFooter
        id={company.profileId}
        type="company"
        onContact={() => setIsContactModalOpen(true)}
      />
      
      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        type="contact"
        title="Contact Seller"
        entityName={company.businessName || 'Company Name'}
      />
    </div>
  );
} 