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
        move:function(point){
            var s = this;
            if(point) return s.point(point);
            if(s.pause()) return s;
            s.point().add(s.velocity());
            return s;
        }
    }).__field__({
            pause:false,
            velocity:new m.Velocity(0.3, 0.3)
        });


    return m;
})(Bakery);