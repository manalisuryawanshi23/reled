import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ArrowLeft, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product, Category, Subcategory } from '../../lib/types';
import { ImageUploadField } from '../../components/ImageUploadField';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(id, name, slug), subcategory:subcategories(id, name, slug)')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    await supabase.from('products').update({ status: newStatus }).eq('id', product.id);
    fetchProducts();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Products</h1>
          <p className="text-dark-500 mt-1">Manage your product catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-dark-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field w-full md:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Created</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <span className="loader" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-dark-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-dark-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.cover_image_url || product.images[0] ? (
                            <img
                              src={product.cover_image_url || product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-dark-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark-900">{product.name}</p>
                          {product.short_description && (
                            <p className="text-dark-500 text-sm truncate max-w-xs">
                              {product.short_description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-600">{product.category?.name || '-'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {product.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-dark-500 text-sm">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-dark-500 hover:text-primary-500 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-dark-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    subcategory_id: '',
    short_description: '',
    full_description: '',
    specifications: {} as Record<string, string>,
    images: [] as string[],
    cover_image_url: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchCategories();
    if (id) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data);
    const subData = await supabase.from('subcategories').select('*').order('sort_order');
    if (subData.data) setSubcategories(subData.data);
  };

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(id), subcategory:subcategories(id)')
      .eq('id', id)
      .single();
    if (data) setFormData(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [newSpecKey]: newSpecValue },
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const specs = { ...prev.specifications };
      delete specs[key];
      return { ...prev, specifications: specs };
    });
  };

  const addImage = () => {
    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
        cover_image_url: prev.cover_image_url || imageUrl,
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images,
        cover_image_url: prev.cover_image_url === prev.images[index] ? images[0] || '' : prev.cover_image_url,
      };
    });
  };

  const setCoverImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, cover_image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { category, subcategory, ...rest } = formData;
    const payload = {
      ...rest,
      subcategory_id: formData.subcategory_id || null,
    };

    let error;
    if (id) {
      ({ error } = await supabase.from('products').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('products').insert([payload]));
    }

    if (error) {
      alert('Error saving product: ' + error.message);
    } else {
      navigate('/admin/products');
    }
    setLoading(false);
  };

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === formData.category_id
  );

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-500 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="font-heading text-3xl font-bold text-dark-900">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Product Name *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field flex-1"
                      required
                    />
                    <button type="button" onClick={generateSlug} className="btn-secondary">
                      Generate Slug
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">Slug *</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input-field" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Category</label>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} className="input-field">
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Subcategory</label>
                    <select name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} className="input-field">
                      <option value="">Select subcategory</option>
                      {filteredSubcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="input-label">Short Description</label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>
                <div>
                  <label className="input-label">Full Description</label>
                  <textarea
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleChange}
                    rows={5}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-3 bg-dark-50 rounded-lg">
                    <span className="font-medium text-dark-700 w-1/3">{key}</span>
                    <span className="text-dark-500 flex-1">{value}</span>
                    <button type="button" onClick={() => removeSpecification(key)} className="text-red-500 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g., Wattage)"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 50W)"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    className="input-field flex-1"
                  />
                  <button type="button" onClick={addSpecification} className="btn-secondary">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Images</h2>
              <div className="space-y-4">
                {/* Cover image quick upload */}
                <ImageUploadField
                  label="Cover Image"
                  value={formData.cover_image_url}
                  onChange={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      cover_image_url: url,
                      images: url && !prev.images.includes(url) ? [...prev.images, url] : prev.images,
                    }));
                  }}
                />

                {/* Additional images */}
                {formData.images.filter(img => img !== formData.cover_image_url).length > 0 && (
                  <div>
                    <p className="input-label mb-2">Additional Images</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formData.images.map((img, index) => (
                        img !== formData.cover_image_url && (
                          <div key={index} className="relative group aspect-square bg-dark-100 rounded-lg overflow-hidden">
                            <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-dark-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setCoverImage(img)}
                                className="px-2 py-1 text-xs rounded bg-white text-dark-900 font-medium"
                              >
                                Set Cover
                              </button>
                              <button type="button" onClick={() => removeImage(index)} className="p-1 bg-red-500 text-white rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Add extra image via URL */}
                <div>
                  <p className="input-label mb-2">Add More Images (URL)</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Additional image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="input-field flex-1 text-sm"
                    />
                    <button type="button" onClick={addImage} className="btn-secondary flex items-center gap-2 text-sm">
                      <Upload className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Publish</h2>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
