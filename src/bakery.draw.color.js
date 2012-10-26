Bakery.draw.color = (function (B) {

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
                    if (s == 0) return  new c.RGB(v, v, v);//gray
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
                return new HSV(ss.h, ss.s, ss.v);
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

    return c;
})(Bakery);