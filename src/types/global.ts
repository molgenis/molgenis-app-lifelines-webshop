declare module NodeJS {
  interface Global {
    app: any,
    IS_TEST: boolean
  }
}

interface Window {
  app: any,
  IS_TEST: boolean
}
