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
    id: string
    name?: string
    submissionDate: string
    projectNumber?: string
    orderId?: string
    applicationForm?: File
    state: OrderState
}
