import { FC, useEffect } from 'react';
import './message.css';
import { messageKindList, KindKey } from './types.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginState } from '@myHooks/useLoginState.ts';

export function Component() {
  return <Message></Message>;
}

const Message: FC = () => {
  useLoginState();
  const navigate = useNavigate();
  const param = useParams();

  const changeKind = (kindKey: KindKey) => {
    return () => {
      navigate(`${kindKey}`);
    };
  };

  useEffect(() => {
    if (!param.kind || !messageKindList.find(item => item.key === param.kind)) {
      navigate('comment');
    }
  }, [param.kind, navigate]);

  useEffect(() => {}, []);
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
            </div>
          ))}
        </div>
        <div className="message-line"></div>
        <div className="message-content-container"></div>
      </div>
    </div>
  );
};
