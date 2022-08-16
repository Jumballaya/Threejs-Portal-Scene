import { StateMachineConfig } from './interfaces/state-machine-config.interface';

export class StateMachine<States extends string, Actions extends string> {
  private actionHandler: Map<
    Actions,
    (state: States, previousState: States) => any
  > = new Map();

  constructor(
    private state: States,
    private config: StateMachineConfig<States, Actions>,
  ) {
    this.populateActionHandler();
  }

  public getState(): States {
    return this.state;
  }

  public is(state: States) {
    return this.state === state;
  }

  public can(action: Actions) {
    const transitions = this.config.transitions.filter(
      (t) => t.from === this.state,
    );
    const transition = transitions.find((t) => t.action === action);
    return !!transition;
  }

  public for(state: States) {
    const transitions = this.config.transitions.filter((t) => t.from === state);

    if (!transitions.length) {
      throw new Error(`No transitions defined for state "${state}"`);
    }

    return {
      dispatch: (action: Actions) => {
        const transition = transitions.find((t) => t.action === action);
        if (!transition) {
          throw new Error(
            `No transition found for state "${state}" with action "${action}"`,
          );
        }
        const prevState = this.state;
        this.state = transition.to;
        return this.dispatch(action, prevState);
      },
    };
  }

  private dispatch(action: Actions, prevState: States) {
    return this.actionHandler.get(action)?.(this.state, prevState);
  }

  private populateActionHandler() {
    for (const transition of this.config.transitions) {
      this.actionHandler.set(
        transition.action,
        this.config.handlers[transition.action],
      );
    }
  }
}
