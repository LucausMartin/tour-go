export type KindKeys = 'follow' | 'food' | 'mountain' | 'sea' | 'roadtrips' | 'specialForces';

interface KindItem {
  title: string;
  key: KindKeys;
}

export const KindList: KindItem[] = [
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
  }
];
