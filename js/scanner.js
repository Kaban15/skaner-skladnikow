/**
 * Scanner - Modul do skanowania kodow kreskowych
 * Uzywa biblioteki html5-qrcode
 */

const Scanner = {
    html5QrCode: null,
    isScanning: false,
    onScanCallback: null,

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
            // Utworzenie instancji skanera
            this.html5QrCode = new Html5Qrcode(this.containerId);

            // Konfiguracja skanera
            const config = {
                fps: 15,
                qrbox: { width: 280, height: 180 },
                aspectRatio: 1.5,
                videoConstraints: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "environment"
                },
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39
                ]
            };

            // Uruchomienie skanera z kamera tylna (preferowana) z autofokusem
            const cameraConfig = {
                facingMode: "environment",
                advanced: [
                    { focusMode: "continuous" },
                    { autoFocusMode: "continuous" }
                ]
            };

            await this.html5QrCode.start(
                cameraConfig,
                config,
                (decodedText, decodedResult) => {
                    // Kod zostal zeskanowany
                    this.onCodeScanned(decodedText, decodedResult);
                },
                (errorMessage) => {
                    // Blad skanowania (ignorujemy - to normalne gdy nie ma kodu w kadrze)
                }
            );

            this.isScanning = true;

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
