Bakery.draw = (function(B){
    if(typeof B === 'undefined'){
        console.error('[bakery.draw.js] you need load bakery.js before use baker.draw.js');
        return;
    }
    var d = {};
    d.Point = B.define({
        init:function (x, y) {
            var s = this;
            s.x = x || 0;
            s.y = y || 0;
        },
        property:{
            clone:function(){
                var s = this;
                return new d.Point(s.x, s.y);
            },
            revertX:function(){
                var s = this;
                s.x *= -1;
                return s;
            },
            revertY:function(){
                var s = this;
                s.y *= -1;
                return s;
            },
            toString:function(){
                var s = this;
                return '{x:' + s.x + ',y:' + s.y + '}';
            },
            add:function(point){
                var s = this;
                s.x += point.x;
                s.y += point.y;
                return s;
            },
            subtract:function(point){
                var s = this;
                s.x -= point.x;
                s.y -= point.y;
                return s;
            },
            distance:function(point){
                var s = this;
                var x = s.x - point.x,
                    y = s.y - point.y;
                return Math.sqrt(
                    Math.pow(x, 2) + Math.pow(y, 2)
                );
            }
        }
    }).__extend__({
            random:function(area){
                var x = area.left + area.getWidth() * Math.random(),
                    y = area.top + area.getHeight() * Math.random();
                return new Point(x, y);
            }
        });
    d.Size = B.define({
        init:function(width, height){
            var s = this;
            s.width = width;
            s.height = height === undefined?width:height;
        },
        property:{
            clone:function(){
                var s = this;
                return new d.Size(s.width, s.height);
            },
            toString:function(){
                var s = this;
                return '{w:' + s.width + ',h:' + s.height + '}';
            }
        }
    });
    d.Area = B.define({
        init:function(left, top, right, bottom){
            var s = this;
            s.left  = left;
            s.right = right;
            s.top = top;
            s.bottom = bottom;
        },
        property:{
            getWidth:function(){
                var s = this;
                return s.right - s.left;
            },
            getHeight:function(){
                var s = this;
                return s.bottom - s.top;
            },
            toString:function(){
                var s = this;
                return '{top:' + s.top + ',right:' + s.right
                    +  ',bottom:' + s.bottom + ',left:' + s.left
            },
            clone:function(){
                var s = this;
                return new exports.Area(s.left, s.top, s.right, s.bottom);
            },
            shrink:function(amount){
                var s = this;
                s.left += amount;
                s.top += amount;
                s.right -= amount;
                s.bottom -= amount;
                return s;
            },
            contains:function(x, y){
                var s = this;
                if(arguments[0] instanceof d.Point){
                    var point = arguments[0];
                    x = point.x;
                    y = point.y;{}
                }
                return s.left <= x
                    && x <= s.right
                    && s.top <= y
                    && y <= s.bottom;
            }

        }
    });


    d.Animation = B.define({
        init:function(canvas, render){
            var s = this;
            s.render(render);
            s.canvas(canvas);
        },
        field:{
            render:null,
            frameCount:0,
            pausing:false,
            stopped:false,
            canvas:null
        },
        property:{
            start:function(){
                var s = this,
                    canvas = s.canvas(),
                    ctx = canvas.getContext('2d');

                var executeRender = function(){
                    if(s.stopped()) return;
                    d.Animation.requestAnimationFrame.call(window, executeRender);
                    if(s.pausing()) return;
                    var frameCount = s.frameCount();
                    frameCount ++;

                    ctx.save();

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    s.render().call(s, ctx, frameCount);

                    ctx.restore();
                    s.frameCount(frameCount);
                };
                executeRender();
            },
            stop:function(){
                var s = this;
                s.stoped = true;
                s.frameCount = 0;
            },
            pause:function(){
                var s = this;
                s.pausing = true;
            },
            resume:function(){
                var s = this;
                s.pausing = false;
            }
        }
    }).__extend__({
        requestAnimationFrame:(function(){
            if(typeof window === 'undefined') return;
            return window.requestAnimationFrame    ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })()
    });




    return d;
})(Bakery);