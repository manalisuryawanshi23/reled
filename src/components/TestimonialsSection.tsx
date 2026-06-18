import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../lib/types';

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    customer_name: 'Rajesh Kumar',
    company_name: 'Modern Industries Pvt Ltd',
    testimonial_text: 'RELED transformed our factory with their industrial lighting solutions. Energy savings exceeded our expectations.',
    star_rating: 5,
    is_active: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    customer_name: 'Priya Sharma',
    company_name: 'Urban Mall Development',
    testimonial_text: 'Outstanding quality and service. The architectural lighting brought our mall to life.',
    star_rating: 5,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    customer_name: 'Amit Patel',
    company_name: 'GreenTech Infrastructure',
    testimonial_text: 'Professional team, premium products. Our street lighting project was delivered on time and within budget.',
    star_rating: 5,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (data && data.length > 0) setTestimonials(data);
      else setTestimonials(defaultTestimonials);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  if (testimonials.length === 0) return null;

  return (
    <section className="section-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-royal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10" ref={containerRef}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Testimonials</span>
          </div>
          <h2 className="font-heading text-heading-1 text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-slate-400 text-body-lg max-w-2xl mx-auto">
            Trusted by leading businesses across India for premium lighting solutions
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary rotate-12">
            <Quote className="w-8 h-8 text-charcoal-900 -rotate-12" />
          </div>

          <div className="overflow-hidden pt-8">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-charcoal-900/50 backdrop-blur-lg border border-charcoal-800 rounded-3xl p-8 md:p-12 relative">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.star_rating
                              ? 'text-primary-500 fill-primary-500'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl text-white text-center leading-relaxed mb-8 font-medium">
                      "{testimonial.testimonial_text}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex flex-col items-center">
                      {testimonial.photo_url ? (
                        <img
                          src={testimonial.photo_url}
                          alt={testimonial.customer_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary-500 mb-4"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-charcoal-900 mb-4">
                          {testimonial.customer_name.charAt(0)}
                        </div>
                      )}
                      <h4 className="font-heading font-semibold text-lg text-white">{testimonial.customer_name}</h4>
                      {testimonial.company_name && (
                        <p className="text-slate-400 text-sm">{testimonial.company_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/10"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/10"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary-500'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
