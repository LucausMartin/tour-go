import { FC, useEffect, useState } from 'react';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import './publish.css';
import { fetchData } from '@myCommon/fetchData.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { PartItemTypes } from '../newPlan/types.ts';

export function Component() {
  return <Publish></Publish>;
}

const Publish: FC = () => {
  const [plan, setPlan] = useState<{ plan_id: string; title: string }[] | []>([]);
  const [emepty, setEmpty] = useState(false);

  const getStartPlan = async () => {
    const res = await fetchData<{
      plans: {
        plan_id: string;
        title: string;
      }[];
    }>('GET', {
      url: '/api/plans/get-start-plan'
    });
    if (res.code === 200) {
      if (res.data.plans.length === 0) {
        setEmpty(true);
      } else {
        setPlan(res.data.plans);
      }
    } else {
      ErrorMessage('获取进行中的计划失败', 2000);
    }
  };

  useEffect(() => {
    getStartPlan();
  }, [emepty]);

  return (
    <div className="publish-container">
      <SelectPlans />
      <Plan plan={plan} emepty={emepty} />
    </div>
  );
};

const SelectPlans: FC = () => {
  const [arrowDown, setArrowDown] = useState(true);
  const [waitPlans, setWaitPlans] = useState<{ plan_id: string; title: string }[] | null>(null);

  const getWaitPlans = async () => {
    const res = await fetchData<{
      plans: {
        plan_id: string;
        title: string;
      }[];
    }>('GET', {
      url: '/api/plans/wait-plans'
    });
    if (res.code === 200) {
      setWaitPlans(res.data.plans);
      setArrowDown(!arrowDown);
    } else {
      ErrorMessage('获取待开始计划失败', 2000);
    }
  };

  const showWaitPlans = (type: boolean) => {
    return () => {
      if (type) {
        getWaitPlans();
      } else {
        setArrowDown(!arrowDown);
      }
    };
  };
  return (
    <>
      <div className="publish-change-plan" onClick={showWaitPlans(arrowDown)}>
        <span>切换进行的计划</span>
        {arrowDown ? <ArrowDropDown /> : <ArrowDropUp />}
      </div>
      {!arrowDown && (
        <div className="publish-select-plans">
          {waitPlans &&
            waitPlans.map(item => {
              return (
                <div className="publish-select-plans-item" key={item.plan_id}>
                  <span>{item.title}</span>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

const Plan: FC<{ plan: { plan_id: string; title: string }[] | []; emepty: boolean }> = ({ plan, emepty }) => {
  const [planInfo, setPlanInfo] = useState<{
    content: {
      title: string;
      plan: PartItemTypes[];
    };
    complate: number[];
  } | null>(null);

  const getPlanInfo = async (plan_id: string) => {
    if (plan_id === '') {
      return;
    }
    const res = await fetchData<
      {
        plan: {
          content: {
            title: string;
            plan: PartItemTypes[];
          };
          complate: number[];
        };
      },
      {
        plan_id: string;
      }
    >(
      'POST',
      {
        url: '/api/plans/get-plan'
      },
      {
        plan_id
      }
    );
    if (res.code === 200) {
      setPlanInfo(res.data.plan);
    } else {
      ErrorMessage('获取计划详情失败', 2000);
    }
  };

  const formatTime = (time: string) => {
    // 将时间戳字符串转换为 Date 对象
    const date = new Date(time);

    // 获取年、月、日、时、分
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份是从 0 开始的，所以需要加 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 格式化成 "年-月-日 时:分" 形式
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
  };

  useEffect(() => {
    getPlanInfo(plan[0] ? plan[0].plan_id : '');
  }, [plan]);

  return emepty ? (
    <div className="publish-no-content-container">
      <h2>暂时没有开始的计划</h2>
    </div>
  ) : (
    <div className="publish-start-plan-container">
      <div className="publish-start-plan-title">
        <span>{planInfo ? planInfo.content.title : ''}</span>
      </div>
      {planInfo &&
        planInfo.content.plan.map((item, index) => {
          return (
            <div className="publish-start-plan-item-container" key={index}>
              <div className="publish-start-plan-item-progress-bar">
                <div
                  className={
                    planInfo.complate.includes(index + 1)
                      ? 'publish-start-plan-item-progress-line-complate'
                      : 'publish-start-plan-item-progress-line'
                  }
                >
                  <div className="publish-start-plan-item-progress-ball"></div>
                </div>
              </div>
              <div className="publish-start-plan-item-content">
                <div className="publish-start-plan-item-title">
                  <span>{item.title}</span>
                </div>
                <div>
                  <span>{formatTime(item.startTime)}</span>&nbsp;至&nbsp;<span>{formatTime(item.endTime)}</span>
                </div>
                <div className="publish-start-plan-item-place">
                  <span>地点：</span>
                  <span>{item.addressName}</span>
                </div>
                <div className="publish-start-plan-item-take">
                  <span>需携带物品：</span>
                  <span>{item.takeThings === '' ? '无' : item.takeThings}</span>
                </div>
                <div className="publish-start-plan-item-take">
                  <span>备忘录：</span>
                  <span>{item.tips === '' ? '无' : item.tips}</span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
