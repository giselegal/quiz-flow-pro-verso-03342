import { ComponentProps } from '@/interfaces/quiz';
import styles from '@/styles/quiz.module.css';

interface QuizVideoProps extends ComponentProps {
  src?: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  width?: string;
  aspectRatio?: string;
}

const QuizVideo: React.FC<QuizVideoProps> = ({
  src = '',
  poster = '',
  autoplay = false,
  controls = true,
  width = '100%',
  aspectRatio = '16/9',
  isSelected,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <div
      className={`${styles.quizComponent} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      style={{
        width,
        maxWidth: '100%',
        aspectRatio: aspectRatio,
      }}
    >
      {src ? (
        <video
          src={src}
          poster={poster}
          autoPlay={autoplay}
          controls={controls}
          className={styles.video}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
      ) : (
        <div
          className={styles.videoPlaceholder}
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#f3f4f6',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
          }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🎥</div>
            <p>Clique para adicionar um vídeo</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizVideo;
