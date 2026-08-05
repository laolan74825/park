import { Button, Card, Flex, Space } from 'antd';
import { useCounterState } from '@/store/index';

export default function Counter() {
  const count = useCounterState((state) => state.count);
  const { increment, decrement, reset } = useCounterState.getState();

  return (
    <Card title="zustand 计数器" style={{ width: 400, margin: '20px 0' }}>
      <Flex vertical gap="large">
        <h2>计数：{count}</h2>
        <Space>
          <Button type="primary" onClick={increment}>
            +1
          </Button>
          <Button onClick={decrement}>-1</Button>
          <Button danger onClick={reset}>
            重置
          </Button>
        </Space>
      </Flex>
    </Card>
  );
}
