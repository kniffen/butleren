export interface APIBotCommand {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isLocked: boolean;
  module: {
    id: string;
    name: string;
  }
}