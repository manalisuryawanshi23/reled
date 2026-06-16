import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, HelpCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { FAQ } from '../../lib/types';

export function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', sort_order: 0, is_active: true });

  useEffect(() => { fetchFAQs(); }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    if (data) setFaqs(data);
    setLoading(false);
  };

  const openModal = (item?: FAQ) => {
    if (item) {
      setEditingItem(item);
      setFormData({ question: item.question, answer: item.answer, sort_order: item.sort_order, is_active: item.is_active });
    } else {
      setEditingItem(null);
      setFormData({ question: '', answer: '', sort_order: 0, is_active: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error;
    if (editingItem) {
      ({ error } = await supabase.from('faqs').update(formData).eq('id', editingItem.id));
    } else {
      ({ error } = await supabase.from('faqs').insert([formData]));
    }
    if (!error) { setShowModal(false); fetchFAQs(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchFAQs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">FAQs</h1>
          <p className="text-dark-500 mt-1">Manage frequently asked questions</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12"><span className="loader" /></div>
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HelpCircle className="w-12 h-12 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-400">No FAQs yet</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div key={faq.id} className={`bg-white rounded-xl shadow-sm p-6 ${!faq.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 bg-accent-500/10 text-accent-500 rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    <h3 className="font-heading font-semibold text-dark-900">{faq.question}</h3>
                  </div>
                  <p className="text-dark-600 text-sm ml-11">{faq.answer}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(faq)} className="p-2 text-dark-500 hover:text-accent-500"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2 text-dark-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-200 flex justify-between items-center">
              <h2 className="font-heading font-semibold text-xl">{editingItem ? 'Edit' : 'Add'} FAQ</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="input-label">Question *</label>
                <input type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Answer *</label>
                <textarea value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="input-field resize-none" rows={4} required />
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
