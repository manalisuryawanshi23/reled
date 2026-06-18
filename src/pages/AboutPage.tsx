import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Building2, CheckCircle, Zap, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { TeamMember } from '../lib/types';

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

export function AboutPage() {
  const { settings } = useSettings();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const years = useCountUp(settings.years_experience || 10);
  const projects = useCountUp(settings.projects_completed || 500);
  const clients = useCountUp(200);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchTeam = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (data) setTeam(data);
    };
    fetchTeam();
  }, []);

  const values = [
    { title: 'Quality First', description: 'We never compromise on quality. Every product undergoes rigorous testing before reaching our customers.' },
    { title: 'Innovation Driven', description: 'Constantly pushing boundaries to bring the latest LED technology to the Indian market.' },
    { title: 'Customer Focus', description: 'Building long-term relationships through exceptional service and support.' },
    { title: 'Sustainability', description: 'Committed to energy-efficient solutions that reduce carbon footprint.' },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-charcoal-950 text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/80 to-transparent" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl" />
        </div>
        <div className="container-wide relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-sm flex-wrap">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-400">About Us</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-charcoal-900" />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                About {settings?.company_name || 'RELED'}
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-xl">
                Leading manufacturer of premium LED lighting solutions for commercial, industrial, and architectural applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-premium-lg">
                <img
                  src={settings?.about_image_url || 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={`About ${settings?.company_name || 'RELED'}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary hidden md:flex">
                <div className="text-center text-charcoal-900">
                  <div className="font-heading text-3xl font-bold">{settings.years_experience || 10}+</div>
                  <div className="text-xs font-semibold uppercase tracking-wide">Years</div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal-900 mb-5">
                Illuminating India Since Inception
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-5">
                {settings.about_text || `${settings.company_name} is a leading manufacturer and supplier of premium LED lighting solutions. We specialize in indoor, outdoor, architectural, and industrial lighting systems designed to meet the highest standards of quality, efficiency, and aesthetics.`}
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Over the years, we have established ourselves as a trusted partner for businesses across India, delivering innovative lighting solutions that combine cutting-edge technology with exceptional craftsmanship.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {settings.iso_certified && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-charcoal-700 font-medium text-sm">ISO Certified</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-charcoal-700 font-medium text-sm">BIS Approved</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-charcoal-700 font-medium text-sm">Energy Star</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-charcoal-700 font-medium text-sm">CE Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section bg-charcoal-950">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-wider mb-3">Our Achievements</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              Numbers That Speak for Themselves
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { ref: years.ref, count: years.count, label: 'Years Experience', icon: <Award className="w-6 h-6" />, suffix: '+' },
              { ref: projects.ref, count: projects.count, label: 'Projects Completed', icon: <Building2 className="w-6 h-6" />, suffix: '+' },
              { ref: clients.ref, count: clients.count, label: 'Happy Clients', icon: <Users className="w-6 h-6" />, suffix: '+' },
              { ref: null, count: 1000, label: 'Products Range', icon: <Zap className="w-6 h-6" />, suffix: '+' },
            ].map(({ ref, count, label, icon, suffix }, i) => (
              <div
                key={i}
                ref={ref}
                className="text-center p-6 md:p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-400">
                  {icon}
                </div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-white mb-1">{count}{suffix}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">What We Stand For</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-card transition-all">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <span className="font-heading font-bold text-charcoal-900 text-sm">0{index + 1}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-charcoal-900 mb-3">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Leadership</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">
                Meet Our Team
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {team.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 rounded-2xl overflow-hidden shadow-card border-2 border-transparent group-hover:border-primary-400 transition-all">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-charcoal-800 to-charcoal-900 flex items-center justify-center text-white text-3xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-charcoal-900">{member.name}</h3>
                  <p className="text-primary-600 text-sm mb-1 font-medium">{member.designation}</p>
                  {member.bio && <p className="text-slate-500 text-xs leading-relaxed">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
