import { usePWA } from '@/services/pwaService';
import { RefreshCw, X } from 'lucide-react';

export function PWAUpdatePrompt() {
  const { needRefresh, updateApp, closeUpdatePrompt } = usePWA();

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-top-5">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-2xl p-4 text-white">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <RefreshCw className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1">
              Update Available
            </h3>
            <p className="text-sm text-green-100 mb-3">
              A new version of Zdoku is available. Update now to get the latest features and improvements.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={updateApp}
                className="flex-1 bg-white text-green-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Update Now
              </button>
              <button
                onClick={closeUpdatePrompt}
                className="px-4 py-2 rounded-md font-medium text-sm text-white hover:bg-white/10 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={closeUpdatePrompt}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
