import { useState, useEffect } from 'react';
import { pwaService } from '@/services/pwaService';

export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);
  const [platformInfo, setPlatformInfo] = useState(pwaService.getPlatformInfo());

  useEffect(() => {
    const unsubscribe = pwaService.onInstallAvailable(setCanInstall);
    setIsInstalled(pwaService.isInstalled());
    setIsIOSSafari(pwaService.isIOSSafari());
    setPlatformInfo(pwaService.getPlatformInfo());

    return unsubscribe;
  }, []);

  const promptInstall = async () => {
    return await pwaService.promptInstall();
  };

  const getInstallInstructions = () => {
    return pwaService.getInstallInstructions();
  };

  return {
    canInstall,
    isInstalled,
    isIOSSafari,
    platformInfo,
    promptInstall,
    getInstallInstructions,
  };
}
