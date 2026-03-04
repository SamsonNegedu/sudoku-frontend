import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff, 
  CheckCircle2,
  Circle
} from 'lucide-react';

export function PWAStatus() {
  const { isInstalled, platformInfo, canInstall, promptInstall, getInstallInstructions } = usePWAInstall();
  const isOnline = useOnlineStatus();

  const getPlatformIcon = () => {
    if (platformInfo.platform === 'ios' || platformInfo.platform === 'android') {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getPlatformName = () => {
    if (platformInfo.platform === 'ios') return 'iOS';
    if (platformInfo.platform === 'android') return 'Android';
    return 'Desktop';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          {getPlatformIcon()}
          PWA Status
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Platform</span>
            <span className="text-sm font-medium">{getPlatformName()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Installation Status</span>
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Installed</span>
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Not Installed
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Network Status</span>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Offline</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Offline Support</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
          </div>
        </div>

        {!isInstalled && canInstall && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={promptInstall}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Install App
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              {getInstallInstructions()}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h4 className="font-semibold text-sm mb-2">Features</h4>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Play offline without internet</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Quick access from home screen</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Automatic updates</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Full-screen experience</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Fast loading with caching</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
