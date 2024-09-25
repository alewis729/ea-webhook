export type GenericObject = Record<string, unknown>;

export type InfoObject = { [key: string]: string | number };

export enum Command {
  BUY = "BUY",
  BUYLIMIT = "BUYLIMIT",
  SELL = "SELL",
  SELLLIMIT = "SELLLIMIT",
  NEWSLTPLONG = "NEWSLTPLONG",
  NEWSLTPSHORT = "NEWSLTPSHORT",
  CANCELLONG = "CANCELLONG",
  CANCELSHORT = "CANCELSHORT",
  CANCELALL = "CANCELALL",
  CLOSEALL = "CLOSEALL",
}

export interface Alert {
  licenseId: string;
  command: Command;
  symbol: string;
  risk?: number;
  price?: number;
  sl?: number;
  tp?: number;
  spread?: number;
  comment?: string;
}
