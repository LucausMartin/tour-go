import { useEffect, FC, useState } from 'react';
import './amap.css';
import AMapLoader from '@amap/amap-jsapi-loader';
import { ReactSetState } from '@myTypes/types.ts';
import '@amap/amap-jsapi-types';
import { Button } from '@mui/material';
import { PartItemTypes } from '../../pages/home/pages/newPlan/types.ts';
import { ErrorMessage } from '@myCommon/errorMessage.ts';

const MapContainer: FC<{
  setMapShow: ReactSetState<boolean>;
  partList: PartItemTypes[];
  setPartList: ReactSetState<PartItemTypes[]>;
  order: number;
}> = ({ setMapShow, setPartList, order }) => {
  const [AMapAddress, setAMapAddress] = useState<string>('');
  const [myLocation, setMyLocation] = useState<[number, number]>([0, 0]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    let map: AMap.Map;
    AMapLoader.load({
      key: '2ba62778feb049646db8c836342d345b', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then(AMap => {
        map = new AMap.Map('container', {
          // 设置地图容器id
          viewMode: '2D', // 是否为3D地图模式
          zoom: 11 // 初始化地图级别
        });

        // navigator.geolocation.getCurrentPosition(
        //   pos => {
        //     // 转换成高德坐标
        //     // @ts-expect-error status is any
        //     AMap.convertFrom([pos.coords.longitude, pos.coords.latitude], 'gps', function (status, result) {
        //       if (result.info === 'ok') {
        //         const nowLocation = result.locations[0];
        //         console.log(nowLocation);
        //       }
        //     });
        //   },
        //   err => {
        //     console.log(err);
        //   }
        // );

        AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
          const auto = new AMap.AutoComplete({
            input: 'tipinput'
          });
          const placeSearch = new AMap.PlaceSearch({
            map: map
          });
          auto.on('select', select); //注册监听，当选中某条记录时会触发
          // @ts-expect-error poi is any
          function select(e) {
            setErrorMessage('');
            placeSearch.setCity(e.poi.adcode);
            map.setCenter([e.poi.location.lng, e.poi.location.lat]);
            try {
              const marker = new AMap.Marker({
                position: [e.poi.location.lng, e.poi.location.lat],
                title: e.poi.name
              });
              map.add(marker);
            } catch (error) {
              setErrorMessage('请选择一个确定的地点');
            }
            setAMapAddress(e.poi.name);
            setMyLocation([e.poi.location.lng, e.poi.location.lat] || [0, 0]);
          }
        });
      })
      .catch(() => {
        ErrorMessage('地图加载失败', 2000);
      });

    return () => {
      map?.destroy();
    };
  }, [setMapShow]);

  return (
    <>
      <div id="container" className="amap-container"></div>
      <div id="myPageTop">
        <table>
          <tr>
            <td>
              <label>请输入关键字：</label>
            </td>
            <td>
              <div>当前选中地点：{AMapAddress}</div>
              <Button
                className="me-info-data-action-log-out"
                variant="contained"
                disableElevation
                onClick={() => {
                  if (errorMessage !== '') {
                    ErrorMessage(errorMessage, 2000);
                    return;
                  }
                  setMapShow(false);
                  setPartList(pre => {
                    const newPartList = [...pre];
                    newPartList[order - 1].addressName = AMapAddress;
                    newPartList[order - 1].placeLocation = myLocation;
                    return newPartList;
                  });
                }}
              >
                创建
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                className="me-info-data-action-log-out"
                variant="contained"
                disableElevation
                onClick={() => {
                  setMapShow(false);
                }}
              >
                取消
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              <input id="tipinput" style={{ color: 'black' }} />
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default MapContainer;
