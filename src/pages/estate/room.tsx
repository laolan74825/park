import { Card, Col, Row, Image, Pagination, Space, Radio, Spin } from 'antd';
import './index.scss';
import { useCallback, useEffect, useState } from 'react';
// 引入图片
import roomPic1 from '@/assets/roomPic1.png';
import roomPic2 from '@/assets/roomPic2.png';
import roomPic3 from '@/assets/roomPic3.png';
import roomPic4 from '@/assets/roomPic4.png';
import roomPic5 from '@/assets/roomPic5.png';
import roomPic6 from '@/assets/roomPic6.png';
import { getRoomList, getBuildingList } from '@/api/index';
import type { BuildingData, RoomData } from '@/types/types';

const roomPics = [roomPic1, roomPic2, roomPic3, roomPic4, roomPic5, roomPic6];
const roomTypes: Record<string, string> = {
  '1': '普通住宅',
  '2': '商业用房',
  '3': '工业厂房',
};
interface BuildingBrief {
  buildingId: string;
  buildingName: string;
}

function Room() {
  const [open, setOpen] = useState(false);
  const [scaleStep] = useState(0.5);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [roomData, setRoomData] = useState<RoomData[]>([]);
  const [buildingData, setBuildingData] = useState<BuildingBrief[]>([]);

  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(1);



  const loadRoomDataById = useCallback(async (id: string) => {
    if (!id) {
      return;
    }
    setLoading(true);
    const response = await getRoomList(id, {
      page: current,
      pageSize,
    });
    if (response.code === 200) {
      console.log('返回的房间信息', response);
      const { data, total } = response;
      setRoomData(data);
      setTotal(total || 0);
    } else {
      console.error('获取房间信息失败:', response.message);
    }
    setLoading(false);
  }, [current, pageSize]);

   const loadBuildingData = useCallback(async () => {
    const response = await getBuildingList({ page: 1, pageSize: 100 });
    if (response.code === 200) {
      const { data } = response;
      const formated = data.map((item: BuildingData) => ({
        buildingId: item.id as string,
        buildingName: item.buildingName as string,
      }));
      setBuildingData(formated);
      if (formated.length > 0) {
        const firstBuildingId = formated[0].buildingId;
        loadRoomDataById(firstBuildingId);
      }
    } else {
      console.error('获取楼宇信息失败:', response.message);
    }
  }, [ loadRoomDataById]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBuildingData();
  }, [loadRoomDataById, loadBuildingData]);

  const handlePreview = (roomNumber: string) => {
    setIndex(parseInt(String(roomNumber).slice(-1)));
    setOpen(true);
  };
  const onClickBuilding = (building: BuildingBrief) => {
    loadRoomDataById(building.buildingId);
  };
  return (
    <div className="room">
      <Image
        width={200}
        style={{ display: 'none' }}
        preview={{
          open,
          scaleStep,
          src: roomPics[index - 1],
          onOpenChange: (value) => {
            setOpen(value);
          },
        }}
      />
      <Card className="mb">
        <Radio.Group defaultValue={0} buttonStyle="solid">
          <Space wrap>
          {buildingData.map((building, index) => (
            <Radio.Button
              value={index}
              key={building.buildingId}
              onClick={() => onClickBuilding(building)}
            >
              {building.buildingName}
            </Radio.Button>
          ))}
        </Space>
        </Radio.Group>

      </Card>
      <Card
        title="房间列表"
        loading={loading}
        style={{ backgroundColor: '#e8f4fd', minHeight: '95vh' }}
        //
        className="clearfix"
      >
        <Spin spinning={loading}>
          <Row gutter={16}>
            {roomData.map((room) => (
              <Col span={4} key={room.id}>
                <Card
                  classNames={'roomCard'}
                title="房间信息"
                extra={
                  <a
                    href="javascript:void(0)"
                    onClick={() => handlePreview(room.roomNumber)}
                  >
                    户型图
                  </a>
                }
                className="mb"
              >
                <h1 className="mb">房间号：{room.roomNumber}</h1>
                <div className="clearfix room-info">
                  <p>楼宇ID：</p>
                  <p>{room.buildingId}</p>
                </div>
                <div className="clearfix room-info">
                  <p>房间面积：</p>
                  <p>{room.area}m²</p>
                </div>
                <div className="clearfix room-info">
                  <p>房间类型：</p>
                  <p>{roomTypes[room.type]}</p>
                </div>
                <div className="clearfix room-info">
                  <p>出租单价：</p>
                  <p>2元/m²/月</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        </Spin>
        <Pagination
          className="mt mb fr"
          total={total}
          current={current}
          onChange={(current) => {
            setCurrent(current);
          }}
          pageSizeOptions={['12', '24', '36', '48']}
          pageSize={pageSize}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setCurrent(current);
          }}
          showSizeChanger
          showQuickJumper
          defaultCurrent={1}
          defaultPageSize={12}
        />
      </Card>
    </div>
  );
}
export default Room;
