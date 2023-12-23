import ReactPlayer from 'react-player';

const Player = ({ playerId, url, muted, playing }) => {
  return (
    <div>
      <ReactPlayer key={playerId} url={url} muted={muted} playing={playing} />
    </div>
  );
};

export default Player;
