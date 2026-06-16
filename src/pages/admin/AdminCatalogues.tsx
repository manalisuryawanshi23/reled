import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FileText, X, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Catalogue } from '../../lib/types';

export function AdminCatalogues() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState<Catalogue | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pdf_url: '',
    thumbnail_url: '',
    is_active: true,
  });

  useEffect(() => { fetchCatalogues(); }, []);

  const fetchCatalogues = async () => {
    setLoading(true);
    const { data } = await supabase.from('catalogues').select('*').order('created_at', { ascending: false });
    if (data) setCatalogues(data);
    setLoading(false);
  };

  const openModal = (catalogue?: Catalogue) => {
    if (catalogue) {
      setEditingCatalogue(catalogue);
      setFormData({
        title: catalogue.title,
        description: catalogue.description || '',
        category: catalogue.category || '',
        pdf_url: catalogue.pdf_url,
        thumbnail_url: catalogue.thumbnail_url || '',
        is_active: catalogue.is_active,
      });
    } else {
      setEditingCatalogue(null);
      setFormData({ title: '', description: '', category: '', pdf_url: '', thumbnail_url: '', is_active: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error;
    if (editingCatalogue) {
      ({ error } = await supabase.from('catalogues').update(formData).eq('id', editingCatalogue.id));
    } else {
      ({ error } = await supabase.from('catalogues').insert([formData]));
    }
    if (!error) { setShowModal(false); fetchCatalogues(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this catalogue?')) return;
    await supabase.from('catalogues').delete().eq('id', id);
    fetchCatalogues();
  };

  const toggleActive = async (catalogue: Catalogue) => {
    await supabase.from('catalogues').update({ is_active: !catalogue.is_active }).eq('id', catalogue.id);
    fetchCatalogues();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Catalogues</h1>
          <p className="text-dark-500 mt-1">Manage downloadable PDF catalogues</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Catalogue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12"><span className="loader" /></div>
        ) : catalogues.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-12 h-12 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-400">No catalogues yet</p>
          </div>
        ) : (
          catalogues.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video bg-dark-100 flex items-center justify-center">
                {cat.thumbnail_url ? (
                  <img src={cat.thumbnail_url} alt={cat.title} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-12 h-12 text-dark-300" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-dark-900 mb-1">{cat.title}</h3>
                {cat.description && <p className="text-dark-500 text-sm mb-2 line-clamp-2">{cat.description}</p>}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <a href={cat.pdf_url} target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-accent-600 text-sm flex items-center gap-1">
                    View PDF <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-dark-100">
                  <button onClick={() => openModal(cat)} className="flex-1 btn-secondary text-sm">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-200 flex justify-between items-center">
              <h2 className="font-heading font-semibold text-xl">{editingCatalogue ? 'Edit' : 'Add'} Catalogue</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="input-label">Title *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none" rows={3} />
              </div>
              <div>
                <label className="input-label">PDF URL *</label>
                <input type="text" value={formData.pdf_url} onChange={e => setFormData({...formData, pdf_url: e.target.value})} className="input-field" placeholder="https://..." required />
              </div>
              <div>
                <label className="input-label">Thumbnail URL</label>
                <input type="text" value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="input-label">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 accent-accent-500" />
                <span className="text-dark-700">Active</span>
              </label>
              <button type="submit" className="btn-primary w-full">{editingCatalogue ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
