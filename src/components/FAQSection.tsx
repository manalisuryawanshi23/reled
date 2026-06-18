import React, { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { FAQ } from '../lib/types';

const defaultFAQs: FAQ[] = [
  {
    id: '1',
    question: 'What warranty do you offer on your LED products?',
    answer: 'We offer a comprehensive warranty ranging from 2 to 5 years depending on the product category. All our products come with guaranteed performance and dedicated after-sales support.',
    sort_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'Do you provide installation services?',
    answer: 'Yes, we have a network of certified installation partners across the country. We can provide end-to-end solutions from product selection to installation and commissioning.',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'What is the typical lifespan of your LED lights?',
    answer: 'Our LED products are designed to last 50,000 to 100,000 hours depending on the product type. This translates to approximately 10-15 years of normal usage with minimal maintenance.',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    question: 'Can I get custom lighting solutions for my project?',
    answer: 'Absolutely! We specialize in custom lighting solutions. Our team of engineers can design and manufacture products tailored to your specific requirements, including custom specifications, colors, and form factors.',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (!error && data && data.length > 0) setFaqs(data);
      else setFaqs(defaultFAQs);
      setLoading(false);
    };
    fetchFAQs();
  }, []);

  if (loading || faqs.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 text-sm font-semibold tracking-wide uppercase">FAQ</span>
          </div>
          <h2 className="font-heading text-heading-1 text-charcoal-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-body-lg">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? 'border-primary-300 shadow-primary'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-gradient-primary text-charcoal-900'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className={`font-heading font-semibold transition-colors ${
                    openIndex === index ? 'text-charcoal-900' : 'text-charcoal-800'
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-primary-100 text-primary-600 rotate-180'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
