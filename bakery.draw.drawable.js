Bakery.draw.drawable = (function(B){

    var HSV = B.draw.color.HSV,
        Point = B.draw.Point,
        Size = B.draw.Size;

    var d = {}; //this 'd' will be Bakery.draw.drawable.
    d.Drawable = B.define({
        field:{
            strokeColor:new HSV(200, 100, 100),
            fillColor:new HSV(20, 100, 100),
            point:new Point(0, 0),
            size:new Size(100, 100)
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