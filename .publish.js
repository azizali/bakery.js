// node shell.

var fs = require('fs');

var src = {
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
    ]
};
(function(src){
    for(var outFile in src){
        if(!src.hasOwnProperty(outFile)) continue;
        fs.writeFileSync(outFile, '');
        src[outFile].forEach(function(srcFile){
            var srcDir = './src/';
            var data = fs.readFileSync(srcDir + srcFile);
            fs.appendFileSync(outFile, data);
            fs.appendFileSync(outFile, '\n\n');
        });
    }
})(src);