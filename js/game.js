'use strict'

const EMPTY = ''
const BOMB = '💣'
const FLAG = '🚩'
var lives = 3
var gInterval
var isWin = false
var gSeconds = 0
var gMinutes = 0
var gFirstClick = true


var gLevel = {
    SIZE: 8,
    MINES: 2
}

var gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard

function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()
    sendLocation()
    renderBoard(gBoard)
    console.log(gBoard)
}


function buildBoard(firstClickIdx, firstClickIdy) {

    var mat = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        mat[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            mat[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    // console.log(bombs)
    for (var k = 0; k < gLevel.MINES;) {
        var location = getRandomBombIndex()
        if (!mat[location.randIdx][location.randIdy].isMine && !(location.randIdx === firstClickIdx && location.randIdy === firstClickIdy)) {
            mat[location.randIdx][location.randIdy].isMine = true
            k++
        }
    }
    return mat
}


function sendLocation() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            setMinesNegsCount({ i, j })
        }
    }
}


function setMinesNegsCount(location) {

    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === location.i && j === location.j) continue
            if (gBoard[i][j].isMine) { gBoard[location.i][location.j].minesAroundCount++ }
        }
    }
    return gBoard
}


function getRandomBombIndex() {
    var randIdx = getRandomIntInclusive(0, gLevel.SIZE - 1)
    var randIdy = getRandomIntInclusive(0, gLevel.SIZE - 1)
    return { randIdx, randIdy }
}


function renderBoard(board) {

    var strHtml = '<tbody>'

    for (var i = 0; i < gLevel.SIZE; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cellClass = `cell cell${i}-${j}`
            strHtml += `<td class="${cellClass}" onclick="onCellClicked(${i},${j})" oncontextmenu="onRightClick(event,${i},${j})"></td>`
        }
        strHtml += '</tr>'

    }
    strHtml += '</tbody>'
    document.querySelector('table').innerHTML = strHtml
}


function renderCell(location, value) {
    var tableCell = document.querySelector(`.cell.cell${location.i}-${location.j}`)
    console.log(`Rendering cell at [${location.i},${location.j}] with value:`, value, tableCell)
    console.log(tableCell)
    tableCell.innerText = value
}


function onCellClicked(i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isRevealed) return
    if (gBoard[i][j].isMarked) return

    if (gFirstClick) {
        timer()
        gFirstClick = false
    }
    gGame.revealedCount++
    gBoard[i][j].isRevealed = true
    if (gBoard[i][j].isMine) {
        renderCell({ i, j }, BOMB)
        isWin = false
        gameOver(isWin)
        return
    }
    gBoard[i][j].minesAroundCount === 0 ? renderCell({ i, j }, EMPTY) : renderCell({ i, j }, gBoard[i][j].minesAroundCount)
    // onCellClicked(recursive function call)
    checkGameOver()
}


function onRightClick(event, i, j) {
    event.preventDefault()
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        renderCell({ i, j }, EMPTY)
    }
    else {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        renderCell({ i, j }, FLAG)
    }
    checkGameOver()
}


// function expandReveal(elCell, i, j) {
//     if(gBoard[i][j].minesAroundCount === 0)
// }

function checkGameOver() {
    if (gGame.markedCount === gLevel.MINES && gGame.revealedCount === gLevel.SIZE ** 2 - gGame.MINES) {
        isWin = true
        gameOver(isWin)
    }
}


function gameOver(status) {
    clearInterval(gInterval)
    if (status) {
        renderMsg('Congratulations!😄')
        gGame.isOn = false
        return
    } else {
        renderMsg('Try again!😞')
        gGame.isOn = false
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine) {
                    gBoard[i][j].isRevealed = true
                    renderCell({ i, j }, BOMB)
                }
            }
        }
    }
}

function renderMsg(msg) {
    var gameOverMsg = document.querySelector('.msg')
    gameOverMsg.innerText = msg
    gameOverMsg.classList.remove('hidden')
}

function timer() {
    gInterval = setInterval(() => {
        gSeconds++
        if (gSeconds >= 60) {
            gMinutes++
            gSeconds = 0
        }
        var secStr = gSeconds < 10 ? secStr = '0' + gSeconds : gSeconds
        var minStr = gMinutes < 10 ? minStr = '0' + gMinutes : gMinutes
        document.querySelector('span').innerText = `${minStr}:${secStr}`
    }, 1000)
}


function changeize(size) {
    if (size === 'Easy') {
        gLevel.SIZE = 8
        gLevel.MINES = 6
    }
    else if (size === 'Hard') {
        gLevel.SIZE = 15
        gLevel.MINES = 20
    }
    else {
        gLevel.SIZE = 21
        gLevel.MINES = 53
    }
    onInit()
}




