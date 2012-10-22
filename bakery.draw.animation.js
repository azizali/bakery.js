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
                    requestAnimationFrame.call(window, executeRender);
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
        requestAnimationFrame:requestAnimationFrame
    });
})(Bakery);