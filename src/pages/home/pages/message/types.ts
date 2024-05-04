export type KindKey = 'comment' | 'likeCollect' | 'fans' | 'share';

interface Kinditem {
  title: string;
  key: KindKey;
}

export const messageKindList: Kinditem[] = [
  {
    title: '新增粉丝',
    key: 'fans'
  },
  {
    title: '点赞收藏',
    key: 'likeCollect'
  },
  {
    title: '分享',
    key: 'share'
  },
  {
    title: '评论',
    key: 'comment'
  }
];
