import { ReactNode } from 'react';
import * as rdd from 'react-device-detect';

interface DeviceProps {
  children: (props: typeof rdd) => any;
}
export default function Device(props: DeviceProps) {
  return <>{props.children(rdd)}</>;
}
