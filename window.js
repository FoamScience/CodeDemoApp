$(() => {
    // Require modules
    const crypto = require('crypto')
    const Gdemo = require('@glorious/demo')
    const fs = require('fs');
    const path = require('path');
    const Fuse = require('fuse.js');
    const yaml = require('js-yaml');
    const hotkeys = require('hotkeys-js');
    const Prism = require('prismjs');


    // Convenience functions
    // Show a piece of code
    function showCode(container, filepath) {
        const demo = new Gdemo(container)
        let fileContents = fs.readFileSync(filepath, 'utf-8');
        let data = yaml.safeLoad(fileContents);

        // Render text in editor-like env
        if (Object.keys(data).includes('editor'))
        {
            data.editor.forEach( function(item, index) {
                if (item.language == 'cpp')
                {
                    const preLng = require('prismjs/components/prism-c');
                }
                const lng = require('prismjs/components/prism-'+item.language);
                const highlightedCode = Prism.highlight(
                    item.text,
                    Prism.languages[item.language],
                    item.language
                );
                demo.openApp('editor', item.options).write(highlightedCode).end();
            });
        }
        // Render terminal commands
        if (Object.keys(data).includes('terminals'))
        {
            data.terminals.forEach( function(item, index) {
                demo.openApp('terminal', item.options)
                item.commands.forEach(com => {
                    demo.command(com.command, com.options);
                    if (Object.keys(com).includes('output'))
                    {
                        demo.respond(com.output);
                    }
                });
            });
        }
        demo.end();
    }

    // Toggle Input field display
    hotkeys.filter = function(event){
        return true;
    };
    hotkeys('ctrl+f',
        function(event, handler){
            if($("#text-input").css('display')==="none")
            {
                $('#default-page').css('width','0%');
                $("#text-input").css('display','block');
                $('#text-input').focus()
            } else {
                $("#text-input").css('display','none');
            }
    });

    // Initiate fuzzy-search
    let fileContents = fs.readFileSync('database.json');
    let db = JSON.parse(fileContents);
    var fuzzyOptions = {
        keys: ['description','title','path']
    }

    // Some vars to perform checks
    var stk = 'default';

    // On text input
    //$('#text-input').bind('input propertychange', function() {
    $('#text-input').on('input', function() {
        // Current input text
        const text = this.value

        // Delay searching until 3 chars are reached
        if (text.length >= 3)
        try {
            // Actively fuzzy search in database
            var f = new Fuse(Object.values(db), fuzzyOptions);
            var result = f.search(text);

            // Show code only if no
            if ((Object.keys(result).length > 0) && (stk != result[0].path))
            {
                // If there is a result, use first match
                $("#code-container").html("");
                showCode("#code-container", result[0].path);
                stk = result[0].path;
            }
        } catch (e) {
            console.log(e);
        }
    })
})
