import { FC, useCallback, useEffect, useState } from 'react';
import { messageKindList, KindKey } from './types.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginState } from '@myHooks/useLoginState.ts';
import { selectMessage, addMessage } from '@myStore/slices/messageSlice.ts';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '@myCommon/fetchData.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { Button } from '@mui/material';
import { PartItemTypes } from '../newPlan/types.ts';
import './message.css';
import '../me/me.css';
import { IP } from '@myTypes/types.ts';

export const Message: FC = () => {
  useLoginState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const messageState = useSelector(selectMessage);

  const changeKind = (kindKey: KindKey) => {
    return () => {
      navigate(`${kindKey}`);
    };
  };

  const getUnreadMessageFetch = useCallback(async () => {
    try {
      const res = await fetchData<{
        message: {
          message_id: string;
          content: string;
          user: string;
          like: number;
        };
      }>('GET', {
        url: `/api/messages/get-unread-messages`
      });

      if (res.code === 200) {
        dispatch(addMessage(res.data));
      } else {
        ErrorMessage('获取未读消息失败', 2000);
      }
    } catch (e) {
      ErrorMessage('获取未读消息失败', 2000);
    }
  }, [dispatch]);

  const readAllMessage = () => {
    readAllMessageFetch();
  };

  const readAllMessageFetch = async () => {
    try {
      const res = await fetchData('GET', {
        url: `/api/messages/read-all`
      });

      if (res.code === 200) {
        getUnreadMessageFetch();
      } else {
        ErrorMessage('标记已读失败', 2000);
      }
    } catch (e) {
      ErrorMessage('标记已读失败', 2000);
    }
  };

  useEffect(() => {
    if (!param.kind || !messageKindList.find(item => item.key === param.kind)) {
      navigate('comment');
    }
  }, [param.kind, navigate, messageState]);
  return (
    <div className="message-container">
      <div className="message-main-area">
        <div className="message-kind-container">
          {messageKindList.map(item => (
            <div
              className="message-kind-title-item"
              onClick={changeKind(item.key)}
              style={{
                backgroundColor: param.kind === item.key ? 'var(--active-background-color)' : '',
                color: param.kind === item.key ? 'var(--active-font-color)' : '',
                fontWeight: param.kind === item.key ? '600' : ''
              }}
              key={item.key}
            >
              {item.title}
              {item.key === 'fans' && messageState.typeList.fans.count > 0 ? messageState.typeList.fans.count : ''}
              {item.key === 'likeCollect' && messageState.typeList.likeCollects.count > 0
                ? messageState.typeList.likeCollects.count
                : ''}
              {item.key === 'share' && messageState.typeList.shares.count > 0 ? messageState.typeList.shares.count : ''}
              {item.key === 'comment' && messageState.typeList.comments.count > 0
                ? messageState.typeList.comments.count
                : ''}
            </div>
          ))}
        </div>
        <div className="message-line"></div>
        <div className="message-content-container">
          {param.kind === 'fans' &&
            messageState.typeList.fans.list.map(item => (
              <MessageFollow
                key={item.message_id}
                messageID={item.message_id}
                user={item.user_name_send}
                time={item.time}
                read={item.read}
                getMessage={getUnreadMessageFetch}
              />
            ))}
          {param.kind === 'likeCollect' &&
            messageState.typeList.likeCollects.list.map(item => (
              <MessageLikeCollect
                key={item.message_id}
                messageID={item.message_id}
                user={item.user_name_send}
                time={item.time}
                type={item.type}
                articleID={item.message_content}
                getMessage={getUnreadMessageFetch}
                read={item.read}
              />
            ))}
          {param.kind === 'share' &&
            messageState.typeList.shares.list.map(item => (
              <MessageShare
                key={item.message_id}
                messageID={item.message_id}
                user={item.user_name_send}
                time={item.time}
                articleID={item.message_content}
                getMessage={getUnreadMessageFetch}
              />
            ))}
          {param.kind === 'comment' &&
            messageState.typeList.comments.list.map(item => (
              <MessageComment
                key={item.message_id}
                messageID={item.message_id}
                user={item.user_name_send}
                time={item.time}
                articleID={item.message_content}
                getMessage={getUnreadMessageFetch}
                read={item.read}
              />
            ))}
        </div>
      </div>
      <Button
        className="me-info-data-action-log-out message-read-all"
        variant="contained"
        disableElevation
        onClick={readAllMessage}
      >
        全部标记已读
      </Button>
    </div>
  );
};

const MessageFollow: FC<{
  messageID: string;
  user: string;
  time: string;
  read: number;
  getMessage: () => void;
}> = ({ messageID, user, time, read, getMessage }) => {
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

  const readMessageFetch = useCallback(async () => {
    try {
      const readMessageRes = await fetchData<{ message: string }, { message_id: string }>(
        'POST',
        { url: '/api/messages/mark-read' },
        { message_id: messageID }
      );
      if (readMessageRes.message === 'success') {
        getMessage();
      }
    } catch (error) {
      ErrorMessage('标记已读失败', 2000);
    }
  }, [messageID, getMessage]);

  const readMessage = () => {
    readMessageFetch();
  };

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  return (
    <div className="message-follow-item-container">
      <div className="message-follow-item-avatar">
        <img className="message-follow-item-avatar-img" src={'//' + userInfo.avatar} alt="avatar" />
      </div>
      <div className="message-follow-item-info">
        <div className="message-follow-item-name">{userInfo.name}</div>
        <div className="message-follow-item-bio">{time}</div>
      </div>
      <div className="message-follow-item-follow">
        {read === 0 && (
          <Button className="me-info-data-action-log-out" variant="contained" disableElevation onClick={readMessage}>
            标记已读
          </Button>
        )}
        关注了你
      </div>
    </div>
  );
};

const MessageLikeCollect: FC<{
  messageID: string;
  user: string;
  time: string;
  articleID: string;
  type: string;
  read: number;
  getMessage: () => void;
}> = ({ messageID, user, time, articleID, type, getMessage, read }) => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    bio: string;
    avatar: string;
  }>({
    name: '--',
    bio: '--',
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

  const readMessageFetch = useCallback(async () => {
    try {
      const readMessageRes = await fetchData<{ message: string }, { message_id: string }>(
        'POST',
        { url: '/api/messages/mark-read' },
        { message_id: messageID }
      );
      if (readMessageRes.message === 'success') {
        getMessage();
      }
    } catch (error) {
      ErrorMessage('标记已读失败', 2000);
    }
  }, [messageID, getMessage]);

  const readMessage = () => {
    readMessageFetch();
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
        articleID: JSON.parse(articleID).article_id
      }
    );

    if (res.code === 200) {
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
  }, [articleID]);

  useEffect(() => {
    getUserInfo();
    fetchArticleInfoData();
  }, [getUserInfo, fetchArticleInfoData]);
  return (
    <div
      className="message-follow-item-container"
      style={{
        height: '100px'
      }}
    >
      <div className="message-follow-item-avatar">
        <img className="message-follow-item-avatar-img" src={'//' + userInfo.avatar} alt="avatar" />
      </div>
      <div className="message-follow-item-info">
        <div className="message-follow-item-name">{userInfo.name}</div>
        <div className="message-follow-item-bio">{time}</div>
      </div>
      <div className="message-follow-item-follow">
        {read === 0 && (
          <Button className="me-info-data-action-log-out" variant="contained" disableElevation onClick={readMessage}>
            标记已读
          </Button>
        )}
        <div className="message-follow-item-article">
          <div className="message-follow-item-article-cover">
            <img
              className="message-follow-item-article-cover-img"
              src={article?.content.cover ? '//' + IP + article.content.cover : ''}
              alt="cover"
            />
          </div>
          <div className="message-follow-item-article-title">{article?.content.title}</div>
        </div>
        {type === 'like' ? '点赞' : '收藏'}
      </div>
    </div>
  );
};

const MessageShare: FC<{
  messageID: string;
  user: string;
  time: string;
  articleID: string;
  getMessage: () => void;
}> = ({ messageID, user, time, articleID, getMessage }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    bio: string;
    avatar: string;
  }>({
    name: '--',
    bio: '--',
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

  const readMessageFetch = useCallback(async () => {
    try {
      const readMessageRes = await fetchData<{ message: string }, { message_id: string }>(
        'POST',
        { url: '/api/messages/mark-read' },
        { message_id: messageID }
      );
      if (readMessageRes.message === 'success') {
        getMessage();
      }
    } catch (error) {
      ErrorMessage('标记已读失败', 2000);
    }
  }, [messageID, getMessage]);

  const readMessage = () => {
    readMessageFetch();
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
        articleID: articleID
      }
    );

    if (res.code === 200) {
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
  }, [articleID]);

  const toArticle = () => {
    navigate(`/home/article/${articleID}`);
    readMessage();
  };

  useEffect(() => {
    getUserInfo();
    fetchArticleInfoData();
  }, [getUserInfo, fetchArticleInfoData]);
  return (
    <div
      className="message-follow-item-container"
      style={{
        height: '100px'
      }}
    >
      <div className="message-follow-item-avatar">
        <img className="message-follow-item-avatar-img" src={'//' + userInfo.avatar} alt="avatar" />
      </div>
      <div className="message-follow-item-info">
        <div className="message-follow-item-name">{userInfo.name}</div>
        <div className="message-follow-item-bio">{time}</div>
      </div>
      <div className="message-follow-item-follow">
        <div className="message-follow-item-article">
          <div className="message-follow-item-article-cover">
            <img
              className="message-follow-item-article-cover-img"
              src={article?.content.cover ? '//' + IP + article.content.cover : ''}
              alt="cover"
            />
          </div>
          <div className="message-follow-item-article-title">{article?.content.title}</div>
        </div>
        <Button className="me-info-data-action-log-out" variant="contained" disableElevation onClick={toArticle}>
          查看
        </Button>
      </div>
    </div>
  );
};

const MessageComment: FC<{
  messageID: string;
  user: string;
  time: string;
  articleID: string;
  read: number;
  getMessage: () => void;
}> = ({ messageID, user, time, articleID, getMessage, read }) => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    bio: string;
    avatar: string;
  }>({
    name: '--',
    bio: '--',
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

  const readMessageFetch = useCallback(async () => {
    try {
      const readMessageRes = await fetchData<{ message: string }, { message_id: string }>(
        'POST',
        { url: '/api/messages/mark-read' },
        { message_id: messageID }
      );
      if (readMessageRes.message === 'success') {
        getMessage();
      }
    } catch (error) {
      ErrorMessage('标记已读失败', 2000);
    }
  }, [messageID, getMessage]);

  const readMessage = () => {
    readMessageFetch();
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
        articleID: JSON.parse(articleID).article_id
      }
    );

    if (res.code === 200) {
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
  }, [articleID]);

  useEffect(() => {
    getUserInfo();
    fetchArticleInfoData();
  }, [getUserInfo, fetchArticleInfoData]);
  return (
    <div className="message-follow-item-container-temp">
      <div
        className="message-follow-item-container"
        style={{
          height: '100px',
          marginBottom: '0'
        }}
      >
        <div className="message-follow-item-avatar">
          <img className="message-follow-item-avatar-img" src={'//' + userInfo.avatar} alt="avatar" />
        </div>
        <div className="message-follow-item-info">
          <div className="message-follow-item-name">{userInfo.name}</div>
          <div className="message-follow-item-bio">{time}</div>
        </div>
        <div className="message-follow-item-follow">
          {read === 0 && (
            <Button className="me-info-data-action-log-out" variant="contained" disableElevation onClick={readMessage}>
              标记已读
            </Button>
          )}
          <div className="message-follow-item-article">
            <div className="message-follow-item-article-cover">
              <img
                className="message-follow-item-article-cover-img"
                src={article?.content.cover ? '//' + IP + article.content.cover : ''}
                alt="cover"
              />
            </div>
            <div className="message-follow-item-article-title">{article?.content.title}</div>
          </div>
        </div>
      </div>
      <div className="message-follow-item-container-comment">评论道：{JSON.parse(articleID).message}</div>
    </div>
  );
};
