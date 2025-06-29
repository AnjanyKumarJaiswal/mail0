import React, { useState, useEffect } from 'react';
import { CheckCircle, Trash, X} from 'lucide-react';

interface DraftNotificationProps {
  message: string;
  type: 'save' | 'delete';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const DraftNotification: React.FC<DraftNotificationProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(100);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      setIsClosing(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const isSave = type === 'save';

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div 
        className={`
          relative overflow-hidden rounded-lg shadow-lg border backdrop-blur-sm
          ${isSave 
            ? 'bg-gray-900/95 border-green-500/30 text-white' 
            : 'bg-gray-900/95 border-red-500/30 text-white'
          }
        `}
        style={{ minWidth: '320px', maxWidth: '400px' }}
      >
        <div className="absolute top-0 left-0 h-1 bg-gray-700/50 w-full">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${
              isSave ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 ${isSave ? 'text-green-400' : 'text-red-400'}`}>
            {isSave ? (
              <CheckCircle/>
            ) : (
              <Trash />
            )}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 p-0.5 rounded hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Bottom accent line */}
        <div className={`h-px ${isSave ? 'bg-green-500/20' : 'bg-red-500/20'}`} />
      </div>
    </div>
  );
};

// Hook for managing notifications
export const useDraftNotification = () => {
  const [notification, setNotification] = useState<{
    type: 'save' | 'delete';
    message: string;
    isVisible: boolean;
  } | null>(null);

  const showSaveNotification = (message: string = 'Your Draft has been Successfully Saved', onComplete?: () => void) => {
    setNotification({
      type: 'save',
      message,
      isVisible: true
    });
    
    // If onComplete callback is provided, execute it after the duration
    if (onComplete) {
      setTimeout(onComplete, 5000);
    }
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showSaveNotification,
    hideNotification
  };
};