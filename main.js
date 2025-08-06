/**
 * Neo Soundbar - Modern Soundboard Application
 * Enhanced with modern JavaScript practices and better error handling
 */

class SoundBoard {
    constructor() {
        this.sounds = new Map();
        this.buttons = [];
        this.init();
    }

    init() {
        this.loadButtons();
        this.preloadSounds();
        this.attachEventListeners();
        this.setupKeyboardNavigation();
    }

    loadButtons() {
        this.buttons = Array.from(document.querySelectorAll('.tecla'));
        console.log(`Loaded ${this.buttons.length} sound buttons`);
    }

    preloadSounds() {
        this.buttons.forEach(button => {
            const classList = Array.from(button.classList);
            const soundClass = classList.find(cls => cls.startsWith('tecla_'));
            
            if (soundClass) {
                const audioId = `#som_${soundClass}`;
                const audioElement = document.querySelector(audioId);
                
                if (audioElement) {
                    this.sounds.set(soundClass, audioElement);
                    // Preload audio for better performance
                    audioElement.preload = 'auto';
                } else {
                    console.warn(`Audio element not found for: ${audioId}`);
                }
            } else {
                console.warn('No tecla class found for button:', button);
            }
        });
    }

    playSound(soundKey) {
        const audioElement = this.sounds.get(soundKey);
        
        if (audioElement) {
            // Reset audio to beginning if already playing
            audioElement.currentTime = 0;
            
            // Play with error handling
            const playPromise = audioElement.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`Playing sound: ${soundKey}`);
                    })
                    .catch(error => {
                        console.warn(`Failed to play sound ${soundKey}:`, error.message);
                    });
            }
        } else {
            console.warn(`Sound not found: ${soundKey}`);
        }
    }

    activateButton(button) {
        button.classList.add('ativa');
        
        // Auto-remove active class after animation
        setTimeout(() => {
            button.classList.remove('ativa');
        }, 150);
    }

    attachEventListeners() {
        this.buttons.forEach(button => {
            const classList = Array.from(button.classList);
            const soundClass = classList.find(cls => cls.startsWith('tecla_'));

            if (soundClass) {
                // Click handler
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.handleButtonAction(button, soundClass);
                });

                // Keyboard handlers
                button.addEventListener('keydown', (event) => {
                    if (event.code === 'Space' || event.code === 'Enter') {
                        event.preventDefault();
                        this.handleButtonAction(button, soundClass);
                    }
                });

                // Touch support for mobile
                button.addEventListener('touchstart', (event) => {
                    event.preventDefault();
                    this.handleButtonAction(button, soundClass);
                });
            }
        });
    }

    handleButtonAction(button, soundClass) {
        this.activateButton(button);
        this.playSound(soundClass);
    }

    setupKeyboardNavigation() {
        // Global keyboard shortcuts (1-9 keys)
        document.addEventListener('keydown', (event) => {
            const keyNumber = parseInt(event.key);
            
            if (keyNumber >= 1 && keyNumber <= 9) {
                event.preventDefault();
                const targetButton = this.buttons[keyNumber - 1];
                
                if (targetButton) {
                    const classList = Array.from(targetButton.classList);
                    const soundClass = classList.find(cls => cls.startsWith('tecla_'));
                    
                    if (soundClass) {
                        this.handleButtonAction(targetButton, soundClass);
                        // Focus the button for visual feedback
                        targetButton.focus();
                    }
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Neo Soundboard initializing...');
    new SoundBoard();
});

// Handle visibility change to pause/resume audio context
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - audio context may be suspended');
    } else {
        console.log('Page visible - audio context resumed');
    }
});