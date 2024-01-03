import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import { useSocket } from '@/context/socket';
import useMediaStream from '@/hooks/useMediaStream';
import usePeer from '@/hooks/usePeer';
import usePlayer from '@/hooks/usePlayer';

import Player from '@/component/Player';
import Bottom from '@/component/Bottom';
import styles from '@/styles/room.module.css';
import { useRouter } from 'next/router';
const Room = () => {
  const socket = useSocket();
  const { roomId } = useRouter().query;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonPlayerHighlighted,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser) => {
      console.log(`User connected in room with user id ${newUser}`);

      const call = peer.call(newUser, stream);

      call.on('stream', (incomingStream) => {
        console.log(`Incoming stream from ${newUser}`);
        setPlayers((prevState) => ({
          ...prevState,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
        setUsers((prevState) => ({
          ...prevState,
          [newUser]: call,
        }));
      });
    };

    socket.on('user-connected', handleUserConnected);

    return () => {
      socket.off('user-connected', handleUserConnected);
    };
  }, [socket, stream, peer, setPlayers]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on('call', (call) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on('stream', (incomingStream) => {
        console.log(`Incoming stream from ${callerId}`);
        setPlayers((prevState) => ({
          ...prevState,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
        setUsers((prevState) => ({
          ...prevState,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!myId || !stream) return;
    console.log(`Setting my stream ${myId}`);
    setPlayers((prevState) => ({
      ...prevState,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);
  useEffect(() => {
    if (!socket) return;
    const handleUserVideo = (userId) => {
      console.log(`The user with id ${userId} has toggled video`);
      toggleVideo(userId);
    };
    const handleUserAudio = (userId) => {
      console.log(`The user with id ${userId} has toggled audio`);
      toggleAudio(userId);
    };
    const handleUserLeave = (userId) => {
      console.log(`user with userId ${userId} is leaving the room`);
      users[userId]?.close();
      const playersClone = cloneDeep(players);
      delete playersClone[userId];
      setPlayers(playersClone);
    };
    socket.on('user-toggle-video', handleUserVideo);
    socket.on('user-toggle-audio', handleUserAudio);
    socket.on('user-leave', handleUserLeave);
    return () => {
      socket.off('user-toggle-video', handleUserVideo);
      socket.off('user-toggle-audio', handleUserAudio);
      socket.off('user-leave', handleUserLeave);
    };
  }, [players, setPlayers, socket, toggleAudio, toggleVideo, users]);

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonPlayerHighlighted).map((playerId) => {
          const { url, muted, playing } = nonPlayerHighlighted[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default Room;
