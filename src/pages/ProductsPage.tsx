import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Filter, X, ChevronRight, Zap, LayoutGrid, List, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category, Subcategory } from '../lib/types';
import { ProductDetailModal } from '../components/ProductDetailModal';

const subcategoryFallbackImages: Record<string, string> = {
  'downlights': 'https://images.unsplash.com/photo-1565538810844-1e119de867c2?auto=format&fit=crop&w=600&q=80',
  'spotlights': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
  'track-lights': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
  'linear-lights': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
  'panel-lights': 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=600&q=80',
  'cob-lights': 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?auto=format&fit=crop&w=600&q=80',
  'magnetic-lights': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  'magnetic-track': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  'magnetic-linear': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  'profile-lights': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  'silicone-profiles': 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
  'outdoor-lights': 'https://images.unsplash.com/photo-1563298723-dcfebaa3a2ec?auto=format&fit=crop&w=600&q=80',
  'flood-lights': 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=600&q=80',
  'street-lights': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
  'garden-lights': 'https://images.unsplash.com/photo-1563298723-dcfebaa3a2ec?auto=format&fit=crop&w=600&q=80',
  'wall-lights': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  'high-bay': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
  'well-glass': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
  'facade-lights': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  'wall-washers': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  'linear-wall-washers': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  'underwater-lights': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'fountain-lights': 'https://images.unsplash.com/photo-1554123158-8884f177c4b3?auto=format&fit=crop&w=600&q=80',
  'swimming-pool-lights': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
  'ev-chargers': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
  'ac-chargers': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
  'dc-chargers': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
};

const getSubcategoryFallbackImage = (slug: string, name: string): string => {
  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (subcategoryFallbackImages[normalizedSlug]) {
    return subcategoryFallbackImages[normalizedSlug];
  }
  const keys = Object.keys(subcategoryFallbackImages);
  const matchedKey = keys.find(k => normalizedSlug.includes(k) || k.includes(normalizedSlug));
  if (matchedKey) {
    return subcategoryFallbackImages[matchedKey];
  }
  return 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80';
};

export function ProductsPage() {
  const { categorySlug, subcategorySlug, childSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Scroll to top whenever the category / subcategory route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowFilters(false); // also close mobile filter panel on route change
  }, [location.pathname]);

  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find((c) => c.slug === categorySlug);
  }, [categorySlug, categories]);

  const currentSubcategory = useMemo(() => {
    if (!subcategorySlug) return null;
    return subcategories.find((s) => s.slug === subcategorySlug);
  }, [subcategorySlug, subcategories]);

  const currentChildSubcategory = useMemo(() => {
    if (!childSlug) return null;
    return subcategories.find((s) => s.slug === childSlug);
  }, [childSlug, subcategories]);

  const filteredSubcategories = useMemo(() => {
    if (!currentCategory) return [];
    // Get top-level subcategories for the current category
    return subcategories.filter((s) => s.category_id === currentCategory.id && !s.parent_id);
  }, [currentCategory, subcategories]);

  const childSubcategories = useMemo(() => {
    if (!currentSubcategory) return [];
    // Get child subcategories for the current subcategory
    return subcategories.filter((s) => s.parent_id === currentSubcategory.id);
  }, [currentSubcategory, subcategories]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (currentCategory) {
      filtered = filtered.filter((p) => p.category_id === currentCategory.id);
    }

    // Filter by child subcategory (most specific)
    if (currentChildSubcategory) {
      filtered = filtered.filter((p) => p.subcategory_id === currentChildSubcategory.id);
    }
    // Filter by subcategory
    else if (currentSubcategory) {
      // Include products in this subcategory or its children
      const subcategoryIds = subcategories
        .filter(s => s.parent_id === currentSubcategory.id || s.id === currentSubcategory.id)
        .map(s => s.id);
      filtered = filtered.filter((p) => p.subcategory_id && subcategoryIds.includes(p.subcategory_id));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.short_description?.toLowerCase().includes(query)
      );
    }

    return filtered.filter((p) => p.status === 'active');
  }, [products, currentCategory, currentSubcategory, currentChildSubcategory, searchQuery, subcategories]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        supabase.from('products').select('*, category:categories(id, name, slug), subcategory:subcategories(id, name, slug)'),
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('subcategories').select('*').eq('is_active', true).order('sort_order'),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-charcoal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-sm flex-wrap">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            {currentCategory ? (
              <>
                <Link to="/products" className="hover:text-gold-400 transition-colors">Products</Link>
                <ChevronRight className="w-4 h-4" />
                {currentSubcategory ? (
                  <>
                    <Link to={`/products/category/${currentCategory.slug}`} className="hover:text-gold-400 transition-colors">
                      {currentCategory.name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    {currentChildSubcategory ? (
                      <>
                        <Link to={`/products/category/${currentCategory.slug}/${currentSubcategory.slug}`} className="hover:text-gold-400 transition-colors">
                          {currentSubcategory.name}
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gold-400">{currentChildSubcategory.name}</span>
                      </>
                    ) : (
                      <span className="text-gold-400">{currentSubcategory.name}</span>
                    )}
                  </>
                ) : (
                  <span className="text-gold-400">{currentCategory.name}</span>
                )}
              </>
            ) : (
              <span className="text-gold-400">Products</span>
            )}
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-charcoal-900" />
            </div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">
                {currentChildSubcategory?.name || currentSubcategory?.name || currentCategory?.name || 'All Products'}
              </h1>
              {(currentChildSubcategory || currentSubcategory || currentCategory)?.description && (
                <p className="text-slate-300 text-lg max-w-2xl">
                  {(currentChildSubcategory || currentSubcategory || currentCategory)?.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters — shown as overlay on mobile, always visible on lg+ */}
            <aside className={`${
              showFilters
                ? 'fixed inset-0 z-40 flex items-start justify-start bg-slate-900/50 lg:static lg:bg-transparent lg:inset-auto lg:z-auto'
                : 'hidden lg:block'
            } lg:w-72 flex-shrink-0`}>
              <div className="sticky top-28 bg-white rounded-2xl border border-slate-100 p-6 shadow-card w-72 max-h-screen overflow-y-auto lg:w-auto lg:max-h-none">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-heading font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-8">
                  <label className="input-label mb-2">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-10 text-sm"
                    />
                  </div>
                </form>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-semibold text-charcoal-900 mb-4 text-sm uppercase tracking-wider">Categories</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/products"
                        className={`block py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
                          !currentCategory
                            ? 'bg-gradient-gold text-charcoal-900'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        All Products
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          to={`/products/category/${cat.slug}`}
                          className={`block py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
                            currentCategory?.id === cat.id
                              ? 'bg-gradient-gold text-charcoal-900'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subcategories */}
                {filteredSubcategories.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-4 text-sm uppercase tracking-wider">Categories</h4>
                    <ul className="space-y-2">
                      {filteredSubcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/products/category/${currentCategory?.slug}/${sub.slug}`}
                            className={`block py-2.5 px-4 rounded-xl transition-all text-sm font-medium ${
                              currentSubcategory?.id === sub.id
                                ? 'bg-gradient-gold text-charcoal-900'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {sub.name}
                          </Link>
                          {/* Show child subcategories if this subcategory is selected */}
                          {currentSubcategory?.id === sub.id && childSubcategories.length > 0 && (
                            <ul className="ml-3 mt-1 space-y-1 border-l-2 border-gold-200 pl-3">
                              {childSubcategories.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    to={`/products/category/${currentCategory?.slug}/${sub.slug}/${child.slug}`}
                                    className={`block py-1.5 px-3 rounded-lg transition-all text-xs font-medium ${
                                      currentChildSubcategory?.id === child.id
                                        ? 'bg-gold-100 text-gold-700'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Subcategories Grid */}
              {currentCategory && !subcategorySlug && filteredSubcategories.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-6">Browse {currentCategory.name} Subcategories</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSubcategories.map((sub) => {
                      const subProductCount = products.filter(p => p.subcategory_id === sub.id || (p.subcategory_id && subcategories.filter(child => child.parent_id === sub.id).map(child => child.id).includes(p.subcategory_id))).length;
                      const imageUrl = sub.image_url || getSubcategoryFallbackImage(sub.slug, sub.name);
                      return (
                        <Link
                          key={sub.id}
                          to={`/products/category/${currentCategory.slug}/${sub.slug}`}
                          className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-premium-lg transition-all duration-300 p-3 flex flex-col hover:border-gold-300 transform hover:-translate-y-1"
                        >
                          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-3 relative">
                            <img
                              src={imageUrl}
                              alt={sub.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            {subProductCount > 0 && (
                              <div className="absolute bottom-2 right-2">
                                <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  {subProductCount} {subProductCount === 1 ? 'Product' : 'Products'}
                                </span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-heading font-semibold text-charcoal-800 group-hover:text-gold-600 transition-colors text-sm truncate">
                            {sub.name}
                          </h3>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn-ghost flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <p className="text-slate-500 text-sm">
                    Showing <span className="font-semibold text-charcoal-900">{filteredProducts.length}</span> products
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-charcoal-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-charcoal-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-[4/3] bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-charcoal-900 mb-2">No products found</h3>
                  <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
                  <Link to="/products" className="btn-primary inline-block">
                    View All Products
                  </Link>
                </div>
              ) : (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ${
                        viewMode === 'grid'
                          ? 'bg-white rounded-2xl border border-slate-100 hover:border-gold-200 overflow-hidden hover:shadow-gold-lg'
                          : 'bg-white rounded-xl border border-slate-100 hover:border-gold-200 p-4 flex gap-6 hover:shadow-premium-lg'
                      }`}
                    >
                      {/* Image */}
                      <div className={viewMode === 'grid'
                        ? 'relative aspect-square overflow-hidden bg-slate-100'
                        : 'w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100'
                      }>
                        {product.cover_image_url || product.images[0] ? (
                          <img
                            src={product.cover_image_url || product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <Zap className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                        {product.category && viewMode === 'grid' && (
                          <div className="absolute top-3 left-3">
                            <span className="badge-gold text-xs">{product.category.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={viewMode === 'grid' ? 'p-5' : 'flex-1 py-1'}>
                        {product.category && viewMode === 'list' && (
                          <span className="badge-gold text-xs mb-2">{product.category.name}</span>
                        )}
                        <h3 className={`font-heading font-semibold text-charcoal-900 mb-2 group-hover:text-gold-600 transition-colors ${
                          viewMode === 'grid' ? 'text-lg' : 'text-base'
                        }`}>
                          {product.name}
                        </h3>
                        {product.short_description && (
                          <p className={`text-slate-500 mb-4 ${viewMode === 'grid' ? 'text-sm line-clamp-2' : 'text-sm line-clamp-1'}`}>
                            {product.short_description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-gold-600 font-medium text-sm group-hover:gap-3 transition-all">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
