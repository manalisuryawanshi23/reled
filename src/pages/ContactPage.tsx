import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Zap, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';

export function ContactPage() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    product_category: '',
    message: '',
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('sort_order');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.full_name || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('enquiries').insert([
      {
        ...formData,
        status: 'new',
      },
    ]);

    if (insertError) {
      setError('Failed to submit enquiry. Please try again.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      city: '',
      state: '',
      product_category: '',
      message: '',
    });
  };

  const whatsappUrl = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
        "Hi, I'm interested in your lighting products"
      )}`
    : '#';

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-charcoal-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-sm">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span className="text-primary-400"> / Contact Us</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-charcoal-900" />
            </div>
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
              <p className="text-slate-300 text-lg max-w-2xl">
                Get in touch with us for all your LED lighting needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 mb-8">
                <h3 className="font-heading text-2xl font-bold text-charcoal-900 mb-8">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  {settings.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal-900 mb-1">Address</h4>
                        <p className="text-slate-500">{settings.address}</p>
                      </div>
                    </div>
                  )}
                  {settings.phone_1 && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal-900 mb-1">Phone</h4>
                        <a href={`tel:${settings.phone_1}`} className="text-slate-500 hover:text-primary-600 transition-colors block">
                          {settings.phone_1}
                        </a>
                        {settings.phone_2 && (
                          <a href={`tel:${settings.phone_2}`} className="text-slate-500 hover:text-primary-600 transition-colors block">
                            {settings.phone_2}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {settings.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal-900 mb-1">Email</h4>
                        <a href={`mailto:${settings.email}`} className="text-slate-500 hover:text-primary-600 transition-colors">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 mb-1">Business Hours</h4>
                      <p className="text-slate-500">Mon - Sat: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Google Maps */}
              {settings.google_maps_url && (
                <div className="rounded-3xl overflow-hidden shadow-premium-lg h-80">
                  <iframe
                    src={settings.google_maps_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  />
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8">
                <h3 className="font-heading text-2xl font-bold text-charcoal-900 mb-8">
                  Send us a message
                </h3>

                {success ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h4 className="font-heading text-2xl font-bold text-charcoal-900 mb-3">
                      Thank You!
                    </h4>
                    <p className="text-slate-500 mb-8">
                      Your enquiry has been submitted successfully. We will contact you shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-primary"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="input-label">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="10-digit number"
                          required
                        />
                      </div>
                      <div>
                        <label className="input-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Your city"
                        />
                      </div>
                      <div>
                        <label className="input-label">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Your state"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Product Category</label>
                      <select
                        name="product_category"
                        value={formData.product_category}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="input-label">Message / Requirements</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="input-field resize-none"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="loader-premium" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Enquiry
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
