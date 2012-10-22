Bakery.draw.move = (function (B) {

    var Point = B.draw.Point

        ;

    var m = {}; // this 'm' will be Bakery.move;
    m.Velocity = B.define({
        prototype:Point,
        init:function (x, y) {
            var s = this;
            s.x(x).y(y);
        },
        property:{
            toString:function () {
                var s = this;
                return '{vx:' + s.x() + ',vy:' + s.y() + '}';
            }
        }
    });

    m.Move = new B.Mixin({
        _velocity:new m.Velocity(0.4, 0.4),
        velocity:function(x, y){
            var s = this;
            if(!arguments.length) return s._velocity;
            s._velocity = arguments[0] instanceof m.Velocity?
                arguments[0] : new m.Velocity(x, y);
            return s;
        },
        move:function(point){
            var s = this;
            if(point) return s.point(point);
            if(s.pause()) return s;
            s.point().add(s.velocity());
            return s;
        }
    }).__field__({
            pause:false
        });


    return m;
})(Bakery);