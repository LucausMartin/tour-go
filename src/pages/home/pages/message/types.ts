export type KindKey = 'comment' | 'likeCollect' | 'fans';

interface Kinditem {
  title: string;
  key: KindKey;
}

export const messageKindList: Kinditem[] = [
  {
    title: '评论',
    key: 'comment'
  },
  {
    title: '赞和收藏',
    key: 'likeCollect'
  },
  {
    title: '新增粉丝',
    key: 'fans'
  }
];
