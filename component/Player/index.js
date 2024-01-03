import ReactPlayer from 'react-player';
import cx from 'classnames';
import { Mic, MicOff, UserSquare2 } from 'lucide-react';
import styles from '@/component/Player/index.module.css';

const Player = ({ url, muted, playing, isActive }) => {
  return (
    <div
      className={cx(styles.playerContainer, {
        [styles.nonActive]: !isActive,
        [styles.active]: isActive,
        [styles.nonPlaying]: !playing,
      })}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          height="100%"
          width="100%"
        />
      ) : (
        <UserSquare2 className={styles.user} size={isActive ? 400 : 150} />
      )}
      {!isActive ? (
        muted ? (
          <MicOff className={styles.icon} size={20} />
        ) : (
          <Mic className={styles.icon} size={20} />
        )
      ) : (
        ''
      )}
    </div>
  );
};

export default Player;
