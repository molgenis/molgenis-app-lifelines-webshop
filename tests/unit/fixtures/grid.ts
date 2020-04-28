import Assessment from '@/types/Assessment'
import { Variable } from '@/types/Variable'

const assessments: { [key:number]: Assessment } = {
  200: { id: 200, name: '2C' },
  201: { id: 201, name: '1A' },
  202: { id: 202, name: '2B' }
}

const variants = [
  { id: 300, assessment_id: 200 },
  { id: 201, assessment_id: 201 },
  { id: 202, assessment_id: 202 }
]

const variables = [
  {
    id: 100,
    name: 'variable 100',
    label: 'variable 100 label',
    subsections: [],
    subvariables: [{ id: 101 }, { id: 102 }],
    definitionEn: 'variable 100 definition',
    definitionNl: 'variable 100 definitie',
    variants
  },
  {
    id: 101,
    name: 'variable 101',
    label: 'variable 101 label',
    subvariable_of: { id: 100 },
    subvariables: [],
    definitionEn: 'variable 101 definition',
    definitionNl: 'variable 101 definitie',
    variants
  },
  {
    id: 102,
    name: 'variable 102',
    label: 'variable 102 label',
    subsections: [],
    subvariable_of: { id: 100 },
    definitionEn: 'variable 102 definition',
    definitionNl: 'variable 102 definitie',
    variants
  }
]

const cartTree:any = [
  {
    id: 1,
    name: 'Section 1',
    subsections: [
      { name: 'Subsection 1', variables }
    ]
  },
  {
    id: 2,
    name: 'Section 2',
    subsections: [{
      name: 'Subsection 2',
      variables
    }]
  }
]

export { assessments, cartTree, variables, variants }
