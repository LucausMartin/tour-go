import { FC, useState } from 'react';
import { Card, TextField, CardContent, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PopUps } from '@myComponents/PopUps/PopUps.tsx';
import { Typewriter } from '@myComponents/TypeWriter/TypeWriter.tsx';
import { ErrorMessageType, ErrorMessage } from './types.ts';
import { Login, VisibilityOff, Visibility, ArrowBackIosNew, Close } from '@mui/icons-material';
import { fetchData } from '@myCommon/fetchData.ts';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAction, logoutAction } from '@myStore/slices/loginSlice.ts';

import JSEncrypt from 'jsencrypt';
import localforage from 'localforage';

import './login.css';

const test = async () => {
  const res = await fetchData<{ users: string[] }>('GET', {
    url: '/api/users/list'
  });
  console.log(res);
};

const encryptor = new JSEncrypt();

const LoginPopUps: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingButtonState, setLoadingButtonState] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<ErrorMessageType>('default');
  const [focusUsername, setFocusUsername] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [certifyCharacters, setCertifyCharacters] = useState<string>('');
  const [name, setName] = useState<string>('');

  const getEncryptedPassword = async (password: string) => {
    // 获取公钥
    const publicKey = await fetchData<{ publicKey: string }>('GET', { url: '/api/users/get-publick-key' });
    if (publicKey.code !== 200) {
      throw new Error('server error');
    }
    encryptor.setPublicKey(publicKey.data.publicKey);
    if (typeof encryptor.getPublicKey() === 'boolean') {
      throw new Error('encryptor error');
    }
    if (typeof encryptor.encrypt(password) === 'string') {
      return encryptor.encrypt(password) as string;
    } else {
      throw new Error('encryptor error');
    }
  };

  const loginFetch = async () => {
    // 验证密码是否正确
    // 获得密文密码
    const encryptedPassword = await getEncryptedPassword(password);
    const res = await fetchData<{ token: string; time: number }, { username: string; password: string }>(
      'POST',
      { url: '/api/users/login' },
      { username: '@' + username, password: encryptedPassword }
    );
    // 密码正确
    if (res.code === 200) {
      await localforage.setItem('token', res.data.token);
      await localforage.setItem('time', res.data.time);
      dispatch(loginAction());
      setLoading(false);
      navigate('/');
      return true;
      // 密码错误
    } else if (res.code === 503) {
      setErrorType('password');
      setLoading(false);
      return false;
    } else {
      throw new Error('server error');
    }
  };

  const registerFetch = async () => {
    // 获得密文密码
    const encryptedPassword = await getEncryptedPassword(password);
    const res = await fetchData<never, { username: string; password: string; name: string; certifyCharacters: string }>(
      'POST',
      { url: '/api/users/register' },
      {
        username: '@' + username,
        password: encryptedPassword,
        name: name,
        certifyCharacters: certifyCharacters
      }
    );
    if (res.code === 200) {
      setErrorType('default');
      setLoadingButtonState('login');
      setLoading(false);
      const loginSuccessState = await loginFetch();
      if (loginSuccessState) {
        dispatch(loginAction());
      } else {
        throw new Error('server error');
      }
    } else {
      throw new Error('server error');
    }
  };

  const hasUserFetch = async () => {
    // 验证是否存在用户
    const res = await fetchData<{ hasUser: boolean }, { username: string }>(
      'POST',
      { url: '/api/users/has' },
      { username: '@' + username }
    );
    // 不存在用户
    if (res.code === 200 && res.data.hasUser === false) {
      setErrorType('register');
      setLoadingButtonState('register');
      setLoading(false);
      //存在用户
    } else if (res.code === 200 && res.data.hasUser === true) {
      if (password === '') {
        setErrorType('passwordEmpty');
        setLoading(false);
        return;
      }
      // 登录
      loginFetch();
    } else {
      throw new Error('server error');
    }
  };

  const loginMethod = (type: string) => {
    return async () => {
      if (type === 'login') {
        if (username === '') {
          setErrorType('usernameEmpty');
          return;
        }
        setLoading(true);
        try {
          // 验证是否存在用户
          hasUserFetch();
        } catch (err) {
          setTimeout(() => {
            setLoading(false);
          }, 3000);
          setErrorType('network');
        }
      } else {
        if (password === '') {
          setErrorType('passwordEmpty');
          return;
        }
        if (name === '') {
          setErrorType('nameEmpty');
          return;
        }
        if (confirmPassword !== password) {
          setErrorType('confirmPassword');
          return;
        }
        if (certifyCharacters === '') {
          setErrorType('certifyCharactersEmpty');
          return;
        }
        if (certifyCharacters.match(/[^a-zA-Z0-9]/)) {
          setErrorType('certifyCharactersViolation');
          return;
        }
        setLoading(true);
        try {
          // 注册
          registerFetch();
        } catch (err) {
          setTimeout(() => {
            setLoading(false);
          }, 3000);
          setErrorType('network');
        }
      }
    };
  };

  const changeFocusUsernameState = (state: boolean) => {
    return () => {
      setFocusUsername(state);
    };
  };

  const changeShowPasswordState = (state: boolean) => {
    return () => {
      setShowPassword(state);
    };
  };

  return (
    <PopUps>
      <Card style={{ position: 'relative' }} className="login-desktop-container">
        {loadingButtonState === 'register' && (
          <div
            onClick={() => {
              setErrorType('default');
              setLoadingButtonState('login');
              setLoading(false);
            }}
            style={{ position: 'relative', top: '7.835px', left: '3.775px' }}
          >
            <ArrowBackIosNew style={{ fontSize: '20px', opacity: '0.89' }} />
          </div>
        )}
        <div
          onClick={async () => {
            dispatch(logoutAction());
            localforage.removeItem('loginTodo');
          }}
          style={{ position: 'absolute', top: '4.9px', right: '4px' }}
        >
          <Close style={{ fontSize: '23px', opacity: '0.89' }} />
        </div>
        <CardContent className="login-desktop-content">
          <div className="login-desktop-tip">
            <span className="login-desktop-tip-title">用户名登录</span>
            <Typewriter
              className={'login-desktop-tip-content'}
              text={ErrorMessage[errorType]}
              typingSpeed={100}
            ></Typewriter>
          </div>
          <div className="login-desktop-input">
            <TextField
              className="login-desktop-input-field"
              id="login-desktop-username"
              variant="standard"
              label="Username"
              onFocus={changeFocusUsernameState(true)}
              onBlur={changeFocusUsernameState(false)}
              InputProps={{
                startAdornment: focusUsername && <InputAdornment position="start">@</InputAdornment>
              }}
              value={username}
              onChange={e => {
                setUsername(e.target.value);
              }}
            ></TextField>
            <TextField
              className="login-desktop-input-field"
              id="login-desktop-password"
              variant="standard"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: showPassword ? (
                  <div onClick={changeShowPasswordState(false)} style={{ cursor: 'pointer' }}>
                    <Visibility />
                  </div>
                ) : (
                  <div onClick={changeShowPasswordState(true)} style={{ cursor: 'pointer' }}>
                    <VisibilityOff />
                  </div>
                )
              }}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
            ></TextField>
            {/* 注册出现的新填写 */}
            {loadingButtonState === 'register' && (
              <>
                <TextField
                  className="login-desktop-input-field"
                  id="desktop-confirm-password"
                  variant="standard"
                  label="ConfirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                  }}
                ></TextField>
                <TextField
                  className="login-desktop-input-field"
                  id="register-desktop-name"
                  variant="standard"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                ></TextField>
                <TextField
                  className="login-desktop-input-field"
                  id="register-desktop-certify-characters"
                  variant="standard"
                  label="CertifyCharacters"
                  value={certifyCharacters}
                  onChange={e => {
                    setCertifyCharacters(e.target.value);
                  }}
                ></TextField>
              </>
            )}
          </div>
          <LoadingButton
            className="login-desktop-action-login"
            style={{ color: loading ? 'rgba(255 255 255 / 74.3%)' : '' }}
            variant="contained"
            disableElevation
            startIcon={<Login></Login>}
            onClick={loginMethod(loadingButtonState)}
            loading={loading}
            loadingPosition="start"
          >
            {loadingButtonState}
          </LoadingButton>
          <button onClick={test}>123</button>
        </CardContent>
      </Card>
    </PopUps>
  );
};

export { LoginPopUps };
