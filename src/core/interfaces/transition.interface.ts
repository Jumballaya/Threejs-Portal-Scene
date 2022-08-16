export interface Transition<States extends string, Actions extends string> {
  from: States;
  to: States;
  action: Actions;
}
