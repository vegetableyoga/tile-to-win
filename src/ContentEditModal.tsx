import { useState } from 'react';
import type { GridConfig } from './types';

interface ModalProps {
  config: GridConfig;
  onClose: () => void;
  onSave: (newConfig: GridConfig) => void;
}

export const ContentEditModal = ({ config, onClose, onSave }: ModalProps) => {
  const [yLabels, setYLabels] = useState([...config.yLabels]);
  // 2次元配列を正しくコピー
  const [xLabels, setXLabels] = useState(config.xLabels.map(row => [...row]));

  const handleYChange = (rowIndex: number, value: string) => {
    const newLabels = [...yLabels];
    newLabels[rowIndex] = value;
    setYLabels(newLabels);
  };

  const handleXChange = (rowIndex: number, colIndex: number, value: string) => {
    const newLabels = xLabels.map((row, r) => 
      r === rowIndex 
        ? row.map((val, c) => c === colIndex ? value : val)
        : row
    );
    setXLabels(newLabels);
  };

  const handleSave = () => {
    onSave({ ...config, yLabels, xLabels });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 text-gray-100 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 overflow-y-auto space-y-6">
          <h2 className="text-xl font-bold">コンテンツ編集</h2>
          <p className="text-sm text-gray-400">各行（科目など）の名前と、そこに紐づく要素を個別に設定できます。</p>
          
          <div className="space-y-4">
            {Array.from({ length: config.rows }).map((_, r) => (
              <div key={`row-block-${r}`} className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-700/50 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500">行 {r + 1}</span>
                  <input 
                    type="text" 
                    value={yLabels[r] || ''} 
                    onChange={e => handleYChange(r, e.target.value)} 
                    placeholder="行の名前 (例: 英語)" 
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded p-2 text-sm text-white font-semibold outline-none focus:border-gray-500" 
                  />
                </div>
                
                {/* 行に紐づく個別の5マスの入力欄 */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pl-7">
                  {Array.from({ length: config.cols }).map((_, c) => (
                    <div key={`cell-${r}-${c}`} className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-500">要素 {c + 1}</span>
                      <input 
                        type="text" 
                        value={(xLabels[r] && xLabels[r][c]) || ''} 
                        onChange={e => handleXChange(r, c, e.target.value)} 
                        placeholder={`要素 ${c + 1}`} 
                        className="bg-neutral-900 border border-neutral-700 rounded p-1.5 text-xs text-white outline-none focus:border-gray-500" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-4 bg-neutral-800 border-t border-neutral-700">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">キャンセル</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-neutral-200 hover:bg-white text-black rounded transition-colors font-bold">保存</button>
        </div>
      </div>
    </div>
  );
};