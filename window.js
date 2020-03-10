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
    const async = require('async');
    const async_series = require('async-series');

    let nonce = crypto.randomBytes(16).toString('base64');

    // Convenience functions
    function sleep(milliseconds) {
          const date = Date.now();
          let currentDate = null;
        do {
                currentDate = Date.now();
              
        } while (currentDate - date < milliseconds);
        
    }
    // Show a piece of code
    async function showCode(container, filepath) {

        let fileContents = fs.readFileSync(filepath, 'utf-8');
        let data = yaml.safeLoad(fileContents);

        var completededitors = 0;
        var completededitorsCached = completededitors;

        function renderEditors() {
            if (Object.keys(data).includes('editor'))
            {
                async.eachSeries(
                    data.editor,
                    async function(item, next) {
                        const demo = new Gdemo(container)
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
                        await demo.openApp('editor', item.options).write(highlightedCode);
                        await demo.end().then(() => 
                            {
								if(Object.keys(item.options).includes('endWait'))
								{
									sleep(item.options.endWait);
								} else {
									sleep(1000);
								}
								$(container).html("");
                            });
                }, function(){completededitors = 1;});
            }
        }

        function renderTerminals() {
            if (!Object.keys(data).includes('editor'))
            {
                completededitors = 1;
            }
            if(completededitors === completededitorsCached)
            {
                console.log("stepping")
                setTimeout(renderTerminals, 1000);
                return;
            }
            completededitorsCached = completededitors;
            if (Object.keys(data).includes('terminals'))
            {
                async.eachSeries(
                    data.terminals,
                    async function(item, next) {
                        const demo = new Gdemo(container);

                        await demo.openApp('terminal', item.options)
                        item.commands.forEach(com => {
                            demo.command(com.command, com.options);
                            if (Object.keys(com).includes('output'))
                            {
                                demo.respond(com.output);
                            }
                        });
                        await demo.end();//.then(() => 
                           // {
						   // 	if(Object.keys(item.options).includes('endWait'))
						   // 	{
						   // 		sleep(item.options.endWait);
						   // 	} else {
						   // 		sleep(1000);
						   // 	}
						   // 	$(container).html("");
                           // });
                    }
                );
            }
        }

        renderEditors();
        renderTerminals();
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
        keys: ['description','title','path'],
        threshold: 0.8,
        minMatchCharLength: 5,
    }

    // Some vars to perform checks
    var stk = 'default';

    // On text input
    //$('#text-input').bind('input propertychange', function() {
    $('#text-input').on('input', function() {
        // Current input text
        const text = this.value
        var displaying = false;

        // Delay searching until 3 chars are reached
        if (text.length >= 5)
        try {
            //Actively fuzzy search in database
            var f = new Fuse(Object.values(db), fuzzyOptions);
            var result = f.search(text);

            // Show code only if no
            if (
                (Object.keys(result).length > 0) 
                && (stk != result[0].path)
            )
            {
                // If there is a result, use first match
                $("#code-container").html("");
                //var container = document.getElementById("code-container")
                showCode("#code-container", result[0].path);
                stk = result[0].path;
            }
        } catch (e) {
            console.log(e);
        }
    })
})
