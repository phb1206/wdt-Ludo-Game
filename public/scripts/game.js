
function move(id, walk) {
    for (let token of tokens) {
        if (token.id==id) {
            let element=token.element
            let path=token.path
            if (token.pos+walk>=56){
                path[pos].removeChild(element)
            }
            token.pos+=walk
            if (path[token.pos].childElementCount>0){
                if (path[token.pos].firstChild.classList[1]!==token.player) backToNest(path[token.pos])
            }
            path[token.pos].appendChild(element)
            return
        }
    }
}

function movable(turn, walk) {
    for (const token of tokens) {
        if ((token.player==="red" && turn=="A") || (token.player==="green" && turn=="B")){
            if (token.pos+walk<0) continue
            token.element.classList.add("movable")
            for (let i = 1; i < walk; i++) {
                if (token.pos+i>=0){
                    if (token.path[token.pos+i].childElementCount>0){
                        if (token.path[token.pos+i].firstChild.classList[1]!==token.player){
                            token.element.classList.remove("movable")
                        }
                    }
                }
            }
        }
    }
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
