# molgenis-app-lifelines-webshop


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Production usage
You need to configure a couple of things to run this app in production.


- **vue.config.js**
  Add a public path to specify the path on which the app is served.
  ```
  const packageJson = require('./package.json')

  ...
  module.export
    ...
    publicPath: process.env.NODE_ENV === 'production'
      ? packageJson.name + '/dist/'
      : '/',
  ```
- **package.json**
  Add a scope for the package name to publish to a organisation scope on NPM. 
  ```
  "name": "*scope*/molgenis-app-lifelines-webshop",
  ```
  Add the publish config with scope public, otherwise you cannot publish to NPM.
  ```
  "publishConfig": {
    "access": "public"
  },
  ```
  Add a target for webservers to resolve to.
  ```
  "main": "dist/index.html",
  ```
  Add directories to pick up when building for production.
  ```
  "files": [
    "dist",
    "src"
  ],
  ```

- **route.ts**
  Change the default base when you want to serve your app on a path other than ```/```
  ```
  export default new Router({
  
  ...

  base: process.env.NODE_ENV === 'production' ? packageJson.name : process.env.BASE_URL,
  ```
 - **i18n**
  For development and testing you can add your translations to `i18n.schemas.js`
  For production make sure to add the translations to the molgenis entity `Localization` using `lifelines-webshop` as a namespace. 

  >tip: 
  Use `i18n.schemas.js` to create the `Localization` entities. For `msgid` add the schema key (for example: "lifelines-webshop-sidebar-header")
  The namespace should be `lifelines-webshop` and than add all of the needed translations.

#### Compile and minify
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```

## Deployment
You need to run the commander script to setup the server:

```python3.6
cp ~/molgenis-app-lifelines-webshop/deployment/lifelines ~/.mcmd/scripts/
mcmd run lifelines -i
```

## Workflow

### Workflow of the catalogue
![order states](docs/img/catalogue-work-flow.svg)

### Order process
![order states](docs/img/order-states.png)

