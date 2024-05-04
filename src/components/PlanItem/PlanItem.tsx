import { FC, useState, useEffect, useCallback } from 'react';
import { FavoriteBorder } from '@mui/icons-material';
import { fetchData } from '@myCommon/fetchData.ts';
import { PartItemTypes } from '../../pages/home/pages/newPlan/types.ts';
import { IP } from '@myTypes/types.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PlanItem: FC<{
  articleID: string;
  userName: string;
  type: 'me' | 'other';
  from?: 'discover' | 'search';
  getArticlesFetch?: () => void;
  getSelfUserInfo?: () => void;
}> = ({ articleID, userName, getArticlesFetch, getSelfUserInfo, type, from }) => {
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

  const navigate = useNavigate();

  const fetchArticleInfoData = useCallback(async () => {
    const res = await fetchData<
      {
        article: {
          article_id: string;
          content: string;
          user: string;
          like: number;
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
      } = {
        article_id: '',
        content: {
          title: '',
          plan: [],
          cover: '',
          articleTitle: ''
        },
        user: '',
        like: 0
      };
      newRes.article_id = res.data.article.article_id;
      newRes.content = JSON.parse(res.data.article.content);
      newRes.user = res.data.article.user;
      newRes.like = res.data.article.like;
      setArticle(newRes);
    } else {
      ErrorMessage('获取文章信息失败', 2000);
    }
  }, [articleID]);

  const getUserInfo = useCallback(async () => {
    try {
      const userInfoRes = await fetchData<
        {
          name: string;
          bio: string;
          avatar: string;
        },
        { username: string }
      >('POST', { url: '/api/users/other-info' }, { username: userName });

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
  }, [userName]);

  const daleteArticle = useCallback(async () => {
    try {
      const res = await fetchData<
        string,
        {
          articleID: string;
        }
      >(
        'POST',
        {
          url: '/api/articles/delete-article'
        },
        {
          articleID: articleID
        }
      );

      if (res.code === 200) {
        ErrorMessage('删除成功', 2000);
        getArticlesFetch && getArticlesFetch();
        getSelfUserInfo && getSelfUserInfo();
      } else {
        ErrorMessage('删除失败', 2000);
      }
    } catch (error) {
      ErrorMessage('删除失败', 2000);
    }
  }, [articleID, getArticlesFetch, getSelfUserInfo]);

  const toArticle = () => {
    if (from === 'search') {
      navigate(`/home/search/article/${articleID}`);
      return;
    }
    navigate(`/home/article/${articleID}`);
  };

  useEffect(() => {
    fetchArticleInfoData();
    getUserInfo();
  }, [articleID, fetchArticleInfoData, getUserInfo]);
  return (
    article && (
      <div className="discover-content-item" onClick={type === 'me' ? () => {} : toArticle}>
        <div className="discover-content-item-cover-container">
          <img src={'//' + IP + article.content.cover} className="discover-content-item-cover" alt="image" />
          {type === 'me' && (
            <div className="me-delete-article">
              <Button className="me-info-data-action-log-out" variant="contained" disableElevation onClick={toArticle}>
                详情
              </Button>
              <Button
                className="me-info-data-action-log-out"
                variant="contained"
                disableElevation
                onClick={daleteArticle}
              >
                删除
              </Button>
            </div>
          )}
        </div>
        <div className="discover-content-item-info">
          <div className="discover-content-item-description">{article.content.articleTitle}</div>
          <div className="discover-content-item-article-info">
            <div className="discover-content-item-article-author">
              <img src={'//' + userInfo.avatar} className="discover-content-item-article-author-avatar" alt="avatar" />
              <div className="discover-content-item-article-author-name">{userInfo.name}</div>
            </div>
            <div className="discover-content-item-author-like">
              <FavoriteBorder className="discover-content-item-author-like-icon" />
              <div className="discover-content-item-author-like-number">{article.like}</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export { PlanItem };
