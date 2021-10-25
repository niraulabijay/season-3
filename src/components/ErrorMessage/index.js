import './style.css';

export default function ErrMessage({message}) {
  return (
    <div className="msgContainer">
      <div className="msgWrapper">
        <div className="title">Network warning!</div>
        <div className="content">{message}</div>
      </div>
    </div>
  );
};
