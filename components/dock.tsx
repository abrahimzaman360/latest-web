import { Terminal } from "lucide-react";

interface DockProps {
  isVisible: boolean;
  isFunction: () => void;
  isActive: boolean;
}

const Dock: React.FC<DockProps> = ({ isFunction, isActive }) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-300">
      <div className="bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-700/50 shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => isFunction()}
            className={`group relative transition-all duration-150 ease-in-out
              ${isActive ? "scale-100" : "scale-90 hover:scale-100"}`}
          >
            <div className="p-2 rounded-xl m-2 bg-gray-700/50 hover:bg-gray-600/50 transition-all">
              <Terminal className="w-10 h-10 text-green-400" />
            </div>

            {/* Dot indicator */}
            <div
              className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full
                ${isActive ? "bg-green-600" : "bg-transparent"}`}
            />

            {/* Hover tooltip */}
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 
                opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="bg-transparent text-gray-100 text-sm py-1 px-2 rounded">
                Terminal
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dock;
