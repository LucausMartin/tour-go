export type KindKey = 'article' | 'like' | 'collect' | 'visitHistory' | 'production';

interface Kinditem {
  title: string;
  key: KindKey;
}

export const meKindList: Kinditem[] = [
  {
    title: '计划',
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
    title: '文章',
    key: 'article'
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
  article: number;
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
  article: number;
  avatar: string;
}
