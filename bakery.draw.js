Bakery.draw = (function(B){
    if(typeof B === 'undefined'){
        console.error('[bakery.draw.js] you need load bakery.js before use baker.draw.js');
        return null;
    }
    var d = {}; //this 'd' will be Bakery.draw.

    d.Point = B.define({
        init:function (x, y) {
            var s = this;
            s.x(x)
                .y(y);
        },
        field:{
            x:0,
            y:0
        },
        property:{
            clone:function(){
                var s = this;
                return new d.Point(s.x(), s.y());
            },
            revertX:function(){
                var s = this;
                s.x(s.x() * -1);
                return s;
            },
            revertY:function(){
                var s = this;
                s.y(s.y() * -1);
                return s;
            },
            revert:function(){
                var s = this;
                return s.revertX().revertY();
            },
            toString:function(){
                var s = this;
                return '{x:' + s.x() + ',y:' + s.y() + '}';
            },
            add:function(point){
                var s = this;
                s.x(s.x() + point.x());
                s.y(s.y() + point.y());
                return s;
            },
            subtract:function(point){
                var s = this;
                s.x(s.x() - point.x());
                s.y(s.y() - point.y());
                return s;
            },
            distance:function(point){
                var s = this;
                var x = s.x() - point.x(),
                    y = s.y() - point.y();
                return Math.sqrt(
                    Math.pow(x, 2) + Math.pow(y, 2)
                );
            }
        }
    }).__extend__({
            random:function(area){
                var x = area.left() + area.getWidth() * Math.random(),
                    y = area.top() + area.getHeight() * Math.random();
                return new d.Point(x, y);
            }
        });

    d.Size = B.define({
        init:function(width, height){
            var s = this;
            s.width(width).height(height);
        },
        field:{
            width:0,
            height:0
        },
        property:{
            clone:function(){
                var s = this;
                return new d.Size(s.width(), s.height());
            },
            toString:function(){
                var s = this;
                return '{w:' + s.width() + ',h:' + s.height() + '}';
            }
        }
    });
    d.Area = B.define({
        init:function(top, right, bottom, left){
            var s = this;
            s
                .top(top || 0)
                .right(right || 0)
                .left(left || right || 0)
                .bottom(bottom || top || 0);
        },
        field:{
            top:0,
            right:0,
            bottom:0,
            left:0
        },
        property:{
            center:function(point){
                var s = this;
                if(!arguments.length) {
                    return new d.Point(
                        (s.right() + s.left()) / 2,
                        (s.top() + s.bottom()) / 2
                    );
                }
                var x = point.x(),
                    y = point.y(),
                    width = s.width(),
                    height = s.height();
                return s
                    .top(y - height / 2)
                    .right(x + width / 2)
                    .bottom(y + height / 2)
                    .left(x - width / 2);
            },
            width:function(width){
                var s = this;
                if(!arguments.length) return s.right() - s.left();
                var x = s.center().x();
                return s.left(x - width / 2)
                    .right(x + width / 2);
            },
            height:function(height){
                var s = this;
                if(!arguments.length) return s.bottom() - s.top();
                var y = s.center().y();
                return s.top(y - height / 2)
                    .bottom(y +  height / 2);
            },
            size:function(width, height){
                var s = this;
                if(!arguments.length) {
                    return new d.Size(s.width(), s.height());
                }
                var size = arguments[0] instanceof d.Size ?
                    arguments[0]:new d.Size(width, height);
                return s.width(size.width()).height(size.height());
            },
            toString:function(){
                var s = this;
                return '{top:' + s.top() + ',right:' + s.right()
                    +  ',bottom:' + s.bottom() + ',left:' + s.left()
            },
            clone:function(){
                var s = this;
                return new exports.Area(s.left(), s.top(), s.right(), s.bottom());
            },
            expand:function(amount){
                var s = this;
                s
                    .width(s.width() + amount)
                    .height(s.height() + amount);
                return s;
            },
            shrink:function(amount){
                var s = this;
                return s.expand(amount * -1);
            },
            contains:function(x, y){
                var s = this;
                if(arguments[0] instanceof d.Point){
                    var point = arguments[0];
                    x = point.x(), y = point.y();
                }
                return s.left() <= x
                    && x <= s.right()
                    && s.top() <= y
                    && y <= s.bottom();
            }

        }
    });
    return d;
})(Bakery);

Bakery.draw.color = (function (B) {
    var d = B.draw;

    var c = {}; // this 'c' will be Bakery.color
    c.RGBA = B.define({
        //r, g, b means  red, blue, green, 0 ~ 255.
        //a means alpha, 0.0 ~ 1.0
        init:function (r, g, b, a) {
            var s = this;
            s.r = r;
            s.g = g;
            s.b = b;
            s.a = a === undefined ? 1 : a;
        },
        property:{
            truncate:function () {
                var s = this;
                s.r = parseInt(s.r);
                s.g = parseInt(s.g);
                s.b = parseInt(s.b);
                return s;
            },
            toString:function () {
                var s = this;
                return 'rgba(' + s.r + ',' + s.g + ',' + s.b + ',' + s.a + ')';
            },
            clone:function(){
                var s = this;
                return new c.RGBA(s.r, s.g, s.b, s.a);
            }

        }
    });
    c.RGB = B.define({
        prototype:c.RGBA,
        init:function (r, g, b) {
            var s = this;
            s.r = r;
            s.g = g;
            s.b = b;
            s.a = 1;
        }
    });
    c.Gray = B.define({
        prototype:c.RGBA,
        init:function(gray){
            var s = this;
            s.r = gray;
            s.g = gray;
            s.b = gray;
            s.a = 1;
        }
    });
    c.HSV = B.define({
        //h means hue, 0 ~ 360
        //s, v means saturation, value of brgitness, 0 ~ 100
        init:function (h, s, v) {
            var ss = this;
            ss.h = h;
            ss.s = s;
            ss.v = v;
        },
        property:{
            toRGBA:function () {
                var ss = this;
                //r, g, b means  red, blue, green, 0 ~ 255.
                //a means alpha, 0.0 ~ 1.0
                //h means hue, 0 ~ 360
                //s, v means saturation, value of brgitness, 0 ~ 100
                var rgb = (function (h, s, v) {
                    if (s == 0) {
                        //gray
                        var dense = v / 100 * 255;
                        return  new c.RGB(dense, dense, dense);
                    }

                    h = h % 360;
                    var i = Math.floor(h / 60);
                    var f = h / 60 - i;
                    v = v * 255 / 100;
                    var m = v * (1 - s / 100);
                    var n = v * (1 - s / 100 * f);
                    var k = v * (1 - s / 100 * (1 - f));
                    switch (i) {
                        case 0:
                            return new c.RGBA(v, k, m);
                        case 1:
                            return new c.RGBA(n, v, m);
                        case 2:
                            return new c.RGBA(m, v, k);
                        case 3:
                            return new c.RGBA(m, n, v);
                        case 4:
                            return new c.RGBA(k, m, v);
                        case 5:
                            return new c.RGBA(v, m, n);
                    }
                    return null;
                })(ss.h, ss.s, ss.v);
                rgb.truncate();
                return rgb;

            },
            toString:function (asHSV) {
                var ss = this;
                if (asHSV) return 'hsv(' + ss.h + ',' + ss.s + ',' + ss.v + ')';
                return ss.toRGBA().toString();
            },
            clone:function () {
                var ss = this;
                return new c.HSV(ss.h, ss.s, ss.v);
            },
            addHue:function (hue) {
                var ss = this;
                ss.h += hue;
                return ss;
            },
            addSaturation:function (saturation) {
                var ss = this;
                ss.s += saturation;
                return ss;
            },
            addBrightness:function (brightness) {
                var ss = this;
                ss.v += brightness;
                return ss;
            }
        }
    });

    c.LinearGradient = B.define({
        init:function(){
            var s = this;
            s.colorStop({});
        },
        field:{
            colorStop:null
        },
        property:{
            _begin:null,
            _end:null,
            begin:function(x, y){
                var s = this;
                if(!arguments.length) return s._begin;
                s._begin = typeof arguments[0] === d.Point?
                    arguments[0]:new d.Point(x, y);
                return s;
            },
            end:function(x, y){
                var s = this;
                if(!arguments.length) return s._end;
                s._end = typeof arguments[0] === d.Point?
                    arguments[0]:new d.Point(x, y);
                 return s;
            },
            _colorStop:null,
            addColorStop:function(offset, color){
                var s = this;
                s.colorStop()[offset] = color.toString();
                return s;
            },
            apply:function(ctx, fill_or_stroke){
                var s = this;
                var begin = s.begin(), end = s.end();
                var gradient = ctx.createLinearGradient(begin.x(), begin.y(), end.x(), end.y());
                var colorStop = s.colorStop();
                for(var offset in colorStop){
                    if(!colorStop.hasOwnProperty(offset)) continue;
                    var color = colorStop[offset];
                    gradient.addColorStop(offset, color);
                }
                switch(fill_or_stroke){
                    case 'fill':
                        ctx.fillStyle = gradient;
                        break;
                    case 'stroke':
                        ctx.strokeStyle = gradient;
                        break;
                }
            },
            applyFillStyle:function(ctx){
                var s = this;
                return s.apply(ctx, 'fill');
            },
            applyStrokeStyle:function(ctx){
                var s = this;
                return s.apply(ctx, 'stroke');
            }
        }
    });
    c.RadialGradient = B.define({
        prototype:c.LinearGradient,
        init:function(){
            var s = this;
            s.colorStop({});
        },
        field:{
            beginRadius:0,
            endRadius:0
        },
        property:{
            apply:function(ctx, fill_or_stroke){
                var s = this;
                var begin = s.begin(), end = s.end();
                var gradient = ctx.createRadialGradient(begin.x(), begin.y(), s.beginRadius(), end.x(), end.y(), s.endRadius());
                var colorStop = s.colorStop();
                for(var offset in colorStop){
                    if(!colorStop.hasOwnProperty(offset)) continue;
                    var color = colorStop[offset];
                    gradient.addColorStop(offset, color);
                }
                switch(fill_or_stroke){
                    case 'fill':
                        ctx.fillStyle = gradient;
                        break;
                    case 'stroke':
                        ctx.strokeStyle = gradient;
                        break;
                }
            }
        }
    });

    return c;
})(Bakery);

Bakery.draw.Animation = (function(B){
    var requestAnimationFrame = (function(){
        if(typeof window === 'undefined') return null;
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    return B.define({
        init:function(canvas, render){
            var s = this;
            s.render(render);
            s.canvas(canvas);
            s.renderables = [];
        },
        field:{
            render:null,
            frameCount:0,
            pausing:false,
            stopped:false,
            canvas:null
        },
        property:{
            add:function(renderable){
                var s = this;
                if(renderable instanceof Array){
                    renderable.forEach(function(renderable){
                        s.add(renderable);
                    });
                    return s;
                }
                s.renderables.push(renderable);
                return s;
            },
            remove:function(renderable){
                var s = this;
                if(renderable instanceof Array){
                    renderable.remove(function(renderable){
                        s.add(renderable);
                    });
                    return s;
                }
                var length = s.renderables.length;
                if(!length) return s;
                for(var i=0; i< length; i++){
                    var hit = s.renderables[i] === renderable;
                    if(hit){
                        s.renderables.splice(i, 1);
                        return s;
                    }
                }
                return s;
            },
            start:function(){
                var s = this,
                    canvas = s.canvas(),
                    ctx = canvas.getContext('2d');

                var executeRender = function(){
                    if(s.stopped()) return;
                    requestAnimationFrame.call(window, executeRender);
                    if(s.pausing()) return;
                    var frameCount = s.frameCount();
                    frameCount ++;

                    ctx.save();
                    var size = new B.draw.Size(canvas.width, canvas.height);


                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    for(var i=0; i< s.renderables.length; i++){
                        var renderable = s.renderables[i];
                        renderable.move && renderable.move.call(renderable);
                        renderable.draw && renderable.draw.call(renderable, ctx);
                    }

                    s.render().call(s, ctx, size, frameCount);

                    ctx.restore();
                    s.frameCount(frameCount);
                };
                executeRender();
                return s;
            },
            stop:function(){
                var s = this;
                s.stopped(true);
                s.frameCount(0);
                return s;
            },
            pause:function(){
                var s = this;
                s.pausing(true);
                return s;
            },
            resume:function(){
                var s = this;
                s.pausing(false);
                return s;
            }
        }
    }).__extend__({
        requestAnimationFrame:requestAnimationFrame
    });
})(Bakery);

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

    d.Triangle = B.define({
        prototype:d.Drawable,
        init:function(){
            var s = this;
        },
        field:{

        },
        property:{
            draw:function(ctx){
                var s = this;

                var p = s.point(),
                    x = p.x(), y = p.y();

                var area = s.area(),
                    t = area.top(),
                    b = area.bottom(),
                    l = area.left(),
                    r = area.right();

                ctx.moveTo(x, t);
                ctx.lineTo(r, b);
                ctx.lineTo(l, b);
                ctx.lineTo(x, t);

            }
        }
    }) ;


    return d;
})(Bakery);

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
            },
            amount:function(){
                var s = this;
                return Math.sqrt(Math.pow(s.x(), 2) + Math.pow(s.y(), 2));
            },
            normalize:function(){
                var s = this;
                var amount = s.amount();
                if(!amount) return s;
                return s.multify(1 / amount);
                return s;
            },
            multify:function(amount){
                var s = this;
                s.x(s.x() * amount);
                s.y(s.y() * amount);
                return s;
            },
            clone:function(){
                var s = this;
                return new m.Velocity(s.x(), s.y());
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

