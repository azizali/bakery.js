Bakery.draw.drawable = (function(B){
    var d = {}; //this 'd' will be Bakery.draw.drawable.
    d.Drawable = B.define({
        field:{
            strokeColor:new B.draw.color.HSV(200, 100, 100),
            fillColor:new B.draw.color.HSV(20, 100, 100),
            point:new B.draw.Point(0, 0),
            size:new B.draw.Size(100, 100)
        },
        property:{
            draw:function(ctx){
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
    return d;
})(Bakery);