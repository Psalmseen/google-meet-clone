import { useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSocket } from '@/context/socket';
import { useRouter } from 'next/router';

const usePlayer = (myId, roomId, peer) => {
  const [players, setPlayers] = useState({});
  const socket = useSocket();
  const router = useRouter();

  const playersClone = cloneDeep(players);

  const playerHighlighted = playersClone[myId];
  delete playersClone[myId];
  const nonPlayerHighlighted = playersClone;

  const toggleAudio = (userId = myId) => {
    console.log('User toggle audio', userId);

    setPlayers((prevState) => {
      const copy = cloneDeep(prevState);
      copy[userId].muted = !copy[userId]?.muted;

      return { ...copy };
    });
    if (userId === myId) {
      socket.emit('user-toggle-audio', myId, roomId);
    }
  };
  const toggleVideo = (userId = myId) => {
    console.log('User toggle video');

    setPlayers((prevState) => {
      const copy = cloneDeep(prevState);
      copy[userId].playing = !copy[userId].playing;

      return { ...copy };
    });
    if (userId === myId) {
      socket.emit('user-toggle-video', myId, roomId);
    }
  };
  const leaveRoom = () => {
    socket.emit('user-leave', myId, roomId);

    console.log(`leaving room ${roomId}`);

    peer?.disconnect();
    router.push('/');
  };

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonPlayerHighlighted,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};

export default usePlayer;
