import { FC, useEffect, useRef, useState } from 'react';
import './me.css';
import { Button, Avatar } from '@mui/material';
import { Edit, Logout } from '@mui/icons-material';
import { useWindowSize } from '@uidotdev/usehooks';
import { meKindList, KindKey, UserInfo, TypeNum } from './types.ts';
import { useNavigate, useParams } from 'react-router-dom';
import avatar from '../../../../assets/avatar.jpg';
import { fetchData } from '@myCommon/fetchData.ts';
import { useLoginState } from '@myHooks/useLoginState.ts';
import localforage from 'localforage';
import { useDispatch } from 'react-redux';
import { logoutAction } from '@myStore/slices/loginSlice.ts';
import { PlanItem } from '@myComponents/PlanItem/PlanItem.tsx';
import { Follow } from './pages/Follow.tsx';

export function Component() {
  return <Me></Me>;
}

const Me: FC = () => {
  const pararm = useParams();
  console.log(pararm);
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
    draft: 0
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
        draft: number;
        history: number;
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
          draft: userInfoRes.data.draft
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="me-container">
      <MeInformation userInfo={userInfo} />
      <MeContent userInfo={userInfo} />
    </div>
  );
};

const MeInformation: FC<{ userInfo: UserInfo }> = ({ userInfo }) => {
  const windowSize = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [followShow, setFollowShow] = useState<boolean>(false);
  const [followShowType, setFollowShowType] = useState<'follow' | 'fans'>('follow');

  const logout = async () => {
    localforage.removeItem('token');
    localforage.removeItem('time');
    dispatch(logoutAction());
    navigate('/home/discover/recommand');
  };

  const showFollow = (type: 'follow' | 'fans') => {
    return () => {
      setFollowShowType(type);
      setFollowShow(true);
    };
  };

  return (
    <>
      {followShow && <Follow followShowType={followShowType}></Follow>}
      <div className="me-info-container">
        <div className="me-info-avatar-container">
          <Avatar
            sx={{
              width: windowSize.width && windowSize.width >= 900 ? 180 : 100,
              height: windowSize.width && windowSize.width >= 900 ? 180 : 100
            }}
            src={avatar}
            alt="avatar"
          ></Avatar>
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
                <Button className="me-info-data-action-edit" variant="outlined" startIcon={<Edit></Edit>}>
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
            <span className="me-info-data-follows-text">
              <span>{userInfo.follow}</span>
              <span className="me-info-data-follows-text-title">关注</span>
            </span>
            <span className="me-info-data-follows-text">
              <span>{userInfo.follower}</span>
              <span className="me-info-data-follows-text-title">粉丝</span>
            </span>
          </div>
          <div className="me-info-data-action">
            <Button className="me-info-data-action-edit" variant="outlined" startIcon={<Edit></Edit>}>
              编辑资料
            </Button>
            <Button
              className="me-info-data-action-log-out"
              variant="contained"
              disableElevation
              startIcon={<Logout></Logout>}
            >
              注销
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

const MeContent: FC<{ userInfo: UserInfo }> = ({ userInfo }) => {
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
    draft: 0
  });

  useEffect(() => {
    if (
      param.kind === undefined ||
      (param.kind !== 'production' &&
        param.kind !== 'collect' &&
        param.kind !== 'like' &&
        param.kind !== 'draft' &&
        param.kind !== 'visitHistory')
    ) {
      navigate('production');
    }
    setTypeNum({
      production: userInfo.plan,
      collect: userInfo.collect,
      like: userInfo.like,
      visitHistory: '',
      draft: userInfo.draft
    });
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
      {/* <div className="me-article-content-null">
        <h2 className="me-article-content-null-text">暂时还没有作品在这里哦</h2>
      </div> */}
      <div className="me-article-content-plan">
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
        <PlanItem articleID="1" userName="1"></PlanItem>
      </div>
    </div>
  );
};

export { MeContent };
