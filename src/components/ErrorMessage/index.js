import * as styles from './style.module.scss';

export default function ErrMessage({message}) {
  return (
    <div className={styles.msgContainer}>
      <div className={styles.msgWrapper}>
        <div className={styles.title}>Network warning!</div>
        <div className={styles.content}>{message}</div>
      </div>
    </div>
  );
};
