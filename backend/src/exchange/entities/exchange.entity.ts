export interface Exchange {
  id: number;
  start: number;
  end: number;
  mode: ExchangeMode;
}

enum ExchangeMode {
  Online = 'online',
  Ofline = 'ofline',
}
