export type KindKeys =
  | 'follow'
  | 'food'
  | 'mountain'
  | 'sea'
  | 'roadtrips'
  | 'specialForces'
  | 'single'
  | 'double'
  | 'multiple'
  | 'recommand';

interface KindItem {
  title: string;
  key: KindKeys;
}

export const discoverKindList: KindItem[] = [
  {
    title: '推荐',
    key: 'recommand'
  },
  {
    title: '关注',
    key: 'follow'
  },
  {
    title: '美食',
    key: 'food'
  },
  {
    title: '爬山',
    key: 'mountain'
  },
  {
    title: '海边',
    key: 'sea'
  },
  {
    title: '自驾游',
    key: 'roadtrips'
  },
  {
    title: '特种兵',
    key: 'specialForces'
  },
  {
    title: '单人行',
    key: 'single'
  },
  {
    title: '双人行',
    key: 'double'
  },
  {
    title: '多人行',
    key: 'multiple'
  }
];
