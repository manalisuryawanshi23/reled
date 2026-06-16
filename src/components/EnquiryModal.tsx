import React, { useState } from 'react';
import { X, Send, CheckCircle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EnquiryModalProps {
  productName?: string;
  onClose: () => void;
}

export function EnquiryModal({ productName, onClose }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    product_name: productName || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-charcoal-950/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-premium-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
              <Send className="w-5 h-5 text-charcoal-900" />
            </div>
            <h2 className="font-heading text-xl font-bold text-charcoal-900">Send Enquiry</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-charcoal-900 mb-3">
              Thank You!
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Your enquiry has been submitted successfully. Our team will contact you shortly.
            </p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              <label className="input-label">Product Name</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Product interested in"
              />
            </div>

            <div>
              <label className="input-label">Message / Requirements</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
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
  );
}
