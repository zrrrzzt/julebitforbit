import React from 'react'
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

export default class Status extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, {imageUrl: props.imageUrl}, reset())
    this.clearCell = this.clearCell.bind(this)
    this.togglePlayState = this.togglePlayState.bind(this)
    this.resetRound = this.resetRound.bind(this)
  }

  async componentDidMount () {
    this.timer = setInterval(this.clearCell, 1000)
  }

  resetRound () {
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

  render () {
    return (
      <div>
        <div className='grid'>
          {this.state.blocks.map((num, index) => (<Cell key={num} className={this.state.clears.includes(index) ? 'clear' : 'cell'} />))}
        </div>
        <div className={'menu'}>
          <Button src={'/static/icons/previous.png'} />
          <Button onClick={this.resetRound} src={'/static/icons/replay.png'} />
          <Button onClick={this.togglePlayState} src={this.state.isPlaying === true ? '/static/icons/pause.png' : '/static/icons/play.png'} />
          <Button src={'/static/icons/next.png'} />
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
              display: flex;
              align-items: center;
              justify-content: center;
            }
          `}
        </style>
      </div>
    )
  }
}
