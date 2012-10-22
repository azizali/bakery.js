$.fn.extend({
    fieldHowToBasic:function(){
        var field = $(this);

        (function(B){
            var canvas = document.getElementById('demo-canvas-01');
            /* if you use jQuery, */
            // var canvas = $('#demo-how-to').get(0);



            var Paper = B.define({
                prototype:B.draw.drawable.Drawable
            }).__mixin__(B.draw.move.Move);

            var ball = new Paper();
            ball.point(new B.draw.Point(100, 100)).size(new B.draw.Size(10, 10));
            var animation = new B.draw.Animation(canvas, function(ctx, frameCount){
                ball
                    .move()
                    .draw(ctx);
            });
            animation.start();
        })(Bakery);
        return field;
    }
});

$(function(){
    $('#field-how-to-basic').fieldHowToBasic();
})