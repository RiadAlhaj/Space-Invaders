import {useEffect ,useState } from 'react'
import './App.css'

const NUM_ALIENS = 10;
const ALIEN_SPEED = 1;
const BULLET_SPEED = 5;

const App = () => {
  const [aliens, setAliens] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [shipPosition, setShipPosition] = useState(200);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const initialAliens = Array.from({ length: NUM_ALIENS }, (_, index) => ({
      id: index,
      position: index * 50,
      isHit: false,
    }));
    
    setAliens(initialAliens);
    const interval = setInterval(moveAliens, 100);

    return () => clearInterval(interval);
  }, []);

  const moveAliens = () => {
    setAliens((prevAliens) =>
      prevAliens.map((alien) => {
        if (!alien.isHit) {
          return { ...alien, position: alien.position + ALIEN_SPEED };
        }
        return alien;
      })
    );
  };

  const shootBullet = () => {
    const newBullet = { id: Date.now(), position: 380 };
    setBullets((prevBullets) => [...prevBullets, newBullet]);
  };

  useEffect(() => {
    const bulletInterval = setInterval(() => {
      setBullets((prevBullets) => {
        const updatedBullets = prevBullets.map((bullet) => ({
          ...bullet,
          position: bullet.position - BULLET_SPEED,
        }));

        // Check for hits
        const newAliens = aliens.map((alien) => {
          if (
            updatedBullets.some(
              (bullet) =>
                bullet.position <= 0 && bullet.id === alien.id
            )
          ) {
            setScore((prevScore) => prevScore + 10);
            return { ...alien, isHit: true };
          }
          return alien;
        });

        setAliens(newAliens);

        return updatedBullets.filter((bullet) => bullet.position > 0);
      });
    }, 100);

    return () => clearInterval(bulletInterval);
  }, [aliens]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' && shipPosition > 0) {
      setShipPosition((prev) => prev - 10);
    } else if (event.key === 'ArrowRight' && shipPosition < 400) {
      setShipPosition((prev) => prev + 10);
    } else if (event.key === ' ') {
      shootBullet();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };}, [shipPosition]);

  useEffect(() => {
    if (aliens.some((alien) => alien.position > 400)) {
      setGameOver(false);
    }
  }, [aliens]);

  if (gameOver) {
    return <div className="game-over">Game Over! Score: {score}</div>;
  }

  return (
    <div className="game-container">
      <h1>Space Invaders</h1>
      <div className="score">Score: {score}</div>
      <div className="game-area">
        <div className="ship" style={{ left: shipPosition }}></div>
        {aliens.map((alien) => (
          !alien.isHit && <div key={alien.id} className="alien" style={{ left: alien.position }}></div>
        ))}
        {bullets.map((bullet) => (
          <div key={bullet.id} className="bullet" style={{ bottom: bullet.position }}></div>
        ))}
      </div>
    </div>
  );
};


export default App
