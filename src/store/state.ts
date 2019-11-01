import ApplicationState from '@/types/ApplicationState'

const state: ApplicationState = {
  isSignedIn: true, // set true during development
  toast: null,
  variables: {},
  gridVariables: [],
  genderOptions: [
    { value: '1', text: 'Male' },
    { value: '2', text: 'Female' }
  ],
  subcohortOptions: [
    { value: 'gwas', text: 'GWAS' },
    { value: 'ugli', text: 'UGLI' },
    { value: 'deep', text: 'DEEP' },
    { value: 'dag3', text: 'DAG3' }
  ],
  ageGroupOptions: [
    { value: '1', text: '0-17' },
    { value: '2', text: '18-65' },
    { value: '3', text: '65+' }
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
  variantCounts: [],
  participantCount: null,
  assessments: {},
  searchTerm: null,
  filteredSubsections: null, // contains the IDs of subsections that either match the search term or contain variables that match the search term
  filteredSections: null, // contains the IDs of sections that match the search term
  isGridLoading: false,
  orders: null
}

export default state
