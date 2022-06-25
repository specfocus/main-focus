
import type { AlertAction } from '../alert';
import { ALERT, quit } from '../alert';

export type Abort = AlertAction;

const DEFAULT_ABORT: Abort = quit('abort');

export default DEFAULT_ABORT;
