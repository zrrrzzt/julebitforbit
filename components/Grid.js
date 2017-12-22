import React from 'react'
import Fullscreen from 'react-full-screen'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import Button from './Button'
import Cell from './Cell'
const shuffle = require('knuth-shuffle').knuthShuffle

function reset () {
  const blocks = Array.apply(null, {length: 25}).map(Number.call, Number)
  const cells = shuffle(blocks.slice(0))
  return {
    blocks: blocks,
    cells: cells,
    clears: [],
    isPlaying: false
  }
}

function getImages () {
  return [
    'https://www.telemark.no/var/ezflow_site/storage/images/media/images/folkehelse/nyhetssaker/aarets-frivillighetskommune-2017/205025-1-nor-NO/AArets-frivillighetskommune-2017_responsive_12.jpg',
    'https://www.telemark.no/var/ezflow_site/storage/images/media/images/aktuelt-nyheter-paa-forsiden/2017/fylkesordfoerer-sven-tore-loekslid-og-vei-i-vellinga/205184-1-nor-NO/Fylkesordfoerer-Sven-Tore-Loekslid-og-Vei-i-vellinga_responsive_12.jpg'
  ]
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
  }

  async componentDidMount () {
    clearInterval(this.timer)
    this.timer = setInterval(this.clearCell, 1000)
  }

  toggleFullscreen () {
    const isFull = this.state.isFull
    this.setState({isFull: !isFull})
  }

  resetRound () {
    clearInterval(this.timer)
    this.timer = setInterval(this.clearCell, 1000)
    this.setState(reset())
  }

  clearCell () {
    if (this.state.isPlaying === true) {
      const cells = this.state.cells
      const clears = this.state.clears
      const cell = cells.pop()
      clears.push(cell)
      this.setState({cells: cells, clears: clears})
    }
  }

  togglePlayState () {
    const playState = this.state.isPlaying
    this.setState({isPlaying: playState !== true})
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
          {this.state.blocks.map((num, index) => (<Cell key={num} className={this.state.clears.includes(index) ? 'clear' : 'cell'} />))}
        </div>
        <div className={'menu'}>
          <Button onClick={this.toggleFullscreen} src={this.state.isFull === true ? '/static/icons/fullscreen_exit.png' : '/static/icons/fullscreen.png'} />
          {this.state.nowShowing > 0 ? <Button onClick={this.prevImage} src={'/static/icons/previous.png'} /> : null}
          <Button onClick={this.resetRound} src={'/static/icons/replay.png'} />
          <Button onClick={this.togglePlayState} src={this.state.isPlaying === true ? '/static/icons/pause.png' : '/static/icons/play.png'} />
          <Button onClick={this.fastForward} src={'/static/icons/fast_forward.png'} />
          {this.state.nowShowing < this.state.lastImage ? <Button onClick={this.nextImage} src={'/static/icons/next.png'} /> : null}
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
