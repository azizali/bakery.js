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