Bakery.draw.Animation = (function(B){
    var requestAnimationFrame = (function(){
        if(typeof window === 'undefined') return;
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
            s.drawables = [];
        },
        field:{
            render:null,
            frameCount:0,
            pausing:false,
            stopped:false,
            canvas:null
        },
        property:{
            add:function(drawable){
                var s = this;
                s.drawables.push(drawable);
                return s;
            },
            remove:function(drawable){
                var s = this;
                var length = s.drawables.length;
                if(!length) return s;
                for(var i=0; i< length; i++){
                    var hit = s.drawables[i] === drawable;
                    if(hit){
                        s.drawables.splice(i, 1);
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


                    s.render().call(s, ctx, size, frameCount);

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
        requestAnimationFrame:requestAnimationFrame
    });
})(Bakery);