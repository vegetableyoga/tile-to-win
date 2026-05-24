import { useState, useEffect } from 'react';
import type { TileData, GridConfig } from './types';
import { Tile } from './Tile';
import { TileDetailModal } from './TileDetailModal';
import { ContentEditModal } from './ContentEditModal';
import { GridSettingsModal } from './GridSettingsModal';

// 初めてアプリを開いた時用のデフォルト設定
const DEFAULT_CONFIG: GridConfig = {
  rows: 5,
  cols: 5,
  yLabels: ['国語', '数学', '理科', '社会', '英語'],
  xLabels: [
    ['漢字', '現代文', '古文', '漢文', '作文'],
    ['計算', '数と式', '関数', '図形', '確率'],
    ['物理', '化学', '生物', '地学', '実験'],
    ['歴史', '地理', '公民', '時事', '地図'],
    ['単語', '文法', '和訳', '読解', '暗唱']
  ],
};

export default function App() {
  // ① 起動時：ローカルストレージに保存された設定があれば読み込み、なければデフォルトを使う
  const [config, setConfig] = useState<GridConfig>(() => {
    const savedConfig = localStorage.getItem('ttw-config');
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
  });

  // ② 起動時：保存されたマスの色やテキストのデータがあれば読み込む
  const [tiles, setTiles] = useState<TileData[]>(() => {
    const savedTiles = localStorage.getItem('ttw-tiles');
    return savedTiles ? JSON.parse(savedTiles) : [];
  });

  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [isContentEditOpen, setIsContentEditOpen] = useState(false);
  const [isGridSettingsOpen, setIsGridSettingsOpen] = useState(false);

  // グリッドやラベルが変更された時、既存のレベルデータを保持しながら再構築する
  useEffect(() => {
    setTiles(prevTiles => {
      const newTiles: TileData[] = [];
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          const id = `${r}-${c}`;
          const existingTile = prevTiles.find(t => t.id === id);
          const rowLabel = config.yLabels[r] || '';
          const colLabel = (config.xLabels[r] && config.xLabels[r][c]) || '';
          
          newTiles.push({
            id,
            row: r,
            col: c,
            level: existingTile ? existingTile.level : 0,
            title: rowLabel && colLabel ? `${rowLabel} - ${colLabel}` : rowLabel || colLabel || '未設定',
            description: existingTile ? existingTile.description : '',
          });
        }
      }
      return newTiles;
    });
  }, [config]);

  // ③ 保存処理：設定（config）が変更されるたびにブラウザに保存
  useEffect(() => {
    localStorage.setItem('ttw-config', JSON.stringify(config));
  }, [config]);

  // ④ 保存処理：マスの状態（tiles）が変更されるたびにブラウザに保存
  useEffect(() => {
    if (tiles.length > 0) {
      localStorage.setItem('ttw-tiles', JSON.stringify(tiles));
    }
  }, [tiles]);

  const handleGridConfigChange = (newConfig: GridConfig) => {
    const adjustedXLabels = Array.from({ length: newConfig.rows }).map((_, r) => {
      const existingRow = config.xLabels[r] || [];
      return Array.from({ length: newConfig.cols }).map((_, c) => existingRow[c] || '');
    });

    setConfig({
      ...newConfig,
      xLabels: adjustedXLabels,
    });
  };

  const handleLevelUp = (id: string) => {
    setTiles(prev => prev.map(t => (t.id === id && t.level < 3 ? { ...t, level: (t.level + 1) as TileData['level'] } : t)));
  };

  const handleLevelDown = (id: string) => {
    setTiles(prev => prev.map(t => (t.id === id && t.level > 0 ? { ...t, level: (t.level - 1) as TileData['level'] } : t)));
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 font-sans">
      <header className="p-4 flex justify-between items-center border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-wider">Tile To Win</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsContentEditOpen(true)}
            className="px-3 py-1.5 text-sm bg-neutral-800 rounded outline-none focus:outline-none hover:bg-neutral-700 transition-colors"
          >
            コンテンツ編集
          </button>
          <button 
            onClick={() => setIsGridSettingsOpen(true)}
            className="px-3 py-1.5 text-sm bg-neutral-800 rounded outline-none focus:outline-none hover:bg-neutral-700 transition-colors"
          >
            グリッド設定
          </button>
        </div>
      </header>

      <main className="p-2 md:p-4 max-w-4xl mx-auto mt-4">
        <div className="flex">
          <div className="flex flex-col gap-1 md:gap-2 mr-2 pt-[18px]">
             {Array.from({ length: config.rows }).map((_, r) => (
                <div key={`y-guide-${r}`} className="flex items-center justify-end pr-1" style={{ height: `calc(100% / ${config.rows})` }}>
                  <span className="text-[10px] text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis w-8 md:w-12 text-right">
                    {config.yLabels[r] || ''}
                  </span>
                </div>
             ))}
          </div>

          <div className="flex-1">
            <div 
              className="grid gap-1 md:gap-2 mb-1"
              style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: config.cols }).map((_, c) => (
                <div key={`x-guide-${c}`} className="flex justify-center">
                  <span className="text-[10px] text-gray-600 font-bold">
                    {c + 1}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="grid gap-1 md:gap-2"
              style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
            >
              {tiles.map(tile => (
                <Tile
                  key={tile.id}
                  data={tile}
                  onLevelUp={handleLevelUp}
                  onOpenDetail={setSelectedTile}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <TileDetailModal tile={selectedTile} onClose={() => setSelectedTile(null)} onLevelDown={handleLevelDown} />
      
      {isGridSettingsOpen && (
        <GridSettingsModal config={config} onClose={() => setIsGridSettingsOpen(false)} onSave={handleGridConfigChange} />
      )}
      
      {isContentEditOpen && (
        <ContentEditModal config={config} onClose={() => setIsContentEditOpen(false)} onSave={setConfig} />
      )}
    </div>
  );
}