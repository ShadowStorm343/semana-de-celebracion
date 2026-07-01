document.addEventListener('DOMContentLoaded', () => {
    // Datos de las cartas (Puedes personalizar el contenido aquí)
    const lettersData = {
        '1': {
            title: 'Para la chica más hermosa de todo el Perú🌸',
            date: 'Inicio de tu Semana Especial',
            body: '<p>Hola, mi reina hermosa. Quería comenzar este detalle diciéndote lo mucho que significas para mí.</p><p>Esta semana es tu semana de celebración, y quiero que cada día te sientas la persona más amada, más querida, más valorada y consentida del universo. Eres la luz de mis ojos y el motivo de mis sonrisas.</p><p>Espero que este pequeño rincón digital semanal te robe una sonrisa hoy y los días por venir. ¡Esto es solo el comienzo de una ola de detalles y pequeños regalos! Todo, el preámbulo de tu gran celebración. Te quiero muchísimo, corazón de melón. 💝</p><p class="bible-quote">Eclesiastés 4:9-10: "Más valen dos que uno, porque obtienen más fruto de su esfuerzo. Si caen, el uno levanta al otro".</p>'
        },
        '2': {
            title: 'Nuestros Momentos ✨',
            date: 'Un dulce recuerdo',
            body: '<p>Cada momento que pasamos juntos es como una escena de nuestra propia historia mágica. Me encanta recordar nuestras risas, nuestras conversaciones largas y la forma tan linda en la que nos complementamos.</p><p>Agradezco a la vida cada segundo a tu lado y juro seguir creando recuerdos hermosos que guardaremos para siempre en el corazón. Eres mi lugar favorito en el mundo entero. 🧸✨</p>Hoy, martes, espero hayas tenido un estupendo trabajo, y te haya ido bien en la universidad. Te quiero, corazón de melón, ya falta poco para la gran sorpresa. Eres la luz del sol que ilumina mis días, y la luz de la luna y las estrellas que ilumina mis nocheso❤️<p class="bible-quote">Rut 1:16: "¡No insistas en que te abandone o en que me separe de ti! Porque iré adonde tú vayas, y viviré donde tú vivas. Tu pueblo será mi pueblo, y tu Dios será mi Dios".</p>'
        },
        '3': {
            title: 'Mis Deseos Para Ti 🎁',
            date: 'Con todo mi corazón',
            body: '<p>En esta semana tan especial, mi mayor deseo es que seas inmensamente feliz. Que se cumplan todos tus sueños y que tu corazón se llene de paz y alegría.</p><p>Quiero estar a tu lado para celebrar cada uno de tus logros y apoyarte en cada paso que des. Que la vida te sonría siempre tanto como tú me haces sonreír a mí.</p><p>¡Que empiece la celebración! Eres maravillosa. 💕🌸</p>'
        }
    };

    // Elementos del DOM
    const cards = document.querySelectorAll('.envelope-card');
    const modal = document.getElementById('letter-modal');
    const modalTitle = document.getElementById('modal-letter-title');
    const modalBody = document.getElementById('modal-letter-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Control de Música de Fondo
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let hasInteracted = false;

    // Intentar reproducir música automáticamente
    function playMusic() {
        if (bgMusic) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
            }).catch(() => {
                console.log('Autoplay bloqueado. Esperando clic del usuario.');
            });
        }
    }

    // Intentar autoplay
    playMusic();

    // Activar al primer clic en cualquier lugar si el navegador bloqueó el autoplay
    const initAudio = () => {
        if (!hasInteracted) {
            hasInteracted = true;
            playMusic();
            document.removeEventListener('click', initAudio);
        }
    };
    document.addEventListener('click', initAudio);

    // Reducir el volumen al 50%
    if (bgMusic) {
        bgMusic.volume = 0.5;
    }

    // Botón flotante para pausar/reproducir
    if (musicToggle && bgMusic) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            hasInteracted = true;
            document.removeEventListener('click', initAudio);

            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                });
            } else {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            }
        });
    }

    // Manejador de clic en cada sobre
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const letterId = card.getAttribute('data-letter');
            const data = lettersData[letterId];

            if (data) {
                // Rellenar contenido del modal
                modalTitle.textContent = data.title;
                modalBody.innerHTML = data.body;
                
                // Mostrar modal con un pequeño delay para que se aprecie la animación del sobre
                setTimeout(() => {
                    modal.classList.add('active');
                    createHeartsExplosion();
                }, 300);
            }
        });
    });

    // Cerrar modal
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    function closeModal() {
        modal.classList.remove('active');
    }

    // Efecto visual: Lluvia de corazones al abrir una carta
    function createHeartsExplosion() {
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart-particle');
            heart.innerHTML = ['❤️', '💖', '🌸', '✨', '💝'][Math.floor(Math.random() * 5)];
            
            // Posición aleatoria desde el centro
            heart.style.left = '50%';
            heart.style.top = '50%';
            
            // Ángulo y distancia aleatoria para la explosión
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity;
            
            heart.style.setProperty('--x', `${x}px`);
            heart.style.setProperty('--y', `${y}px`);
            
            // Tamaño aleatorio
            heart.style.fontSize = `${10 + Math.random() * 15}px`;
            
            // Añadir al body
            document.body.appendChild(heart);
            
            // Remover después de que termine la animación
            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    }
});
