# CodeShoApp

A simple [Electron](http://electron.atom.io) application to show code demos
in presentations, developed mainly for the "Basic Reservoir Engineering with OpenFOAM"
Course.

## Getting started

- Install [Node LTS](https://nodejs.org)
- Clone this repository
- [Optional but recommended] Install the [Iosevka font](https://github.com/be5invis/Iosevka)
- `cd codedemoapp`
- `npm install` to install the application's dependencies
- `npm start` to start the application

Press Ctrl-F to start searching for code snippets.

You can populate/update the code database from the commandline with 
(After running `npm install` of course):
- ``rm database.json``
- ``node_modules/electron/cli.js app.js --update-db``

## Underline Tech

The app doesn't do much:

1. Maintains a JSON database of code snippet titles, descriptions and paths to YAML files
2. Usues Fuse.js to search through the descriptions and titles; Select the best match
3. Reads in the selected YAML file. See ``code/syntax/example.yml`` for example.
4. Uses ``@glorious/demo`` to instantiate terminals and editor windows according to the YAML file.

That's it ...

> One last note, this is still under development; Please open an issue if you judge something
> is wrong!

## Adding your own snippets

Code snippets are stored as YAML files under `code/` directory. Copy ``code/syntax/example.yml`` and
start editing it.

- Supported code languages are those of PrismJS
``ls node_modules/prismjs/components/prism-*.js`` gives a list of such languages

## Theming and syntax highlighting

- The code theme is a combination of the selected PrismJS theme and `css/styles`
- The default PrismJS theme is "VS"
- With some overwrites in `css/styles`
