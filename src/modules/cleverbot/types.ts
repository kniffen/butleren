export interface Cleverbot {
  configure: (opts: {botapi: string}) => void;
  write: (question: string, cb: (answer: {message: string}) => void) => void
}