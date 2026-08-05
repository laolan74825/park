import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import './index.scss';

export interface LabelSelectProps extends SelectProps {
  label: string;
  labelWidth?: number;
}

// 封装一个带标签的下拉选择组件
const LabelSelect = ({ label, labelWidth = 80, ...props }: LabelSelectProps) => (
  <Space.Compact block className="labelInput">
    <span className="addon-label" style={{ width: labelWidth }}>
      {label}
    </span>
    <Select {...props} style={{ flex: 1, ...props.style }} />
  </Space.Compact>
);

export default LabelSelect;

