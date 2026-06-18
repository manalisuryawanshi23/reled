import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, FolderTree, Image, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  products: number;
  enquiries: number;
  newEnquiries: number;
  categories: number;
  gallery: number;
}

interface RecentEnquiry {
  id: string;
  full_name: string;
  phone: string;
  product_category: string;
  created_at: string;
  status: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    enquiries: 0,
    newEnquiries: 0,
    categories: 0,
    gallery: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<RecentEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, enquiriesRes, newEnquiriesRes, categoriesRes, galleryRes, recentRes] =
        await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('enquiries').select('id', { count: 'exact', head: true }),
          supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('gallery').select('id', { count: 'exact', head: true }),
          supabase
            .from('enquiries')
            .select('id, full_name, phone, product_category, created_at, status')
            .order('created_at', { ascending: false })
            .limit(10),
        ]);

      setStats({
        products: productsRes.count || 0,
        enquiries: enquiriesRes.count || 0,
        newEnquiries: newEnquiriesRes.count || 0,
        categories: categoriesRes.count || 0,
        gallery: galleryRes.count || 0,
      });

      if (recentRes.data) setRecentEnquiries(recentRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    {
      name: 'Total Products',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      name: 'Total Enquiries',
      value: stats.enquiries,
      icon: Mail,
      color: 'bg-green-500',
      link: '/admin/enquiries',
      badge: stats.newEnquiries > 0 ? `${stats.newEnquiries} New` : undefined,
    },
    {
      name: 'Categories',
      value: stats.categories,
      icon: FolderTree,
      color: 'bg-purple-500',
      link: '/admin/categories',
    },
    {
      name: 'Gallery Images',
      value: stats.gallery,
      icon: Image,
      color: 'bg-orange-500',
      link: '/admin/gallery',
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-900">Dashboard</h1>
        <p className="text-dark-500 mt-1">Welcome to your admin dashboard</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.name}
                to={card.link}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {card.badge && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-dark-500 text-sm mb-1">{card.name}</h3>
                <p className="font-heading text-3xl font-bold text-dark-900">{card.value}</p>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-dark-200 flex justify-between items-center">
            <h2 className="font-heading font-semibold text-lg text-dark-900">Recent Enquiries</h2>
            <Link
              to="/admin/enquiries"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Phone</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-dark-400">
                      No enquiries yet
                    </td>
                  </tr>
                ) : (
                  recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-dark-50">
                      <td className="px-6 py-4 text-dark-900">{enquiry.full_name}</td>
                      <td className="px-6 py-4 text-dark-600">{enquiry.phone}</td>
                      <td className="px-6 py-4 text-dark-600">{enquiry.product_category || '-'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            enquiry.status === 'new'
                              ? 'bg-blue-100 text-blue-700'
                              : enquiry.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {enquiry.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-dark-500 text-sm">
                        {formatDate(enquiry.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-dark-200">
            <h2 className="font-heading font-semibold text-lg text-dark-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Add New Product</span>
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <FolderTree className="w-5 h-5" />
              <span className="font-medium">Manage Categories</span>
            </Link>
            <Link
              to="/admin/gallery"
              className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <Image className="w-5 h-5" />
              <span className="font-medium">Upload Gallery Images</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Update Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
