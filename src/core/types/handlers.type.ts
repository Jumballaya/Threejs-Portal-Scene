export type Handlers<States extends string, Actions extends string> = Record<
  Actions,
  (state: States, prevState: States) => any
>;
