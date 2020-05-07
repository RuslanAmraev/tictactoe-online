const ws = new WebSocket('ws://localhost:80')

setInterval(() => {
    ws.send('GET_STATUS')
}, 100);

setInterval(() => {
    winChecker()
}, 500);

setInterval(() => {
    statusSetter()
}, 1000);

ws.onopen = () => {
    console.log('ONLINE')
    ws.send('GET_STATUS')
}

ws.onmessage = response => {
    if(response.data == 0 || response.data == 1){
        turn = response.data
        setTurn()
    }else{
    status = response.data
    status = JSON.parse(status)
    statusSetter()
    }
}

let turn = 0
let status = {
    row_1:[0,0,0],
    row_2:[0,0,0],
    row_3:[0,0,0]
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

let crossScore = getCookie('cross-score') || 0
let zeroScore = getCookie('zero-score') || 0

console.log(getCookie('cross-score'))
console.log(getCookie('zero-score'))


document.getElementsByName('cross-score')[0].innerHTML = crossScore
document.getElementsByName('zero-score')[0].innerHTML = zeroScore

function cry(){
    if(event.target.className == 'cell'){
        let who = 0
        if(turn == 0){
            event.target.className = 'cross'
            turn++
            who = 1
        }else{
            event.target.className = 'zero'
            turn--
            who = 2
        }
        statusChanger(event.target, who)
        setTurn()
    }
    ws.send('CHANGE_TURN')  
}

function setTurn(){
    ws.send('GET_TURN')
    if(turn == 0){
        document.getElementsByName('turn')[0].innerHTML = 'Крестик'
    }else{
        document.getElementsByName('turn')[0].innerHTML = 'Нолик'
    }
}

function statusChanger(el, who){
    let cellNumber = el.id.slice(-1) - 0
    let rowNumber = el.parentElement.id.slice(-1) - 0
    if(rowNumber == 1){
        status.row_1[cellNumber - 1] = who
    }
    if(rowNumber == 2){
        status.row_2[cellNumber - 1] = who
    }
    if(rowNumber == 3){
        status.row_3[cellNumber - 1] = who
    }
    ws.send(JSON.stringify(status))
    setTimeout(winChecker, 1000) 
}

function winChecker(){
    if(status.row_1[0] == status.row_1[1] &&  status.row_1[1] == status.row_1[2] && status.row_1[0] != 0){
        if(status.row_1[0] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if(status.row_2[0] == status.row_2[1] &&  status.row_2[1] == status.row_2[2] && status.row_2[0] != 0){
        if(status.row_2[0] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if(status.row_3[0] == status.row_3[1] &&  status.row_3[1] == status.row_3[2] && status.row_3[0] != 0){
        if(status.row_3[0] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if(status.row_1[0] == status.row_2[1] && status.row_2[1] == status.row_3[2] && status.row_3[2] != 0){
        if(status.row_1[0] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if(status.row_1[2] == status.row_2[1] && status.row_2[1] == status.row_3[0] && status.row_3[0] != 0){
        if(status.row_1[2] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if(status.row_1[0] == status.row_2[0] &&  status.row_2[0] == status.row_3[0] && status.row_1[0] != 0){
        if(status.row_1[0] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if(status.row_1[1] == status.row_2[1] &&  status.row_2[1] == status.row_3[1] && status.row_1[1] != 0){
        if(status.row_1[1] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if(status.row_1[2] == status.row_2[2] &&  status.row_2[2] == status.row_3[2] && status.row_1[2] != 0){
        if(status.row_1[2] == 1){
            crossWin()
        }else{
            zeroWin()
        }
        restart()
    }
    if((document.getElementsByClassName('cross').length - 0) + (document.getElementsByClassName('zero').length - 0) == 9){
        alert('НИЧЬЯ')
        restart()
    }
}

function restart(){
    let crosses = document.getElementsByClassName('cross')
    let zeros = document.getElementsByClassName('zero')
    let a = 0
    turn = 0
    while( a < 3){
        for (let i = 0; i < crosses.length; i++) {
            crosses[i].className = 'cell'
        }
        a++
    }
    a = 0
    while( a < 3){
        for (let i = 0; i < zeros.length; i++) {
            zeros[i].className = 'cell'
        }
        a++
    }
    for (key in status){
        status[key] = [0,0,0]
    }
    setTurn()
    ws.send('RESET_STATUS')
    ws.send(JSON.stringify(status))
}

function crossWin(){
    setTimeout(alert("Победили крестики!"),1000)
    crossScore++
    document.getElementsByName('cross-score')[0].innerHTML = crossScore
    document.cookie = "crossScore=" + crossScore
}

function zeroWin(){
    setTimeout(alert("Победили нолики!"),1000)
    zeroScore++
    document.getElementsByName('zero-score')[0].innerHTML = zeroScore
    document.cookie = "zeroScore=" + zeroScore
}

function resetScore(){
    crossScore = 0
    zeroScore = 0
    document.getElementsByName('cross-score')[0].innerHTML = crossScore
    document.getElementsByName('zero-score')[0].innerHTML = zeroScore
    document.cookie = "zeroScore=0"
    document.cookie = "crossScore=0"
    ws.send('RESET_STATUS')
    setTurn()
    ws.send(JSON.stringify(status))
}

function statusSetter(){
    for(key in status){
        status[key].map((el, i) => {
            if(el == 1){
                document.querySelector('#row-' + key.slice(-1)).querySelector('#cell-' + (i+1)).className = 'cross'
            }
            if(el == 2){
                document.querySelector('#row-' + key.slice(-1)).querySelector('#cell-' + (i+1)).className = 'zero'
            }
            if(el == 0){
                document.querySelector('#row-' + key.slice(-1)).querySelector('#cell-' + (i+1)).className = 'cell'
            }
        })
    }
}