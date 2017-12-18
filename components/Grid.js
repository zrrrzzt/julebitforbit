import Cell from './Cell'

export default () => (
  <div className='grid'>
    <Cell />
    <style jsx>
      {`
        .grid {
          color: red;
          font-size: 12px;
          width: 100%;
          height: 50px;
          text-align: center;
        }
      `}
    </style>
  </div>
)
