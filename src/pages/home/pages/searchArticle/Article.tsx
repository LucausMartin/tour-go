import { FC, useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import { PartItemTypes } from '../newPlan/types.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { Avatar, Button } from '@mui/material';
import { useLoginState } from '@myHooks/useLoginState.ts';
import { FavoriteBorder, Favorite, StarBorder, Star, Comment, Close, Share } from '@mui/icons-material';
import { IP, ReactSetState } from '@myTypes/types.ts';
import { selectLogin, readyLoginAction } from '@myStore/slices/loginSlice.ts';
import { useSelector, useDispatch } from 'react-redux';
import './article.css';
import '../publish/publish.css';
import '../me/me.css';
import { PopUps } from '@myComponents/PopUps/PopUps.tsx';

export function Component() {
  return <Article></Article>;
}

const Article: FC = () => {
  useLoginState();
  const login = useSelector(selectLogin);
  const param = useParams();
  const dispatch = useDispatch();
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [isLike, setIsLike] = useState<boolean>(false);
  const [isCollect, setIsCollect] = useState<boolean>(false);
  const [commentValue, setCommentValue] = useState<string>('');
  const [commentShow, setCommentShow] = useState<boolean>(false);
  const [shareShow, setShareShow] = useState<boolean>(false);
  const [commentArray, setCommentArray] = useState<
    | {
        comment: string;
        user: string;
        time: string;
      }[]
    | null
  >(null);
  const [selfInfo, setSelfInfo] = useState<{
    user_name: string;
    name: string;
    bio: string;
    follow: number;
    follower: number;
    plan: number;
    like: number;
    collect: number;
    article: number;
    avatar: string;
  }>({
    user_name: '',
    name: '',
    bio: '',
    follow: 0,
    follower: 0,
    plan: 0,
    like: 0,
    collect: 0,
    article: 0,
    avatar: ''
  });

  const [article, setArticle] = useState<{
    article_id: string;
    content: {
      title: string;
      plan: PartItemTypes[];
      cover: string;
      articleTitle: string;
    };
    user: string;
    like: number;
    collect: number;
    comment: number;
  } | null>(null);

  const [userInfo, setUserInfo] = useState<{
    name: string;
    bio: string;
    avatar: string;
  }>({
    name: '--',
    bio: '--',
    avatar: ''
  });

  const getIsLikeFetch = useCallback(async () => {
    const res = await fetchData<
      {
        hasLike: boolean;
      },
      {
        article_id: string;
      }
    >('POST', { url: '/api/likes/has-like' }, { article_id: param.id === undefined ? '' : param.id });

    if (res.message === 'success') {
      setIsLike(res.data.hasLike);
    } else {
      ErrorMessage('获取点赞信息失败', 2000);
    }
  }, [param.id]);

  const getSelfInfo = useCallback(async () => {
    try {
      const userInfoRes = await fetchData<{
        user_name: string;
        name: string;
        bio: string;
        follow: number;
        follower: number;
        plan: number;
        like: number;
        collect: number;
        article: number;
        avatar: string;
      }>('GET', {
        url: '/api/users/self-info'
      });

      if (userInfoRes.message === 'success') {
        // 数据校验
        if (userInfoRes.data.bio === null) {
          userInfoRes.data.bio = '这个人很懒，什么都没有留下';
        }
        setSelfInfo({
          user_name: userInfoRes.data.user_name,
          name: userInfoRes.data.name,
          bio: userInfoRes.data.bio,
          follow: userInfoRes.data.follow,
          follower: userInfoRes.data.follower,
          plan: userInfoRes.data.plan,
          like: userInfoRes.data.like,
          collect: userInfoRes.data.collect,
          article: userInfoRes.data.article,
          avatar: userInfoRes.data.avatar
        });
      }
    } catch (error) {
      ErrorMessage('获取用户信息失败', 2000);
    }
  }, []);

  const getIsFollowFetch = async (id: string) => {
    const res = await fetchData<
      {
        isFollow: boolean;
      },
      {
        followName: string;
      }
    >('POST', { url: '/api/users/is-follow' }, { followName: id });

    if (res.message === 'success') {
      setIsFollow(res.data.isFollow);
    }
  };

  const fetchArticleInfoData = useCallback(async () => {
    const res = await fetchData<
      {
        article: {
          article_id: string;
          content: string;
          user: string;
          like: number;
          collect: number;
          comment: number;
        };
      },
      {
        articleID: string;
      }
    >(
      'POST',
      {
        url: `/api/articles/get-article-info`
      },
      {
        articleID: param.id === undefined ? '' : param.id
      }
    );

    if (res.code === 200) {
      getUserInfo(res.data.article.user);
      getIsFollowFetch(res.data.article.user);
      const newRes: {
        article_id: string;
        content: {
          title: string;
          plan: PartItemTypes[];
          cover: string;
          articleTitle: string;
        };
        user: string;
        like: number;
        collect: number;
        comment: number;
      } = {
        article_id: '',
        content: {
          title: '',
          plan: [],
          cover: '',
          articleTitle: ''
        },
        user: '',
        like: 0,
        collect: 0,
        comment: 0
      };
      newRes.article_id = res.data.article.article_id;
      newRes.content = JSON.parse(res.data.article.content);
      newRes.user = res.data.article.user;
      newRes.like = res.data.article.like;
      newRes.collect = res.data.article.collect;
      newRes.comment = res.data.article.comment;
      setArticle(newRes);
    } else {
      ErrorMessage('获取文章信息失败', 2000);
    }
  }, [param.id]);

  const getUserInfo = async (id: string) => {
    try {
      const userInfoRes = await fetchData<
        {
          name: string;
          bio: string;
          avatar: string;
        },
        { username: string }
      >('POST', { url: '/api/users/other-info' }, { username: id });

      if (userInfoRes.message === 'success') {
        // 数据校验
        if (userInfoRes.data.bio === null) {
          userInfoRes.data.bio = '这个人很懒，什么都没有留下';
        }
        setUserInfo({
          name: userInfoRes.data.name,
          bio: userInfoRes.data.bio,
          avatar: userInfoRes.data.avatar
        });
      }
    } catch (error) {
      ErrorMessage('获取用户信息失败', 2000);
    }
  };

  const toLogin = () => {
    dispatch(readyLoginAction());
  };

  const addLikeFetch = async () => {
    try {
      const res = await fetchData<
        string,
        {
          article_id: string;
        }
      >('POST', { url: '/api/likes/add-like' }, { article_id: article ? article?.article_id : '' });

      if (res.message === 'success') {
        setArticle({
          // 拆开每一个字段
          article_id: article ? article?.article_id : '',
          content: article ? article?.content : { title: '', plan: [], cover: '', articleTitle: '' },
          user: article ? article?.user : '',
          like: article ? article?.like + 1 : 0,
          collect: article ? article?.collect : 0,
          comment: article ? article?.comment : 0
        });
        setIsLike(true);
      } else {
        ErrorMessage('点赞失败', 2000);
      }
    } catch (error) {
      ErrorMessage('点赞失败', 2000);
    }
  };

  const daleteLikeFetch = async () => {
    const res = await fetchData<
      string,
      {
        article_id: string;
      }
    >('POST', { url: '/api/likes/delete-like' }, { article_id: article ? article?.article_id : '' });

    if (res.message === 'success') {
      setArticle({
        // 拆开每一个字段
        article_id: article ? article?.article_id : '',
        content: article ? article?.content : { title: '', plan: [], cover: '', articleTitle: '' },
        user: article ? article?.user : '',
        like: article ? article?.like - 1 : 0,
        collect: article ? article?.collect : 0,
        comment: article ? article?.comment : 0
      });
      setIsLike(false);
    }
  };

  const getIsCollectFetch = useCallback(async () => {
    const res = await fetchData<
      {
        hasCollect: boolean;
      },
      {
        article_id: string;
      }
    >('POST', { url: '/api/collects/has-collect' }, { article_id: param.id === undefined ? '' : param.id });

    if (res.message === 'success') {
      setIsCollect(res.data.hasCollect);
    } else {
      ErrorMessage('获取收藏信息失败', 2000);
    }
  }, [param.id]);

  const addCollectFetch = async () => {
    const res = await fetchData<
      string,
      {
        article_id: string;
      }
    >('POST', { url: '/api/collects/add-collect' }, { article_id: article ? article?.article_id : '' });

    if (res.message === 'success') {
      setArticle({
        // 拆开每一个字段
        article_id: article ? article?.article_id : '',
        content: article ? article?.content : { title: '', plan: [], cover: '', articleTitle: '' },
        user: article ? article?.user : '',
        like: article ? article?.like : 0,
        collect: article ? article?.collect + 1 : 0,
        comment: article ? article?.comment : 0
      });
      setIsCollect(true);
    }
  };

  const daleteCollectFetch = async () => {
    const res = await fetchData<
      string,
      {
        article_id: string;
      }
    >('POST', { url: '/api/collects/delete-collect' }, { article_id: article ? article?.article_id : '' });

    if (res.message === 'success') {
      setArticle({
        // 拆开每一个字段
        article_id: article ? article?.article_id : '',
        content: article ? article?.content : { title: '', plan: [], cover: '', articleTitle: '' },
        user: article ? article?.user : '',
        like: article ? article?.like : 0,
        collect: article ? article?.collect - 1 : 0,
        comment: article ? article?.comment : 0
      });
      setIsCollect(false);
    }
  };

  const addLike = (isLike: boolean) => {
    return () => {
      if (login === 'login') {
        if (!isLike) {
          addLikeFetch();
        } else {
          daleteLikeFetch();
        }
      } else {
        toLogin();
      }
    };
  };

  const addCollect = (isCollect: boolean) => {
    return () => {
      if (login === 'login') {
        if (!isCollect) {
          addCollectFetch();
        } else {
          daleteCollectFetch();
        }
      } else {
        toLogin();
      }
    };
  };

  const formatTime = (time: string) => {
    // 将时间戳字符串转换为 Date 对象
    const date = new Date(time);

    // 获取年、月、日、时、分
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份是从 0 开始的，所以需要加 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 格式化成 "年-月-日 时:分" 形式
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
  };

  const getComment = () => {
    if (login === 'login') {
      getCommentFetch();
    } else {
      toLogin();
    }
  };

  const getCommentFetch = async () => {
    try {
      const res = await fetchData<
        {
          comment: string;
          user: string;
          time: string;
        }[],
        {
          article_id: string;
        }
      >('POST', { url: '/api/comments/get-comments' }, { article_id: param.id === undefined ? '' : param.id });

      if (res.message === 'success') {
        setCommentArray(res.data);
        setCommentShow(true);
      } else {
        ErrorMessage('获取评论失败', 2000);
      }
    } catch (error) {
      ErrorMessage('获取评论失败', 2000);
    }
  };

  const addCommentFetch = async () => {
    try {
      const res = await fetchData<
        string,
        {
          article_id: string;
          comment: string;
          time: string;
        }
      >(
        'POST',
        { url: '/api/comments/add-comment' },
        { article_id: article ? article?.article_id : '', comment: commentValue, time: new Date().toString() }
      );

      if (res.message === 'success') {
        setArticle({
          // 拆开每一个字段
          article_id: article ? article?.article_id : '',
          content: article ? article?.content : { title: '', plan: [], cover: '', articleTitle: '' },
          user: article ? article?.user : '',
          like: article ? article?.like : 0,
          collect: article ? article?.collect : 0,
          comment: article ? article?.comment + 1 : 0
        });
        getCommentFetch();
        setCommentValue('');
        await fetchData<
          string,
          {
            comment_id: string;
            comment: string;
          }
        >('POST', { url: '/api/comments/update-score' }, { comment_id: res.data, comment: commentValue });
      } else {
        ErrorMessage('评论失败', 2000);
      }
    } catch (error) {
      ErrorMessage('评论失败', 2000);
    }
  };

  const addComment = () => {
    if (login === 'login') {
      addCommentFetch();
    } else {
      toLogin();
    }
  };

  const changeFollowState = async () => {
    if (isFollow) {
      try {
        const followRes = await fetchData(
          'POST',
          { url: '/api/articles/remove-follow' },
          { removeName: article?.user }
        );
        if (followRes.message === 'success') {
          setIsFollow(false);
        } else {
          ErrorMessage('取消关注失败', 2000);
        }
      } catch (error) {
        ErrorMessage('取消关注失败', 2000);
      }
    } else {
      try {
        const followRes = await fetchData('POST', { url: '/api/users/add-follow' }, { followName: article?.user });
        if (followRes.message === 'success') {
          setIsFollow(true);
        } else {
          ErrorMessage('关注失败', 2000);
        }
      } catch (error) {
        ErrorMessage('关注失败', 2000);
      }
    }
  };

  const addFollow = () => {
    if (login === 'login') {
      changeFollowState();
    } else {
      toLogin();
    }
  };

  const addHistoryFetch = useCallback(async () => {
    try {
      const res = await fetchData(
        'POST',
        { url: '/api/histories/add-history' },
        { article_id: param.id === undefined ? '' : param.id }
      );

      if (res.message !== 'success') {
        ErrorMessage('添加历史记录失败', 2000);
      }
    } catch (error) {
      ErrorMessage('添加历史记录失败', 2000);
    }
  }, [param.id]);

  const addSearchHistoryFetch = useCallback(async () => {
    try {
      const res = await fetchData(
        'POST',
        { url: '/api/searchs/add-search-history' },
        { article_id: param.id === undefined ? '' : param.id }
      );

      if (res.message !== 'success') {
        ErrorMessage('添加搜索历史记录失败', 2000);
      }
    } catch (error) {
      ErrorMessage('添加搜索历史记录失败', 2000);
    }
  }, [param.id]);

  useEffect(() => {
    fetchArticleInfoData();
    if (login === 'login') {
      getSelfInfo();
      getIsLikeFetch();
      getIsCollectFetch();
      addHistoryFetch();
      addSearchHistoryFetch();
    }
  }, [
    fetchArticleInfoData,
    getSelfInfo,
    login,
    getIsLikeFetch,
    getIsCollectFetch,
    addHistoryFetch,
    addSearchHistoryFetch
  ]);
  return (
    <div className="article-container">
      <div className="article-content-container">
        <div className="article-content-cover">
          <img className="article-content-cover-img" src={'//' + IP + article?.content.cover} alt="" />
        </div>
        <div className="article-content-title">{article?.content.articleTitle}</div>
        <div className="article-content-plan">
          {article?.content.plan &&
            article?.content.plan.map((item, index) => {
              return (
                <div className="publish-start-plan-item-container" key={index}>
                  <div className="publish-start-plan-item-progress-bar">
                    <div className="publish-start-plan-item-progress-line-complate">
                      <div
                        style={{ backgroundColor: 'hotpink' }}
                        className="publish-start-plan-item-progress-ball"
                      ></div>
                    </div>
                  </div>
                  <div className="publish-start-plan-item-content">
                    <div className="publish-start-plan-item-title publish-start-plan-item-take">
                      <span>{item.title}</span>
                    </div>
                    <div className="publish-start-plan-item-take">
                      <span>{formatTime(item.startTime)}</span>&nbsp;至&nbsp;<span>{formatTime(item.endTime)}</span>
                    </div>
                    <div className="publish-start-plan-item-place publish-start-plan-item-take">
                      <span>地点：</span>
                      <span>{item.addressName}</span>
                    </div>
                    <div className="publish-start-plan-item-take">
                      <span>需携带物品：</span>
                      <span>{item.takeThings === '' ? '无' : item.takeThings}</span>
                    </div>
                    <div className="publish-start-plan-item-take">
                      <span>备忘录：</span>
                      <span>{item.tips === '' ? '无' : item.tips}</span>
                    </div>
                    {item.imgName !== undefined && item.imgName !== null && (
                      <div className="article-plan-img">
                        <img
                          className="article-plan-img"
                          src={item.imgName === null ? '' : '//' + IP + item.imgName}
                          alt=""
                        />
                      </div>
                    )}
                    {item.text !== undefined && item.text !== null && (
                      <div className="article-plan-text">
                        该阶段描述：<span>{item.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          <div className="article-user-container">
            <div className="article-user-avatar">
              <img className="article-user-avatar-img" src={'//' + userInfo.avatar} alt="" />
            </div>
            <div className="article-user-info">
              <div className="article-user-name">{userInfo.name}</div>
              <div className="article-user-bio">{userInfo.bio}</div>
            </div>
            {login !== 'login' ? (
              <Button
                className="me-info-data-action-log-out"
                style={{ width: 'fit-content' }}
                variant="contained"
                disableElevation
                onClick={toLogin}
              >
                关注
              </Button>
            ) : (
              selfInfo.user_name !== article?.user && (
                <Button
                  className="me-info-data-action-log-out"
                  style={{ width: 'fit-content' }}
                  variant="contained"
                  disableElevation
                  onClick={addFollow}
                >
                  {isFollow ? '取消关注' : '关注'}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
      <div className="article-action-container">
        <div className="article-action" onClick={addLike(isLike)}>
          {isLike ? (
            <Favorite className="article-icon" style={{ fill: 'red' }}></Favorite>
          ) : (
            <FavoriteBorder className="article-icon"></FavoriteBorder>
          )}
          {article?.like}
        </div>
        <div className="article-action" onClick={addCollect(isCollect)}>
          {isCollect ? (
            <Star style={{ fill: 'yellow' }} className="article-icon"></Star>
          ) : (
            <StarBorder className="article-icon"></StarBorder>
          )}
          {article?.collect}
        </div>
        <div className="article-action" onClick={getComment}>
          <Comment className="article-icon"></Comment>
          {article?.comment}
        </div>
        <div className="article-action" onClick={() => setShareShow(true)}>
          <Share className="article-icon"></Share>
        </div>
      </div>
      {shareShow && <Follow setShareShow={setShareShow} articleId={param.id === undefined ? '' : param.id}></Follow>}
      {commentShow && (
        <div className="article-comment">
          <Close
            className="article-comment-close"
            style={{ fontSize: '23px', opacity: '0.89', color: 'var(--main-icon-color)', cursor: 'pointer' }}
            onClick={() => {
              setCommentShow(false);
            }}
          ></Close>
          <div className="article-comments">
            {commentArray &&
              commentArray.map((item, index) => {
                return (
                  <CommentContent key={index} comment={item.comment} user={item.user} time={item.time}></CommentContent>
                );
              })}
          </div>
          <div className="article-add-comment">
            <input
              className="article-add-comment-input"
              type="text"
              value={commentValue}
              onChange={e => {
                setCommentValue(e.target.value);
              }}
            />
            <button className="article-add-comment-button" onClick={addComment}>
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentContent: FC<{
  comment: string;
  user: string;
  time: string;
}> = ({ comment, user, time }) => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    bio: string;
    avatar: string;
  }>({
    name: '--',
    bio: '--',
    avatar: ''
  });

  const getUserInfo = useCallback(async () => {
    try {
      const userInfoRes = await fetchData<
        {
          name: string;
          bio: string;
          avatar: string;
        },
        { username: string }
      >('POST', { url: '/api/users/other-info' }, { username: user });

      if (userInfoRes.message === 'success') {
        // 数据校验
        if (userInfoRes.data.bio === null) {
          userInfoRes.data.bio = '这个人很懒，什么都没有留下';
        }
        setUserInfo({
          name: userInfoRes.data.name,
          bio: userInfoRes.data.bio,
          avatar: userInfoRes.data.avatar
        });
      }
    } catch (error) {
      ErrorMessage('获取用户信息失败', 2000);
    }
  }, [user]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <div className="article-comment-content">
      <div className="article-comment-content-user">
        <div className="article-comment-content-user-avatar">
          <img className="article-comment-content-user-avatar-img" src={'//' + userInfo.avatar} alt="" />
        </div>
        <div className="article-comment-content-user-info">
          <div className="article-comment-content-user-name">{userInfo.name}</div>
          <div className="article-comment-content-user-comment">{comment}</div>
        </div>
      </div>
      <div className="article-comment-content-time">
        <span>{time}</span>
      </div>
    </div>
  );
};

const Follow: FC<{ setShareShow: ReactSetState<boolean>; articleId: string }> = ({ setShareShow, articleId }) => {
  const [userArray, setUserArray] = useState<{ follow: string; follows_id: string }[]>([]);
  const getFollow = useCallback(async (type: 'follow' | 'fans' = 'fans') => {
    if (type === 'follow') {
      const res = await fetchData<{ follows: { follow: string; follows_id: string }[] }>('GET', {
        url: '/api/users/follows'
      });
      if (res.code === 200) {
        setUserArray(res.data.follows);
      }
    } else {
      const res = await fetchData<{ follows: { follow: string; follows_id: string }[] }>('GET', {
        url: '/api/users/fans'
      });
      if (res.code === 200) {
        setUserArray(res.data.follows);
      }
    }
  }, []);

  useEffect(() => {
    getFollow();
  }, [getFollow]);

  return (
    <PopUps>
      <div className="me-follow-container">
        <div className="me-follow-close" onClick={() => setShareShow(false)}>
          <Close />
        </div>
        <div className="me-follow-content">
          {userArray.map(item => (
            <OtherInfo key={item.follows_id} username={item.follow} articleId={articleId} />
          ))}
        </div>
      </div>
    </PopUps>
  );
};

const OtherInfo: FC<{
  username: string;
  articleId: string;
}> = ({ username, articleId }) => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    bio: string;
    avatar: string;
  }>({
    name: '--',
    bio: '--',
    avatar: ''
  });

  const getUserInfo = useCallback(async () => {
    try {
      const userInfoRes = await fetchData<
        {
          name: string;
          bio: string;
          avatar: string;
        },
        { username: string }
      >('POST', { url: '/api/users/other-info' }, { username });

      if (userInfoRes.message === 'success') {
        // 数据校验
        if (userInfoRes.data.bio === null) {
          userInfoRes.data.bio = '这个人很懒，什么都没有留下';
        }
        setUserInfo({
          name: userInfoRes.data.name,
          bio: userInfoRes.data.bio,
          avatar: userInfoRes.data.avatar
        });
      }
    } catch (error) {
      ErrorMessage('获取用户信息失败', 2000);
    }
  }, [username]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo, username]);

  const stringAvatar = (name: string) => {
    const stringToColor = (string: string) => {
      let hash = 0;
      let i;

      for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = '#';

      for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
      }

      return color;
    };
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 50,
        height: 50
      },
      children: name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0]
    };
  };

  const shareTo = async () => {
    try {
      const res = await fetchData(
        'POST',
        { url: '/api/articles/share' },
        { shareName: username, article_id: articleId }
      );
      if (res.message === 'success') {
        ErrorMessage('分享成功', 2000);
      } else {
        ErrorMessage('分享失败', 2000);
      }
    } catch (error) {
      ErrorMessage('分享失败', 2000);
    }
  };
  return (
    <div className="me-other-info-container">
      <div className="me-other-info">
        {userInfo.avatar === '' ? (
          <Avatar {...stringAvatar(userInfo.name)} alt="avatar" />
        ) : (
          <Avatar
            sx={{
              width: 50,
              height: 50
            }}
            src={'//' + userInfo.avatar}
            alt="avatar"
          />
        )}
        <div className="me-other-info-name">
          <div className="me-other-info-name-content">
            <div style={{ fontSize: '20px', fontWeight: '600' }}>{userInfo.name}</div>
            <div style={{ fontSize: '12px', fontWeight: '300' }}>{userInfo.bio}</div>
          </div>
          <div onClick={shareTo}>
            <Button className="me-info-data-action-edit" style={{ height: '38px' }} variant="outlined">
              分享
            </Button>
          </div>
        </div>
      </div>
      <div className="me-other-info-line"></div>
    </div>
  );
};
