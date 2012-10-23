$.fn.extend({
    fieldHowToBasic:function(){
        var field = $(this);

        (function(B){

            var Ball = B.define({
                prototype:B.draw.drawable.Circle
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
    },
    fieldHowToMixinMove:function(){
        var field = $(this);
        (function(B){
            var Move = B.draw.move.Move;
            var BounceMove = new B.Mixin({
                move:function(canvasSize){
                    var s = this;
                    //bounce when exceed canvas
                    var x = s.point().x();
                    if(x < 0 || canvasSize.width() < x){
                        s.velocity().revertX();
                    }
                    var y = s.point().y();
                    if(y < 0 || canvasSize.height() < y){
                        s.velocity().revertY();
                    }

                    return Move.move.call(s); //call original .move() function
                }
            }, Move);

            var Ball = B.define({
                prototype:B.draw.drawable.Circle
            }).__mixin__(BounceMove);

            var Block = B.define({
                prototype:B.draw.drawable.Rectangle
            }).__mixin__(BounceMove);

            var HSV = B.draw.color.HSV;

            var ball = new Ball().point(40, 40)
                    .fillColor(new HSV(120, 30, 90))
                    .radius(20).velocity(0.5, 0.4);

            var block = new Block()
                    .fillColor(new HSV(180, 30, 90))
                    .point(100, 40)
                    .size(40, 40)
                    .velocity(0.8, 0.3);


            var canvas = document.getElementById('demo-canvas-02');
            new B.draw.Animation(canvas).render(function(ctx, canvasSize){
                ball.move(canvasSize).draw(ctx);
                block.move(canvasSize).draw(ctx);
            }).start();

        })(Bakery);
        return field;
    },
    fieldHitDetect:function(){
        var field = $(this);
        (function(B){
            var Move = B.draw.move.Move;
            var BounceMove = new B.Mixin({
                move:function(canvasSize){
                    var s = this;
                    //bounce when exceed canvas
                    var x = s.point().x();
                    if(x < 0 || canvasSize.width() < x){
                        s.velocity().revertX();
                    }
                    var y = s.point().y();
                    if(y < 0 || canvasSize.height() < y){
                        s.velocity().revertY();
                    }

                    return Move.move.call(s); //call original .move() function
                }
            }, Move);
            var CollideBallMove = new B.Mixin({
                findCollided:function (balls) {
                    var s = this;
                    for(var i=0; i<balls.length; i++){
                        var ball = balls[i];
                        var distance = s.point().distance(ball.point());
                        if(distance < ball.radius() * 2) return ball;
                    }
                    return null;
                },
                repel:function(ball){
                    var s = this;
                    if(!ball) return s;
                    var x = ball.point().x() - s.point().x(),
                        y = ball.point().y() - s.point().y();
                    var vector = new B.draw.move.Velocity(x, y).normalize();
//                    s.velocity(vector.clone().multify(s.velocity().amount()));
//                    ball.velocity(vector.clone().revert().multify(ball.velocity().amount()));
                    return s;
                }
            }, BounceMove);

            var Ball = B.define({
                prototype:B.draw.drawable.Circle
            }).__mixin__(CollideBallMove);
            var balls = (function(count){
                var balls = [], HSV = B.draw.color.HSV;
                for(var i=0; i<count; i++){
                    var color = new HSV(B.util.math.randomInt(360), 20, 90);
                    var x = 55 * i % 200, y = 55 *  ( i/4);
                    var ball = new Ball()
                        .radius(15)
                        .point(x, y)
                        .fillColor(color)
                        .velocity(Math.random(), Math.random());
                    balls.push(ball);
                }
                return balls;
            })(10);

            var canvas = document.getElementById('demo-canvas-03');
            new B.draw.Animation(canvas).render(function(ctx, canvasSize){
                for(var i=0; i<balls.length; i++){
                    var ball = balls[i];
                    ball.move(canvasSize)
                        .draw(ctx);
                    var collided = ball.findCollided(balls);
                    ball.repel(collided);
                }
            }).start();
        })(Bakery);
        return field;
    }

});

$(function(){
    $('#field-how-to-basic').fieldHowToBasic();
    $('#field-how-to-mixin-move').fieldHowToMixinMove();
    $('#field-hit-detect').fieldHitDetect();
});