# molgenis-app-lifelines-webshop

## i18n

For development and testing you can add your translations to `i18n.schemas.js`
For production make sure to add the translations to the molgenis entity `Localization` using `lifelines-webshop` as a namespace. 

Tip: 
Use `i18n.schemas.js` to create the `Localization` entities. For `msgid` add the schema key (for example: "lifelines-webshop-sidebar-header")
The namespace should be `lifelines-webshop` and than add all of the needed translations.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
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

