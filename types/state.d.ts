import { Buffer } from "node:buffer";
import { ParserContext } from "./parser-context";

export type Frame =
  | { stateType: 'RESP_ARRAY'; length: number }
  | { stateType: 'BULK_STRING'; value: Buffer };

export type EmitFunction = (f: Frame) => void;

export interface State {
  handle(ctx: ParserContext, emit: EmitFunction): State;
}

export type StateFactory = () => State;
