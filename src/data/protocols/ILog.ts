export interface ILog {
    logError (stack: string): Promise<void>
}