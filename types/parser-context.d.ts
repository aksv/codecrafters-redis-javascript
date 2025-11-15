import { Buffer } from "node:buffer";

export interface ParserContext {
  get length(): number;
  append(chunk: Buffer): void;
  readBytes(n: number): Buffer<ArrayBufferLike> | null;
  readUntil(code: number): Buffer<ArrayBufferLike> | null;
  readInt8(): number;
}

export {};
