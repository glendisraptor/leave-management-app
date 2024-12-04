import { Loader2 } from 'lucide-react';

interface LoaderProps {
    text?: string;
    progress?: number;
    className?: string;
}

const LoaderCard = ({
    text = 'Loading...',
    progress,
}: LoaderProps) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[280px] flex flex-col items-center gap-4">
                <div className="w-full space-y-4">
                    {/* Spinner */}
                    <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>

                    {/* Loading text and progress */}
                    <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-gray-600">{text}</p>
                        {progress !== undefined && (
                            <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        {progress !== undefined ? (
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        ) : (
                            <div className="bg-primary h-full w-1/2 rounded-full animate-[loading_1s_ease-in-out_infinite]" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoaderCard;

// Add this to your global CSS or tailwind.config.js
const style = `
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = style;
document.head.appendChild(styleSheet);