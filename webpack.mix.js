const mix = require('laravel-mix')

mix.browserSync({
  proxy: 'localhost:3000',
  files: [
    'resources/**/*'
  ]
}).setPublicPath('public')

mix.js(['resources/js/app.js'], 'dist/js')

mix.css('resources/css/app.css', 'dist/css')
