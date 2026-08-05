import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import {useNavigate} from 'react-router-dom';

function Surrender() {
  const navigate = useNavigate();


  return <div>
    <Card>
    <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
      返回合同列表
    </Button>
    </Card>

  </div>;
}
export default Surrender;
