document.addEventListener('DOMContentLoaded', () => {
    // Configuración
    const CORRECT_PIN = '0407'; // Contraseña establecida al 4 de julio (0407)
    const MAX_LENGHT = 4;
    let currentInput = '';

    // Elementos DOM
    const dots = document.querySelectorAll('#passcode-dots .dot');
    const messageBanner = document.getElementById('message-banner');
    const container = document.querySelector('.lock-container');
    const keys = document.querySelectorAll('.key-btn[data-value]');
    const deleteBtn = document.getElementById('btn-delete');
    const enterBtn = document.getElementById('btn-enter');

    // Inicializar estado del banner
    setMessage('Pista: Tu cumpleaños (DDMM) 🎂', 'info');

    // Listeners para los números del teclado
    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (currentInput.length < MAX_LENGHT) {
                currentInput += key.getAttribute('data-value');
                updateDots();
                playClickSound();

                // Si llega al máximo, verificar automáticamente después de un pequeño delay
                if (currentInput.length === MAX_LENGHT) {
                    setTimeout(verifyPin, 300);
                }
            }
        });
    });

    // Listener para borrar
    deleteBtn.addEventListener('click', () => {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDots();
            playClickSound();
        }
    });

    // Listener para el botón enter (Corazón)
    enterBtn.addEventListener('click', () => {
        if (currentInput.length < MAX_LENGHT) {
            setMessage('Ingresa los 4 dígitos 💝', 'error');
            shakeContainer();
        } else {
            verifyPin();
        }
    });

    // Soporte para entrada desde el teclado físico
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            const keyBtn = Array.from(keys).find(k => k.getAttribute('data-value') === e.key);
            if (keyBtn) {
                keyBtn.click();
                keyBtn.classList.add('active-state');
                setTimeout(() => keyBtn.classList.remove('active-state'), 100);
            }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            deleteBtn.click();
        } else if (e.key === 'Enter') {
            enterBtn.click();
        }
    });

    // Actualizar la interfaz de los puntos
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < currentInput.length) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Verificar el PIN introducido
    function verifyPin() {
        if (currentInput === CORRECT_PIN) {
            // Éxito
            setMessage('¡Correcto! Entrando... ✨', 'success');
            dots.forEach(dot => dot.style.backgroundColor = 'var(--pink-dark)');
            
            // Animación de salida y redirección
            setTimeout(() => {
                container.style.transform = 'scale(0.9) translateY(20px)';
                container.style.opacity = '0';
                document.body.style.transition = 'background 0.8s ease';
                document.body.style.background = '#ffd1dc';
                
                setTimeout(() => {
                    window.location.href = 'cartas.html';
                }, 600);
            }, 600);
        } else {
            // Error
            setMessage('Contraseña incorrecta, intenta de nuevo 😢', 'error');
            shakeContainer();
            
            // Limpiar input con retraso corto
            setTimeout(() => {
                currentInput = '';
                updateDots();
            }, 500);
        }
    }

    // Mostrar mensajes con estilos
    function setMessage(text, type) {
        messageBanner.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i> ${text}`;
        messageBanner.className = 'message-banner ' + type;
    }

    // Animación de sacudida en caso de error
    function shakeContainer() {
        container.classList.add('shake-animation');
        setTimeout(() => {
            container.classList.remove('shake-animation');
        }, 400);
    }

    // Efecto de sonido sutil por Web Audio API (no requiere archivos externos)
    function playClickSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime); // La natural
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Ignorar si el navegador bloquea audio sin interacción previa del todo
        }
    }
});
