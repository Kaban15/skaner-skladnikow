/**
 * Scanner - Modul do skanowania kodow kreskowych
 * Uzywa biblioteki html5-qrcode
 */

const Scanner = {
    html5QrCode: null,
    isScanning: false,
    onScanCallback: null,
    torchEnabled: false,

    // Inicjalizacja skanera
    init(containerId) {
        this.containerId = containerId;
    },

    // Uruchomienie skanera
    async start(onScanSuccess, onScanError) {
        if (this.isScanning) {
            return;
        }

        this.onScanCallback = onScanSuccess;

        try {
            // Najpierw znajdz tylna kamere
            const cameras = await Html5Qrcode.getCameras();
            let cameraId = null;

            // Szukaj kamery tylnej (environment/back)
            for (const camera of cameras) {
                const label = camera.label.toLowerCase();
                if (label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('tylna') || label.includes('0')) {
                    cameraId = camera.id;
                    break;
                }
            }

            // Jesli nie znaleziono, uzyj ostatniej kamery (zazwyczaj tylna)
            if (!cameraId && cameras.length > 0) {
                cameraId = cameras[cameras.length - 1].id;
            }

            // Utworzenie instancji skanera
            this.html5QrCode = new Html5Qrcode(this.containerId);

            // Konfiguracja skanera - bez videoConstraints bo powoduja problemy
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 150 },
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39
                ]
            };

            // Uruchomienie skanera z konkretna kamera lub facingMode
            if (cameraId) {
                await this.html5QrCode.start(
                    cameraId,
                    config,
                    (decodedText) => this.onCodeScanned(decodedText),
                    () => {}
                );
            } else {
                await this.html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => this.onCodeScanned(decodedText),
                    () => {}
                );
            }

            this.isScanning = true;

            // Poczekaj az video sie zaladuje, potem ustaw fokus
            setTimeout(() => this.tryEnableAutoFocus(), 500);

        } catch (err) {
            console.error('Blad uruchamiania skanera:', err);

            // Sprawdzenie czy to blad uprawnien
            if (err.name === 'NotAllowedError') {
                if (onScanError) {
                    onScanError('Brak dostepu do kamery. Prosze zezwolic na dostep w ustawieniach przegladarki.');
                }
            } else if (err.name === 'NotFoundError') {
                if (onScanError) {
                    onScanError('Nie znaleziono kamery. Upewnij sie, ze urzadzenie ma kamere.');
                }
            } else {
                if (onScanError) {
                    onScanError('Nie udalo sie uruchomic skanera: ' + err.message);
                }
            }
        }
    },

    // Obsluga zeskanowanego kodu
    onCodeScanned(decodedText, decodedResult) {
        // Wibracja (jesli dostepna)
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }

        // Zatrzymanie skanera
        this.stop();

        // Wywolanie callbacku
        if (this.onScanCallback) {
            this.onScanCallback(decodedText);
        }
    },

    // Zatrzymanie skanera
    async stop() {
        if (this.html5QrCode && this.isScanning) {
            try {
                await this.html5QrCode.stop();
                this.html5QrCode.clear();
            } catch (err) {
                console.error('Blad zatrzymywania skanera:', err);
            }
            this.isScanning = false;
        }
    },

    // Sprawdzenie czy skaner jest aktywny
    isActive() {
        return this.isScanning;
    },

    // Proba wlaczenia autofokusu na aktywnym strumieniu
    async tryEnableAutoFocus() {
        try {
            // Poczekaj chwile az video bedzie gotowe
            await new Promise(r => setTimeout(r, 300));

            const video = document.querySelector('#scanner-video-container video');
            if (!video || !video.srcObject) {
                console.warn('Video nie znalezione');
                return;
            }

            const tracks = video.srcObject.getVideoTracks();
            if (tracks.length === 0) {
                console.warn('Brak video tracks');
                return;
            }

            const track = tracks[0];
            const capabilities = track.getCapabilities ? track.getCapabilities() : {};
            const settings = track.getSettings ? track.getSettings() : {};

            console.log('Mozliwosci kamery:', capabilities);
            console.log('Ustawienia kamery:', settings);

            // Sprawdz czy fokus jest wspierany
            if (capabilities.focusMode) {
                const focusModes = capabilities.focusMode;
                console.log('Dostepne tryby fokusa:', focusModes);

                if (focusModes.includes('continuous')) {
                    await track.applyConstraints({
                        advanced: [{ focusMode: 'continuous' }]
                    });
                    console.log('Autofokus continuous wlaczony');
                } else if (focusModes.includes('auto')) {
                    await track.applyConstraints({
                        advanced: [{ focusMode: 'auto' }]
                    });
                    console.log('Fokus auto wlaczony');
                }
            } else {
                console.warn('Kamera nie wspiera focusMode');
            }

            // Sprobuj ustawic ostrosc manualnie jesli to mozliwe
            if (capabilities.focusDistance) {
                console.log('Zakres focusDistance:', capabilities.focusDistance);
            }

        } catch (err) {
            console.warn('Nie udalo sie ustawic autofokusu:', err);
        }
    },

    // Przelaczanie latarki
    async toggleTorch() {
        try {
            const video = document.querySelector('#scanner-video-container video');
            if (!video || !video.srcObject) return false;

            const tracks = video.srcObject.getVideoTracks();
            if (tracks.length === 0) return false;

            const track = tracks[0];
            const capabilities = track.getCapabilities ? track.getCapabilities() : {};

            if (!capabilities.torch) {
                console.warn('Latarka nie jest dostepna');
                return false;
            }

            this.torchEnabled = !this.torchEnabled;
            await track.applyConstraints({
                advanced: [{ torch: this.torchEnabled }]
            });

            return this.torchEnabled;
        } catch (err) {
            console.error('Blad latarki:', err);
            return false;
        }
    },

    // Reczne wymuszenie fokusa (tap-to-focus)
    async triggerFocus() {
        try {
            const video = document.querySelector('#scanner-video-container video');
            if (!video || !video.srcObject) return;

            const tracks = video.srcObject.getVideoTracks();
            if (tracks.length === 0) return;

            const track = tracks[0];
            const capabilities = track.getCapabilities ? track.getCapabilities() : {};

            // Przelacz miedzy manual a continuous zeby wymusic refokus
            if (capabilities.focusMode) {
                if (capabilities.focusMode.includes('manual')) {
                    await track.applyConstraints({
                        advanced: [{ focusMode: 'manual' }]
                    });
                    // Krotka pauza
                    await new Promise(r => setTimeout(r, 100));
                }
                if (capabilities.focusMode.includes('continuous')) {
                    await track.applyConstraints({
                        advanced: [{ focusMode: 'continuous' }]
                    });
                } else if (capabilities.focusMode.includes('auto')) {
                    await track.applyConstraints({
                        advanced: [{ focusMode: 'auto' }]
                    });
                }
                console.log('Fokus odswiezony');
            }
        } catch (err) {
            console.warn('Nie udalo sie odswiezyc fokusa:', err);
        }
    },

    // Sprawdzenie dostepnosci kamery
    async checkCameraAvailability() {
        try {
            const devices = await Html5Qrcode.getCameras();
            return devices && devices.length > 0;
        } catch (err) {
            console.error('Blad sprawdzania kamer:', err);
            return false;
        }
    },

    // Walidacja kodu kreskowego EAN/UPC
    validateBarcode(code) {
        // Usuniecie bialych znakow
        code = code.trim();

        // Sprawdzenie czy to tylko cyfry
        if (!/^\d+$/.test(code)) {
            return { valid: false, error: 'Kod kreskowy moze zawierac tylko cyfry' };
        }

        // Sprawdzenie dlugosci (EAN-8, EAN-13, UPC-A, UPC-E)
        const validLengths = [8, 12, 13, 14];
        if (!validLengths.includes(code.length)) {
            return { valid: false, error: 'Nieprawidlowa dlugosc kodu (oczekiwano 8, 12, 13 lub 14 cyfr)' };
        }

        // Walidacja sumy kontrolnej dla EAN-13
        if (code.length === 13) {
            if (!this.validateEAN13Checksum(code)) {
                return { valid: false, error: 'Nieprawidlowa suma kontrolna EAN-13' };
            }
        }

        // Walidacja sumy kontrolnej dla EAN-8
        if (code.length === 8) {
            if (!this.validateEAN8Checksum(code)) {
                return { valid: false, error: 'Nieprawidlowa suma kontrolna EAN-8' };
            }
        }

        return { valid: true };
    },

    // Walidacja sumy kontrolnej EAN-13
    validateEAN13Checksum(code) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            const digit = parseInt(code[i], 10);
            sum += i % 2 === 0 ? digit : digit * 3;
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit === parseInt(code[12], 10);
    },

    // Walidacja sumy kontrolnej EAN-8
    validateEAN8Checksum(code) {
        let sum = 0;
        for (let i = 0; i < 7; i++) {
            const digit = parseInt(code[i], 10);
            sum += i % 2 === 0 ? digit * 3 : digit;
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit === parseInt(code[7], 10);
    },

    // Formatowanie kodu do wyswietlenia
    formatBarcode(code) {
        if (code.length === 13) {
            // EAN-13: X XXXXXX XXXXXX
            return `${code[0]} ${code.slice(1, 7)} ${code.slice(7)}`;
        } else if (code.length === 8) {
            // EAN-8: XXXX XXXX
            return `${code.slice(0, 4)} ${code.slice(4)}`;
        }
        return code;
    }
};

// Export dla uzycia w innych plikach
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scanner;
}
