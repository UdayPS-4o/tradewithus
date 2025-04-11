"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Search, ChevronRight, Building, Package } from 'lucide-react';
import { useAuth } from '@/app/components/auth/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Profile, Product } from '@/app/types/index';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/all`);
        if (profileRes.ok) {
          const profileResponse = await profileRes.json();
          if (profileResponse.success && Array.isArray(profileResponse.data)) {
            setProfiles(profileResponse.data as Profile[]);
            setFeaturedProfiles(profileResponse.data as Profile[]);
          }
        }

        const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/all`);
        if (productRes.ok) {
          const productResponse = await productRes.json();
          if (productResponse.success && Array.isArray(productResponse.data)) {
            const productsWithSellers = await Promise.all(productResponse.data.map(async (prod: Product) => {
              const sellerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${prod.sellerId}`);
              const sellerResponse = sellerRes.ok ? await sellerRes.json() : { success: false };
              const sellerData = sellerResponse.success ? sellerResponse.data as Profile : { businessName: 'Unknown Seller' } as Partial<Profile>;
              
              return { 
                ...prod,
                seller: sellerData 
              };
            }));
            setProducts(productsWithSellers);
            setFeaturedProducts(productsWithSellers);
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-[500px] mx-auto">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-emerald-700">TradeWithUs</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">
                Welcome, <span className="font-medium text-gray-800">{user.name}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-emerald-700 p-1">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="px-4 py-4">
          <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 mb-6 p-4 text-white">
            <h2 className="text-xl font-bold mb-2">TradeWithUs</h2>
            <p className="text-emerald-50 text-sm mb-3">Connect with trusted suppliers and buyers from around the world</p>
            
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for products or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 bg-white/90 rounded-full w-full focus:bg-white text-gray-800 placeholder-gray-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <section className="mb-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-1 text-emerald-600" />
              <h2 className="text-base font-semibold text-gray-800">Top Companies</h2>
            </div>
          </div>

          {loadingData ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="w-full">
              <Swiper
                spaceBetween={10}
                slidesPerView={2.5}
                breakpoints={{
                  400: { slidesPerView: 3.2 },
                  500: { slidesPerView: 4.2 },
                }}
                className="company-swiper !pl-4"
              >
                {featuredProfiles
                  .filter(profile => 
                    searchQuery === '' || 
                    profile.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .length > 0 ? (
                  featuredProfiles
                    .filter(profile => 
                      searchQuery === '' || 
                      profile.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((profile) => (
                    <SwiperSlide key={profile.profileId} className="!h-auto">
                      <Link href={`/${profile.profileId}`} className="block h-full">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="aspect-square relative">
                            <Image 
                              src={profile.logo || `/placeholders/company-logo-${profile.businessName?.charAt(0).toLowerCase()}.jpg`}
                              alt={profile.businessName || 'Company Logo' }
                              fill
                              sizes="(max-width: 400px) 50vw, (max-width: 500px) 33vw, 150px"
                              style={{ objectFit: "cover" }}
                              className="object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <div className="flex items-center gap-1 mb-0.5">
                              <h3 className="font-medium text-xs text-gray-900 line-clamp-1">{profile.businessName}</h3>
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{profile.businessType || "Trading Company"}</p>
                            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-500">
                              <span>{profile.origin || "Global"}</span>
                              <div className="w-0.5 h-0.5 rounded-full bg-gray-300"></div>
                              <span>{new Date().getFullYear() - (profile.established || new Date().getFullYear())} Yrs</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="w-full py-4 text-center text-gray-500 text-sm">
                    No companies found
                  </div>
                )}
              </Swiper>
            </div>
          )}
        </section>

        <section className="mb-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1 text-emerald-600" />
              <h2 className="text-base font-semibold text-gray-800">Featured Products</h2>
            </div>
          </div>

          {loadingData ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="w-full">
              <Swiper
                spaceBetween={10}
                slidesPerView={2.5}
                breakpoints={{
                  400: { slidesPerView: 3.2 },
                  500: { slidesPerView: 4.2 },
                }}
                className="product-swiper !pl-4"
              >
                {featuredProducts
                  .filter(product => 
                    searchQuery === '' || 
                    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.seller?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .length > 0 ? (
                  featuredProducts
                    .filter(product => 
                      searchQuery === '' || 
                      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      product.seller?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((product) => (
                    <SwiperSlide key={product.productId} className="!h-auto">
                      <Link href={`/${product.sellerId}/product/${product.productId}`} className="block h-full">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="aspect-square relative">
                            <Image 
                              src={product.images[0] || '/placeholders/product.jpg'}
                              alt={product.productName}
                              fill
                              sizes="(max-width: 400px) 50vw, (max-width: 500px) 33vw, 150px"
                              style={{ objectFit: "cover" }}
                              className="object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <h3 className="font-medium text-xs text-gray-900 mb-0.5 line-clamp-1">{product.productName}</h3>
                            <p className="text-[11px] text-gray-500 line-clamp-1">
                              Seller: {product.seller?.businessName || "Unknown"}
                            </p>
                            {product.price && (
                              <div className="mt-0.5 font-medium text-xs text-emerald-600">
                                ${product.price.range.min} - ${product.price.range.max}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="w-full py-4 text-center text-gray-500 text-sm">
                    No products found
                  </div>
                )}
              </Swiper>
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        .swiper-slide {
          height: auto;
        }
        
        .swiper {
          overflow: hidden !important;
        }
        
        .swiper-wrapper {
          padding-right: 16px;
        }
      `}</style>
    </div>
  );
} 