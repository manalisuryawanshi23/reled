import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Category, Subcategory } from '../../lib/types';
import { ImageUploadField } from '../../components/ImageUploadField';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    sort_order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [catRes, subRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('subcategories').select('*').order('sort_order'),
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (subRes.data) setSubcategories(subRes.data);
    setLoading(false);
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image_url: category.image_url || '',
        sort_order: category.sort_order,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', image_url: '', sort_order: 0 });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      is_active: true,
    };

    let error;
    if (editingCategory) {
      ({ error } = await supabase.from('categories').update(payload).eq('id', editingCategory.id));
    } else {
      ({ error } = await supabase.from('categories').insert([payload]));
    }

    if (!error) {
      setShowModal(false);
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Categories</h1>
          <p className="text-dark-500 mt-1">Manage product categories and subcategories</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Subcategories</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Sort</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center"><span className="loader" /></td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-dark-400">No categories found</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-dark-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-dark-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-dark-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-dark-900">{cat.name}</p>
                          <p className="text-dark-500 text-sm">{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-dark-600">{subcategories.filter(s => s.category_id === cat.id).length}</span>
                    </td>
                    <td className="px-6 py-4 text-dark-500">{cat.sort_order}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(cat)} className="p-2 text-dark-500 hover:text-accent-500">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-dark-500 hover:text-red-500">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-200">
              <h2 className="font-heading font-semibold text-xl">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="input-label">Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Slug *</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none" rows={3} />
              </div>
              <ImageUploadField
                label="Category Image"
                value={formData.image_url}
                onChange={(url) => setFormData({...formData, image_url: url})}
              />
              <div>
                <label className="input-label">Sort Order</label>
                <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} className="input-field" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminSubcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    description: '',
    parent_id: '',
    image_url: '',
    sort_order: 0,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [subRes, catRes] = await Promise.all([
      supabase.from('subcategories').select('*').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (subRes.data) setSubcategories(subRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  };

  const openModal = (sub?: Subcategory) => {
    if (sub) {
      setEditingSubcategory(sub);
      setFormData({
        name: sub.name,
        slug: sub.slug,
        category_id: sub.category_id,
        description: sub.description || '',
        parent_id: sub.parent_id || '',
        image_url: sub.image_url || '',
        sort_order: sub.sort_order,
      });
    } else {
      setEditingSubcategory(null);
      setFormData({
        name: '',
        slug: '',
        category_id: '',
        description: '',
        parent_id: '',
        image_url: '',
        sort_order: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parent_id: formData.parent_id || null,
      image_url: formData.image_url || null,
      is_active: true,
    };
    let error;
    if (editingSubcategory) {
      ({ error } = await supabase.from('subcategories').update(payload).eq('id', editingSubcategory.id));
    } else {
      ({ error } = await supabase.from('subcategories').insert([payload]));
    }
    if (!error) { setShowModal(false); fetchData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subcategory?')) return;
    await supabase.from('subcategories').delete().eq('id', id);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Subcategories</h1>
          <p className="text-dark-500 mt-1">Manage product subcategories</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Subcategory
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <table className="w-full">
          <thead className="bg-dark-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Subcategory</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Parent Subcategory</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Sort</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center"><span className="loader" /></td></tr>
            ) : subcategories.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-dark-400">No subcategories found</td></tr>
            ) : (
              subcategories.map(sub => (
                <tr key={sub.id} className="hover:bg-dark-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-dark-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {sub.image_url ? (
                          <img src={sub.image_url} alt={sub.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-dark-400 font-semibold uppercase">No img</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-dark-900">{sub.name}</p>
                        <p className="text-dark-500 text-sm">{sub.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-600">{(sub as any).category?.name || '-'}</td>
                  <td className="px-6 py-4 text-dark-600">{(sub as any).parent?.name || '-'}</td>
                  <td className="px-6 py-4 text-dark-500">{sub.sort_order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(sub)} className="p-2 text-dark-500 hover:text-accent-500"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(sub.id)} className="p-2 text-dark-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-200">
              <h2 className="font-heading font-semibold text-xl">{editingSubcategory ? 'Edit' : 'Add'} Subcategory</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="input-label">Category *</label>
                <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value, parent_id: ''})} className="input-field" required>
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              {formData.category_id && (
                <div>
                  <label className="input-label">Parent Subcategory (Optional)</label>
                  <select value={formData.parent_id} onChange={e => setFormData({...formData, parent_id: e.target.value})} className="input-field">
                    <option value="">None (Top-Level Subcategory)</option>
                    {subcategories
                      .filter(s => s.category_id === formData.category_id && s.id !== editingSubcategory?.id && !s.parent_id)
                      .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="input-label">Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Slug *</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Description (Optional)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none" rows={2} />
              </div>
              <ImageUploadField
                label="Subcategory Image (Optional)"
                value={formData.image_url}
                onChange={(url) => setFormData({...formData, image_url: url})}
              />
              <div>
                <label className="input-label">Sort Order</label>
                <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} className="input-field" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingSubcategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
