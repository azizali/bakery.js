$.fn.extend({
    fieldHowToBasic:function(){
        var field = $(this);

        (function(B){

            var Circle = B.draw.drawable.Circle;
            var Ball = B.define({
                prototype:Circle
            }).__mixin__(B.draw.move.Move);

            var ball = new Ball().point(40, 40)
                .radius(30)
                .velocity(1, 1);

            var canvas = document.getElementById('demo-canvas-01');

            new B.draw.Animation(canvas).render(function(ctx, canvasSize){
                ball
                    .move() //move function changes the object location due to it's velocity
                    .draw(ctx);

                //bounce when exceed canvas
                var x = ball.point().x();
                if(x < 0 || canvasSize.width() < x){
                    ball.velocity().revertX();
                }
                var y = ball.point().y();
                if(y < 0 || canvasSize.height() < y){
                    ball.velocity().revertY();
                }

            }).start();

        })(Bakery);
        return field;
    }
});

$(function(){
    $('#field-how-to-basic').fieldHowToBasic();
})