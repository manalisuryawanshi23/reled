import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Building2, CheckCircle, Zap } from 'lucide-react';
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
    <main className="min-h-screen bg-white">
      <section className="bg-dark-950 text-white py-16">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-dark-400 mb-4">
            <Link to="/" className="hover:text-accent-400 transition-colors">Home</Link>
            <span className="text-accent-400"> / About Us</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">About {settings?.company_name || 'LedPrisha'}</h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                {settings?.about_image_url ? (
                  <img
                    src={settings.about_image_url}
                    alt={`About ${settings?.company_name || 'LedPrisha'}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt={`About ${settings?.company_name || 'LedPrisha'}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-xl hidden md:flex">
                <div className="text-center text-white">
                  <div className="font-heading text-4xl font-bold">{settings.years_experience}+</div>
                  <div className="text-sm">Years</div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-accent-500 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark-900 mt-2 mb-6">
                Illuminating India Since Inception
              </h2>
              <p className="text-dark-600 text-lg leading-relaxed mb-6">
                {settings.about_text || `${settings.company_name} is a leading manufacturer and supplier of premium LED lighting solutions. We specialize in indoor, outdoor, architectural, and industrial lighting systems designed to meet the highest standards of quality, efficiency, and aesthetics.`}
              </p>
              <p className="text-dark-500 leading-relaxed mb-8">
                Over the years, we have established ourselves as a trusted partner for businesses across India, delivering innovative lighting solutions that combine cutting-edge technology with exceptional craftsmanship. Our commitment to quality and customer satisfaction has earned us a reputation for excellence in the industry.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {settings.iso_certified && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-dark-700 font-medium">ISO Certified</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-dark-700 font-medium">BIS Approved</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-dark-700 font-medium">Energy Star</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-dark-700 font-medium">CE Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark-900 mb-4">
              Our Achievements
            </h2>
            <p className="text-dark-500 text-lg max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div ref={years.ref} className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent-500" />
              </div>
              <div className="font-heading text-4xl font-bold text-dark-900 mb-2">{years.count}+</div>
              <div className="text-dark-500">Years Experience</div>
            </div>
            <div ref={projects.ref} className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-accent-500" />
              </div>
              <div className="font-heading text-4xl font-bold text-dark-900 mb-2">{projects.count}+</div>
              <div className="text-dark-500">Projects Completed</div>
            </div>
            <div ref={clients.ref} className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent-500" />
              </div>
              <div className="font-heading text-4xl font-bold text-dark-900 mb-2">{clients.count}+</div>
              <div className="text-dark-500">Happy Clients</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent-500" />
              </div>
              <div className="font-heading text-4xl font-bold text-dark-900 mb-2">1000+</div>
              <div className="text-dark-500">Products Range</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-accent-500 font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark-900 mt-2">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="p-6 bg-dark-50 rounded-xl hover:shadow-lg transition-shadow">
                <h3 className="font-heading font-semibold text-xl text-dark-900 mb-3">{value.title}</h3>
                <p className="text-dark-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="section-padding bg-dark-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-accent-500 font-semibold text-sm uppercase tracking-wider">Leadership</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-dark-900 mt-2">
                Meet Our Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-dark-900">{member.name}</h3>
                  <p className="text-accent-500 text-sm mb-2">{member.designation}</p>
                  {member.bio && <p className="text-dark-500 text-sm">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
