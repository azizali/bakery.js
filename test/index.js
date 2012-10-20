//Basic Use
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

//Inheritance
(function(B){
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

    var SoccerPlayer = B.define({
        prototype:Person,
        init:function(name, position){
            var s = this;
            s.name = name;
            s.position = position;
        },
        property:{
            sayPosition:function(){
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