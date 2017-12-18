export default (props) => (
  <div className='cell' {...props}>
    <style jsx>
      {`
        .cell {
          background: red;
        }
        .clear {
          background: transparent;
        }
      `}
    </style>
  </div>
)
