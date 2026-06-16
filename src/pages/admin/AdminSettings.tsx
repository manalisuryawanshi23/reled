import React, { useEffect, useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../context/SettingsContext';
import type { Settings } from '../../lib/types';

export function AdminSettings() {
  const { settings: contextSettings, refreshSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<Partial<Settings>>({});

  useEffect(() => {
    setFormData(contextSettings || {});
  }, [contextSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.from('settings').update(formData).eq('id', 1);
    await refreshSettings();

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-dark-900">Settings</h1>
        <p className="text-dark-500 mt-1">Manage company information and website settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Company Name</label>
              <input type="text" name="company_name" value={formData.company_name || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Tagline</label>
              <input type="text" name="tagline" value={formData.tagline || ''} onChange={handleChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="input-label">Address</label>
              <textarea name="address" value={formData.address || ''} onChange={handleChange} className="input-field resize-none" rows={2} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Primary Phone</label>
              <input type="text" name="phone_1" value={formData.phone_1 || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Secondary Phone</label>
              <input type="text" name="phone_2" value={formData.phone_2 || ''} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">WhatsApp Number</label>
              <input type="text" name="whatsapp_number" value={formData.whatsapp_number || ''} onChange={handleChange} className="input-field" placeholder="+919876543210" />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Facebook URL</label>
              <input type="text" name="facebook_url" value={formData.facebook_url || ''} onChange={handleChange} className="input-field" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="input-label">Instagram URL</label>
              <input type="text" name="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} className="input-field" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="input-label">YouTube URL</label>
              <input type="text" name="youtube_url" value={formData.youtube_url || ''} onChange={handleChange} className="input-field" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="input-label">LinkedIn URL</label>
              <input type="text" name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} className="input-field" placeholder="https://linkedin.com/..." />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">About Section</h2>
          <div className="space-y-6">
            <div>
              <label className="input-label">About Text</label>
              <textarea name="about_text" value={formData.about_text || ''} onChange={handleChange} className="input-field resize-none" rows={4} />
            </div>
            <div>
              <label className="input-label">About Image URL</label>
              <input type="text" name="about_image_url" value={formData.about_image_url || ''} onChange={handleChange} className="input-field" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="input-label">Years Experience</label>
                <input type="number" name="years_experience" value={formData.years_experience || 0} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="input-label">Projects Completed</label>
                <input type="number" name="projects_completed" value={formData.projects_completed || 0} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold text-lg text-dark-900 mb-4">Google Maps</h2>
          <div>
            <label className="input-label">Google Maps Embed URL</label>
            <input type="text" name="google_maps_url" value={formData.google_maps_url || ''} onChange={handleChange} className="input-field" placeholder="https://www.google.com/maps/embed?..." />
            <p className="text-dark-400 text-sm mt-1">Get the embed URL from Google Maps (Share &gt; Embed a map)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-5 h-5" /> Saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
