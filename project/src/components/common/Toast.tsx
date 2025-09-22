import React from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  show: boolean;
  onClose: () => void;
  progress?: number;
  showProgress?: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  show, 
  onClose, 
  progress = 0, 
  showProgress = false 
}) => {
  if (!show) return null;

  const getIconComponent = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
        );
      case 'info':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  const getBgClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  const getProgressBarClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md ${getBgClass()}`}>
        <div className="flex-shrink-0">
          {getIconComponent()}
        </div>
        
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {showProgress && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarClass()}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 opacity-75">{progress}% tamamlandı</p>
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;