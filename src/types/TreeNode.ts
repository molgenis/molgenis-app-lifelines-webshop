import { Section } from './Section'

export interface TreeNode extends Section {
  children: {
    name: string
    id: number
  }[]
}
