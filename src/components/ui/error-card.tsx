import { XCircle, XIcon } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message?: string;
  onClose?: () => void;
}

const ErrorCard = ({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onClose,
}: ErrorCardProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[320px] flex flex-col items-center gap-4 relative">
        {/* Close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        )}

        {/* Error icon */}
        <div className="rounded-full bg-red-100 p-3">
          <XCircle className="h-8 w-8 text-red-600"/>
        </div>
        
        {/* Error content */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-sm text-gray-500">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">          
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;