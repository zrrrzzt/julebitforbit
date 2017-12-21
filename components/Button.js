export default (props) => {
  const propTypes = {
    onClick: props.onClick,
    disabled: props.disabled,
    type: props.type || 'image',
    name: props.name,
    autoFocus: props.autoFocus,
    src: props.src
  }
  return (
    <div>
      <button {...propTypes}><img {...propTypes} /></button>
      <style jsx>
        {`
          button {
            background: transparent;
            border-radius: 2px;
            padding: 0 12px;
            border: 0;
            cursor: pointer;
            margin-right: 5px;
          }
          button:focus {
            outline:0;
          }
          button:active {
            outline: 0;
          }
        `}
      </style>
    </div>
  )
}
