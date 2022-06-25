import type { AlertAction } from '../alert';
import { idle, ALERT } from '../alert';

export type Heartbeat = AlertAction;

const DEFAULT_HEARTBEAT: Heartbeat = idle('heartbeat');

export default DEFAULT_HEARTBEAT;
