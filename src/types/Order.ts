export enum OrderState {
    Submitted = 'Submitted',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Draft = 'Draft'
}

export interface MolgenisFile {
    id: string
    filename: string
    url: string
}

export interface Order {
    orderNumber: string | null
    requestId: string | null
    name: string | null
    submissionDate: string | null
    projectNumber: string | null
    applicationForm: MolgenisFile | null
    state: OrderState | null
    creationDate: string | null
    updateDate: string | null
    contents: MolgenisFile | null
    user: string | null
    email: string | null
}
