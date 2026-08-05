import { Input, Space } from 'antd';
import type { InputProps } from 'antd';
import './index.scss';

export interface LabelInputProps extends InputProps {
  label: string;
  labelWidth?: number;
}

// 封装一个带标签的输入组件
const LabelInput = ({ label, labelWidth = 90, ...props }: LabelInputProps) => (
  <Space.Compact block className="labelInput">
    <span className="addon-label" style={{ width: labelWidth }}>
      {label}
    </span>
    <Input {...props} style={{ flex: 1, ...props.style }} />
  </Space.Compact>
);

export default LabelInput;
