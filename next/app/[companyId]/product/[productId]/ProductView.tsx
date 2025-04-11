'use client';

import Image from 'next/image';
import React, { useState, Fragment, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Product, Profile, Verification, Certification } from '@/app/types/index';
import { useParams } from 'next/navigation';

// Import our reusable components
import { 
  ProfileHeader, 
  TabNavigation,
  ContactFooter,
  ContactModal,
  VerificationCard,
  CertificationsSection,
  DetailsList,
  QuickInfoCards
} from '@/app/components/main';

import {
  Button 
} from "@/app/components/ui/button"

// Helper function to transform Verification object
const transformVerifications = (verifications?: Verification): Record<string, boolean> => {
  if (!verifications) return {};
  return {
    "Business Email Verified": !!verifications.businessEmail,
    "Business Registration Verified": !!verifications.businessRegistration,
    "Representative Profile Verified": !!verifications.representativeProfile,
  };
};

// Add this helper function after imports
const ensureIcons = (certifications?: Certification[]): any[] => {
  if (!certifications) return [];
  return certifications.map(cert => ({
    ...cert,
    icon: cert.icon || '/assets/default-cert-icon.svg'
  }));
};

// Market Price Trend component
const MarketPriceTrend = ({ price }: { price: any }) => {
  // Calculate price position within range as width percentage
  const calculatePricePosition = () => {
    if (!price || !price.range) return 50; // Default position if price is missing
    const priceRange = price.range.max - price.range.min;
    if (priceRange <= 0) return 50; // Avoid division by zero
    const pricePosition = ((price.current - price.range.min) / priceRange) * 100;
    return Math.min(Math.max(pricePosition, 0), 100);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-black">Market Price Trend</h2>
        <button>
          <Image src="/assets/info-icon.svg" alt="Info" width={16} height={16} />
        </button>
      </div>

      <p className="text-sm mb-1">Prices are <span className="font-medium">typical</span> right now</p>
      <p className="text-xs text-gray-500 mb-16">
        Currently ${price.current}/unit. This is around the usual price. The least expensive price is around ${price.range.min}–${price.range.max}.
      </p>

      <div className="relative mb-3">
        <div
          className="absolute -top-12 transform -translate-x-1/2 text-center"
          style={{ left: `${calculatePricePosition()}%` }}
        >
          <div className="text-xs text-gray-500">Today</div>
          <div className="text-base font-bold">${price.current}</div>
        </div>
        
        {/* Triangle pointer that cuts into the bar */}
        <div 
          className="absolute w-3 h-1.5 bg-white -translate-x-1/2 z-10"
          style={{ 
            left: `${calculatePricePosition()}%`,
            top: '0px',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
          }}
        ></div>

        {/* Bar with segments */}
        <div className="w-full h-3 flex rounded-full overflow-hidden">
          <div className="w-[25%] bg-green-400"></div>
          <div className="w-[45%] bg-green-600"></div>
          <div className="w-[30%] bg-green-700"></div>
        </div>
      </div>

      <button className="text-sm text-green-600 font-medium flex items-center gap-1">
        <span>View Price History</span>
        <Image src="/assets/arrow-right.svg" alt="Arrow" width={14} height={14} />
      </button>
    </>
  );
};

export default function ProductView({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('seller');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const totalSlides = product.images?.length || 0;
  const params = useParams();
  const sellerId = params.companyId as string;
  
  const seller: Profile | undefined = product.seller;
  
  useEffect(() => {
    // Check localStorage for favorite status on component mount
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsFavorite(favorites.products.includes(product.productId));
    }
  }, [product.productId]);

  const toggleFavorite = () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    
    // Update localStorage
    const savedFavorites = localStorage.getItem('favorites');
    let favorites: { companies: string[], products: string[] } = { companies: [], products: [] };
    
    if (savedFavorites) {
      favorites = JSON.parse(savedFavorites);
    }
    
    if (newStatus) {
      favorites.products = Array.from(new Set([...favorites.products, product.productId]));
    } else {
      favorites.products = favorites.products.filter((id: string) => id !== product.productId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };
  
  // Quick info cards data
  const quickInfoCards = [
    {
      icon: "/assets/SealCheck.svg",
      iconBg: "bg-amber-100",
      title: "Verified by",
      subtitle: "GTX"
    },
    {
      icon: "/assets/CalendarStar.svg",
      iconBg: "bg-blue-100",
      title: seller?.established ? `${new Date().getFullYear() - seller.established} Years Old` : "Company Age"
    },
    {
      icon: "/assets/IN.png",
      iconBg: "bg-orange-100",
      title: "Based in",
      subtitle: seller?.origin || "Country"
    },
    {
      icon: "/assets/ListPlus.svg",
      iconBg: "bg-green-100",
      title: "View All",
      subtitle: "Details",
      onClick: () => setActiveTab('product details')
    }
  ];
  
  // Helper to create an object from product details for DetailsList
  const productDetailsItems = {
    "Product Name": product.details.name,
    "Origin": product.details.origin,
    "Production Capacity": product.details.productionCapacity,
    "Export Volume": product.details.exportVolume,
    "Form & Cut": product.details.formAndCut,
    "Colour": product.details.color,
    "Cultivation Type": product.details.cultivationType,
    "Moisture": product.details.moisture || 'N/A',
    "Forecast": product.details.forecast || 'N/A',
  };

  // Helper to create an object from shipping details for DetailsList
  const shippingDetailsItems = {
    "HS Code": product.shipping.hsCode,
    "Minimum Order Quantity": product.shipping.minQuantity,
    "Packing Details": product.shipping.packaging,
    "Transport Mode": product.shipping.transportMode,
    "Incoterms": product.shipping.incoterms,
    "Shelf Life": product.shipping.shelfLife,
  };

  return (
    <div className="flex flex-col items-start bg-white pb-[72px] min-h-screen relative max-w-[600px] mx-auto w-full">
      {/* Header */}
      <ProfileHeader 
        title={product.productName}
        backHref={`/${sellerId}`}
        showShare={true}
        showWhatsapp={true}
        subtitle={seller?.businessName}
      />
      
      {/* Product Image Carousel */}
      <section className="w-full relative">
        <Swiper
          modules={[Pagination]}
          pagination={{ 
            enabled: true,
            type: 'bullets',
            clickable: true
          }}
          className="w-full aspect-square product-swiper"
          onSlideChange={(swiper: SwiperType) => setActiveSlide(swiper.activeIndex)}
        >
          {(product.images && product.images.length > 0) ? product.images.map((image: string, index: number) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center relative">
                <Image 
                  src={image}
                  alt={`${product.productName} ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          )) : (
             <SwiperSlide>
               <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                 <span>No Images Available</span>
               </div>
             </SwiperSlide>
           )}
          
          {/* Photo Counter */}
          {totalSlides > 0 && (
            <div className="absolute bottom-4 right-4 z-10 bg-black text-white px-3 py-1.5 rounded-full text-xs">
              {activeSlide + 1}/{totalSlides} Photos
            </div>
          )}
        </Swiper>
      </section>
      
      {/* Navigation Tabs */}
      <TabNavigation 
        tabs={['Images', 'Seller', 'Price', 'Product Details', 'Certifications']} 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as string)}
      />
      
      {/* Tab Content */}
      <div className="w-full">
        {/* Images Tab */}
        {activeTab === 'images' && (
          <section className="w-full px-4 py-3">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-black mb-2">Product Images</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {(product.images && product.images.length > 0) ? product.images.map((image: string, index: number) => (
                  <div key={index} className="aspect-square bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <Image 
                      src={image}
                      alt={`${product.productName} ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )) : (
                   <p className="col-span-full text-center py-4 text-gray-500">No images available for this product.</p>
                )}
              </div>
            </div>
          </section>
        )}
        
        {/* Seller Tab */}
        {activeTab === 'seller' && (
          <>
            {/* Quick Info Cards */}
            <div className="px-4 py-3 flex flex-row justify-between">
              {quickInfoCards.map((card, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center w-1/4 text-center"
                  onClick={card.onClick ? () => card.onClick() : undefined}
                >
                  <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center mb-1`}>
                    <Image src={card.icon} alt={card.title} width={20} height={20} />
                  </div>
                  <div className="text-xs font-medium">{card.title}</div>
                  {card.subtitle && <div className="text-xs text-gray-500">{card.subtitle}</div>}
                </div>
              ))}
            </div>
            
            {/* Seller Section */}
            <section className="w-full px-4 py-3 border-b">
              <h2 className="text-xl font-bold text-black mb-3">Seller</h2>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-green-100 flex items-center justify-center rounded-md mr-3">
                  <span className="text-lg font-bold text-green-800">
                    {seller?.businessName ? seller.businessName.split(' ').map((word: string) => word[0]).join('') : ''}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{seller?.businessName}</span>
                    {seller?.isVerified && (
                      <Image src="/assets/shield-check.svg" alt="Verified" width={16} height={16} />
                    )}
                    {seller?.isPro && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold text-white uppercase rounded" 
                           style={{ background: 'linear-gradient(to bottom, #FBBB54, #C88110)' }}>
                        Pro
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <span>{seller?.revenue}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-300"></div>
                    <span>{seller?.employeeCount}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-300"></div>
                    <span>{seller?.established ? `${new Date().getFullYear() - seller.established} Years Old` : ""}</span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Verification Details */}
            <section className="w-full px-4 py-3 border-b">
              {seller?.verifications && (
                <VerificationCard 
                  verifications={transformVerifications(seller.verifications)}
                />
              )}
            </section>
            
            {/* Market Price Trend */}
            <section className="w-full px-4 py-3 border-b">
              <MarketPriceTrend price={product.price} />
            </section>
            
            {/* Product Details */}
            <section className="w-full px-4 py-3 border-b">
              <DetailsList
                title="Product Details"
                items={productDetailsItems}
                downloadable={true}
                actionText="View All Details"
              />
            </section>
            
            {/* Certifications */}
            <section className="w-full px-4 py-3 border-b">
              <CertificationsSection 
                {...{
                  certifications: ensureIcons(seller?.certifications),
                  actionText: "View All Certifications",
                  onActionClick: () => setActiveTab('certifications')
                } as any}
              />
            </section>
            
            {/* Shipping Details */}
            <section className="w-full px-4 py-3">
              <DetailsList
                title="Shipping Details"
                items={shippingDetailsItems}
              />
            </section>
          </>
        )}
        
        {/* Price Tab */}
        {activeTab === 'price' && (
          <section className="w-full px-4 py-3">
            <MarketPriceTrend price={product.price} />
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-3">Pricing Options</h3>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Minimum Order Quantity</span>
                  <span>{product.shipping.minQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price Range</span>
                  <span>${product.price.range.min} - ${product.price.range.max} per unit</span>
                </div>
              </div>
            </div>
          </section>
        )}
      
        {/* Product Details Tab */}
        {activeTab === 'product details' && (
          <section className="w-full px-4 py-3">
            <DetailsList
              title="Product Details"
              items={productDetailsItems}
              downloadable={true}
            />
          </section>
        )}
        
        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <section className="w-full px-4 py-3">
            <CertificationsSection 
              certifications={ensureIcons(seller?.certifications)}
              subtitle="Click on the certification to view details"
            />
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Certification Details</h3>
              <p className="text-sm text-gray-700">
                All certifications are verified by trusted third-party organizations. 
                Click on any certification to view the full certificate details including 
                issuing authority, standards met, and verification methods.
              </p>
            </div>
          </section>
        )}
      </div>
      
      {/* Add custom CSS for white pagination bullets */}
      <style jsx global>{`
        .product-swiper .swiper-pagination {
          bottom: 15px;
        }
        
        .product-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
          width: 6px;
          height: 6px;
          margin: 0 3px;
          border-radius: 50%;
        }
        
        .product-swiper .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
          width: 20px;
          height: 6px;
          border-radius: 3px;
        }
      `}</style>
      
      {/* Contact Footer */}
      <ContactFooter
        id={product.productId}
        type="product"
        onContact={() => setIsContactModalOpen(true)}
        onQuote={() => setIsQuoteModalOpen(true)}
      />
      
      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        type="contact"
        title="Contact Seller"
        entityName={seller?.businessName || "Seller"}
        productName={product.productName}
      />
      
      {/* Quote Modal */}
      <ContactModal
        isOpen={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        type="quote"
        title="Request a Quote"
        entityName={seller?.businessName || "Seller"}
        productName={product.productName}
      />
    </div>
  );
}