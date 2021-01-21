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
    this.pos = 0

    if (this.player=="red") this.path=redPath
    if (this.player=="blue") this.path=bluePath
    if (this.player=="yellow") this.path=yellowPath
    if (this.player=="green") this.path=greenPath
}
let tokens = []
for (let i = 0; i < 16; i++) {
    tokens[i]= new token(tokenElements[i])
}