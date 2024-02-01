import { FC, useEffect, useRef, useState } from 'react';
import './me.css';
import { Button, Avatar } from '@mui/material';
import { Edit, ExitToApp } from '@mui/icons-material';
import { useWindowSize } from '@uidotdev/usehooks';
import { meKindList, KindKey } from './types.ts';
import { useNavigate, useParams } from 'react-router-dom';
import avatar from '../../../../assets/avatar.jpg';

export function Component() {
  return <Me></Me>;
}

const Me: FC = () => {
  return (
    <div className="me-container">
      <MeInformation />
      <MeContent></MeContent>
    </div>
  );
};

const MeInformation = () => {
  const windowSize = useWindowSize();

  return (
    <>
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
          <div className="me-info-data-name">Lucaus Martin</div>
          <div className="me-info-data-name-box">
            <div className="me-info-data-username">
              <span className="me-info-data-username-title">用户名:</span>
              <span>LucausMartin_8749</span>
            </div>
            <div className="me-info-data-bio">
              <span className="me-info-data-username-title">签名:</span>
              &nbsp;
              <span>
                biobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobiobio
              </span>
            </div>
          </div>
          {windowSize.width && windowSize.width >= 900 ? (
            <>
              <div className="me-info-data-follows">
                <span className="me-info-data-follows-text">
                  <span>123</span>
                  <span className="me-info-data-follows-text-title">关注</span>
                </span>
                <span className="me-info-data-follows-text">
                  <span>123</span>
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
                  startIcon={<ExitToApp></ExitToApp>}
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
              <span>123</span>
              <span className="me-info-data-follows-text-title">关注</span>
            </span>
            <span className="me-info-data-follows-text">
              <span>123</span>
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
              startIcon={<ExitToApp></ExitToApp>}
            >
              注销
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

const MeContent = () => {
  const param = useParams();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [startState, setStartState] = useState<boolean>(false);
  const [endState, setEndState] = useState<boolean>(true);

  const ob = {
    production: 123,
    like: 456,
    collect: 789,
    draft: 0,
    visitHistory: null
  };

  useEffect(() => {
    navigate('production');
  }, [navigate]);

  const changeKind = (kindKey: KindKey) => {
    return () => {
      navigate(`${kindKey}`);
    };
  };

  const onScrollHandle = () => {
    const scrollLeft = rootRef.current?.scrollLeft;
    const scrollWidth = rootRef.current?.scrollWidth;
    const clientWidth = rootRef.current?.clientWidth;
    console.log(scrollLeft);
    console.log(scrollWidth);
    console.log(clientWidth);
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
            {item.title} {item.key === 'visitHistory' ? '' : ' '}
            <span style={{ fontWeight: 'normal' }}>{ob[item.key]}</span>
          </div>
        ))}
        {endState && <div className="me-article-title-list-right-mask"></div>}
      </div>
    </div>
  );
};

export { MeContent };
