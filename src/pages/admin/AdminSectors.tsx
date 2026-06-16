import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Building2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Sector } from '../../lib/types';

export function AdminSectors() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon_url: '',
    image_url: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => { fetchSectors(); }, []);

  const fetchSectors = async () => {
    setLoading(true);
    const { data } = await supabase.from('sectors').select('*').order('sort_order');
    if (data) setSectors(data);
    setLoading(false);
  };

  const openModal = (item?: Sector) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        slug: item.slug,
        short_description: item.short_description || '',
        full_description: item.full_description || '',
        icon_url: item.icon_url || '',
        image_url: item.image_url || '',
        sort_order: item.sort_order,
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', slug: '', short_description: '', full_description: '', icon_url: '', image_url: '', sort_order: 0, is_active: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error;
    if (editingItem) {
      ({ error } = await supabase.from('sectors').update(formData).eq('id', editingItem.id));
    } else {
      ({ error } = await supabase.from('sectors').insert([formData]));
    }
    if (!error) { setShowModal(false); fetchSectors(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sector?')) return;
    await supabase.from('sectors').delete().eq('id', id);
    fetchSectors();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Sectors</h1>
          <p className="text-dark-500 mt-1">Manage business sectors and applications</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Sector
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12"><span className="loader" /></div>
        ) : sectors.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
            <Building2 className="w-12 h-12 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-400">No sectors yet</p>
          </div>
        ) : (
          sectors.map((sector) => (
            <div key={sector.id} className={`bg-white rounded-xl shadow-sm overflow-hidden ${!sector.is_active ? 'opacity-60' : ''}`}>
              <div className="aspect-video bg-dark-100">
                {sector.image_url ? (
                  <img src={sector.image_url} alt={sector.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-dark-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-dark-900 mb-1">{sector.name}</h3>
                <p className="text-dark-500 text-sm line-clamp-2">{sector.short_description}</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-dark-100">
                  <span className="text-dark-400 text-xs">Sort: {sector.sort_order}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(sector)} className="p-2 text-dark-500 hover:text-accent-500"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(sector.id)} className="p-2 text-dark-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-200 flex justify-between items-center">
              <h2 className="font-heading font-semibold text-xl">{editingItem ? 'Edit' : 'Add'} Sector</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})} className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Slug *</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="input-field" required />
                </div>
              </div>
              <div>
                <label className="input-label">Short Description</label>
                <input type="text" value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="input-label">Full Description</label>
                <textarea value={formData.full_description} onChange={e => setFormData({...formData, full_description: e.target.value})} className="input-field resize-none" rows={4} />
              </div>
              <div>
                <label className="input-label">Image URL</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="input-label">Sort Order</label>
                <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} className="input-field" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 accent-accent-500" />
                <span className="text-dark-700">Active</span>
              </label>
              <button type="submit" className="btn-primary w-full">{editingItem ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
