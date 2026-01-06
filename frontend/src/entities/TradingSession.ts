export interface ITradingSession {
  start: string;
  end: string;
  isTrading: boolean;
}

export class TradingSession implements ITradingSession {
  start: string;
  end: string;
  isTrading: boolean;

  constructor(data: ITradingSession) {
    this.start = data.start;
    this.end = data.end;
    this.isTrading = data.isTrading;
  }

  public toTimestampObject() {
    return {
      date: [+new Date(this.start), +new Date(this.end)],
      isTrading: this.isTrading,
    };
  }

  static fromTimestampObject(obj: { date: number[]; isTrading: boolean }) {
    return {
      start: new Date(obj.date[0]).toISOString(),
      end: new Date(obj.date[1]).toISOString(),
      isTrading: obj.isTrading,
    };
  }

  public update(data: ITradingSession) {
    this.start = data.start;
    this.end = data.end;
    this.isTrading = data.isTrading;
  }
}
