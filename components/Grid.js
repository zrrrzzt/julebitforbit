import Cell from './Cell'

export default (props) => (
  <div className='grid' {...props}>
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <Cell className={'clear'} />
    <Cell />
    <style jsx>
      {`
        .grid {
          display: grid;
          grid-template-columns: auto auto auto auto auto;
          background-image: url(${props.imageUrl});
          background-repeat: no-repeat;
          background-position: center;
          height: 800px;
          color: red;
          font-size: 12px;
          text-align: center;
        }
      `}
    </style>
  </div>
)
