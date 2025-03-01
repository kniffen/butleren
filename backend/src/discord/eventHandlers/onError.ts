import { logError } from "../../logger/logger";

export const onError = (err: Error): void => {
  logError('Discord', err.message, err);
};