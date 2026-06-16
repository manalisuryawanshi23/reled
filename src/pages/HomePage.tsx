import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { AboutSection } from '../components/AboutSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { SectorsSection } from '../components/SectorsSection';
import { FAQSection } from '../components/FAQSection';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <AboutSection />
      <SectorsSection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  );
}
