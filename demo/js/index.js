(function (B) {
    var Person = B.define({
        init:function (name) {
            var s = this;
            s.name = name;
        },
        property:{
            introduce:function(){
                var s = this;
                var msg = 'Hello! My name is' + s.name + '.';
                if(s.love) msg += ' I love ' + s.love + '.';
                console.log(msg);
            }
        }
    });

    var john = new Person('John');
    john.love = 'chickens';
    john.introduce(); // >> "Hello! My name is John. I love chickens."
})(Bakery);


$(function(){
    $('pre.js').each(function(){
        var js = $(this);
        js.snippet('javascript', {
            showNum:false,
            style:'rand01',
            menu:false
        });
    })
});