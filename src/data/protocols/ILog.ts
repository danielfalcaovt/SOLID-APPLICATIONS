export interface ILog {
    log (stack: string): Promise<void>
}