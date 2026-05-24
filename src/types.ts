export type TileLevel = 0 | 1 | 2 | 3;

export interface TileData {
  id: string;
  row: number;
  col: number;
  level: TileLevel;
  title: string;
  description: string;
}

export interface GridConfig {
  rows: number;
  cols: number;
  yLabels: string[];
  xLabels: string[][]; // 二次元配列に変更（行ごとに異なる要素名を持つため）
}