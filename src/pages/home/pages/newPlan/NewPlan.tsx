import { FC, useState } from 'react';
import './newPlan.css';
import { MdAddCircleOutline, MdHighlightOff } from 'react-icons/md';
import { DatetimePicker } from 'react-vant';
import { ReactSetState } from '@myTypes/types.ts';
import { PartItemTypes } from './types.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { Button } from '@mui/material';
import { fetchData } from '@myCommon/fetchData.ts';
import { PopUps } from '@myComponents/PopUps/PopUps.tsx';
import AMap from '@myComponents/AMap/Amap.tsx';
import { useLoginState } from '@myHooks/useLoginState.ts';

export function Component() {
  return <NewPlan></NewPlan>;
}

const NewPlan: FC = () => {
  useLoginState();
  const partItem: PartItemTypes = {
    title: '',
    startTime: '',
    endTime: '',
    placeLocation: [0, 0],
    cost: 0,
    takeThings: '',
    tips: '',
    addressName: ''
  };

  const [partList, setPartList] = useState<PartItemTypes[]>([]);
  const [title, setTitle] = useState<string>('');

  const createPlanFetch = async () => {
    if (title === '') {
      ErrorMessage('计划书题目不能为空', 2000);
      return;
    }
    if (partList.length === 0) {
      ErrorMessage('请添加阶段', 2000);
      return;
    }
    for (let i = 0; i < partList.length; i++) {
      if (partList[i].title === '') {
        ErrorMessage('阶段题目不能为空', 2000);
        return;
      }
      if (partList[i].startTime === '' || partList[i].endTime === '') {
        ErrorMessage('请选择阶段的开始时间和结束时间', 2000);
        return;
      }
    }

    try {
      const res = await fetchData<string, { content: { title: string; plan: PartItemTypes[] } }>(
        'POST',
        {
          url: '/api/plans/new-plan'
        },
        {
          content: {
            title: title,
            plan: partList
          }
        }
      );
      if (res.code === 200) {
        ErrorMessage('创建成功', 2000);
        return;
      }
    } catch (error) {
      ErrorMessage('创建失败', 2000);
    }
  };
  return (
    <div className="plan-container">
      <div className="plan-title-container">
        <span className="plan-title">计划书题目：</span>
        <input
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
          }}
          className="plan-input"
          style={{ width: '266px', height: '34px' }}
        ></input>
      </div>
      {partList.map((item, index) => {
        return <Part setPartList={setPartList} partList={partList} key={index} item={item} order={index + 1}></Part>;
      })}
      <div
        onClick={() =>
          setPartList(pre => {
            return [...pre, partItem];
          })
        }
        className="plan-add-part-container"
      >
        <MdAddCircleOutline></MdAddCircleOutline>
      </div>
      <div className="plan-add-part-container">
        <Button className="me-info-data-action-log-out" variant="contained" disableElevation onClick={createPlanFetch}>
          创建
        </Button>
      </div>
    </div>
  );
};

const Part: FC<{
  partList: PartItemTypes[];
  order: number;
  setPartList: ReactSetState<PartItemTypes[]>;
  item: PartItemTypes;
}> = ({ order, setPartList, item, partList }) => {
  const [mapShow, setMapShow] = useState<boolean>(false);

  const deletePart = () => {
    setPartList(pre => {
      const newList = [...pre];
      newList.splice(order - 1, 1);
      return newList;
    });
  };

  const formatTime = (time: string) => {
    const date = new Date(time);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="plan-part-container">
      <span className="plan-part-cancle plan-part-order" onClick={deletePart}>
        <MdHighlightOff></MdHighlightOff>
      </span>
      <span className="plan-part-order">{order + '.'}</span> &nbsp;&nbsp;&nbsp;
      <div className="plan-part-content">
        <div className="plan-part-content-item">
          <div>阶段题目：</div>
          <input
            value={item.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPartList(pre => {
                const newList = [...pre];
                newList[order - 1].title = e.target.value;
                return newList;
              });
            }}
            className="plan-input plan-part-content-item-input"
            style={{ height: '34px' }}
          ></input>
        </div>
        <div className="plan-part-content-item">
          <div>开始时间：</div>
          {partList[order - 1].startTime !== '' ? (
            <div className="plan-part-content-item-input plan-part-content-item-button">
              {formatTime(partList[order - 1].startTime)}
              <Button
                className="me-info-data-action-log-out"
                variant="contained"
                disableElevation
                onClick={() => {
                  setPartList(pre => {
                    const newList = [...pre];
                    for (let i = order - 1; i < newList.length; i++) {
                      newList[i].startTime = '';
                      newList[i].endTime = '';
                    }
                    return newList;
                  });
                }}
              >
                编辑
              </Button>
            </div>
          ) : order > 1 ? (
            partList[order - 2].endTime === '' ? (
              <div className="plan-part-content-item-input">请先选择上一阶段的结束时间</div>
            ) : (
              <DatetimePicker
                type="datetime"
                minDate={new Date(partList[order - 2].endTime)}
                maxDate={new Date(new Date().getFullYear() + 3, new Date().getMonth(), new Date().getDate())}
                value={item.startTime}
                className="plan-input plan-part-content-item-input"
                style={{ height: '34px' }}
                onConfirm={(value: string) => {
                  setPartList(pre => {
                    const newList = [...pre];
                    newList[order - 1].startTime = value.toString();
                    return newList;
                  });
                }}
                onChange={() => {}}
              />
            )
          ) : (
            <DatetimePicker
              type="datetime"
              minDate={new Date()}
              maxDate={new Date(new Date().getFullYear() + 3, new Date().getMonth(), new Date().getDate())}
              value={item.startTime}
              className="plan-input plan-part-content-item-input"
              style={{ height: '34px' }}
              onConfirm={(value: string) => {
                setPartList(pre => {
                  const newList = [...pre];
                  newList[order - 1].startTime = value.toString();
                  return newList;
                });
              }}
              onChange={() => {}}
            />
          )}
        </div>
        <div className="plan-part-content-item">
          <div>结束时间：</div>
          {partList[order - 1].endTime !== '' ? (
            <div className="plan-part-content-item-input plan-part-content-item-button">
              {formatTime(partList[order - 1].endTime)}
              <Button
                className="me-info-data-action-log-out"
                variant="contained"
                disableElevation
                onClick={() => {
                  setPartList(pre => {
                    const newList = [...pre];
                    for (let i = order - 1; i < newList.length; i++) {
                      if (i === order - 1) {
                        newList[i].endTime = '';
                      } else {
                        newList[i].startTime = '';
                        newList[i].endTime = '';
                      }
                    }
                    return newList;
                  });
                }}
              >
                编辑
              </Button>
            </div>
          ) : partList[order - 1].startTime === '' ? (
            <div className="plan-part-content-item-input">请先选择这一阶段的开始时间</div>
          ) : (
            <DatetimePicker
              type="datetime"
              minDate={new Date(partList[order - 1].startTime)}
              maxDate={new Date(new Date().getFullYear() + 3, new Date().getMonth(), new Date().getDate())}
              value={item.endTime}
              className="plan-input plan-part-content-item-input"
              style={{ height: '34px' }}
              onConfirm={(value: string) => {
                setPartList(pre => {
                  const newList = [...pre];
                  newList[order - 1].endTime = value.toString();
                  return newList;
                });
              }}
              onChange={() => {}}
            />
          )}
        </div>
        <div className="plan-part-content-item">
          <div>地点：</div>
          {partList[order - 1].addressName ? (
            <div className="plan-part-content-item-input">{partList[order - 1].addressName}</div>
          ) : !mapShow ? (
            <Button
              className="plan-part-content-item-input me-info-data-action-log-out"
              variant="contained"
              disableElevation
              onClick={() => setMapShow(true)}
            >
              选择地点
            </Button>
          ) : (
            <PopUps>
              <div className="plan-part-map">
                <AMap setMapShow={setMapShow} partList={partList} setPartList={setPartList} order={order} />
              </div>
            </PopUps>
          )}
        </div>
        <div className="plan-part-content-item">
          <div>花费：</div>
          <input
            value={item.cost}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              // 判断是否只是数字或 ''
              if (!/^\d*$/.test(e.target.value) && e.target.value !== '') {
                ErrorMessage('请输入数字', 2000);
                return;
              }
              setPartList(pre => {
                const newList = [...pre];
                newList[order - 1].cost = Number(e.target.value);
                return newList;
              });
            }}
            className="plan-input plan-part-content-item-input"
            style={{ height: '34px' }}
          ></input>
        </div>
        <div className="plan-part-content-item">
          <div>携带物品：</div>
          <textarea
            value={item.takeThings}
            style={{
              paddingTop: '10px',
              paddingBottom: '10px',
              height: '34px',
              overflow: 'hidden',
              resize: 'vertical'
            }}
            className="plan-input plan-part-content-item-input"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setPartList(pre => {
                const newList = [...pre];
                newList[order - 1].takeThings = e.target.value;
                return newList;
              });
            }}
          ></textarea>
        </div>
        <div className="plan-part-content-item">
          <div>备注：</div>
          <textarea
            value={item.tips}
            style={{
              paddingTop: '10px',
              paddingBottom: '10px',
              height: '34px',
              overflow: 'hidden',
              resize: 'vertical'
            }}
            className="plan-input plan-part-content-item-input"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setPartList(pre => {
                const newList = [...pre];
                newList[order - 1].tips = e.target.value;
                return newList;
              });
            }}
          ></textarea>
        </div>
      </div>
    </div>
  );
};
