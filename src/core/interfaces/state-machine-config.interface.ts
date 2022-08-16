import { Handlers } from '../types/handlers.type';
import { Transition } from './transition.interface';

export interface StateMachineConfig<
  States extends string,
  Actions extends string,
> {
  init?: string;
  transitions: Transition<States, Actions>[];
  handlers: Handlers<States, Actions>;
}
