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
    orderNumber: string | null
    name: string | null
    submissionDate: string | null
    projectNumber: string | null
    applicationForm: File | null
    state: OrderState | null
    creationDate: string | null
    updateDate: string | null
}
