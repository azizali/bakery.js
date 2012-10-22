$.fn.extend({
    fieldHowToBasic:function(){
        var field = $(this);

        (function(B){
            var canvas = document.getElementById('demo-canvas-01');
            /* if you use jQuery, */
            // var canvas = $('#demo-how-to').get(0);

            var ball = new B.draw.drawable.Drawable();
            var animation = new B.draw.Animation(canvas, function(ctx, frameCount){
                ball.draw(ctx);
            });
            animation.start();
        })(Bakery);
        return field;
    }
});

$(function(){
    $('#field-how-to-basic').fieldHowToBasic();
})