import { FC, useEffect, useState } from 'react';
import './themeButton.css';
import { useTheme } from '@myHooks/useTheme.ts';

const ThemeButton: FC<{ display: boolean }> = ({ display }) => {
  const theme = useTheme();
  console.log(theme);
  const [buttonClassName, setButtonClassName] = useState('button');

  useEffect(() => {
    if (theme.themeName === 'dark') {
      setButtonClassName('button night');
    } else if (theme.themeName === 'light') {
      setButtonClassName('button');
    }
  }, [theme]);

  const changeClassName = () => {
    if (buttonClassName === 'button') {
      setButtonClassName('button night');
      theme.changeTheme();
    } else {
      setButtonClassName('button');
      theme.changeTheme();
    }
  };

  return (
    <span
      className={buttonClassName}
      id="button"
      style={{ display: display ? 'block' : 'none' }}
      onClick={changeClassName}
    >
      <span className="btn-inner">
        <span className="circle">
          <span className="circle-night">
            <span className="crater"></span>
            <span className="crater crater2"></span>
            <span className="crater crater3"></span>
          </span>
        </span>
        <span className="halo-box">
          <span className="halo"></span>
          <span className="halo halo2"></span>
          <span className="halo halo3"></span>
        </span>
        <span className="clouds">
          <span className="cloud"></span>
          <span className="cloud cloud2"></span>
          <span className="cloud cloud3"></span>
          <span className="cloud cloud4"></span>
          <span className="cloud cloud5"></span>
          <span className="cloud cloud6"></span>
          <span className="cloud cloud7"></span>
        </span>
        <span className="clouds clouds2">
          <span className="cloud"></span>
          <span className="cloud cloud2"></span>
          <span className="cloud cloud3"></span>
          <span className="cloud cloud4"></span>
          <span className="cloud cloud5"></span>
          <span className="cloud cloud6"></span>
          <span className="cloud cloud7"></span>
        </span>
        <span className="stars">
          <span className="star">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star2">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star3">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star4">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star5">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star6">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star7">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star8">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star9">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span className="star star10">
            <svg version="1.1" viewBox="0 0 20 20" height="20" width="20" style={{ width: '100%', height: '100%' }}>
              <path
                d="M 0 10 c 5 0 10 -5 10 -10 c 0 5 5 10 10 10 c -5 0 -10 5 -10 10 c 0 -5 -5 -10 -10 -10"
                stroke="#fff"
                strokeWidth="1"
                fill="#fff"
              ></path>
            </svg>
          </span>
        </span>
      </span>
    </span>
  );
};

export { ThemeButton };
