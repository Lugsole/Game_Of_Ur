/* create local width and height values */
var w = window.innerWidth
var h = window.innerHeight

var H = 1 / 3;
var W = 1 / 8;
var game;

function Size_Canvas() {
    //console.log("Resizing canvas")
    /* Change local With and height variables */
    w = window.innerWidth
    h = window.innerHeight
    /* Change canvas With and height variables */
    canvas.width = w
    canvas.height = h
};

var canvas;

var buttons = []

window.addEventListener('load', function (e) {
    canvas = document.getElementById("MyCanvas");
    canvas.addEventListener("click", Click);
    Size_Canvas()
    game = new Game_Of_Ur()
    window.requestAnimationFrame(step);
    Init_Buttons()
})

window.onresize = Size_Canvas;

class player {
    constructor() {
        this.pices = 7
        this.passed = 0
        this.places = []
        this.Color = "Blue"
        for (var i = 0; i < 7; i++)
            this.places.push(-1)
    }
    avalible() {
        return ((this.passed + this.places.length) - this.pices) >= 0
    }
}

class Game_Of_Ur {
    constructor() {
        this.Dice_Count = 4;
        this.dice = []
        this.turn = true;
        this.Players = ["a", "b"]
        this.Player = {}
        this.Player.a = new player()
        this.Player.b = new player()
        this.Player.a.Color = "Black"
        this.Roal_All_Dice()
        this.First_Point = true;
    }
    Change_Turn() {
        this.turn = !this.turn;
    }
    Curent_Player_name() {
        return this.turn ? "a" : "b"
    }
    Other_Player_name() {
        return !this.turn ? "a" : "b"
    }
    Make_Play(input) {

    }
    Roal_All_Dice() {
        for (var i = 0; i < this.Dice_Count; i++) {
            this.dice[i] = this.Roal_Dice()
        }
    }
    Roal_Dice() {
        return (Math.floor(Math.random() * 2) == 1)
    }
    Sum_Dice() {
        var sum = 0;
        for (var i = 0; i < this.Dice_Count; i++)
            if (this.dice[i])
                sum++;
        return sum;
    }
    Make_Move(Pice, Move_To) {
        if (Move_To <= 14) {
            //alert("Make move")
            this.Player[this.Curent_Player_name()].places[Pice] = Move_To
            if (Move_To == 14) {
                this.Player[this.Curent_Player_name()].passed++

                this.Player[this.Curent_Player_name()].places.splice(Pice, 1);
            }
            this.Change_Turn()
            this.Roal_All_Dice()
        }
        else {
            alert("Too Far off board")
        }
    }
    Tap_Place(str) {
        // if current player
        if (str.includes(this.Curent_Player_name())) {
            console.log("Current player")
            var place = parseInt(str.replace(this.Curent_Player_name(), ""))
            var Pice = this.Player[this.Curent_Player_name()].places.indexOf(place);
            console.log(Pice)
            if (Pice != -1) {
                var Move_To = place + this.Sum_Dice();
                if (this.Player[this.Curent_Player_name()].places.indexOf(Move_To) == -1) {
                    // if on a "Public" Square
                    if (Move_To >= 2 && Move_To < 10) {
                        console.log("Public space")
                        // if its the "Rosette"
                        if (Move_To == 6) {
                            // if the other player is not occupying it
                            if (this.Player[this.Other_Player_name()].places.indexOf(Move_To) == -1) {
                                this.Make_Move(Pice, Move_To)
                            }
                            alert("Cant make move, Because \"Rosette\" is already captured")
                        }
                        // if it is not the "Rosette"
                        else {
                            var oponentpice = this.Player[this.Other_Player_name()].places.indexOf(Move_To)
                            // if taking the opponents place
                            if (oponentpice != -1) {
                                this.Player[this.Other_Player_name()].places[oponentpice] = -1;
                            }
                            this.Make_Move(Pice, Move_To)
                        }
                    }
                    else {
                        console.log("private")
                        this.Make_Move(Pice, Move_To)
                    }
                } else {
                    console.log("Cant move because piece there")

                    alert("Position already occupied")
                }
            } else {
                alert("Not your pice")
            }


            console.log(Move_To)
        }

    }
    from_place(i, p) {

        var H = 1 / 3;
        var W = 1 / 8;
        var x = 0;
        var y = 0;
        if (i < 2) {
            x = 1 - i
        }
        if (i >= 2 && i < 10) {
            y = H;
            x = i - 2
        }
        else if (i >= 10) {
            x = (i - 10);
            x = 7 - x;
            //x / w
        }
        x *= W
        if (p == "b" && y == 0)
            y = 2 * H
        p = new place(x, y);
        return p
    }
}

class place {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class button {
    constructor(n, x, y, w, h) {
        this.name = n;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.Color = "#FF8800";
    }
    is_clicked(c_x, c_y) {
        return (this.x < c_x && this.y < c_y && c_x < this.x + this.w && c_y < this.y + this.h)
    }
}
var BTN
var ctx;
function step(now) {
    /* requests a new frame  */
    window.requestAnimationFrame(step);
    /* Creates a canvas that can be used to draw */
    //console.log("Frame")
    Size_Canvas()
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    var t1 = performance.now()
    for (var i = 0; i < buttons.length; i++) {
        var BTN = buttons[i]
        ctx.fillStyle = BTN.Color;
        ctx.fillRect(BTN.x * w, BTN.y * h, BTN.w * w, BTN.h * h);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 5;
        ctx.rect(BTN.x * w, BTN.y * h, BTN.w * w, BTN.h * h);
        ctx.stroke();
    }

    var t2 = performance.now()
    //console.log(t2 - t1)
    game.Players.forEach((p) => {
        game.Player[p].places.forEach((i) => {
            var Pla = game.from_place(i, p)
            ctx.beginPath();
            ctx.strokeStyle = game.Player[p].Color;
            ctx.arc(Pla.x * w + W / 2 * w, Pla.y * h + H / 2 * h, 50, 0, 2 * Math.PI);
            ctx.stroke();
        })
    })
    ctx.fillStyle = "#F80"
    ctx.font = "30px Arial";
    var str =  ""
    
    ctx.fillText("Player " + game.Curent_Player_name(), 3 * w * W, 1 * h * H);
    ctx.fillText(game.Sum_Dice(), 3 * w * W, .5 * h * H);

}
function Init_Buttons() {

    game.Players.forEach((p) => {
        for (var i = 0; i < 14; i++) {
            var pl = game.from_place(i, p)

            var b = new button(p + i, pl.x, pl.y, W, H)
            b.Color = "Red"
            buttons.push(b)
        }
    })

    var b = new button( "a-1", W * 2, 0, W / 2, H / 2)
    b.Color = "Blue"
    buttons.push(b)

    var b = new button("b-1", W * 2, 2.5* H, W / 2, H / 2)
    b.Color = "Blue"
    buttons.push(b)

}
function Click(e) {
    var X = e.x / w
    var Y = e.y / h
    var Player_Name = game.Curent_Player_name()
    buttons.forEach((button) => {
        if (button.is_clicked(X, Y)) {
            if (button.name.includes(Player_Name)) {
                if (button.name.includes("_I"))
                    game.Player[Player_Name].avalible()

                else
                    game.Tap_Place(button.name)
                console.log(button.name, button.Color)
            }
        }
    })
}