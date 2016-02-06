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
  api.addFiles([
    'dist/js/materialize.js',
    // Added custom
    'sass/components/_buttons.scss',
    'sass/components/_cards.scss',
    'sass/components/_carousel.scss',
    'sass/components/_chips.scss',
    'sass/components/_collapsible.scss',
    'sass/components/_color.scss',
    'sass/components/_dropdown.scss',
    'sass/components/_form.scss',
    'sass/components/_global.scss',
    'sass/components/_grid.scss',
    'sass/components/_icons-material-design.scss',
    'sass/components/_materialbox.scss',
    'sass/components/_mixins.scss',
    'sass/components/_modal.scss',
    'sass/components/_navbar.scss',
    'sass/components/_normalize.scss',
    'sass/components/_prefixer.scss',
    'sass/components/_preloader.scss',
    'sass/components/_roboto.scss',
    'sass/components/_sideNav.scss',
    'sass/components/_slider.scss',
    'sass/components/_table_of_contents.scss',
    'sass/components/_tabs.scss',
    'sass/components/_toast.scss',
    'sass/components/_tooltip.scss',
    'sass/components/_typography.scss',
    'sass/components/_variables.scss',
    'sass/components/_waves.scss',
    'sass/components/date_picker/_default.date.scss',
    'sass/components/date_picker/_default.scss',
    'sass/components/date_picker/_default.time.scss',
    'sass/materialize.scss',
    //
  ], 'client');
```
