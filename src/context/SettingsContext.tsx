import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Settings } from '../lib/types';

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  id: 1,
  company_name: 'RELED',
  tagline: 'Illuminating Excellence',
  address: '123 Industrial Area, New Delhi, India',
  phone_1: '+91-9876543210',
  whatsapp_number: '+919876543210',
  email: 'info@reled.com',
  years_experience: 10,
  projects_completed: 500,
  iso_certified: true,
  hero_slides: [],
  updated_at: new Date().toISOString(),
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();

      if (error) throw error;
      setSettings(data || defaultSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
    settings: settings || defaultSettings,
    loading,
    refreshSettings: fetchSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
