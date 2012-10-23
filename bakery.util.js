Bakery.util = (function(B){
    if(typeof B === 'undefined'){
        console.error('[bakery.util.js] you need load bakery.js before use baker.util.js');
        return null;
    }
    var u = {}; //this 'u' will be Bakery.util;


    return u;
})(Bakery);

Bakery.util.math = (function(B){
    var m = {}; // this 'm' will be Bakery.util.math;

    m.getSmaller = function(val1, val2){
        return val1 < val2 ? val1:val2;
    };

    m.randomInt = function(max){
        return Math.round(max * Math.random());
    };

    return m;
})(Bakery);

