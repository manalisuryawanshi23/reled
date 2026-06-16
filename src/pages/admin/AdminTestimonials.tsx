import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Testimonial } from '../../lib/types';

export function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    company_name: '',
    testimonial_text: '',
    star_rating: 5,
    photo_url: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    if (data) setTestimonials(data);
    setLoading(false);
  };

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        customer_name: item.customer_name,
        company_name: item.company_name || '',
        testimonial_text: item.testimonial_text,
        star_rating: item.star_rating,
        photo_url: item.photo_url || '',
        sort_order: item.sort_order,
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({ customer_name: '', company_name: '', testimonial_text: '', star_rating: 5, photo_url: '', sort_order: 0, is_active: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error;
    if (editingItem) {
      ({ error } = await supabase.from('testimonials').update(formData).eq('id', editingItem.id));
    } else {
      ({ error } = await supabase.from('testimonials').insert([formData]));
    }
    if (!error) { setShowModal(false); fetchTestimonials(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchTestimonials();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Testimonials</h1>
          <p className="text-dark-500 mt-1">Manage customer testimonials</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12"><span className="loader" /></div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center">
            <Star className="w-12 h-12 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-400">No testimonials yet</p>
          </div>
        ) : (
          testimonials.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl shadow-sm p-6 ${!item.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-dark-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.photo_url ? (
                    <img src={item.photo_url} alt={item.customer_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-dark-400">{item.customer_name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-semibold text-dark-900">{item.customer_name}</h3>
                    {item.company_name && <span className="text-dark-500 text-sm">• {item.company_name}</span>}
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < item.star_rating ? 'text-accent-500 fill-accent-500' : 'text-dark-300'}`} />
                    ))}
                  </div>
                  <p className="text-dark-600 text-sm line-clamp-3">{item.testimonial_text}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(item)} className="p-2 text-dark-500 hover:text-accent-500"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-dark-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
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
              <h2 className="font-heading font-semibold text-xl">{editingItem ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="input-label">Customer Name *</label>
                <input type="text" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Company Name</label>
                <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="input-label">Testimonial *</label>
                <textarea value={formData.testimonial_text} onChange={e => setFormData({...formData, testimonial_text: e.target.value})} className="input-field resize-none" rows={4} required />
              </div>
              <div>
                <label className="input-label">Star Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(r => (
                    <button key={r} type="button" onClick={() => setFormData({...formData, star_rating: r})} className="p-1">
                      <Star className={`w-6 h-6 ${r <= formData.star_rating ? 'text-accent-500 fill-accent-500' : 'text-dark-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="input-label">Photo URL</label>
                <input type="text" value={formData.photo_url} onChange={e => setFormData({...formData, photo_url: e.target.value})} className="input-field" placeholder="https://..." />
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
