import React, { useState, useEffect } from 'react';
import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface QuizCountdownProps extends ComponentProps {
  title?: string;
  endTime?: number;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

const QuizCountdown: React.FC<QuizCountdownProps> = ({
  title = 'Oferta por tempo limitado!',
  endTime = Date.now() + 24 * 60 * 60 * 1000, // 24 horas por padrão
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  isSelected,
  onClick,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();
      setTimeLeft(Math.max(0, difference));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div
      className={`${styles.quizComponent} ${styles.countdown} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.countdownCard}>
        <h3 className={styles.countdownTitle}>{title}</h3>

        <div className={styles.countdownTimer}>
          {showDays && (
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{days.toString().padStart(2, '0')}</div>
              <div className={styles.timeLabel}>Dias</div>
            </div>
          )}

          {showHours && (
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{hours.toString().padStart(2, '0')}</div>
              <div className={styles.timeLabel}>Horas</div>
            </div>
          )}

          {showMinutes && (
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{minutes.toString().padStart(2, '0')}</div>
              <div className={styles.timeLabel}>Min</div>
            </div>
          )}

          {showSeconds && (
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{seconds.toString().padStart(2, '0')}</div>
              <div className={styles.timeLabel}>Seg</div>
            </div>
          )}
        </div>

        {timeLeft === 0 && <div className={styles.countdownExpired}>⏰ Tempo esgotado!</div>}
      </div>
    </div>
  );
};

export default QuizCountdown;
