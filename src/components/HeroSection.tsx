import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight, Play } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const defaultSlides = [
  {
    image_url: 'https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=1920',
    headline: 'Illuminate Your World',
    subheadline: 'Premium LED lighting solutions crafted for modern spaces',
    cta_text: 'Explore Products',
    cta_link: '/products',
  },
  {
    image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920',
    headline: 'Architectural Excellence',
    subheadline: 'Transform buildings into stunning visual experiences',
    cta_text: 'View Solutions',
    cta_link: '/products/category/architectural',
  },
  {
    image_url: 'https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=1920',
    headline: 'Industrial Strength',
    subheadline: 'Reliable lighting for the most demanding environments',
    cta_text: 'Learn More',
    cta_link: '/sectors',
  },
];

export function HeroSection() {
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slides = settings.hero_slides?.length > 0 ? settings.hero_slides : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <section className="relative h-[75vh] sm:h-[85vh] min-h-[560px] md:min-h-[700px] overflow-hidden bg-charcoal-950">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(${slide.image_url})`,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
              transition: 'transform 8s ease-out',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/70 to-charcoal-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent opacity-80" />
        </div>
      ))}

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-royal-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative h-full container-wide flex items-center">
        <div className="max-w-2xl pt-16 md:pt-20">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 absolute invisible'
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-5 md:mb-8">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-white/80 text-xs md:text-sm font-medium tracking-wide">Premium LED Solutions</span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 md:mb-6">
                {slide.headline.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-gradient-primary">{slide.headline.split(' ').pop()}</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-7 md:mb-10 leading-relaxed max-w-xl">
                {slide.subheadline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to={slide.cta_link} className="btn-primary group">
                  {slide.cta_text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/gallery" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-charcoal-900">
                  <Play className="w-4 h-4" />
                  View Projects
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="hidden xl:block absolute bottom-32 right-8">
          <div className="flex gap-8">
            <div className="text-center px-6 py-4 border-r border-white/10 last:border-0">
              <div className="font-heading text-4xl font-bold text-white mb-1">{settings.years_experience || 10}+</div>
              <div className="text-slate-400 text-sm">Years Experience</div>
            </div>
            <div className="text-center px-6 py-4 border-r border-white/10 last:border-0">
              <div className="font-heading text-4xl font-bold text-white mb-1">{settings.projects_completed || 500}+</div>
              <div className="text-slate-400 text-sm">Projects Complete</div>
            </div>
            <div className="text-center px-6 py-4">
              <div className="font-heading text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-slate-400 text-sm">Quality Assured</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary-500'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs tracking-widest uppercase rotate-90 origin-center translate-y-8">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
