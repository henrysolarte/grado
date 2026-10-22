import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [countdown, setCountdown] = useState(10)
  const [stage, setStage] = useState('countdown') // countdown, starwars, photos, graduationCard, menu, galeria, invitacion, confirmacion, mapa
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [countdownStarted, setCountdownStarted] = useState(false)
  const [expandedPhoto, setExpandedPhoto] = useState(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  // Iniciar countdown y audio simultáneamente
  const handlePlayClick = () => {
    setCountdownStarted(true)
    // Reproducir audio combinado (cuenta regresiva + MCE.mp3)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.muted = false
      audioRef.current.volume = 1
      audioRef.current.play().catch(err => {
        console.log('Error al reproducir audio:', err)
      })
    }
  }

  const photos = [
    'samito1.jpg', 'samito2.jpg', 'samito3.jpg', 'samito4.jpg',
    'samito6.jpg', 'samito7.jpg', 'samito8.jpg', 'samito9.jpg', 'samito10.jpg',
    'samito11.jpg', 'samito12.jpg', 'samito13.jpg', 'samito14.jpg', 'samito15.jpg',
    'samito16.jpg', 'samito18.jpg', 'samito19.jpg', 'samito20.jpg'
  ]

  useEffect(() => {
    if (countdown < 0 && stage === 'countdown') {
      setStage('starwars')
      setCountdownStarted(false)
      return
    }

    if (stage === 'countdown' && countdownStarted) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [countdown, stage, countdownStarted])

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
      // Después de 12 segundos (animación de letras), pasar a fotos
      const timer = setTimeout(() => {
        setStage('photos')
      }, 12000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  useEffect(() => {
    if (stage === 'photos' && currentPhotoIndex < photos.length) {
      // Todas las fotos se muestran 3 segundos
      const duration = 3000
      
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

  // Mostrar menú después de 10 segundos de la tarjeta de graduación
  useEffect(() => {
    if (stage === 'graduationCard') {
      const timer = setTimeout(() => {
        setStage('menu')
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  // Control de música de fondo - pausa solo si volvemos a countdown
  useEffect(() => {
    if (stage === 'countdown' && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [stage])

  return (
    <div className="countdown-container">
      <audio 
        ref={audioRef}
        src="/musica/presentacion-audio.mp3"
        loop
        preload="auto"
        muted={false}
        volume={1}
      ></audio>

      {stage === 'countdown' && (
        <div className="countdown-wrapper">
          {!countdownStarted && (
            <button className="play-button" onClick={handlePlayClick}>
              ▶ PLAY
            </button>
          )}
          {countdownStarted && (
            <div className="countdown-number">
              {countdown}
            </div>
          )}
        </div>
      )}


      {stage === 'starwars' && (
        <div className="starwars-container">
          <div className="starwars-text">
            <p>Hace Dieciséis años, en el planeta Tierra, un lindo niño llamado Samuel Solarte Polo inició su aventura. Esta etapa que ha batallado durante tanto tiempo llega a su fin, pero este final es realmente el inicio de su verdadera lucha.</p>
          </div>
        </div>
      )}

      {stage === 'photos' && currentPhotoIndex < photos.length && (
        <div className="photos-container">
          <img 
            key={currentPhotoIndex}
            src={`/fotos/${photos[currentPhotoIndex]}`}
            alt={`Foto ${currentPhotoIndex + 1}`}
            className={`photo-display photo-effect-${currentPhotoIndex % 10}`}
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

      {stage === 'menu' && (
        <div className="menu-container">
          <div className="menu-content">
            <div className="menu-buttons-grid">
              <button className="menu-button" onClick={() => setStage('galeria')}>
                <span>Galería</span>
              </button>
              <button className="menu-button" onClick={() => setStage('invitacion')}>
                <span>Invitación</span>
              </button>
              <button className="menu-button" onClick={() => setStage('confirmacion')}>
                <span>Confirmación</span>
              </button>
              <button className="menu-button" onClick={() => setStage('mapa')}>
                <span>Mapa</span>
              </button>
            </div>
            <button className="menu-home-button" onClick={() => {
              setCountdown(10)
              setCurrentPhotoIndex(0)
              setStage('countdown')
            }}>
              🏠
            </button>
          </div>
        </div>
      )}

      {stage === 'galeria' && (
        <div className="page-container">
          <h1>Galería</h1>
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <div 
                key={index} 
                className="gallery-item"
                onClick={() => setExpandedPhoto(photo)}
              >
                <img 
                  src={`/fotos/${photo}`}
                  alt={`Foto ${index + 1}`}
                  className="gallery-thumbnail"
                />
              </div>
            ))}
          </div>
          <button className="page-home-button" onClick={() => setStage('menu')}>
            🏠
          </button>

          {expandedPhoto && (
            <div className="photo-modal" onClick={() => setExpandedPhoto(null)}>
              <div className="photo-modal-content">
                <img 
                  src={`/fotos/${expandedPhoto}`}
                  alt="Foto expandida"
                  className="photo-expanded"
                />
                <button className="photo-modal-close" onClick={() => setExpandedPhoto(null)}>
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {stage === 'invitacion' && (
        <div className="invitation-page-container">
          <img 
            src="/fotos/tarjeta.jpeg" 
            alt="Invitación" 
            className="invitation-image"
          />
          <button className="invitation-home-button" onClick={() => setStage('menu')}>
            🏠
          </button>
        </div>
      )}

      {stage === 'confirmacion' && (
        <div className="page-container">
          <h1>Confirmación</h1>
          <div className="confirmation-content">
            <p className="confirmation-text">Confirma tu asistencia enviando un mensaje a:</p>
            <div className="whatsapp-buttons-group">
              <a 
                href="https://wa.me/573186866521?text=Hola%20quiero%20confirmar%20mi%20asistencia%20al%20evento%20de%20Samuel"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
              >
                📱 3186866521
              </a>
              <a 
                href="https://wa.me/573174724462?text=Hola%20quiero%20confirmar%20mi%20asistencia%20al%20evento%20de%20Samuel"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
              >
                📱 3174724462
              </a>
            </div>
          </div>
          <button className="page-home-button" onClick={() => setStage('menu')}>
            🏠
          </button>
        </div>
      )}

      {stage === 'mapa' && (
        <div className="page-container">
          <h1>Mapa</h1>
          <div className="map-content">
            <h2 className="map-title">Hotel Don Saúl - Salón Nazareth</h2>
            <p className="map-location">Pasto, Nariño, Colombia</p>
            <p className="map-description">Ubicación del evento</p>
            <a 
              href="https://www.google.com/maps/place/Hotel+Don+Saul/@1.213053,-77.2815043,17.25z/data=!4m9!3m8!1s0x8e2ed4845c740f9d:0x1ea85a2642a586c4!5m2!4m1!1i2!8m2!3d1.2132089!4d-77.2791564!16s%2Fg%2F1tddt786?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="map-button"
            >
              📍 Abrir en Google Maps
            </a>
          </div>
          <button className="page-home-button" onClick={() => setStage('menu')}>
            🏠
          </button>
        </div>
      )}
    </div>
  )
}

export default App
