import { useSocket } from '@/context/socket';
import useMediaStream from '@/hooks/useMediaStream';
import usePeer from '@/hooks/usePeer';
import Player from '@/component/Player';
const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();

  return (
    <div>
      <Player url={stream} muted={true} playing={true} playerId={myId} />
    </div>
  );
};

export default Room;
