document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const cakeInteractive = document.getElementById('cake-interactive');
    const candles = document.querySelectorAll('.candle');
    const interactiveStage = document.getElementById('interactive-stage');
    const birthdayCard = document.getElementById('birthday-card');
    const instructionBanner = document.getElementById('instruction-banner');
    
    // Control de Música
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    // Ajustar el volumen por defecto al 15% para que sea suave de fondo
    if (bgMusic) {
        bgMusic.volume = 0.15;
    }

    // Lógica para soplar las velas (clic en el pastel/velas)
    if (cakeInteractive) {
        cakeInteractive.addEventListener('click', () => {
            // Si ya se soplaron, no hacer nada
            if (candles[0].classList.contains('blown-out')) return;

            // Apagar las velas
            candles.forEach(candle => {
                candle.classList.add('blown-out');
            });

            // Cambiar instrucción
            if (instructionBanner) {
                instructionBanner.innerHTML = '¡Deseo pedido con éxito! 💖';
            }

            // Reproducir sonido sutil de soplido (Web Audio API)
            playBlowSound();

            // Iniciar música de fondo
            playMusic();

            // Explosión masiva de confeti y corazones
            createHeartsExplosion(50);

            // Transición a la carta de cumpleaños
            setTimeout(() => {
                if (interactiveStage) {
                    interactiveStage.classList.add('fade-out');
                }
                
                setTimeout(() => {
                    if (interactiveStage) {
                        interactiveStage.style.display = 'none';
                    }
                    if (birthdayCard) {
                        birthdayCard.classList.add('visible');
                        // Lluvia extra al aparecer la carta
                        createHeartsExplosion(20);
                    }
                }, 800);
            }, 1500);
        });
    }

    // Lógica para voltear la tarjeta (Flip 3D)
    if (birthdayCard) {
        birthdayCard.addEventListener('click', (e) => {
            // Evitar que el clic en enlaces o textos interactivos dentro de la carta cause problemas (si hubiera)
            if (e.target.tagName === 'A' || e.target.classList.contains('close-modal')) return;
            
            birthdayCard.classList.toggle('flipped');
            createHeartsExplosion(10);
        });
    }

    // Control del botón flotante de música
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que voltee la carta si se hace clic en la música
            
            if (bgMusic.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });
    }

    // Funciones auxiliares de música
    function playMusic() {
        if (bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                if (musicToggle) musicToggle.classList.add('playing');
            }).catch(e => {
                console.log("Error al reproducir audio:", e);
            });
        }
    }

    function pauseMusic() {
        if (bgMusic) {
            bgMusic.pause();
            isMusicPlaying = false;
            if (musicToggle) musicToggle.classList.remove('playing');
        }
    }

    // Efecto visual: Lluvia de confeti de corazones y cumpleaños
    function createHeartsExplosion(count = 15) {
        const emojis = ['❤️', '💖', '🌸', '✨', '💝', '🎈', '🎉', '🍰', '🎂'];
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('heart-particle');
            particle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            
            // Posición aleatoria en pantalla (cerca del centro del viewport o del pastel)
            const xOffset = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const yOffset = (Math.random() - 0.5) * window.innerHeight * 0.8;
            
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.setProperty('--x', `${xOffset}px`);
            particle.style.setProperty('--y', `${yOffset}px`);
            
            // Tamaño aleatorio
            particle.style.fontSize = `${14 + Math.random() * 20}px`;
            
            document.body.appendChild(particle);
            
            // Remover después de que termine la animación
            setTimeout(() => {
                particle.remove();
            }, 1400);
        }
    }

    // Sonido sutil simulando un soplido (ruido blanco + filtro de frecuencia)
    function playBlowSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            // Crear búfer de ruido blanco
            const bufferSize = ctx.sampleRate * 0.5; // Medio segundo
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            // Filtrar el ruido para que suene a soplido de aire
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 400;
            filter.Q.value = 2.0;
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            noise.start();
        } catch (e) {
            // Ignorar si el navegador restringe el audio
        }
    }
});
