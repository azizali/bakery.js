$.fn.extend({
    fieldHowToBasic:function(){
        var field = $(this);

        (function(B){
            var canvas = document.getElementById('demo-how-to');
            /* if you use jQuery, */
            // var canvas = $('#demo-how-to').get(0);


            var animation = new B.draw.Animation(canvas, function(ctx, frameCount){
            });
            animation.start();
        })(Bakery);
        return field;
    }
});

$(function(){
    $('#field-how-to-basic').fieldHowToBasic();
})