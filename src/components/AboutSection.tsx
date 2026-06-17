import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Building2, Users, CheckCircle, ArrowRight, Zap, Shield, Target } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

export function AboutSection() {
  const { settings } = useSettings();
  const years = useCountUp(settings.years_experience || 10);
  const projects = useCountUp(settings.projects_completed || 500);
  const clients = useCountUp(200);

  const features = [
    { icon: Shield, label: 'ISO Certified', value: '9001:2015' },
    { icon: Award, label: 'BIS Approved', value: 'Quality' },
    { icon: Target, label: 'CE Certified', value: 'Standard' },
  ];

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="relative z-10">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-premium-xl">
                {settings?.about_image_url ? (
                  <img
                    src={settings.about_image_url}
                    alt={`About ${settings?.company_name || 'RELED'}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt={`About ${settings?.company_name || 'RELED'}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 z-20 bg-gradient-gold rounded-2xl shadow-gold-lg p-6 hidden lg:block">
              <div className="text-charcoal-900">
                <div className="font-heading text-4xl font-bold">{settings.years_experience || 10}+</div>
                <div className="text-charcoal-700 font-medium">Years of Excellence</div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-slate-100 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-100 rounded-3xl -z-10" />

            {/* Certification Badges */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-premium flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-gold-600" />
                  <span className="text-xs font-semibold text-charcoal-800">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Column */}
          <div>
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full mb-6">
              <Zap className="w-4 h-4 text-gold-600" />
              <span className="text-gold-700 text-sm font-semibold tracking-wide uppercase">About Us</span>
            </div>

            <h2 className="font-heading text-heading-1 text-charcoal-900 mb-6">
              Illuminating India with
              <span className="text-gradient-gold block">Premium LED Solutions</span>
            </h2>

            <p className="text-slate-600 text-body-lg leading-relaxed mb-8">
              {settings.about_text || `${settings.company_name} is a leading manufacturer and supplier of premium LED lighting solutions. We specialize in indoor, outdoor, architectural, and industrial lighting systems designed to meet the highest standards of quality, efficiency, and aesthetics.`}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div ref={years.ref} className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className="font-heading text-3xl font-bold text-charcoal-900 mb-1">{years.count}+</div>
                <div className="text-slate-500 text-sm font-medium">Years Experience</div>
              </div>
              <div ref={projects.ref} className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className="font-heading text-3xl font-bold text-charcoal-900 mb-1">{projects.count}+</div>
                <div className="text-slate-500 text-sm font-medium">Projects Completed</div>
              </div>
              <div ref={clients.ref} className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className="font-heading text-3xl font-bold text-charcoal-900 mb-1">{clients.count}+</div>
                <div className="text-slate-500 text-sm font-medium">Happy Clients</div>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {['Energy Efficient', 'Long Lasting', 'Eco-Friendly', 'Cost Effective'].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn-primary group">
              Learn More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
