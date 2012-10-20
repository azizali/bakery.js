//Basic Use
(function (B) {
    var Person = B.define({
        init:function (name) {
            var s = this;
            s.name = name;
        },
        property:{
            introduce:function () {
                var s = this;
                var msg = 'Hello! My name is' + s.name + '.';
                if (s.love) msg += ' I love ' + s.love + '.';
                console.log(msg);
            }
        }
    });

    var john = new Person('John');
    john.love = 'chickens';
    john.introduce(); // >> "Hello! My name is John. I love chickens."
})(Bakery);

//Inheritance
(function (B) {
    var Person = B.define({
        init:function (name) {
            var s = this;
            s.name = name;
        },
        property:{
            introduce:function () {
                var s = this;
                var msg = 'Hello! My name is' + s.name + '.';
                if (s.love) msg += ' I love ' + s.love + '.';
                console.log(msg);
            }
        }
    });

    var SoccerPlayer = B.define({
        prototype:Person,
        init:function (name, position) {
            var s = this;
            s.name = name;
            s.position = position;
        },
        property:{
            sayPosition:function () {
                var s = this;
                console.log('My position is ' + s.position + '.');
            }
        }
    });
    var john = new SoccerPlayer('John', 'striker');
    john.love = 'chickens';
    john.introduce(); // >> "Hello! My name is John. I love chickens."
    john.sayPosition(); // >> "my position is striker;

})(Bakery);

//Field
(function (B) {
    var Fruit = B.define({
        field:{
            name:'default-name',  //field names will be accessor
            color:'default-color'
        },
        property:{
            describe:function () {
                var s = this;
                // accessor works as getter when no arguments passed
                var name = s.name(),
                    color = s.color();
                var msg = 'This is a ' + name
                    + ', fruit with color ' + color + '.';
                console.log(msg);
            }
        }
    });
    var banana = new Fruit();
    // accessor works as setter when a argument passed.
    // it return object itself so that you can chain methods like below
    banana.color('yellow').name('banana');
    banana.describe(); // >>This is a banana, fruit with color yellow.
})(Bakery);

//Mixin
(function(B){
    var Fruit = B.define({
        field:{
            name:'default-name',  //field names will be accessor
            color:'default-color'
        },
        property:{
            describe:function () {
                var s = this;
                // accessor works as getter when no arguments passed
                var name = s.name(),
                    color = s.color();
                var msg = 'This is a ' + name
                    + ', fruit with color ' + color + '.';
                console.log(msg);
            }
        }
    });
    var Orange = B.define({
        prototype:Fruit,
        init:function(){
            var s = this;
            s.name('orange').color('orange');
        }
    });
    var WithPeel = new B.Mixin({
        peeled:false,
        peel:function(){
            var s = this;
            s.peeld = true;
            var name = s.name();
            var msg = 'You just peeled the ' + name + '!';
            console.log(msg);
        }
    });
    Orange.__mixin__(WithPeel);

    var orange = new Orange();
    orange.describe();
        // >> This is a orange, fruit with color orange.
    orange.peel();
        // >> You just peeled the orange!
})(Bakery);


//Extend
(function(B){
    var Coffee = B.define({
        field:{
            sugar:null
        },
        property:{
            taste:function(){
                var s = this;
                var sugar = s.sugar();
                var msg = 'This is a coffee with ' + sugar + '.';
                console.log(msg);
            }
        }

    }).__extend__({
        sugar:{
            a_lot:'a lot of sugar',
            a_little:'litter sugar',
            none:'sugar free'
        }
    });
    var coffee = new Coffee();
    coffee.sugar(Coffee.sugar.a_lot);
    coffee.taste();
            // >> This is a coffee with a lot of sugar
})(Bakery);
