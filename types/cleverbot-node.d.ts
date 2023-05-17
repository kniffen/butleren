interface Cleverbot {
  configure: (opts: {botapi: string}) => void;
  write: (question: string, cb: (answer: {message: string}) => void) => void
}

declare module 'cleverbot-node' {
  function Cleverbot(): Cleverbot
  export = Cleverbot
}