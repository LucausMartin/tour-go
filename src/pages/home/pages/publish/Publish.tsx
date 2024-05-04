import React, { FC, useEffect, useState } from 'react';
import { ArrowDropDown, ArrowDropUp, Search } from '@mui/icons-material';
import AMapLoader from '@amap/amap-jsapi-loader';

import './publish.css';
import { fetchData } from '@myCommon/fetchData.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';
import { PartItemTypes } from '../newPlan/types.ts';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Space } from '@myComponents/Space/Space.tsx';
import { Uploader, type UploaderValueItem } from 'react-vant';
import { ReactSetState } from '@myTypes/types.ts';
import '../me/me.css';
import '../../../login/login.css';

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
      <SelectPlans setPlan={setPlan} />
      <Plan plan={plan} emepty={emepty} />
    </div>
  );
};

const SelectPlans: FC<{ setPlan: ReactSetState<{ plan_id: string; title: string }[] | []> }> = ({ setPlan }) => {
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

  const changePlanStartStateFetch = async (id: string) => {
    try {
      const changePlanStartStateRes = await fetchData(
        'POST',
        { url: '/api/plans/change-start-state' },
        { plan_id: id, state: 1 }
      );
      if (changePlanStartStateRes.code === 200) {
        getWaitPlans();
      }
    } catch (error) {
      ErrorMessage('操作失败', 2000);
    }
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
                <div
                  className="publish-select-plans-item"
                  key={item.plan_id}
                  onClick={() => {
                    changePlanStartStateFetch(item.plan_id);
                    setPlan([item]);
                  }}
                >
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

  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [coverName, setCoverName] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [labels, setLabels] = useState<{ label_id: string; name: string }[] | []>([]);
  const [selectLabel, setSelectLabel] = useState<{ label_id: string; name: string }[] | null>(null);

  const getLabelsFetch = async () => {
    const res = await fetchData<{
      labels: {
        label_id: string;
        name: string;
      }[];
    }>('GET', {
      url: '/api/labels/get-labels'
    });
    if (res.code === 200) {
      setLabels(res.data.labels);
    } else {
      ErrorMessage('获取标签失败', 2000);
    }
  };

  const selectLabelAction = (item: { label_id: string; name: string }) => {
    return () => {
      if (selectLabel) {
        if (selectLabel.includes(item)) {
          setSelectLabel(selectLabel.filter(label => label !== item));
        } else {
          setSelectLabel([...selectLabel, item]);
        }
      } else {
        setSelectLabel([item]);
      }
    };
  };

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
      // 向每一个 plan 中加一个 loading 属性
      const newPlan = res.data.plan.content.plan.map(item => {
        return { ...item, loading: false };
      });
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'null'.
      res.data.plan.content.plan = newPlan;
      setPlanInfo(res.data.plan);
    } else {
      ErrorMessage('获取计划详情失败', 2000);
    }
  };

  const setComplate = (index: number, type: number) => {
    const newComplateArr = planInfo ? planInfo.complate : [];
    if (type === 1) {
      newComplateArr.push(index + 1);
    } else {
      // 从数组中删除指定元素
      newComplateArr.splice(newComplateArr.indexOf(index + 1), 1);
    }
    setComplateFetch(plan[0] ? plan[0].plan_id : '', newComplateArr);
  };

  const setComplateFetch = async (plan_id: string, complate: Array<number>) => {
    const res = await fetchData<
      string,
      {
        plan_id: string;
        complate: Array<number>;
      }
    >(
      'POST',
      {
        url: '/api/plans/set-complate'
      },
      {
        plan_id,
        complate
      }
    );
    if (res.code === 200) {
      getPlanInfo(plan_id);
    } else {
      ErrorMessage('更新计划失败', 2000);
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

  const uploadImg = (index: number) => {
    return async (file: File) => {
      // 验证是否小于 5M
      if (file.size > 5 * 1024 * 1024) {
        ErrorMessage('图片大小不能超过 5M', 2000);
        return {} as UploaderValueItem;
      }
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const uploadCoverRes = await fetchData<
          {
            coverImg: string;
          },
          FormData
        >(
          'POST',
          {
            url: '/api/articles/add-cover',
            headers: {
              'Content-Type': ''
            }
          },
          formData
        );
        if (uploadCoverRes.message === 'success') {
          // 存进 planInfo.content.plan[index].img
          const newPlanInfo = JSON.parse(JSON.stringify(planInfo));
          if (!newPlanInfo) {
            return {} as UploaderValueItem;
          }
          newPlanInfo.content.plan[index].img = URL.createObjectURL(file);
          newPlanInfo.content.plan[index].imgName = uploadCoverRes.data.coverImg;
          setPlanInfo(newPlanInfo);
          return {} as UploaderValueItem;
        }
        return {} as UploaderValueItem;
      } catch (error) {
        ErrorMessage('上传失败', 2000);
        return {} as UploaderValueItem;
      }
    };
  };

  const uploadCover = async (file: File) => {
    // 验证是否小于 5M
    if (file.size > 5 * 1024 * 1024) {
      ErrorMessage('图片大小不能超过 5M', 2000);
      return {} as UploaderValueItem;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const uploadCoverRes = await fetchData<
        {
          coverImg: string;
        },
        FormData
      >(
        'POST',
        {
          url: '/api/articles/add-cover',
          headers: {
            'Content-Type': ''
          }
        },
        formData
      );
      if (uploadCoverRes.message === 'success') {
        setCoverName(uploadCoverRes.data.coverImg);
        // 存进 planInfo.content.plan[index].img
        setCoverImg(URL.createObjectURL(file));
        return {} as UploaderValueItem;
      }
      return {} as UploaderValueItem;
    } catch (error) {
      ErrorMessage('上传失败', 2000);
      return {} as UploaderValueItem;
    }
  };

  const changeText = (index: number) => {
    return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newPlanInfo = JSON.parse(JSON.stringify(planInfo));
      if (!newPlanInfo) {
        return;
      }
      newPlanInfo.content.plan[index].text = e.target.value;
      setPlanInfo(newPlanInfo);
    };
  };

  const addArticleFetch = async () => {
    // 验证是否有未填写的
    planInfo?.content.plan.forEach(item => {
      if (item.text === null || item.text === undefined) {
        ErrorMessage('请填写完整内容', 2000);
        return;
      }
    });
    if (!coverImg) {
      ErrorMessage('请上传封面', 2000);
      return;
    }
    if (!title) {
      ErrorMessage('请填写描述', 2000);
      return;
    }
    // 发送请求
    const contentOnject = {
      title: planInfo?.content.title,
      plan: planInfo?.content.plan.map(item => {
        return {
          title: item.title,
          startTime: item.startTime,
          endTime: item.endTime,
          placeLocation: item.placeLocation,
          cost: item.cost,
          takeThings: item.takeThings,
          tips: item.tips,
          addressName: item.addressName,
          imgName: item.imgName === null || item.imgName === undefined ? null : item.imgName,
          text: item.text
        };
      }),
      cover: coverName,
      articleTitle: title
    };
    const res = await fetchData<string, { content: object; human_labels: { label_id: string; name: string }[] | null }>(
      'POST',
      {
        url: '/api/articles/new-article'
      },
      {
        content: contentOnject,
        human_labels: selectLabel
      }
    );

    if (res.code === 200) {
      ErrorMessage('发布成功', 2000);
    } else {
      ErrorMessage('发布失败', 2000);
    }
  };

  const getImgFetch = async (text: string | null | undefined, index: number) => {
    if (!text) {
      return;
    }
    const res = await fetchData<
      {
        img: string;
      },
      {
        text: string;
      }
    >(
      'POST',
      {
        url: '/api/articles/get-img'
      },
      {
        text
      }
    );
    if (res.code === 200) {
      window.open(res.data.img);
      const newPlanInfo = JSON.parse(JSON.stringify(planInfo));
      if (!newPlanInfo) {
        return;
      }
      newPlanInfo.content.plan[index].loading = false;
      setPlanInfo(newPlanInfo);
    } else {
      ErrorMessage('获取图片失败', 2000);
    }
  };

  const getImg = (item: PartItemTypes, index: number) => {
    //看看是否为空
    if (!item.text) {
      ErrorMessage('请填写描述', 2000);
      return;
    }
    // 将该条的 loading 设置为 true
    const newPlanInfo = JSON.parse(JSON.stringify(planInfo));
    if (!newPlanInfo) {
      return;
    }
    newPlanInfo.content.plan[index].loading = true;
    setPlanInfo(newPlanInfo);
    getImgFetch(item.text, index);
  };

  const comparePlanComplate = async () => {
    AMapLoader.load({
      key: '2ba62778feb049646db8c836342d345b', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then(AMap => {
      const plan_id = plan[0] ? plan[0].plan_id : '';
      navigator.geolocation.getCurrentPosition(
        async pos => {
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
            const complateArray = res.data.plan.complate;
            // 遍历每一个阶段，查看当前时间是否在该阶段的时间范围内
            res.data.plan.content.plan.forEach((item, index) => {
              const nowTime = new Date().getTime();
              const startTime = new Date(item.startTime).getTime();
              const endTime = new Date(item.endTime).getTime();
              if (nowTime >= startTime && nowTime <= endTime) {
                // 如果当前时间在该阶段的时间范围内，且该阶段未完成，则判断是否到达该阶段地点1公里以内
                if (!complateArray.includes(index + 1)) {
                  // @ts-expect-error status is any
                  AMap.convertFrom([pos.coords.longitude, pos.coords.latitude], 'gps', function (status, result) {
                    if (result.info === 'ok') {
                      const nowLocation = result.locations[0];
                      const m1 = new AMap.Marker({
                        map: undefined,
                        draggable: true,
                        position: new AMap.LngLat(nowLocation.lng, nowLocation.lat)
                      });
                      const m2 = new AMap.Marker({
                        map: undefined,
                        draggable: true,
                        position: new AMap.LngLat(item.placeLocation[0], item.placeLocation[1])
                      });
                      const dis = m1.getPosition().distance(m2.getPosition());
                      if (dis <= 5500) {
                        setComplate(index, 1);
                        Notification.requestPermission();
                        // 发送浏览器通知
                        const notification = new Notification('到达目的地', {
                          body: '已到达'
                        });
                        notification.onclick = () => {
                          window.focus();
                        };
                      }
                    }
                  });
                }
              }
            });
          } else {
            ErrorMessage('获取计划详情失败', 2000);
          }
        },
        err => {
          console.log(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  useEffect(() => {
    getPlanInfo(plan[0] ? plan[0].plan_id : '');
    getLabelsFetch();
    const timer = setInterval(() => {
      comparePlanComplate();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, [plan]);

  return emepty ? (
    <div className="publish-no-content-container">
      <h2>暂时没有开始的计划</h2>
    </div>
  ) : (
    <>
      <div className="publish-start-plan-container">
        <div className="publish-start-plan-title">
          <span>{planInfo ? planInfo.content.title : ''}</span>
        </div>
        {planInfo?.complate.length === planInfo?.content.plan.length && (
          <div className="publish-start-plan-cover">
            {!coverImg ? (
              <div
                style={{ height: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                className="publish-start-plan-item-img"
              >
                <Uploader
                  style={{ cursor: 'pointer' }}
                  previewImage={false}
                  accept="image/*"
                  upload={uploadCover}
                ></Uploader>
              </div>
            ) : (
              <img src={coverImg} alt="" style={{ objectFit: 'cover', width: '100%', height: '300px' }} />
            )}
            title
            <input
              style={{ width: '50%', height: '60px', marginTop: '10px' }}
              className="publish-start-plan-item-textarea"
              onChange={e => setTitle(e.target.value)}
            ></input>
          </div>
        )}
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
                    <div
                      style={{ backgroundColor: planInfo.complate.includes(index + 1) ? 'hotpink' : 'gray' }}
                      className="publish-start-plan-item-progress-ball"
                    ></div>
                  </div>
                </div>
                <div className="publish-start-plan-item-content">
                  <div className="publish-start-plan-item-title publish-start-plan-item-take">
                    <span>{item.title}</span>
                  </div>
                  <div className="publish-start-plan-item-take">
                    <span>{formatTime(item.startTime)}</span>&nbsp;至&nbsp;<span>{formatTime(item.endTime)}</span>
                  </div>
                  <div className="publish-start-plan-item-place publish-start-plan-item-take">
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
                  <Button
                    className="me-info-data-action-log-out"
                    style={{ width: 'fit-content' }}
                    variant="contained"
                    disableElevation
                    onClick={() => setComplate(index, planInfo.complate.includes(index + 1) ? 0 : 1)}
                  >
                    {planInfo.complate.includes(index + 1) ? '撤销' : '完成'}
                  </Button>
                  {planInfo?.complate.length === planInfo?.content.plan.length && (
                    <div className="publish-start-plan-item-textarea-container">
                      <textarea className="publish-start-plan-item-textarea" onChange={changeText(index)}></textarea>
                      {!item.img ? (
                        <div className="publish-start-plan-item-img">
                          <Uploader
                            style={{ cursor: 'pointer' }}
                            previewImage={false}
                            accept="image/*"
                            upload={uploadImg(index)}
                          ></Uploader>
                          <LoadingButton
                            className="login-desktop-action-login"
                            style={{ color: item.loading ? 'rgba(255 255 255 / 74.3%)' : '', marginTop: '10px' }}
                            variant="contained"
                            disableElevation
                            startIcon={<Search></Search>}
                            onClick={() => getImg(item, index)}
                            loading={item.loading}
                            loadingPosition="start"
                          >
                            根据该阶段描述生成
                          </LoadingButton>
                        </div>
                      ) : (
                        <div className="publish-start-plan-item-img-show">
                          <img src={item.img} alt="" style={{ objectFit: 'cover', width: '100%', height: '300px' }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        <div className="publish-start-plan-choose-label">
          {planInfo?.complate.length === planInfo?.content.plan.length &&
            labels &&
            labels.map(item => {
              return (
                <div
                  className={
                    selectLabel?.includes(item)
                      ? 'publish-start-plan-choose-label-item-select'
                      : 'publish-start-plan-choose-label-item'
                  }
                  key={item.label_id}
                  onClick={selectLabelAction(item)}
                >
                  <span>{item.name}</span>
                </div>
              );
            })}
        </div>
        <Space width="100%" height="58px"></Space>
      </div>
      {planInfo?.complate.length === planInfo?.content.plan.length && (
        <Button
          className="me-info-data-action-log-out"
          style={{ width: 'fit-content' }}
          variant="contained"
          disableElevation
          onClick={addArticleFetch}
        >
          发布
        </Button>
      )}
      <div id="test" style={{ display: 'none' }}></div>
    </>
  );
};
