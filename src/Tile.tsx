import { useRef } from 'react';
import type { TileData } from './types';

interface TileProps {
  data: TileData;
  onLevelUp: (id: string) => void;
  onOpenDetail: (data: TileData) => void;
}

export const Tile = ({ data, onLevelUp, onOpenDetail }: TileProps) => {
  // ここをブラウザ環境用の型に修正しました
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bgColor = {
    0: 'bg-white',
    1: 'bg-gray-300',
    2: 'bg-gray-600',
    3: 'bg-black',
  }[data.level];

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      if (data.level < 3) onLevelUp(data.id);
      timerRef.current = null;
    }, 500);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      onOpenDetail(data);
    }
  };

  const handlePointerLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div
      className={`relative w-full aspect-square rounded transition-colors duration-200 cursor-pointer flex items-center justify-center select-none ${bgColor} ${data.level === 3 ? 'border border-gray-800' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      title={data.title}
    >
      {data.level === 3 && (
        <span className="text-white text-xl md:text-3xl font-bold opacity-80 pointer-events-none">
          ✓
        </span>
      )}
    </div>
  );
};