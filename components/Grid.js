import React from 'react'
import Button from './Button'
import Cell from './Cell'
const shuffle = require('knuth-shuffle').knuthShuffle

export default class Status extends React.Component {
  constructor (props) {
    super(props)
    const list = Array.apply(null, {length: 25}).map(Number.call, Number)
    const cells = shuffle(list.slice(0))
    this.state = {
      imageUrl: props.imageUrl,
      list: list,
      cells: cells,
      clears: []
    }
    this.clearCell = this.clearCell.bind(this)
  }

  async componentDidMount () {
    this.timer = setInterval(this.clearCell, 1000)
  }

  clearCell () {
    const cells = this.state.cells
    const clears = this.state.clears
    const cell = cells.pop()
    clears.push(cell)
    this.setState({cells: cells, clears: clears})
  }

  render () {
    return (
      <div>
        <div className='grid'>
          {this.state.list.map((num, index) => (<Cell key={num} className={this.state.clears.includes(index) ? 'clear' : 'cell'} />))}
        </div>
        <div className={'menu'}>
          <Button src={'/static/icons/previous.png'} />
          <Button src={'/static/icons/replay.png'} />
          <Button src={'/static/icons/play.png'} />
          <Button src={'/static/icons/pause.png'} />
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
