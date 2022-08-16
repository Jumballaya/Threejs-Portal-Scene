import { Core } from '../Core';

export type TickFunction = (deltaTime: number, core: Core) => void;
