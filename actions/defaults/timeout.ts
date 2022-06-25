import type { AlertAction } from '../alert';
import { ALERT, quit } from '../alert';

export type Timeout = AlertAction;

const DEFAULT_TIMEOUT: Timeout = quit('timeout');

export default DEFAULT_TIMEOUT;
