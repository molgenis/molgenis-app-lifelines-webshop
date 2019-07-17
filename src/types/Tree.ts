export interface TreeChild {
  id: number
  count: number
}

export interface TreeParent {
  id: number
  count: number
  children: TreeChild[]
}

export interface TreeParentInternal {
  key: number
  list: TreeChild[]
}
