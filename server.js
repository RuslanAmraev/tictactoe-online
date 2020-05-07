const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 80 })

var status = {
    row_1:[0,0,0],
    row_2:[0,0,0],
    row_3:[0,0,0]
}

var turn = 0

server.on('connection', ws => {
    ws.on('message', message => {
        if(message == "GET_STATUS"){
            ws.send((JSON.stringify(status)))
        }else if(message == "RESET_STATUS"){
            status = {
                row_1:[0,0,0],
                row_2:[0,0,0],
                row_3:[0,0,0]
            }
            turn = 0
            ws.send((JSON.stringify(status)))
        }else if(message == "GET_TURN"){
            ws.send(turn)
        }else if(message == "CHANGE_TURN"){
            if(turn == 1){
                turn--
            }else{
                turn++
            }
            ws.send(turn)
        }else{
            status = JSON.parse(message)
            console.log(status)
            ws.send((JSON.stringify(status)))
        }
    })
    ws.send('Welcome to the club buddy!')
})