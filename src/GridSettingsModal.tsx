import { useState } from 'react';
import type { GridConfig } from './types';

interface ModalProps {
  config: GridConfig;
  onClose: () => void;
  onSave: (newConfig: GridConfig) => void;
}

export const GridSettingsModal = ({ config, onClose, onSave }: ModalProps) => {
  const [rows, setRows] = useState(config.rows);
  const [cols, setCols] = useState(config.cols);

  const handleSave = () => {
    onSave({ ...config, rows, cols });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 text-gray-100 w-full max-w-sm rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">グリッド設定</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">行数 (縦のマス数)</label>
            <input 
              type="number" min="1" max="10" 
              value={rows} onChange={e => setRows(Number(e.target.value))} 
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white outline-none focus:border-gray-500" 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">列数 (横のマス数)</label>
            <input 
              type="number" min="1" max="10" 
              value={cols} onChange={e => setCols(Number(e.target.value))} 
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white outline-none focus:border-gray-500" 
            />
          </div>
          <p className="text-xs text-yellow-500/80 mt-2">
            ※ マス数を減らすと枠外のマスは非表示になりますが、データ自体は保持されます。
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">キャンセル</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-neutral-200 hover:bg-white text-black rounded transition-colors font-bold">保存</button>
        </div>
      </div>
    </div>
  );
};