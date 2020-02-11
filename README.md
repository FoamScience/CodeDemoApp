# CodeShoApp

A simple [Electron](http://electron.atom.io) application to show code demos
in presentations, developped mainly for the "Basic Reservoir Engineering with OpenFOAM"
Course.

## Getting started

- Install [Node LTS](https://nodejs.org)
- Clone this repository
- `cd codedemoapp`
- `npm install` to install the application's dependencies
- `npm start` to start the application

You can populate/update the code database with:
``node_modules/electron/cli.js app.js --update-db``

Press Ctrl-f to start searching for code snippets.

## Underline Tech

The app doesn't do much:

1. Maintains a JSON database of code snippet titles, descriptions and paths to YAML files
2. Usues Fuse.js to search through the descriptions and titles; Select the best match
3. Reads in the selected YAML file. See ``code/syntax/keyword.yml`` for example.
4. Uses ``@glorious/demo`` to instantiate terminals and editor windows accroding to the YAML file.

That's it ...

> One last note, this is still under developement; Please open an issue if you judge something
> is wrong!
