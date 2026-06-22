import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../context/SettingsContext';
import type { Settings } from '../../lib/types';
import { ImageUploadField } from '../../components/ImageUploadField';

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

    // Filter out any completely empty slides before saving
    const cleanedData = { ...formData };
    if (cleanedData.hero_slides) {
      cleanedData.hero_slides = cleanedData.hero_slides.filter(
        slide => slide.image_url || slide.headline || slide.subheadline
      );
    }

    await supabase.from('settings').update(cleanedData).eq('id', 1);
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

  const addSlide = () => {
    setFormData(prev => ({
      ...prev,
      hero_slides: [...(prev.hero_slides || []), { image_url: '', headline: '', subheadline: '', cta_text: '', cta_link: '' }]
    }));
  };

  const removeSlide = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hero_slides: (prev.hero_slides || []).filter((_, i) => i !== index)
    }));
  };

  const updateSlide = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newSlides = [...(prev.hero_slides || [])];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return { ...prev, hero_slides: newSlides };
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-dark-900">Settings</h1>
        <p className="text-dark-500 mt-1">Manage company information and website settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold text-lg text-dark-900 mb-1">Website Logo</h2>
          <p className="text-dark-400 text-sm mb-4">Upload your company logo. It will appear in the Navbar and Footer. Recommended: PNG with transparent background, min 200px height.</p>
          <div className="max-w-sm">
            <ImageUploadField
              label="Logo Image"
              value={formData.logo_url || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
              placeholder="https://..."
            />
          </div>
          {formData.logo_url && (
            <div className="mt-4 p-4 bg-dark-900 rounded-xl inline-flex items-center gap-3">
              <span className="text-dark-400 text-xs">Preview on dark background:</span>
              <img src={formData.logo_url} alt="Logo preview" className="h-10 w-auto object-contain" />
            </div>
          )}
        </div>

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-lg text-dark-900">Hero Slider</h2>
            <button type="button" onClick={addSlide} className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Slide
            </button>
          </div>
          
          <div className="space-y-6">
            {!formData.hero_slides || formData.hero_slides.length === 0 ? (
              <p className="text-dark-500 text-center py-4 bg-dark-50 rounded-lg">No slides configured. Add one to replace the default slides.</p>
            ) : (
              formData.hero_slides.map((slide, index) => (
                <div key={index} className="p-4 border border-dark-200 rounded-lg relative bg-dark-50">
                  <button 
                    type="button" 
                    onClick={() => removeSlide(index)}
                    className="absolute top-4 right-4 p-1.5 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="font-medium text-dark-900 mb-4">Slide {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <ImageUploadField 
                        label="Background Image" 
                        value={slide.image_url} 
                        onChange={(url) => updateSlide(index, 'image_url', url)} 
                      />
                    </div>
                    <div>
                      <label className="input-label">Headline</label>
                      <input type="text" value={slide.headline || ''} onChange={e => updateSlide(index, 'headline', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="input-label">Subheadline</label>
                      <input type="text" value={slide.subheadline || ''} onChange={e => updateSlide(index, 'subheadline', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="input-label">Button Text</label>
                      <input type="text" value={slide.cta_text || ''} onChange={e => updateSlide(index, 'cta_text', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="input-label">Button Link</label>
                      <input type="text" value={slide.cta_link || ''} onChange={e => updateSlide(index, 'cta_link', e.target.value)} className="input-field" placeholder="/products" />
                    </div>
                  </div>
                </div>
              ))
            )}
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
