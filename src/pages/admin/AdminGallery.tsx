import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { GalleryItem } from '../../lib/types';

export function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', image_url: '', project_name: '' });

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (data) setGallery(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) return;
    await supabase.from('gallery').insert([{ ...formData, is_active: true }]);
    setShowModal(false);
    setFormData({ title: '', category: '', image_url: '', project_name: '' });
    fetchGallery();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    fetchGallery();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Gallery</h1>
          <p className="text-dark-500 mt-1">Manage project gallery images</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Image
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><span className="loader" /></div>
      ) : gallery.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-dark-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No gallery images yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {gallery.map((item) => (
            <div key={item.id} className="group relative aspect-square bg-dark-100 rounded-lg overflow-hidden">
              <img src={item.image_url} alt={item.title || 'Gallery'} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-dark-950 to-transparent">
                  <p className="text-white text-sm truncate">{item.title}</p>
                  {item.category && <p className="text-dark-300 text-xs">{item.category}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-200 flex justify-between items-center">
              <h2 className="font-heading font-semibold text-xl">Add Image</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="input-label">Image URL *</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="input-field" placeholder="https://..." required />
              </div>
              <div>
                <label className="input-label">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="input-label">Category</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field" placeholder="e.g., Indoor Projects" />
              </div>
              <div>
                <label className="input-label">Project Name</label>
                <input type="text" value={formData.project_name} onChange={e => setFormData({...formData, project_name: e.target.value})} className="input-field" />
              </div>
              {formData.image_url && (
                <div className="aspect-video bg-dark-100 rounded-lg overflow-hidden">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <button type="submit" className="btn-primary w-full">Add Image</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
