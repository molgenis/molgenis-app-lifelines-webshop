export default interface FormField{
    id: string
    type: string,
    label?: string
    description?: string
    required?: () => boolean,
    disabled?: boolean,
    readOnly?: boolean,
    visible?: () => boolean,
    validate?: () => boolean,
}
