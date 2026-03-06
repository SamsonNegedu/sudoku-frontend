import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Monitor, Share } from 'lucide-react';
import { pwaService } from '@/services/pwaService';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);
  const platformInfo = pwaService.getPlatformInfo();

  useEffect(() => {
    setIsIOSSafari(pwaService.isIOSSafari());

    // Check if we should hide the prompt based on localStorage
    const installShownBefore = localStorage.getItem('pwa-install-prompt-shown');
    let shouldHidePrompt = false;
    
    if (installShownBefore) {
      const shownDate = new Date(installShownBefore);
      const daysSinceShown = (Date.now() - shownDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceShown < 7) {
        shouldHidePrompt = true;
      }
    }

    // Only subscribe to install events if we shouldn't hide the prompt
    const unsubscribe = pwaService.onInstallAvailable((canInstall) => {
      if (!shouldHidePrompt) {
        setShowPrompt(canInstall);
      }
    });

    return unsubscribe;
  }, []);

  const handleInstall = async () => {
    if (isIOSSafari) {
      return;
    }

    const installed = await pwaService.promptInstall();
    if (installed) {
      setShowPrompt(false);
      localStorage.setItem('pwa-install-prompt-shown', new Date().toISOString());
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-shown', new Date().toISOString());
  };

  if (!showPrompt || pwaService.isInstalled()) {
    return null;
  }

  const getIcon = () => {
    if (platformInfo.platform === 'ios') return <Smartphone className="h-6 w-6" />;
    if (platformInfo.platform === 'android') return <Smartphone className="h-6 w-6" />;
    return <Monitor className="h-6 w-6" />;
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-card border border-border rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1 text-primary">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 text-card-foreground">
              Install Zdoku
            </h3>
            
            {isIOSSafari ? (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Install this app on your iPhone:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Tap the <Share className="inline h-3 w-3" /> Share button below</li>
                  <li>Scroll and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right</li>
                </ol>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">
                Install Zdoku for quick access and offline play. Works on all devices!
              </p>
            )}
            
            {!isIOSSafari && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 rounded-md font-medium text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  Later
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
