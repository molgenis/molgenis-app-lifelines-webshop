declare module NodeJS {
  interface Global {
    IS_TEST: boolean
  }
}

interface Window {
  IS_TEST: boolean
}
