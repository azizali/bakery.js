// node shell.

var fs = require('fs');

var src = {
    'bakery.draw.js':[
        'bakery.draw.primitive.js'
    ]
};

(function(src){
    for(var outFile in src){
        if(!src.hasOwnProperty(outFile)) continue;
        fs.writeFileSync(outFile, '');
        src[outFile].forEach(function(srcFile){
            var srcDir = './';
            fs.readFile(srcDir + srcFile, function(err, data){
                fs.appendFile(outFile, data);
            });
        });
    }
})(src);