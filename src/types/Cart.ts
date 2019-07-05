import Filter from './Filter'

export interface Cart {
    selection: Selection[]
    filters: Filter
}

export interface Selection {
    assessment: string
    variables: string[]
}
