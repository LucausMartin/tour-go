export type KindKey = 'draft' | 'like' | 'collect' | 'visitHistory' | 'production';

interface Kinditem {
  title: string;
  key: KindKey;
}

export const meKindList: Kinditem[] = [
  {
    title: '作品',
    key: 'production'
  },
  {
    title: '喜欢',
    key: 'like'
  },
  {
    title: '收藏',
    key: 'collect'
  },
  {
    title: '草稿',
    key: 'draft'
  },
  {
    title: '观看历史',
    key: 'visitHistory'
  }
];

export interface TypeNum {
  production: number;
  like: number;
  collect: number;
  draft: number;
  visitHistory: string;
}

export interface UserInfo {
  userName: string;
  name: string;
  bio: string;
  follow: number;
  follower: number;
  plan: number;
  like: number;
  collect: number;
  draft: number;
  avatar: string;
}
