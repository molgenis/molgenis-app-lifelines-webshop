import { AppState } from '@/types/ApplicationState'

const state: AppState = {
  loading: 0,
  toast: null,
  order: {
    orderNumber: null,
    name: null,
    projectNumber: null,
    applicationForm: null,
    submissionDate: null,
    creationDate: null,
    updateDate: null,
    state: null
  },
  orderFormFields: [
    {
      type: 'text',
      id: 'projectNumber',
      label: 'Project number',
      description: 'The OV number.',
      required: () => false,
      disabled: false,
      readOnly: false,
      visible: () => true,
      validate: () => true
    },
    {
      type: 'text',
      id: 'name',
      label: 'Label',
      description: 'Optional label for ease of identification',
      required: () => false,
      disabled: false,
      readOnly: false,
      visible: () => true,
      validate: () => true
    },
    {
      type: 'file',
      id: 'applicationForm',
      label: 'Application form ',
      description: 'Word or text file to describe the request.',
      required: () => false,
      disabled: false,
      readOnly: false,
      visible: () => true,
      validate: () => true
    }
  ],
  variables: {},
  gridVariables: null,
  genderOptions: [
    { value: '1', text: 'Male' },
    { value: '2', text: 'Female' }
  ],
  subcohortOptions: [
    { value: 'gwas', text: 'GWAS', info: 'lifelines-webshop-sidebar-gwas-info', href: 'lifelines-webshop-sidebar-gwas-link' },
    { value: 'ugli', text: 'UGLI', info: 'lifelines-webshop-sidebar-ugli-info', href: 'lifelines-webshop-sidebar-ugli-link' },
    { value: 'deep', text: 'DEEP', info: 'lifelines-webshop-sidebar-deep-info', href: 'lifelines-webshop-sidebar-deep-link' },
    { value: 'dag3', text: 'DAG3', info: 'lifelines-webshop-sidebar-dag3-info', href: 'lifelines-webshop-sidebar-dag3-link' }
  ],
  ageGroupOptions: [
    { value: '1', text: '0-17', info: 'lifelines-webshop-sidebar-child-info', href: 'lifelines-webshop-sidebar-child-link' },
    { value: '2', text: '18-65', info: 'lifelines-webshop-sidebar-adult-info', href: 'lifelines-webshop-sidebar-adult-link' },
    { value: '3', text: '65+', info: 'lifelines-webshop-sidebar-elderly-info', href: 'lifelines-webshop-sidebar-elderly-link' }
  ],
  ageAtOptions: [
    { value: 'ageGroupAt1A', text: 'baseline' },
    { value: 'ageGroupAt2A', text: 'second assessment' },
    { value: 'ageGroupAt3A', text: 'third assessment' }
  ],
  facetFilter: {
    gender: [],
    subcohort: [],
    ageGroupAt1A: [],
    ageGroupAt2A: [],
    ageGroupAt3A: [],
    yearOfBirthRange: []
  },
  sections: {},
  subSectionList: [],
  treeStructure: [],
  treeSelected: -1,
  treeOpenSection: -1,
  treeOpenPageSection: -1,
  gridSelection: {},
  variantCounts: null,
  participantCount: null,
  assessments: {},
  searchTerm: null,
  filteredSubsections: null, // contains the IDs of subsections that either match the search term or contain variables that match the search term
  filteredSections: null, // contains the IDs of sections that match the search term
  orders: null
}

export default state
