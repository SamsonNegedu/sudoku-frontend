import { useRegisterSW } from 'virtual:pwa-register/react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installCallbacks: ((canInstall: boolean) => void)[] = [];
  private updateCallbacks: ((needsUpdate: boolean) => void)[] = [];

  constructor() {
    this.setupInstallPrompt();
    this.detectPlatform();
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallListeners(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.notifyInstallListeners(false);
      console.log('PWA was installed');
    });
  }

  private detectPlatform() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;

    return {
      isIOS,
      isAndroid,
      isStandalone: isStandalone || isInWebAppiOS,
      isMobile: isIOS || isAndroid,
      platform: isIOS ? 'ios' : isAndroid ? 'android' : 'desktop'
    };
  }

  public getPlatformInfo() {
    return this.detectPlatform();
  }

  public canInstall(): boolean {
    const { isStandalone } = this.detectPlatform();
    return !isStandalone && (this.deferredPrompt !== null || this.isIOSSafari());
  }

  public isIOSSafari(): boolean {
    const { isIOS, isStandalone } = this.detectPlatform();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return isIOS && isSafari && !isStandalone;
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.deferredPrompt = null;
        this.notifyInstallListeners(false);
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  }

  public onInstallAvailable(callback: (canInstall: boolean) => void) {
    this.installCallbacks.push(callback);
    callback(this.canInstall());
    
    return () => {
      this.installCallbacks = this.installCallbacks.filter(cb => cb !== callback);
    };
  }

  public onUpdateAvailable(callback: (needsUpdate: boolean) => void) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  private notifyInstallListeners(canInstall: boolean) {
    this.installCallbacks.forEach(callback => callback(canInstall));
  }

  private notifyUpdateListeners(needsUpdate: boolean) {
    this.updateCallbacks.forEach(callback => callback(needsUpdate));
  }

  public isInstalled(): boolean {
    const { isStandalone } = this.detectPlatform();
    return isStandalone;
  }

  public getInstallInstructions(): string {
    const { platform } = this.detectPlatform();
    
    if (platform === 'ios') {
      return 'Tap the Share button and select "Add to Home Screen"';
    } else if (platform === 'android') {
      return 'Tap the menu button and select "Add to Home Screen" or "Install App"';
    } else {
      return 'Click the install button in your browser\'s address bar';
    }
  }
}

export const pwaService = new PWAService();

export function usePWA() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      console.log('Service Worker registered:', registration);
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
    onNeedRefresh() {
      console.log('New content available, please refresh.');
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });

  const updateApp = () => {
    updateServiceWorker(true);
  };

  const closeUpdatePrompt = () => {
    setNeedRefresh(false);
  };

  return {
    needRefresh,
    updateApp,
    closeUpdatePrompt,
    canInstall: pwaService.canInstall(),
    isInstalled: pwaService.isInstalled(),
    platformInfo: pwaService.getPlatformInfo(),
    promptInstall: () => pwaService.promptInstall(),
    getInstallInstructions: () => pwaService.getInstallInstructions(),
  };
}
