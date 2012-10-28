Bakery.draw.drawable = (function (B) {

    var HSV = B.draw.color.HSV,
        Point = B.draw.Point,
        Size = B.draw.Size,
        Area = B.draw.Area;


    var Rotatable = new B.Mixin({
        __originPoint:null,
        __startRotation:function(ctx){
            var s = this,
                p = s.point();
            if(!s.rotate()) return s;
            ctx.save();
            ctx.translate(p.x(), p.y());
            ctx.rotate(s.rotate());
            s.__originPoint = p;
            s.point(0, 0);
            return s;
        },
        __endRotation:function(ctx){
            var s = this;
            if(!s.rotate()) return s;
            ctx.restore();
            s.point(s.__originPoint);
            return s;
        }
    });



    var d = {}; //this 'd' will be Bakery.draw.drawable.
    d.Drawable = B.define({
        field:{
            fill:true,
            stroke:false,
            fillColor:new HSV(20, 100, 100),
            strokeColor:new HSV(200, 100, 100),
            lineWidth:2,
            rotate:0
        },
        property:{
            _point:new Point(0, 0),
            _size:new Size(100, 100),
            point:function (x, y) {
                var s = this;
                if (!arguments.length) return s._point;
                if (arguments[0] instanceof Point) {
                    s._point = arguments[0];
                } else {
                    s._point = new Point(x, y);
                }
                return s;
            },
            size:function (width, height) {
                var s = this;
                if (!arguments.length) return s._size;
                if (arguments[0] instanceof Size) {
                    s._size = arguments[0];
                } else {
                    s._size = new Size(width, height);
                }
                return s;
            },
            area:function (area) {
                var s = this;
                if (!arguments.length) {
                    return new Area()
                        .center(s.point())
                        .size(s.size());
                }
                s.point(area.center())
                    .size(area.size());
                return s;
            },
            draw:null,
            toImg:function(){
                var s = this,
                    point = s.point();
                var canvas = document.createElement('canvas');
                var w = s.size().width(), h = s.size().height();
                canvas.width = w;
                canvas.height = h;

                s.point(w/2, h/2);
                s.draw && s.draw(canvas.getContext('2d'));
                s.point(point);

                return canvas;
            },
            fillPath:function(ctx){
                var s = this;
                ctx.fillStyle = s.fillColor().toString();
                ctx.fill();
                return s;
            },
            strokePath:function(ctx){
                var s = this;
                ctx.strokeStyle = s.strokeColor().toString();
                ctx.stroke();
                return s;
            }

        }
    })
        .__mixin__(Rotatable);





    d.Rectangle = B.define({
        prototype:d.Drawable,
        property:{
            draw:function (ctx) {
                var s = this;
                var area = s.area();
                ctx.rect(
                    area.left(),
                    area.top(),
                    area.size().width(),
                    area.size().height()
                );
                if(s.fill()) s.fillPath(ctx);
                if(s.stroke()) s.strokePath(ctx);
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
            radius:function (radius) {
                var s = this;
                if (!arguments.length) return s._radius;
                s._radius = radius;
                s.size(new Size(radius, radius));
                return s;
            },
            draw:function (ctx) {
                var s = this,
                    r = s.radius(),
                    p = s.point(),
                    x = p.x(), y = p.y();

                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2, false);
                if(s.fill()) s.fillPath(ctx);
                if(s.stroke()) s.strokePath(ctx);
                ctx.closePath();
                return s;
            }
        }
    });

    d.Ellipse = B.define({
        prototype:d.Drawable,
        field:{
            fillColor:new HSV(30, 30, 100)
        },
        property:{
            draw:function (ctx) {
                var s = this;

                if(s.rotate()) s.__startRotation(ctx);

                ctx.beginPath();

                var area = s.area();
                var t = area.top(),
                    b = area.bottom(),
                    l = area.left(),
                    r = area.right();

                var x = s.point().x();

                ctx.moveTo(x, t);
                ctx.bezierCurveTo(r, t, r, b, x, b);
                ctx.bezierCurveTo(l, b, l, t, x, t);

                if(s.fill()) s.fillPath(ctx);
                if(s.stroke()) s.strokePath(ctx);

                ctx.closePath();
                if(s.rotate()) s.__endRotation(ctx);
            }
        }
    });

    d.XMark = B.define({
        prototype:d.Drawable,
        field:{
            strokeColor:new HSV(50, 50, 100),
            radius:10
        },
        property:{
            drawCrossLine:function(ctx, angle){
                var s = this,
                    p = s.point(),
                    r = s.radius(),
                    x = p.x(), y = p.y();
                var PI = Math.PI,
                    cos = Math.cos, sin = Math.sin;
                ctx.moveTo(x + cos(angle) * r, y + sin(angle) * r);
                ctx.lineTo(x + cos(angle + PI) * r, y + sin(angle + PI) * r);
            },
            draw:function(ctx){
                var s = this;
                ctx.beginPath();
                ctx.strokeStyle = s.strokeColor().toString();
                ctx.lineCap = "butt";
                s.drawCrossLine(ctx, Math.PI * -0.25);
                s.drawCrossLine(ctx, Math.PI * 0.25);
                ctx.stroke();
                ctx.closePath();
            }
        }

    });


    d.Star = B.define({
        prototype:d.Drawable,
        field:{
            vertexCount:5,
            outerRadius:30,
            innerRadius:10
        },
        property:{
            draw:function(ctx){
                var s = this,
                    p = s.point(),
                    inR = s.innerRadius(),
                    outR = s.outerRadius(),
                    x = p.x(), y = p.y();
                ctx.beginPath();
                var vertexCount = s.vertexCount();
                var angle = Math.PI / vertexCount;
                ctx.moveTo(x + outR, y);
                var cos = Math.cos, sin = Math.sin;
                for(var i=0; i< vertexCount; i++){
                    var inAngle = angle * (i * 2 + 1);
                    ctx.lineTo(
                        x + cos(inAngle) * inR,
                        y + sin(inAngle) * inR
                    );
                    var outAngle = inAngle + angle;
                    ctx.lineTo(
                        x + cos(outAngle) * outR,
                        y + sin(outAngle) * outR
                    )
                }

                if(s.fill()) s.fillPath(ctx);
                if(s.stroke()) s.strokePath(ctx);

                ctx.closePath();

            }
        }

    });


    return d;
})(Bakery);