import React, { Component } from 'react'
import Fullscreen from 'react-full-screen'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import Button from './Button'
import Cell from './Cell'
const Images = require('../static/data/images.json')
const { knuthShuffle: shuffle } = require('knuth-shuffle')
const gpc = require('generate-pincode')
const Gun = require('gun/gun')
require('gun/lib/not.js')
const gun = Gun('https://gundb.allthethings.win/gun')

function reset () {
  return {
    cells: shuffle(Array.apply(null, {length: 25}).map(Number.call, Number)),
    clearFrom: 0,
    isPlaying: false,
    timerSpeed: 1000
  }
}

function getImages () {
  const images = shuffle(Images.slice(0))
  return images
}

function fixSyncOut (data) {
  return Array.isArray(data) ? data.join('###') : data
}

function fixSyncIn (data) {
  return /###/.test(data) ? data.split('###') : data
}

export default class Grid extends Component {
  constructor (props) {
    super(props)
    const images = getImages()
    const gamePin = gpc(6)
    this.state = (Object.assign({}, {gamePin: gamePin, isFull: false, images: images, nowShowing: 0, lastImage: images.length - 1, imageUrl: images[0]}, reset()))
    this.clearCell = this.clearCell.bind(this)
    this.togglePlayState = this.togglePlayState.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.resetRound = this.resetRound.bind(this)
    this.fastForward = this.fastForward.bind(this)
    this.nextImage = this.nextImage.bind(this)
    this.prevImage = this.prevImage.bind(this)
    this.syncState = this.syncState.bind(this)
    this.setGamePin = this.setGamePin.bind(this)
    this.initGame = this.initGame.bind(this)
  }

  async componentDidMount () {
    const gamePin = this.state.gamePin
    this.initGame(gamePin)
    this.clearCell()
  }

  initGame (gamePin) {
    gun.get(gamePin).not(key => {
      const state = {
        isPlaying: fixSyncOut(this.state.isPlaying),
        imageUrl: fixSyncOut(this.state.imageUrl),
        images: fixSyncOut(this.state.images),
        cells: fixSyncOut(this.state.cells),
        timerSpeed: this.state.timerSpeed
      }
      gun.get(key).put(state)
    })
    // Cleanup
    gun.get(gamePin).off()
    gun.get(gamePin).on(state => {
      if (state !== undefined) {
        Object.keys(state).filter(key => key !== '_').forEach(key => {
          const updatedState = {[key]: fixSyncIn(state[key])}
          this.setState(updatedState)
        })
      }
    }, true)
  }

  setGamePin (e) {
    e.preventDefault()
    const gamePinField = document.getElementById('enterGamePin')
    const gamePin = gamePinField.value.trim()
    this.setState({
      gamePin: gamePin
    })
    gamePinField.value = ''
    this.initGame(gamePin)
  }

  toggleFullscreen () {
    const isFull = this.state.isFull
    this.setState({isFull: !isFull})
  }

  resetRound () {
    const newState = reset()
    let newSyncState = {}
    Object.keys(newState).forEach(key => {
      newSyncState[key] = fixSyncOut(newState[key])
    })
    this.syncState(newSyncState)
  }

  clearCell () {
    if (this.state.isPlaying === true) {
      const clearFrom = this.state.clearFrom
      const newValue = clearFrom + 1
      this.setState({clearFrom: newValue})
    }
    setTimeout(this.clearCell, this.state.timerSpeed)
  }

  togglePlayState () {
    const playState = this.state.isPlaying
    const status = playState !== true
    const clearFrom = this.state.clearFrom
    const newState = {
      isPlaying: status,
      clearFrom: clearFrom
    }
    this.syncState(newState)
  }

  fastForward () {
    const timerSpeed = 100
    const clearFrom = this.state.clearFrom
    const newState = {
      timerSpeed: timerSpeed,
      clearFrom: clearFrom,
      isPlaying: true
    }
    this.syncState(newState)
  }

  nextImage () {
    const images = this.state.images
    const nowShowing = this.state.nowShowing
    const newNum = nowShowing + 1
    const imageUrl = images[newNum]
    const newState = Object.assign({}, {nowShowing: newNum, imageUrl: imageUrl}, reset())
    this.syncState(newState)
  }

  prevImage () {
    const images = this.state.images
    const nowShowing = this.state.nowShowing
    const newNum = nowShowing - 1
    const imageUrl = images[newNum]
    const newState = Object.assign({}, {nowShowing: newNum, imageUrl: imageUrl}, reset())
    this.syncState(newState)
  }

  syncState (state) {
    const gamePin = this.state.gamePin
    Object.keys(state).forEach(key => {
      const val = fixSyncOut(state[key])
      gun.get(gamePin).get(key).put(val)
    })
  }

  render () {
    return (
      <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({isFull})}>
        <KeyHandler keyEventName={KEYPRESS} keyValue='f' onKeyHandle={this.toggleFullscreen} />
        <KeyHandler keyEventName={KEYPRESS} keyValue='p' onKeyHandle={this.togglePlayState} />
        <KeyHandler keyEventName={KEYPRESS} keyValue='r' onKeyHandle={this.resetRound} />
        <KeyHandler keyEventName={KEYPRESS} keyValue='n' onKeyHandle={this.nextImage} />
        <KeyHandler keyEventName={KEYPRESS} keyValue='l' onKeyHandle={this.prevImage} />
        <KeyHandler keyEventName={KEYPRESS} keyValue='s' onKeyHandle={this.fastForward} />
        <div className='grid'>
          {this.state.cells.map((num, index) => (<Cell key={num} className={this.state.clearFrom > num ? 'clear' : 'cell'} />))}
        </div>
        <div className={'menu'}>
          <Button onClick={this.toggleFullscreen} src={this.state.isFull === true ? '/static/icons/fullscreen_exit.png' : '/static/icons/fullscreen.png'} />
          {this.state.nowShowing > 0 ? <Button onClick={this.prevImage} src={'/static/icons/previous.png'} /> : null}
          <Button onClick={this.resetRound} src={'/static/icons/replay.png'} />
          <Button onClick={this.togglePlayState} src={this.state.isPlaying === true ? '/static/icons/pause.png' : '/static/icons/play.png'} />
          <Button onClick={this.fastForward} src={'/static/icons/fast_forward.png'} />
          {this.state.nowShowing < this.state.lastImage ? <Button onClick={this.nextImage} src={'/static/icons/next.png'} /> : null}
        </div>
        <div>
          Bilde {this.state.nowShowing + 1} av {this.state.lastImage + 1} Game pin: {this.state.gamePin}
        </div>
        <div>
          <form onSubmit={this.setGamePin}>
            <input type='text' name='enterGamePin' id='enterGamePin' placeholder='Enter Game pin to join another game' />
          </form>
        </div>
        <style jsx>
          {`
            .grid {
              display: grid;
              grid-template-columns: auto auto auto auto auto;
              background-image: url(${this.state.imageUrl});
              background-repeat: no-repeat;
              background-position: center;
              height: 800px;
              color: red;
              font-size: 12px;
              text-align: center;
            }
            .menu {
              background-color: black;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            input {
              width: 350px;
              height: 40px;
              margin: 10px;
              font-size: 20px;
              text-align: center;
            }
          `}
        </style>
      </Fullscreen>
    )
  }
}
