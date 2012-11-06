// node shell.

var fs = require('fs'),
    Zip = require('node-zip');

(function(src){

    var zip = new Zip();
    for(var outFile in src){
        if(!src.hasOwnProperty(outFile)) continue;
        fs.writeFileSync(outFile, '');
        src[outFile].forEach(function(srcFile){
            var srcDir = './src/';
            var data = fs.readFileSync(srcDir + srcFile);
            fs.appendFileSync(outFile, data);
            fs.appendFileSync(outFile, '\n\n');
        });

        zip.file(outFile, fs.readFileSync(outFile, 'utf-8'));

        var data = zip.generate({base64:false,compression:'DEFLATE'});
        fs.writeFile('./zip/bakery.js.zip', data, 'binary');
    }



})({
    'bakery.js':[
        'bakery.js'
    ],
    'bakery.util.js':[
        'bakery.util.basic.js',
        'bakery.util.math.js'
    ],
    'bakery.draw.js':[
        'bakery.draw.primitive.js',
        'bakery.draw.color.js',
        'bakery.draw.animation.js',
        'bakery.draw.drawable.js',
        'bakery.draw.move.js'
    ],
    'jquery.bakery.js':[
        'jquery.bakery.basic.js',
        'jquery.bakery.icon.js',
        'jquery.bakery.editable.js'
    ],
    'jquery.bakery.css':[
        'jquery.bakery.base.css'
    ]
});