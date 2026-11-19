SF = {

    canvas: null,
    opacity: 0,
    ctx: null,
    W: 320,
    H: 100,
    counter: 0,
    options: {
        strokeStyle: 'rbga(0,0,0,0.2)',
        strokeWidth: 1,
        xStart: 220
    },

    renderBlocks: {
  
        col: '#7CFC00',
        size: 10,
        spacing: 5,
        palette: ['#fff', '#000', '#F00', '#0F0', '#00F'],

        prepare: function(x, y, str) {
       
            var i;
       
            var letters = str.split('');
            for (i = 0; i < letters.length; i += 1) {
                this.draw(x, y, letters[i]);
                x =  x + ( this.size * SF.blocks[letters[i]][0].length ) + this.spacing;
            }

        },

        draw: function(xPos, yPos, letter) {

            var grid = SF.blocks[letter],
                xOffset = xPos,
                col,
                x, y;

            for (y = 0; y < grid.length; y += 1) {
                xPos = xOffset;
                for (x = 0; x < grid[y].length; x += 1) {
                    // col = (grid[y][x] === 1) ? this.col : '#000';
                    // switch (col) {

                    //     case 1:
                    //        col = this.col;
                    //     break;

                    //     case 2:
                    //         col
                    //     break;

                    //     default:
                    //         false;
                    //     break;
                    // }
                    if (grid[y][x] !== 0) {
                        SF.draw.rect(xPos, yPos, this.size, this.size, this.col);
                    }
                    xPos += this.size; 
                }
                yPos += this.size;
            }

        }

    
    },


    blocks: {
   
        A: [
            [1,1,1,1],
            [1,0,0,1],
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1]
        ],

        B: [
            [1,1,1,0],
            [1,0,1,0],
            [1,1,1,1],
            [1,0,0,1],
            [1,1,1,1]
        ],

        C: [
            [0,1,1,1],
            [1,0,1,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,1,1,1]
        ],

        D: [
            [1,1,1,0],
            [1,0,1,0],
            [1,0,0,1],
            [1,0,0,0],
            [1,1,1,1]
        ],
        
        E: [
            [1,1,1,1],
            [1,0,0,0],
            [1,1,1,0],
            [1,0,0,0],
            [1,1,1,1]
        ],

        F: [
            [1,1,1,1],
            [1,0,0,0],
            [1,1,1,0],
            [1,0,0,0],
            [1,0,0,0]
        ],
        
        G: [
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,0],
            [1,0,1,1],
            [1,1,1,1]
        ],

        H: [
            [1,0,0,1],
            [1,0,0,1],
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1]
        ],


        I: [
            [1,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [1,1,1,0]
        ],

        J: [
            [1,1,1,1],
            [0,0,1,0],
            [0,0,1,0],
            [1,0,1,0],
            [1,1,1,0]
        ],

        K: [
            [1,0,1,0],
            [1,0,1,0],
            [1,1,1,0],
            [1,0,0,1],
            [1,0,0,1]
        ],

        N: [
            [1,1,1,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1]
        ],


        O: [
            [0,1,1,0],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [0,1,1,0]
        ],


        S: [
            [1,1,1,2],
            [1,0,0,0],
            [1,1,1,1],
            [0,0,0,1],
            [3,1,1,1]
        ],


        T: [
            [1,1,1,1],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0]
        ],

        // GHOST: [
        //     [0,0,1,1,1,0,0],
        //     [0,1,1,1,1,1,0],
        //     [0,1,0,1,0,1,0],
        //     [0,1,1,1,1,1,0],
        //     [0,1,1,1,1,1,0],
        //     [0,1,0,1,0,1,0]
        // ],

        GHOST: [
            [0,0,0,0,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,0,0,1,1,0,0,1,1,0,0],
            [0,1,0,0,1,1,0,0,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,0,1,0,1,1,0,0],
            [0,1,1,0,1,0,1,0,1,1,0,0]
        ],

        INVADER0: [
            [0,0,1,0,0,0,0,0,1,0,0,0],
            [0,0,0,1,0,0,0,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,0,0,0],
            [0,1,1,0,1,1,1,0,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,0],
            [1,0,1,1,1,1,1,1,1,0,1,0],
            [1,0,1,0,0,0,0,0,1,0,1,0],
            [0,0,0,1,1,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0]
        ],

        INVADER1: [
            [0,0,1,0,0,0,0,0,1,0,0,0],
            [0,0,0,1,0,0,0,1,0,0,0,0],
            [1,0,1,1,1,1,1,1,1,0,1,0],
            [1,1,1,0,1,1,1,0,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,0,0,0,0,0,1,0,0,0],
            [0,1,0,0,0,0,0,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0]
        ]



    },

    draw: {
   
        clear: function() {
            SF.ctx.clearRect(0, 0, SF.W, SF.H); 
        },


        rect: function(x, y, w, h, col) {
            SF.ctx.fillStyle = col;
            SF.ctx.strokeStyle = SF.options.strokeStyle;
            SF.ctx.strokeWidth = SF.options.strokeWidth;
            SF.ctx.fillRect(x, y, w, h);
            SF.ctx.strokeRect(x, y, w, h);
        }
    
    },


    init: function(x) {
  

        SF.canvas = document.getElementsByTagName('canvas')[0];
        SF.canvas.width = SF.W;
        SF.canvas.height = SF.H;
        SF.ctx = SF.canvas.getContext('2d');

        SF.loop();

    },



    loop: function() {

        var time = new Date().getSeconds(),
            frame = (time % 2),
            x = SF.options.xStart;


        SF.draw.clear();
        SF.renderBlocks.size = 10;
        SF.ctx.globalAlpha = SF.opacity;
        SF.renderBlocks.draw(x - (SF.renderBlocks.size * 5),10,'INVADER' + frame);

        SF.opacity += 0.05;
        SF.counter += 1;
        setTimeout(SF.loop, 30);
    
    }
};

