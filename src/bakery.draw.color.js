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