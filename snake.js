(function() {
    'use strict';

    $(document).ready(function() {
        //Canvas attributes
        var canvas = $('#canvas')[0];
        var ctx = canvas.getContext('2d');
        var canvasWidth = $('#canvas').width();
        var canvasHeight = $('#canvas').height();

        //The snake
        var snake;
        var food;
        var direction;
        var startLength = 10;
        var cellWidth = 10;
        var gameLoop;
        var score = 0;

        function init() {
            direction = 'right';
            createSnake();
            createFood();

            if(typeof gameLoop !== 'undefined') {
                clearInterval(gameLoop);
            }
            gameLoop = setInterval(paint, 60);
        }

        function createSnake() {
            var i,
                length = startLength;

            snake = [];
            for(i = length - 1; i >= 0; i--) {
                snake.push({
                    x: i,
                    y: 0
                });
            }
        }

        function createFood() {
            food = {
                x: Math.round(Math.random() * (canvasWidth - cellWidth) / cellWidth),
                y: Math.round(Math.random() * (canvasHeight - cellWidth) / cellWidth)
            }
        }

        function paint() {
            paintSnake();
            paintFood();

            var scoreText = revealMessage(score);
            ctx.fillText(scoreText, 5, canvasHeight - 5);
        }

        function revealMessage(score){
            var message = '\u0414\u0430\u0448\u0430 \u0442\u0438 \u043f\u0440\u0435\u043a\u0440\u0430\u0441\u043d\u0438\u0439';
            if(score >= message.length) {
                return message;
            } else {
                return message.substr(0, score);
            }
        }

        function paintSnake() {
            var i, c;

            //Paint background to avoid the trail
            paintBackground();

            //Snake movement
            var newHeadXPos = snake[0].x;
            var newHeadYPos = snake[0].y;
            switch (direction) {
                case 'right':
                    newHeadXPos++;
                    break;
                case 'left':
                    newHeadXPos--;
                    break;
                case 'up':
                    newHeadYPos--;
                    break;
                case 'down':
                    newHeadYPos++;
                    break;
            }

            //Game Over check
            if(newHeadXPos === -1 ||
                newHeadXPos === canvasWidth / cellWidth ||
                newHeadYPos === -1 ||
                newHeadYPos === canvasWidth / cellWidth ||
                checkCollision(newHeadXPos, newHeadYPos, snake)) {
                //Restart the game
                init();
                return;
            }

            //Move the tail to the new head position to represent movement
            //Or snake eats food
            if(newHeadXPos === food.x && newHeadYPos === food.y) {
                var tail = {
                    x: newHeadXPos,
                    y: newHeadYPos
                };

                score++;

                createFood();
            } else {
                var tail = snake.pop();
                tail.x = newHeadXPos;
                tail.y = newHeadYPos;
            }
            snake.unshift(tail);

            //Paint the snake
            for(i = 0; i < snake.length; i++) {
                c = snake[i];
                paintCell(c.x, c.y);
            }
        }

        function paintFood() {
            paintCell(food.x, food.y);
        }

        function paintCell(x, y) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
        }

        function paintBackground() {
            //Painting the Canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
        }

        function checkCollision(x, y, collisionArray) {
            var i;

            for(i = 0; i < collisionArray.length; i++) {
                if(collisionArray[i].x === x && collisionArray[i].y === y) {
                    return true;
                }
            }
            return false;
        }

        $(document).keydown(function(e) {
            var key = e.which;
            if(key === 37 && direction !== 'right') {
                direction = 'left';
            } else if(key === 38 && direction !== 'down') {
                direction = 'up';
            } else if(key === 39 && direction !== 'left') {
                direction = 'right';
            } else if(key === 40 && direction !== 'up') {
                direction = 'down';
            }
        });

        init();
    });
}());