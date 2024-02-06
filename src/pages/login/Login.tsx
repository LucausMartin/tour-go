import { FC, useState } from 'react';
import { Card, TextField, CardContent, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PopUps } from '@myComponents/PopUps/PopUps.tsx';
import { Typewriter } from '@myComponents/TypeWriter/TypeWriter.tsx';
import { ErrorMessageType, ErrorMessage } from './types.ts';
import './login.css';

export function Component() {
  return <Login></Login>;
}

const Login: FC = () => {
  const [errorType, setErrorType] = useState<ErrorMessageType>('default');
  const [focusUsername, setFocusUsername] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const usernameErrorTip = () => {
    setErrorType('register');
    setLoading(true);
  };

  const changeFocusUsernameState = (state: boolean) => {
    return () => {
      setFocusUsername(state);
    };
  };

  return (
    <PopUps>
      <Card className="login-desktop-container">
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
            ></TextField>
            <TextField
              className="login-desktop-input-field"
              id="login-desktop-password"
              variant="standard"
              label="Password"
            ></TextField>
            {errorType === 'register' && (
              <>
                <TextField
                  className="login-desktop-input-field"
                  id="desktop-confirm-password"
                  variant="standard"
                  label="ConfirmPassword"
                ></TextField>
                <TextField
                  className="login-desktop-input-field"
                  id="register-desktop-certify-characters-1"
                  variant="standard"
                  label="CertifyCharacters"
                ></TextField>
              </>
            )}
          </div>
          <LoadingButton
            className="login-desktop-action-login"
            style={{ color: loading ? 'rgba(255 255 255 / 74.3%)' : ' ' }}
            variant="contained"
            disableElevation
            startIcon={<Login></Login>}
            onClick={usernameErrorTip}
            loading={loading}
            loadingPosition="start"
          >
            {errorType === 'register' ? 'register' : 'login'}
          </LoadingButton>
        </CardContent>
      </Card>
    </PopUps>
  );
};

export { Login };
