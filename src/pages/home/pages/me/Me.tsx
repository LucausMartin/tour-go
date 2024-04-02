import { FC, useEffect, useRef, useState } from 'react';
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
    draft: 0,
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
        draft: number;
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
          draft: userInfoRes.data.draft,
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
      <MeContent userInfo={userInfo} />
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
    navigate('/home/discover/recommand');
  };

  const showFollow = (type: 'follow' | 'fans') => {
    return () => {
      setFollowShowType(type);
      setFollowShow(true);
    };
  };

  const changeAvatar = () => {
    console.log('change avatar');
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
    console.log(formData.get('avatar'));
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
      {followShow && <Follow followShowType={followShowType}></Follow>}
      <div className="me-info-container">
        <div
          className="me-info-avatar-container"
          onMouseEnter={showEditAvatar(true)}
          onMouseLeave={showEditAvatar(false)}
          onClick={changeAvatar}
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
        className="follow-close"
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

const Follow: FC<{ followShowType: 'follow' | 'fans' }> = ({ followShowType }) => {
  return (
    <PopUps>
      <div className="follow-container">
        <div className="follow-close">
          <Close />
        </div>
        {followShowType}
      </div>
    </PopUps>
  );
};

export { MeContent };
