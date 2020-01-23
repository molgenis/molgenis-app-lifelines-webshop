export interface QueryParams {
    filters: { text: string, state: string }
    sortBy: string | null
    sortDesc: boolean
    num: number
    start: number
}
