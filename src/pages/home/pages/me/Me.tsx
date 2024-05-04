import { FC, useEffect, useRef, useState, useCallback } from 'react';
import './me.css';
import { Button, Avatar } from '@mui/material';
import { Edit, Logout, Close } from '@mui/icons-material';
import { useWindowSize } from '@uidotdev/usehooks';
import { meKindList, KindKey, UserInfo, TypeNum } from './types.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import { useLoginState } from '@myHooks/useLoginState.ts';
import localforage from 'localforage';
import { useDispatch } from 'react-redux';
import { logoutAction } from '@myStore/slices/loginSlice.ts';
import { PlanItem } from '@myComponents/PlanItem/PlanItem.tsx';
import { Uploader, type UploaderValueItem } from 'react-vant';
import { PopUps } from '@myComponents/PopUps/PopUps.tsx';
import { ReactSetState } from '@myTypes/types.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { PartItemTypes } from '../newPlan/types.ts';
import { addMessage } from '@myStore/slices/messageSlice.ts';

export const Me: FC = () => {
  useLoginState();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    userName: '--',
    name: '--',
    bio: '--',
    follow: 0,
    follower: 0,
    plan: 0,
    like: 0,
    collect: 0,
    article: 0,
    avatar: ''
  });

  const getUserInfo = async () => {
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
        history: number;
        avatar: string;
      }>('GET', {
        url: '/api/users/self-info'
      });

      if (userInfoRes.message === 'success') {
        // 数据校验
        if (userInfoRes.data.bio === null) {
          userInfoRes.data.bio = '这个人很懒，什么都没有留下';
        }
        setUserInfo({
          userName: userInfoRes.data.user_name,
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
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="me-container">
      <MeInformation userInfo={userInfo} getUserInfo={getUserInfo} />
      <MeContent getUserInfo={getUserInfo} userInfo={userInfo} />
    </div>
  );
};

const MeInformation: FC<{ userInfo: UserInfo; getUserInfo: () => void }> = ({ userInfo, getUserInfo }) => {
  const windowSize = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [followShow, setFollowShow] = useState<boolean>(false);
  const [followShowType, setFollowShowType] = useState<'follow' | 'fans'>('follow');
  const [editAvatarShow, setEditAvatarShow] = useState<boolean>(false);
  const [editInfoShow, setEditInfoShow] = useState<boolean>(false);

  const logout = async () => {
    localforage.removeItem('token');
    localforage.removeItem('time');
    dispatch(logoutAction());
    dispatch(
      addMessage({
        count: 0,
        typeList: {
          comments: {
            count: 0,
            list: []
          },
          likeCollects: {
            count: 0,
            list: []
          },
          fans: {
            count: 0,
            list: []
          },
          shares: {
            count: 0,
            list: []
          }
        }
      })
    );
    navigate('/home/discover/recommand');
  };

  const showFollow = (type: 'follow' | 'fans') => {
    return () => {
      setFollowShowType(type);
      setFollowShow(true);
    };
  };

  const showEditAvatar = (showType: boolean) => {
    return () => {
      setEditAvatarShow(showType);
    };
  };

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
        width: windowSize.width && windowSize.width >= 900 ? 180 : 100,
        height: windowSize.width && windowSize.width >= 900 ? 180 : 100
      },
      children: name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0]
    };
  };

  const uploadAvatar = async (file: File) => {
    // 验证是否小于 5M
    if (file.size > 5 * 1024 * 1024) {
      ErrorMessage('图片大小不能超过 5M', 2000);
      return {} as UploaderValueItem;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const uploadAvatarRes = await fetchData(
        'POST',
        {
          url: '/api/users/change-avatar',
          headers: {
            'Content-Type': ''
          }
        },
        formData
      );
      if (uploadAvatarRes.message === 'success') {
        getUserInfo();
      }
      return {} as UploaderValueItem;
    } catch (error) {
      ErrorMessage('上传失败', 2000);
      return {} as UploaderValueItem;
    }
  };

  return (
    <>
      {editInfoShow && (
        <PopUps>
          <MeEditInfo getUserInfo={getUserInfo} userInfo={userInfo} setEditInfoShow={setEditInfoShow}></MeEditInfo>
        </PopUps>
      )}
      {followShow && (
        <Follow followShowType={followShowType} setFollowShow={setFollowShow} getUserInfo={getUserInfo}></Follow>
      )}
      <div className="me-info-container">
        <div
          className="me-info-avatar-container"
          onMouseEnter={showEditAvatar(true)}
          onMouseLeave={showEditAvatar(false)}
        >
          {editAvatarShow && (
            <div className="me-info-avatar-edit">
              <Uploader
                style={{ cursor: 'pointer' }}
                previewImage={false}
                accept="image/*"
                upload={uploadAvatar}
              ></Uploader>
            </div>
          )}
          {userInfo.avatar === '' ? (
            <Avatar {...stringAvatar(userInfo.name)} alt="avatar" />
          ) : (
            <Avatar
              sx={{
                width: windowSize.width && windowSize.width >= 900 ? 180 : 100,
                height: windowSize.width && windowSize.width >= 900 ? 180 : 100
              }}
              src={'//' + userInfo.avatar}
              alt="avatar"
            />
          )}
        </div>
        <div className="me-info-data-container">
          <div className="me-info-data-name">{userInfo.name}</div>
          <div className="me-info-data-name-box">
            <div className="me-info-data-username">
              <span className="me-info-data-username-title">用户名:</span>
              <span>{userInfo.userName}</span>
            </div>
            <div className="me-info-data-bio">
              <span className="me-info-data-username-title">签名:</span>
              &nbsp;
              <span>{userInfo.bio}</span>
            </div>
          </div>
          {windowSize.width && windowSize.width >= 900 ? (
            <>
              <div className="me-info-data-follows">
                <span onClick={showFollow('follow')} className="me-info-data-follows-text">
                  <span>{userInfo.follow}</span>
                  <span className="me-info-data-follows-text-title">关注</span>
                </span>
                <span onClick={showFollow('fans')} className="me-info-data-follows-text">
                  <span>{userInfo.follower}</span>
                  <span className="me-info-data-follows-text-title">粉丝</span>
                </span>
              </div>
              <div className="me-info-data-action">
                <Button
                  className="me-info-data-action-edit"
                  variant="outlined"
                  startIcon={<Edit></Edit>}
                  onClick={() => setEditInfoShow(true)}
                >
                  编辑资料
                </Button>
                <Button
                  className="me-info-data-action-log-out"
                  variant="contained"
                  disableElevation
                  onClick={logout}
                  startIcon={<Logout></Logout>}
                >
                  注销
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {windowSize.width && windowSize.width < 900 ? (
        <div className="me-info-data-follows-mobile">
          <div className="me-info-data-follows">
            <span onClick={showFollow('follow')} className="me-info-data-follows-text">
              <span>{userInfo.follow}</span>
              <span className="me-info-data-follows-text-title">关注</span>
            </span>
            <span onClick={showFollow('fans')} className="me-info-data-follows-text">
              <span>{userInfo.follower}</span>
              <span className="me-info-data-follows-text-title">粉丝</span>
            </span>
          </div>
          <div className="me-info-data-action">
            <Button
              className="me-info-data-action-edit"
              variant="outlined"
              startIcon={<Edit></Edit>}
              onClick={() => setEditInfoShow(true)}
            >
              编辑资料
            </Button>
            <Button
              className="me-info-data-action-log-out"
              variant="contained"
              disableElevation
              startIcon={<Logout></Logout>}
              onClick={logout}
            >
              注销
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

const MeContent: FC<{ userInfo: UserInfo; getUserInfo: () => void }> = ({ userInfo, getUserInfo }) => {
  const param = useParams();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [startState, setStartState] = useState<boolean>(false);
  const [endState, setEndState] = useState<boolean>(true);
  const [typeNum, setTypeNum] = useState<TypeNum>({
    production: 0,
    like: 0,
    collect: 0,
    visitHistory: '',
    article: 0
  });
  const [planList, setPlanList] = useState<
    {
      plan_id: string;
      content: {
        title: string;
        plan: PartItemTypes[];
      };
      user: string;
      start: number;
    }[]
  >([]);
  const [articleList, setArticleList] = useState<
    {
      article_id: string;
      content: {
        title: string;
        plan: PartItemTypes[];
      };
      user: string;
    }[]
  >([]);

  const [likeArticle, setLikeArticle] = useState<
    | {
        article_id: string;
        user: string;
      }[]
    | null
  >(null);

  const [collectArticle, setCollectArticle] = useState<
    | {
        article_id: string;
        user: string;
      }[]
    | null
  >(null);

  const [historyArticle, setHistoryArticle] = useState<
    | {
        article_id: string;
        user: string;
      }[]
    | null
  >(null);

  const getPlansFetch = async () => {
    const res = await fetchData<{
      plans: {
        plan_id: string;
        content: string;
        user: string;
        start: number;
      }[];
    }>('GET', {
      url: '/api/plans/get-plans'
    });

    if (res.code === 200) {
      const newRes: {
        plan_id: string;
        content: {
          title: string;
          plan: PartItemTypes[];
        };
        user: string;
        start: number;
      }[] = [];

      res.data.plans.forEach(item => {
        newRes.push({
          plan_id: item.plan_id,
          content: JSON.parse(item.content),
          user: item.user,
          start: item.start
        });
      });
      setPlanList(newRes);
    }
  };

  const getArticlesFetch = async () => {
    const res = await fetchData<{
      articles: {
        article_id: string;
        content: string;
        user: string;
      }[];
    }>('GET', {
      url: '/api/articles/get-articles'
    });

    if (res.code === 200) {
      const newRes: {
        article_id: string;
        content: {
          title: string;
          plan: PartItemTypes[];
        };
        user: string;
      }[] = [];

      res.data.articles.forEach(item => {
        newRes.push({
          article_id: item.article_id,
          content: JSON.parse(item.content),
          user: item.user
        });
      });
      setArticleList(newRes);
    }
  };

  const getLikesFetch = async () => {
    try {
      const res = await fetchData<{
        likes: {
          article_id: string;
          user: string;
        }[];
      }>('GET', {
        url: '/api/likes/get-likes'
      });

      if (res.code === 200) {
        setLikeArticle(res.data.likes);
      } else {
        ErrorMessage('获取点赞文章失败', 2000);
      }
    } catch (error) {
      ErrorMessage('获取点赞文章失败', 2000);
    }
  };

  const getCollectFetch = async () => {
    try {
      const res = await fetchData<{
        collects: {
          article_id: string;
          user: string;
        }[];
      }>('GET', {
        url: '/api/collects/get-collects'
      });

      if (res.code === 200) {
        setCollectArticle(res.data.collects);
      } else {
        ErrorMessage('获取收藏文章失败', 2000);
      }
    } catch (error) {
      ErrorMessage('获取收藏文章失败', 2000);
    }
  };

  const getHistoryFetch = async () => {
    try {
      const res = await fetchData<{
        histories: {
          article_id: string;
          user: string;
        }[];
      }>('GET', {
        url: '/api/histories/get-histories'
      });

      if (res.code === 200) {
        setHistoryArticle(res.data.histories);
      } else {
        ErrorMessage('获取收藏文章失败', 2000);
      }
    } catch (error) {
      ErrorMessage('获取收藏文章失败', 2000);
    }
  };

  useEffect(() => {
    if (
      param.kind === undefined ||
      (param.kind !== 'production' &&
        param.kind !== 'collect' &&
        param.kind !== 'like' &&
        param.kind !== 'article' &&
        param.kind !== 'visitHistory')
    ) {
      navigate('production');
    }

    setTypeNum({
      production: userInfo.plan,
      collect: userInfo.collect,
      like: userInfo.like,
      visitHistory: '',
      article: userInfo.article
    });

    if (param.kind === 'production') {
      getPlansFetch();
    }
    if (param.kind === 'article') {
      getArticlesFetch();
    }
    if (param.kind === 'like') {
      getLikesFetch();
    }
    if (param.kind === 'collect') {
      getCollectFetch();
    }
    if (param.kind === 'visitHistory') {
      getHistoryFetch();
    }
  }, [navigate, userInfo, param.kind]);

  const changeKind = (kindKey: KindKey) => {
    return () => {
      navigate(`${kindKey}`);
    };
  };

  const onScrollHandle = () => {
    const scrollLeft = rootRef.current?.scrollLeft;
    const scrollWidth = rootRef.current?.scrollWidth;
    const clientWidth = rootRef.current?.clientWidth;
    if (scrollLeft === 0) {
      setStartState(false);
    } else {
      setStartState(true);
    }
    if (scrollWidth && (scrollLeft ? scrollLeft : 0) + (clientWidth ? clientWidth : 0) < scrollWidth) {
      setEndState(true);
    } else {
      setEndState(false);
    }
  };

  return (
    <div className="me-article-container">
      <div ref={rootRef} className="me-article-title" onScrollCapture={onScrollHandle}>
        {startState && <div className="me-article-title-list-left-mask"></div>}
        {meKindList.map(item => (
          <div
            className="me-article-title-item"
            onClick={changeKind(item.key)}
            style={{
              backgroundColor: param.kind === item.key ? 'var(--active-background-color)' : '',
              color: param.kind === item.key ? 'var(--active-font-color)' : '',
              fontWeight: param.kind === item.key ? '600' : ''
            }}
            key={item.key}
          >
            {item.title} {item.key === 'visitHistory' ? '' : <>&nbsp;</>}
            <span style={{ fontWeight: 'normal' }}>{typeNum[item.key]}</span>
          </div>
        ))}
        {endState && <div className="me-article-title-list-right-mask"></div>}
      </div>

      <div className="me-article-content-plan">
        {param.kind === 'production' &&
          (planList.length > 0 ? (
            planList.map(item => (
              <Plans key={item.plan_id} plan={item} getPlansFetch={getPlansFetch} getUserInfo={getUserInfo}></Plans>
            ))
          ) : (
            <div className="me-article-content-null">
              <h2 className="me-article-content-null-text">暂时还没有作品在这里哦</h2>
            </div>
          ))}
        {param.kind === 'article' &&
          (articleList.length > 0 ? (
            articleList.map(item => {
              return (
                <PlanItem
                  key={item.article_id}
                  articleID={item.article_id}
                  userName={item.user}
                  type="me"
                  getArticlesFetch={getArticlesFetch}
                  getSelfUserInfo={getUserInfo}
                ></PlanItem>
              );
            })
          ) : (
            <div className="me-article-content-null">
              <h2 className="me-article-content-null-text">暂时还没有文章在这里哦</h2>
            </div>
          ))}
        {param.kind === 'like' &&
          (likeArticle && likeArticle.length > 0 ? (
            likeArticle.map(item => {
              return (
                <PlanItem
                  key={item.article_id}
                  articleID={item.article_id}
                  userName={item.user}
                  type="other"
                ></PlanItem>
              );
            })
          ) : (
            <div className="me-article-content-null">
              <h2 className="me-article-content-null-text">暂时还没有文章在这里哦</h2>
            </div>
          ))}
        {param.kind === 'collect' &&
          (collectArticle && collectArticle.length > 0 ? (
            collectArticle.map(item => {
              return (
                <PlanItem
                  key={item.article_id}
                  articleID={item.article_id}
                  userName={item.user}
                  type="other"
                ></PlanItem>
              );
            })
          ) : (
            <div className="me-article-content-null">
              <h2 className="me-article-content-null-text">暂时还没有文章在这里哦</h2>
            </div>
          ))}
        {param.kind === 'visitHistory' &&
          (historyArticle && historyArticle.length > 0 ? (
            historyArticle.map(item => {
              return (
                <PlanItem
                  key={item.article_id}
                  articleID={item.article_id}
                  userName={item.user}
                  type="other"
                ></PlanItem>
              );
            })
          ) : (
            <div className="me-article-content-null">
              <h2 className="me-article-content-null-text">暂时还没有文章在这里哦</h2>
            </div>
          ))}
      </div>
    </div>
  );
};

const MeEditInfo: FC<{ getUserInfo: () => void; userInfo: UserInfo; setEditInfoShow: ReactSetState<boolean> }> = ({
  getUserInfo,
  userInfo,
  setEditInfoShow
}) => {
  const [name, setName] = useState<string>(userInfo.name);
  const [bio, setBio] = useState<string>(userInfo.bio);

  const submitEditInfo = async () => {
    try {
      const editInfoRes = await fetchData(
        'POST',
        {
          url: '/api/users/change-info'
        },
        {
          name,
          bio
        }
      );
      if (editInfoRes.message === 'success') {
        getUserInfo();
        setEditInfoShow(false);
      }
    } catch (error) {
      ErrorMessage('修改失败', 2000);
    }
  };

  return (
    <div className="me-edit-info-container">
      <div
        style={{ color: 'white' }}
        className="me-follow-close"
        onClick={() => {
          setEditInfoShow(false);
        }}
      >
        <Close />
      </div>
      <div className="me-edit-info-name-title">name</div>
      <input value={name} className="me-edit-info-name" type="text" onChange={e => setName(e.target.value)} />
      <div className="me-edit-info-bio-title">bio</div>
      <textarea value={bio} className="me-edit-info-bio" name="bio" onChange={e => setBio(e.target.value)}></textarea>
      <Button
        className="me-info-data-action-log-out"
        variant="contained"
        disableElevation
        startIcon={<Logout></Logout>}
        onClick={submitEditInfo}
      >
        提交
      </Button>
    </div>
  );
};

const Follow: FC<{
  followShowType: 'follow' | 'fans';
  setFollowShow: ReactSetState<boolean>;
  getUserInfo: () => void;
}> = ({ followShowType, setFollowShow, getUserInfo }) => {
  const [userArray, setUserArray] = useState<{ follow: string; follows_id: string }[]>([]);
  const getFollow = async (type: 'follow' | 'fans') => {
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
  };

  useEffect(() => {
    getFollow(followShowType);
  }, [followShowType]);

  return (
    <PopUps>
      <div className="me-follow-container">
        <div className="me-follow-close" onClick={() => setFollowShow(false)}>
          <Close />
        </div>
        <div className="me-follow-content">
          {userArray.map(item => (
            <OtherInfo
              key={item.follows_id}
              username={item.follow}
              id={item.follows_id}
              followShowType={followShowType}
              getFollow={getFollow}
              getSelfUserInfo={getUserInfo}
            />
          ))}
        </div>
      </div>
    </PopUps>
  );
};

const OtherInfo: FC<{
  username: string;
  id: string;
  followShowType: 'follow' | 'fans';
  getFollow: (type: 'follow' | 'fans') => void;
  getSelfUserInfo: () => void;
}> = ({ username, id, followShowType, getFollow, getSelfUserInfo }) => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    bio: string;
    avatar: string;
  }>({
    name: '--',
    bio: '--',
    avatar: ''
  });
  const [isFollow, setIsFollow] = useState<'已关注' | '关注' | '移除粉丝'>(
    followShowType === 'fans' ? '移除粉丝' : '已关注'
  );

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

  const changeFollowState = async () => {
    if (isFollow === '已关注') {
      try {
        const followRes = await fetchData('POST', { url: '/api/users/remove-follow' }, { id, removeName: username });
        if (followRes.message === 'success') {
          setIsFollow('关注');
          getSelfUserInfo();
        } else {
          ErrorMessage('取消关注失败', 2000);
        }
      } catch (error) {
        ErrorMessage('取消关注失败', 2000);
      }
    } else if (isFollow === '关注') {
      try {
        const followRes = await fetchData('POST', { url: '/api/users/add-follow' }, { followName: username });
        if (followRes.message === 'success') {
          setIsFollow('已关注');
          getSelfUserInfo();
        } else {
          ErrorMessage('关注失败', 2000);
        }
      } catch (error) {
        ErrorMessage('关注失败', 2000);
      }
    } else {
      try {
        const followRes = await fetchData('POST', { url: '/api/users/remove-fans' }, { removeName: username });
        if (followRes.message === 'success') {
          getFollow('fans');
          getSelfUserInfo();
        } else {
          ErrorMessage('移除粉丝失败', 2000);
        }
      } catch (error) {
        ErrorMessage('移除粉丝失败', 2000);
      }
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
          <div onClick={changeFollowState}>
            <Button className="me-info-data-action-edit" style={{ height: '38px' }} variant="outlined">
              {isFollow}
            </Button>
          </div>
        </div>
      </div>
      <div className="me-other-info-line"></div>
    </div>
  );
};

const Plans: FC<{
  plan: {
    plan_id: string;
    content: {
      title: string;
      plan: PartItemTypes[];
    };
    start: number;
  };
  getPlansFetch: () => void;
  getUserInfo: () => void;
}> = ({ plan, getPlansFetch, getUserInfo }) => {
  const changePlanStartStateFetch = async (state: number) => {
    try {
      const changePlanStartStateRes = await fetchData(
        'POST',
        { url: '/api/plans/change-start-state' },
        { plan_id: plan.plan_id, state }
      );
      if (changePlanStartStateRes.code === 200) {
        getPlansFetch();
      }
    } catch (error) {
      ErrorMessage('操作失败', 2000);
    }
  };

  const changePlanStartState = (state: number) => {
    return () => {
      changePlanStartStateFetch(state);
    };
  };

  const deletePlanFetch = async () => {
    const res = await fetchData<string, { plan_id: string }>(
      'POST',
      { url: '/api/plans/delete-plan' },
      { plan_id: plan.plan_id }
    );
    if (res.code === 200) {
      getPlansFetch();
      getUserInfo();
    } else {
      ErrorMessage('删除失败', 2000);
    }
  };
  return (
    <>
      <div className="me-article-plan-container">
        <div>{plan.content.title}</div>
        <div className="me-article-plan-action">
          <Button className="me-info-data-action-edit" style={{ height: '38px' }} variant="outlined">
            查看详情
          </Button>
          <Button
            className={plan.start === 0 ? 'me-info-data-action-edit' : 'me-info-data-action-log-out'}
            style={{ height: '38px' }}
            variant={plan.start === 0 ? 'outlined' : 'contained'}
            onClick={changePlanStartState(plan.start === 0 ? 1 : 0)}
          >
            {plan.start === 0 ? '开始执行' : '停止计划'}
          </Button>
          <Button
            className="me-info-data-action-log-out"
            variant="contained"
            disableElevation
            onClick={deletePlanFetch}
          >
            删除
          </Button>
        </div>
      </div>
      <div className="me-article-plan-line"></div>
    </>
  );
};

export { MeContent };
