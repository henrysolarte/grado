import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [countdown, setCountdown] = useState(10)
  const [stage, setStage] = useState('countdown') // countdown, video, starwars, photos, graduationCard
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const photos = [
    'samito1.jpg', 'samito2.jpg', 'samito3.jpg', 'samito4.jpg',
    'samito6.jpg', 'samito7.jpg', 'samito8.jpg', 'samito9.jpg', 'samito10.jpg',
    'samito11.jpg', 'samito12.jpg', 'samito13.jpg', 'samito14.jpg', 'samito15.jpg',
    'samito16.jpg', 'samito18.jpg', 'samito19.jpg', 'samito20.jpg'
  ]

  useEffect(() => {
    if (countdown < 0 && stage === 'countdown') {
      setStage('video')
      return
    }

    if (stage === 'countdown') {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [countdown, stage])

  useEffect(() => {
    if (stage === 'video' && videoRef.current) {
      videoRef.current.muted = false
      videoRef.current.volume = 1
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Error en reproducción:', err)
        })
      }
    }
  }, [stage])

  useEffect(() => {
    if (stage === 'starwars') {
      // Después de 10 segundos (animación de letras), pasar a fotos
      const timer = setTimeout(() => {
        setStage('photos')
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  useEffect(() => {
    if (stage === 'photos' && currentPhotoIndex < photos.length) {
      // La última foto (samito20) se muestra 4 segundos (2 estática + 2 fade)
      // Las demás fotos se muestran 2 segundos
      const isLastPhoto = currentPhotoIndex === photos.length - 1
      const duration = isLastPhoto ? 4000 : 2000
      
      const timer = setTimeout(() => {
        setCurrentPhotoIndex(currentPhotoIndex + 1)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [stage, currentPhotoIndex, photos.length])

  useEffect(() => {
    if (stage === 'photos' && currentPhotoIndex >= photos.length) {
      // Después de todas las fotos, mostrar tarjeta
      const timer = setTimeout(() => {
        setStage('graduationCard')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [stage, currentPhotoIndex, photos.length])

  // Control de música de fondo
  useEffect(() => {
    if (stage === 'starwars' || stage === 'photos' || stage === 'graduationCard') {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.log('Error al reproducir audio:', err)
        })
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [stage])

  return (
    <div className="countdown-container">
      <audio 
        ref={audioRef}
        src="/musica/MCE.mp3"
        loop
      ></audio>

      {stage === 'countdown' && (
        <div className="countdown-number">
          {countdown}
        </div>
      )}

      {stage === 'video' && (
        <div className="video-container">
          <video 
            ref={videoRef}
            className="video-player"
            controls
            autoPlay
            muted
            onEnded={() => setStage('starwars')}
          >
            <source src="/video/twenty.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
        </div>
      )}

      {stage === 'starwars' && (
        <div className="starwars-container">
          <div className="starwars-text">
            <p>Hace muchos años, en el planeta Tierra, un lindo niño llamado Samuel Solarte inició su aventura. Esta etapa que ha batallado durante tanto tiempo llega a su fin, pero este final es realmente el inicio de su verdadera lucha.</p>
          </div>
        </div>
      )}

      {stage === 'photos' && currentPhotoIndex < photos.length && (
        <div className="photos-container">
          <img 
            key={currentPhotoIndex}
            src={`/fotos/${photos[currentPhotoIndex]}`}
            alt={`Foto ${currentPhotoIndex + 1}`}
            className={currentPhotoIndex === photos.length - 1 ? 'photo-display photo-effect-last-fade' : `photo-display photo-effect-${currentPhotoIndex % 10}`}
          />
        </div>
      )}

      {stage === 'graduationCard' && (
        <div className="graduation-card-container">
          <img 
            src="/fotos/tarjeta.jpeg" 
            alt="Tarjeta de Graduación" 
            className="graduation-card-image"
          />
        </div>
      )}
    </div>
  )
}

export default App
