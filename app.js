const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const yaml = require('js-yaml');

let window = null

// Convenience Functions
function recFindByExt(base,ext,files,result) 
{
    files = files || fs.readdirSync(base) 
    result = result || [] 

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory() )
            {
                result = recFindByExt(newbase,ext,fs.readdirSync(newbase),result)
            }
            else
            {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                {
                    result.push(newbase)
                } 
            }
        }
    )
    return result
}

// Code to update the files database
if (process.argv[2] == '--update-db')
{
    const JsonDB = require('node-json-db/dist/JsonDB')
    const DBConfig = require('node-json-db/dist/lib/JsonDBConfig')
    var db = new JsonDB.JsonDB(new DBConfig.Config("database", true, true, ':'));
    const files = recFindByExt('code/', 'yml');
    files.forEach( item => {
        let fileContents = fs.readFileSync(item, 'utf8');
        let data = yaml.safeLoad(fileContents);
        db.push(':'+item, {"path":item,"title":data.title, "description":data.description});
    });
    db.save();
    app.exit();
}

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    // Set the initial width to 800px
    width: 800,
    // Set the initial height to 600px
    height: 600,
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    backgroundColor: "#D6D8DC",
    frame: false,
    title: "OpenFOAM Code Cheats",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false
  })

  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Show window when page is ready
  window.once('ready-to-show', () => {
    window.show()
  })
})
