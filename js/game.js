'use strict'

const EMPTY = ''
const BOMB = '💣'
const FLAG = '🚩'


// var bombs = []

var gLevel = {
    SIZE: 4,
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
    gBoard = buildBoard()
    sendLocation()
    renderBoard(gBoard)
    console.log(gBoard)
}


function buildBoard() {

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
        if (!mat[location.randIdx][location.randIdy].isMine) {
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
            var cellClass = `cell  cell${i}-${j}`
            strHtml += `<td class="${cellClass}" onclick="onCellClicked(${i},${j})" oncontextmenu="onRightClick(event,${i},${j})"></td>`
        }
        strHtml += '</tr>'

    }
    strHtml += '</tbody>'
    document.querySelector('table').innerHTML = strHtml
}


function renderCell(location, value) {
    var tableCell = document.querySelector(`.cell.cell${location.i}-${location.j}`)
    if (!tableCell) return console.warn('cell not found', location)
    tableCell.innerText = value
}


function onCellClicked(i, j) {

    if (gBoard[i][j].isRevealed) return
    if (gBoard[i][j].isMarked) return
    gBoard[i][j].isRevealed = true
    if (gBoard[i][j].isMine) {
        renderCell({ i, j }, BOMB)
        return
        // GameOver()
    }
    gBoard[i][j].minesAroundCount === 0 ? renderCell({ i, j }, EMPTY) : renderCell({ i, j }, gBoard[i][j].minesAroundCount)
    // onCellClicked(recursive function call)

}

function onRightClick(event, i, j) {
    event.preventDefault()
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        renderCell({ i, j }, FLAG)
    }
}






function expandReveal(elCell, i, j) {
    // if(gBoard[i][j].minesAroundCount === 0)
}


// function checkGameOver() {
//     if (gGame.markedCount &&)
// }