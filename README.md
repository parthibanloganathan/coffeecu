# Tea@Columbia

Dependencies
------------
For login:
- accounts-password
- fourseven:scss (to compile SCSS for materialize)
- installed [materialize SCSS](http://materializecss.com/getting-started.html) manually to change colors in `_variables.sccs` for materialize theme for meteor:user-accounts
- useraccounts:core
- useraccounts:materialize
- useraccounts:iron-routing

For styling:
- materialize:materialize-custom
- semantic:ui

For email:
- cunneen:mailgun (need to create Mailgun account too)

For search:
- easy:search

Routing:
- iron:router


Hacks:
-----
materialize:materialize-custom is found in `/packages` and is pulled from [the GitHub repo](https://github.com/Dogfalo/materialize) and has the following modifications:
`sass/components/_variables.scss` is modified for a custom color scheme. But we have to compile this scss. So in `package.js`, we add `api.use('fourseven:scss');` and 
```
  var assets = [
      'dist/font/material-design-icons/Material-Design-Icons.eot',
          'dist/font/material-design-icons/Material-Design-Icons.svg',
              'dist/font/material-design-icons/Material-Design-Icons.ttf',
                  'dist/font/material-design-icons/Material-Design-Icons.woff',
                      'dist/font/material-design-icons/Material-Design-Icons.woff2',
                          'dist/font/roboto/Roboto-Bold.ttf',
                              'dist/font/roboto/Roboto-Bold.woff',
                                  'dist/font/roboto/Roboto-Bold.woff2',
                                      'dist/font/roboto/Roboto-Light.ttf',
                                          'dist/font/roboto/Roboto-Light.woff',
                                              'dist/font/roboto/Roboto-Light.woff2',
                                                  'dist/font/roboto/Roboto-Medium.ttf',
                                                      'dist/font/roboto/Roboto-Medium.woff',
                                                          'dist/font/roboto/Roboto-Medium.woff2',
                                                              'dist/font/roboto/Roboto-Regular.ttf',
                                                                  'dist/font/roboto/Roboto-Regular.woff',
                                                                      'dist/font/roboto/Roboto-Regular.woff2',
                                                                          'dist/font/roboto/Roboto-Thin.ttf',
                                                                              'dist/font/roboto/Roboto-Thin.woff',
                                                                                  'dist/font/roboto/Roboto-Thin.woff2',
                                                                                    ];
```
