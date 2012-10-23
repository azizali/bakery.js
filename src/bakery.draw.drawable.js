Bakery.draw.drawable = (function (B) {

    var HSV = B.draw.color.HSV,
        Point = B.draw.Point,
        Size = B.draw.Size;

    var d = {}; //this 'd' will be Bakery.draw.drawable.
    d.Drawable = B.define({
        field:{
            strokeColor:new HSV(200, 100, 100),
            fillColor:new HSV(20, 100, 100)
        },
        property:{
            _point:new Point(0, 0),
            _size:new Size(100, 100),
            point:function(x, y){
                var s = this;
                if(!arguments.length) return s._point;
                if(arguments[0] instanceof Point){
                    s._point = arguments[0];
                } else {
                    s._point = new Point(x, y);
                }
                return s;
            },
            size:function(width, height){
                var s = this;
                if(!arguments.length) return s._size;
                if(arguments[0] instanceof Size){
                    s._size = arguments[0];
                } else {
                    s._size = new Size(width, height);
                }
                return s;
            },
            draw:null
        }
    });
    d.Rectangle = B.define({
        prototype:d.Drawable,
        property:{
            draw:function (ctx) {
                var s = this;
                var area = new B.draw.Area().center(s.point())
                    .size(s.size());
                ctx.fillStyle = s.fillColor().toString();
                ctx.fillRect(
                    area.left(),
                    area.top(),
                    area.size().width(),
                    area.size().height()
                );
                return s;
            }
        }
    });
    d.Circle = B.define({
        prototype:d.Drawable,
        field:{
            fillColor:new HSV(20, 20, 100)
        },
        property:{
            _radius:100,
            radius:function(radius){
                var s = this;
                if(!arguments.length) return s._radius;
                s._radius = radius;
                s.size(new Size(radius, radius));
                return s;
            },
            draw:function(ctx){
                var s = this,
                    point = s.point(),
                    radius = s.radius();
                ctx.beginPath();
                ctx.fillStyle = s.fillColor().toString();
                ctx.arc(point.x(), point.y(), radius, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
                return s;
            }
        }
    });
    return d;
})(Bakery);