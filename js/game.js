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
    SIZE: 4,
    MINES: 3
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
    renderBoard(gBoard)

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
    tableCell.innerText = value

    if (value !== FLAG && value !== BOMB) tableCell.classList.add('revealed')
    else if (value !== FLAG && value !== BOMB) {
        tableCell.classList.add('revealed')
    }
}


function onCellClicked(i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isRevealed) return
    if (gBoard[i][j].isMarked) return

    if (gFirstClick) {
        timer()
        gFirstClick = false
        placeMinesNoFirstClick(i, j)
        sendLocation()
        gBoard[i][j].isRevealed = false
        gGame.revealedCount++
        gBoard[i][j].minesAroundCount === 0 ? renderCell({ i, j }, EMPTY) : renderCell({ i, j }, gBoard[i][j].minesAroundCount)


    }
    else if (gBoard[i][j].isMine) {
        renderCell({ i, j }, BOMB)
        gBoard[i][j].isRevealed = true
        lives--
        updateLivesDisplay()

        if (lives === 0) {
            gameOver(false)
        } else {
            setTimeout(() => {
                if (!gGame.isOn) return
                gBoard[i][j].isRevealed = false
                renderCell({ i, j }, EMPTY)
            }, 1000)
        }
    }
    else {
        gGame.revealedCount++
        gBoard[i][j].isRevealed = true
        gBoard[i][j].minesAroundCount === 0 ? renderCell({ i, j }, EMPTY) : renderCell({ i, j }, gBoard[i][j].minesAroundCount)
    }
    // onCellClicked(recursive function call)
    checkGameOver()
}



function placeMinesNoFirstClick(iIndex, jIndex) { // there are not any mines yet because its first click
    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        var randPlace = findEmptyPos()
        if (!randPlace) break
        if (randPlace.i === iIndex && randPlace.j === jIndex) continue
        gBoard[randPlace.i][randPlace.j].isMine = true
        minesPlaced++
    }
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


function checkGameOver() {
    if (gGame.markedCount === gLevel.MINES && gGame.revealedCount === gLevel.SIZE ** 2 - gLevel.MINES) {
        isWin = true
        gameOver(isWin)
    }
}


function gameOver(status) {
    clearInterval(gInterval)
    gGame.isOn = false

    if (status) {
        renderMsg('Congratulations! 😄')
        updateSmiley('😎')
    } else {
        updateSmiley('🤯')
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
        gLevel.SIZE = 4
        gLevel.MINES = 3
    }
    else if (size === 'Hard') {
        console.log('hello')
        gLevel.SIZE = 8
        gLevel.MINES = 14
    }
    else {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    onInit()
}


function findEmptyPos() {
    const emptyPositions = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (!cell.isMine && !cell.isRevealed && !cell.isMarked) {
                const pos = { i, j }
                emptyPositions.push(pos)
            }
        }
    }

    if (emptyPositions.length === 0) return null
    const randIdx = getRandomInt(0, emptyPositions.length)
    const emptyPos = emptyPositions[randIdx]
    return emptyPos
}


function updateLivesDisplay() {
    document.querySelector('.lives').innerText = `Lives: ${lives}`
}


function updateSmiley(smiley) {
    document.querySelector('.smiley-btn').innerText = smiley
}

function onSmileyClick() {
    updateSmiley('😃')
    lives = 3
    isWin = false
    gSeconds = 0
    gMinutes = 0
    gFirstClick = true
    gGame = {
        isOn: true,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    clearInterval(gInterval)
    updateLivesDisplay()
    onInit()
}

function darkMode() {

}

