var dice = {
    element: document.querySelector(".dice"),
    value:0,
    rolled:true
};

dice.element.querySelector("#roll").addEventListener("click", function () {
    if (dice.rolled) return
    let x = Math.floor(Math.random() * 6 + 1);
    dice.value = x;
    dice.element.querySelector("h1").innerHTML = x
    dice.rolled=true
});

dice.element.querySelector("#pass").addEventListener("click", function () {
    if (!dice.rolled) return
    endTurn()
})

let tiles = Array.from(document.querySelectorAll(".tile"))
let redBottom = tiles.slice(18,24)
let redRight = tiles.slice(0,6).reverse()
let blueDoor = tiles[6]
let blueHall = tiles.slice(7,12)
let blueLeft = tiles.slice(12,18)
let blueBottom = tiles.slice(36,42)
let greenDoor = tiles[47]
let greenHall = tiles.slice(42,47).reverse()
let greenTop = tiles.slice(48,54).reverse()
let greenLeft = tiles.slice(66,72)
let yellowDoor = tiles[65]
let yellowHall = tiles.slice(60,65).reverse()
let yellowRight = tiles.slice(54,60).reverse()
let yellowTop = tiles.slice(30,36).reverse()
let redDoor = tiles[24]
let redHall = tiles.slice(25,30)

let redPath = redBottom.slice(1,6).concat(redRight,blueDoor,blueLeft,blueBottom,greenDoor,greenTop
    ,greenLeft,yellowDoor,yellowRight,yellowTop,redDoor,redHall)
let bluePath = blueLeft.slice(1,6).concat(blueBottom,greenDoor,greenTop,greenLeft,yellowDoor
    ,yellowRight,yellowTop,redDoor,redBottom,redRight,blueDoor,blueHall,)
let greenPath = greenTop.slice(1,6).concat(greenLeft,yellowDoor,yellowRight,yellowTop,redDoor
    ,redBottom,redRight,blueDoor,blueLeft,blueBottom,greenDoor,greenHall)
let yellowPath = yellowRight.slice(1,6).concat(yellowTop,redDoor,redBottom,redRight,blueDoor,blueLeft
    ,blueBottom,greenDoor,greenTop,greenLeft,yellowDoor,yellowHall)

let tokenElements = document.querySelectorAll(".token")
function token(element){
    this.element = element
    this.id = element.id
    this.player = element.classList[1]
    this.pos = -6

    if (this.player=="red") this.path=redPath
    if (this.player=="blue") this.path=bluePath
    if (this.player=="yellow") this.path=yellowPath
    if (this.player=="green") this.path=greenPath
}
let tokens = []
for (let i = 0; i < 16; i++) {
    tokens[i]= new token(tokenElements[i])
    tokenElements[i]
    tokenElements[i].addEventListener("click", function (){
        if (this.classList[1]!=document.querySelector(".turn h1").className || !dice.rolled) return
        if (this.parentNode.className=="tokenHolder" && dice.value<6) return;
        move(this.id)
        endTurn()
    })
}
function move(id) {
    let walk=dice.value
    for (let token of tokens) {
        if (token.id==id) {
            let element=token.element
            let path=token.path
            if (token.pos+walk>=56){
                path[pos].removeChild(element)
            }
            token.pos+=walk
            if (path[token.pos].childElementCount>0) backToNest(path[token.pos])
            path[token.pos].appendChild(element)
            return
        }
    }
}
function endTurn(){
    let turn = document.querySelector(".turn h1").className
    let newTurn
    if (turn=="red") newTurn = "blue"
    if (turn=="blue") newTurn="green"
    if (turn=="green") newTurn="yellow"
    if (turn=="yellow") newTurn="red"
    document.querySelector(".turn h1").className=newTurn
    dice.rolled=false
}
function backToNest(tile){
    let eatenToken = tile.childNodes[0]
    for (let token of tokens) {
        if (token.id == eatenToken.id) {
            tile.removeChild(eatenToken)
            let nest = document.querySelector(".nest."+token.player)
            for (let tokenHolder of nest.childNodes){
                if (tokenHolder.childElementCount==0) {
                    tokenHolder.appendChild(eatenToken)
                    break
                }
            }
            token.pos=-6
            return
        }
    }
}
