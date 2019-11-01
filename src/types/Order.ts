export enum OrderState {
    Submitted,
    Approved,
    Rejected,
    Draft
}

export interface File {
    id: string
    filename: string
    url: string
}

export interface Order {
    orderNumber: string
    state: OrderState
    contents?: string
    name?: string
    submissionDate?: string
    projectNumber?: string
    applicationForm?: File
}
