export class Inputs {
  private keylist: Record<string, boolean> = {};
  private history: string[] = [];
  private _lastKey = '';

  constructor() {
    document.body.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      this.keylist[key] = true;
      this.history.push(key);
      this._lastKey = key;
      if (this.history.length > 5) this.history.shift();
    });
    document.body.addEventListener('keyup', (e) => {
      this.keylist[e.key.toLowerCase()] = false;
    });
  }

  get keys(): Record<string, boolean> {
    return { ...this.keylist };
  }

  get lastKey(): string {
    return this._lastKey;
  }
}
