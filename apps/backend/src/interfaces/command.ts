export interface Command<Result = any> {
  execute(): Promise<Result>;
}