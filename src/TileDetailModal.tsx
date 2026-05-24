import type { TileData } from './types';

interface ModalProps {
  tile: TileData | null;
  onClose: () => void;
  onLevelDown: (id: string) => void;
}

export const TileDetailModal = ({ tile, onClose, onLevelDown }: ModalProps) => {
  if (!tile) return null;

  const handleLevelDown = () => {
    if (tile.level > 0) {
      onLevelDown(tile.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 text-gray-100 w-full max-w-sm rounded-lg p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{tile.title || '未設定'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white outline-none focus:outline-none"
          >
            ✕
          </button>
        </div>
        
        <p className="mb-6 text-sm text-gray-300">
          {tile.description || '詳細メモはまだありません。'}
        </p>
        
        <div className="flex flex-col gap-3">
          <div className="text-sm text-gray-400">
            現在のレベル: {tile.level} / 3
          </div>
          <button
            onClick={handleLevelDown}
            disabled={tile.level === 0}
            className="w-full py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded outline-none focus:outline-none transition-colors"
          >
            レベルを1つ下げる
          </button>
        </div>
      </div>
    </div>
  );
};