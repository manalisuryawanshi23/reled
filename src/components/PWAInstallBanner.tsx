import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

type Platform = 'ios' | 'android' | 'desktop' | 'other';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
  if (/android/i.test(ua)) return 'android';
  if (window.innerWidth >= 1024) return 'desktop';
  return 'other';
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
}

export function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    // Don't show if already installed as PWA
    if (isStandalone()) return;

    // Don't show if user dismissed it recently (within 7 days)
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    // Don't show if already installed
    const installed = localStorage.getItem('pwa-installed');
    if (installed) return;

    const plt = detectPlatform();
    setPlatform(plt);

    // Check if prompt is already captured in window (from index.html early capture)
    if ((window as any).__pwaInstallPrompt) {
      setDeferredPrompt((window as any).__pwaInstallPrompt);
    }

    // Listen for prompt event
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaInstallPrompt = e;
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt as EventListener);

    // Listen for custom event dispatched by index.html
    const handleReady = () => {
      setDeferredPrompt((window as any).__pwaInstallPrompt);
    };
    window.addEventListener('pwaInstallReady', handleReady);

    // Show banner after 4 seconds on page load (non-intrusive delay)
    const timer = setTimeout(() => {
      setShow(true);
    }, 4000);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      localStorage.setItem('pwa-installed', 'true');
      setShow(false);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handlePrompt as EventListener);
      window.removeEventListener('pwaInstallReady', handleReady);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPrompt || (window as any).__pwaInstallPrompt;
    if (prompt) {
      try {
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
          localStorage.setItem('pwa-installed', 'true');
          (window as any).__pwaInstallPrompt = null;
          setShow(false);
        }
      } catch (err) {
        console.error('Install error:', err);
      }
    } else if (platform === 'ios') {
      setShowIOSSteps(true);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
    setShow(false);
    setShowIOSSteps(false);
  };

  if (!show) return null;

  // iOS manual instructions overlay
  if (showIOSSteps) {
    return (
      <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-lg">Install RELED App</h3>
            <button onClick={handleDismiss} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-slate-800">Tap the Share button</p>
                <p className="text-sm text-slate-500">Tap <strong>□↑</strong> at the bottom of your Safari browser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-slate-800">Tap "Add to Home Screen"</p>
                <p className="text-sm text-slate-500">Scroll down in the share sheet and tap this option</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-slate-800">Tap "Add"</p>
                <p className="text-sm text-slate-500">Tap "Add" in the top right corner to install</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="mt-6 w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // Desktop banner (top of screen)
  if (platform === 'desktop') {
    return (
      <div className="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-slate-900 via-charcoal-900 to-slate-900 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-4 h-4 text-white" />
            </div>
            <p className="text-white text-sm">
              <span className="font-semibold">Install RELED App</span>
              <span className="text-slate-400 ml-2">— Access our product catalog offline, anytime</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-orange-500 text-white text-sm font-semibold rounded-lg hover:from-primary-600 hover:to-orange-600 transition-all shadow-lg shadow-primary-500/25"
            >
              Install Now
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mobile banner (bottom sheet style)
  return (
    <div className="fixed bottom-20 left-4 right-4 z-[200] animate-slide-up">
      <div className="bg-charcoal-900 rounded-2xl shadow-2xl border border-white/10 p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">Install RELED App</p>
          <p className="text-slate-400 text-xs truncate">Fast access to all LED products offline</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white text-sm font-bold rounded-xl shadow-lg hover:from-primary-600 hover:to-orange-600 transition-all"
          >
            {platform === 'ios' ? 'How?' : 'Install'}
          </button>
          <button onClick={handleDismiss} className="p-1.5 text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
