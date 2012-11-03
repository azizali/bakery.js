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