import React from 'react'
import Fullscreen from 'react-full-screen'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import Button from './Button'
import Cell from './Cell'
const Images = require('../static/data/images.json')
const { knuthShuffle: shuffle } = require('knuth-shuffle')
const gpc = require('generate-pincode')
const qs = require('querystring')
const Gun = require('gun/gun')
require('gun/lib/not.js')
const gun = Gun('https://gundb.allthethings.win/gun')

function reset () {
  const blocks = Array.apply(null, {length: 25}).map(Number.call, Number)
  const cells = shuffle(blocks.slice(0))
  return {
    cells: cells,
    clearFrom: 0,
    isPlaying: false
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

export default class Grid extends React.Component {
  constructor (props) {
    super(props)
    const images = getImages()
    this.state = (Object.assign({}, {isFull: false, images: images, nowShowing: 0, lastImage: images.length - 1, imageUrl: images[0]}, reset()))
    this.clearCell = this.clearCell.bind(this)
    this.togglePlayState = this.togglePlayState.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.resetRound = this.resetRound.bind(this)
    this.fastForward = this.fastForward.bind(this)
    this.nextImage = this.nextImage.bind(this)
    this.prevImage = this.prevImage.bind(this)
    this.syncState = this.syncState.bind(this)
  }

  async componentDidMount () {
    clearInterval(this.timer)
    this.timer = setInterval(this.clearCell, 1000)
    const query = qs.parse(window.location.search.replace('?', ''))
    const gamePin = query.gamePin || gpc(6)
    gun.get(gamePin).not(key => {
      console.log('no game found - let me create one for you')
      const state = {
        isPlaying: fixSyncOut(this.state.isPlaying),
        imageUrl: fixSyncOut(this.state.imageUrl),
        images: fixSyncOut(this.state.images),
        cells: fixSyncOut(this.state.cells)
      }
      gun.get(key).put(state)
    })
    this.setState({gamePin: gamePin})
    gun.get(gamePin).on(state => {
      Object.keys(state).filter(key => key !== '_').forEach(key => {
        const updatedState = {[key]: fixSyncIn(state[key])}
        console.log(updatedState)
        this.setState(updatedState)
      })
      console.log(`Synced state`)
    })
  }

  toggleFullscreen () {
    const isFull = this.state.isFull
    this.setState({isFull: !isFull})
  }

  resetRound () {
    clearInterval(this.timer)
    this.timer = setInterval(this.clearCell, 1000)
    const newState = reset()
    this.setState(newState)
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
  }

  togglePlayState () {
    const playState = this.state.isPlaying
    const status = playState !== true
    const clearFrom = this.state.clearFrom
    const newState = {
      isPlaying: status,
      clearFrom: clearFrom
    }
    this.setState(newState)
    this.syncState(newState)
  }

  fastForward () {
    clearInterval(this.timer)
    this.timer = setInterval(this.clearCell, 100)
    this.setState({isPlaying: true})
  }

  nextImage () {
    const images = this.state.images
    const nowShowing = this.state.nowShowing
    const newNum = nowShowing + 1
    const imageUrl = images[newNum]
    clearInterval(this.timer)
    this.timer = setInterval(this.clearCell, 1000)
    this.setState(Object.assign({nowShowing: newNum, imageUrl: imageUrl}, reset()))
  }

  prevImage () {
    const images = this.state.images
    const nowShowing = this.state.nowShowing
    const newNum = nowShowing - 1
    const imageUrl = images[newNum]
    clearInterval(this.timer)
    this.timer = setInterval(this.clearCell, 1000)
    this.setState(Object.assign({nowShowing: newNum, imageUrl: imageUrl}, reset()))
  }

  syncState (state) {
    const gamePin = this.state.gamePin
    Object.keys(state).forEach(key => {
      const val = fixSyncOut(state[key])
      console.log(val)
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
          `}
        </style>
      </Fullscreen>
    )
  }
}
