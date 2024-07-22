export interface IValidation {
    validate (data: string): Error | null
}