export interface Cart {
    selection: Selection[]
    filters: CartFilter
}

export interface CartFilter {
    gender?: string[],
    subcohort?: string[],
    ageGroupAt1A?: string[],
    ageGroupAt2A?: string[],
    ageGroupAt3A?: string[],
    yearOfBirthRange?: number[]
}

export interface Selection {
    assessment: string
    variables: string[]
}
