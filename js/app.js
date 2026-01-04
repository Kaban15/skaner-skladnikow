/**
 * App - Glowna logika aplikacji Skaner Skladnikow
 */

const App = {
    // Konfiguracja - ZMIEN NA SWOJ ADRES N8N WEBHOOK
    config: {
        // Adres webhooka n8n - do zmiany po konfiguracji
        n8nWebhookUrl: 'https://n8n.kaban.click/webhook/product-lookup',

        // Fallback - bezposrednie API (jesli n8n nie dziala)
        useFallbackApi: true,
        openFoodFactsApi: 'https://world.openfoodfacts.org/api/v2/product/',
        openBeautyFactsApi: 'https://world.openbeautyfacts.org/api/v2/product/'
    },

    // Stan aplikacji
    state: {
        currentProduct: null,
        isLoading: false
    },

    // Elementy DOM
    elements: {},

    // Inicjalizacja aplikacji
    init() {
        this.cacheElements();
        this.bindEvents();

        // Sprawdzenie czy konfiguracja jest ustawiona
        if (this.config.n8nWebhookUrl === 'TWOJ_N8N_WEBHOOK_URL') {
            console.warn('Webhook n8n nie jest skonfigurowany. Uzywam bezposredniego API.');
        }
    },

    // Cache elementow DOM
    cacheElements() {
        this.elements = {
            barcodeInput: document.getElementById('barcode-input'),
            searchBtn: document.getElementById('search-btn'),
            loadingSection: document.getElementById('loading-section'),
            errorSection: document.getElementById('error-section'),
            errorMessage: document.getElementById('error-message'),
            retryBtn: document.getElementById('retry-btn'),
            resultsSection: document.getElementById('results-section'),
            newSearchBtn: document.getElementById('new-search-btn'),
            inputSection: document.querySelector('.input-section'),

            // Wyniki
            productImage: document.getElementById('product-image'),
            productName: document.getElementById('product-name'),
            productBrand: document.getElementById('product-brand'),
            productQuantity: document.getElementById('product-quantity'),
            nutriscoreContainer: document.getElementById('nutriscore-container'),
            nutriscore: document.getElementById('nutriscore'),
            novaContainer: document.getElementById('nova-container'),
            novaScore: document.getElementById('nova-score'),
            ecoscoreContainer: document.getElementById('ecoscore-container'),
            ecoscore: document.getElementById('ecoscore'),
            warningsContainer: document.getElementById('warnings-container'),
            warningsList: document.getElementById('warnings-list'),
            allergensContainer: document.getElementById('allergens-container'),
            allergensList: document.getElementById('allergens-list'),
            nutritionContainer: document.getElementById('nutrition-container'),
            nutritionList: document.getElementById('nutrition-list'),
            ingredientsContainer: document.getElementById('ingredients-container'),
            ingredientsText: document.getElementById('ingredients-text'),
            addIngredientsBtn: document.getElementById('add-ingredients-btn'),
            photoIngredientsBtn: document.getElementById('photo-ingredients-btn'),
            uploadIngredientsBtn: document.getElementById('upload-ingredients-btn'),
            imageUpload: document.getElementById('image-upload'),
            // Modal
            ingredientsModal: document.getElementById('ingredients-modal'),
            closeModal: document.getElementById('close-modal'),
            modalTitle: document.getElementById('modal-title'),
            cameraMode: document.getElementById('camera-mode'),
            ocrMode: document.getElementById('ocr-mode'),
            editMode: document.getElementById('edit-mode'),
            cameraPreview: document.getElementById('camera-preview'),
            captureBtn: document.getElementById('capture-btn'),
            cancelCameraBtn: document.getElementById('cancel-camera-btn'),
            ocrImage: document.getElementById('ocr-image'),
            ocrStatusText: document.getElementById('ocr-status-text'),
            ingredientsInput: document.getElementById('ingredients-input'),
            saveIngredientsBtn: document.getElementById('save-ingredients-btn'),
            additivesContainer: document.getElementById('additives-container'),
            additivesList: document.getElementById('additives-list'),
            analysisSummary: document.getElementById('analysis-summary')
        };
    },

    // Bindowanie eventow
    bindEvents() {
        // Szukanie
        if (this.elements.searchBtn) {
            this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        }
        if (this.elements.barcodeInput) {
            this.elements.barcodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        // Retry i nowe wyszukiwanie
        if (this.elements.retryBtn) {
            this.elements.retryBtn.addEventListener('click', () => this.resetToInput());
        }
        if (this.elements.newSearchBtn) {
            this.elements.newSearchBtn.addEventListener('click', () => this.resetToInput());
        }

        // Dodawanie skladu
        if (this.elements.addIngredientsBtn) {
            this.elements.addIngredientsBtn.addEventListener('click', () => this.openIngredientsModal('manual'));
        }
        if (this.elements.photoIngredientsBtn) {
            this.elements.photoIngredientsBtn.addEventListener('click', () => this.openIngredientsModal('camera'));
        }
        if (this.elements.uploadIngredientsBtn) {
            this.elements.uploadIngredientsBtn.addEventListener('click', () => this.elements.imageUpload.click());
        }
        if (this.elements.imageUpload) {
            this.elements.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => this.closeIngredientsModal());
        }
        if (this.elements.cancelCameraBtn) {
            this.elements.cancelCameraBtn.addEventListener('click', () => this.cancelCamera());
        }
        if (this.elements.captureBtn) {
            this.elements.captureBtn.addEventListener('click', () => this.capturePhoto());
        }
        if (this.elements.saveIngredientsBtn) {
            this.elements.saveIngredientsBtn.addEventListener('click', () => this.saveIngredients());
        }

        // Zamkniecie modalu po kliknieciu w tlo
        if (this.elements.ingredientsModal) {
            this.elements.ingredientsModal.addEventListener('click', (e) => {
                if (e.target === this.elements.ingredientsModal) {
                    this.closeIngredientsModal();
                }
            });
        }
    },

    // Obsluga wyszukiwania
    async handleSearch() {
        const barcode = this.elements.barcodeInput.value.trim();

        if (!barcode) {
            this.showError('Wprowadz kod kreskowy');
            return;
        }

        // Walidacja kodu (podstawowa)
        if (!/^\d{8,14}$/.test(barcode)) {
            this.showError('Kod kreskowy musi zawierac od 8 do 14 cyfr');
            return;
        }

        await this.searchProduct(barcode);
    },

    // Wyszukiwanie produktu
    async searchProduct(barcode) {
        this.showLoading();

        try {
            let product = null;

            // Proba przez n8n
            if (this.config.n8nWebhookUrl !== 'TWOJ_N8N_WEBHOOK_URL') {
                try {
                    product = await this.fetchFromN8n(barcode);
                } catch (n8nError) {
                    console.warn('Blad n8n, proba przez bezposrednie API:', n8nError);
                }
            }

            // Fallback do bezposredniego API
            if (!product && this.config.useFallbackApi) {
                product = await this.fetchFromOpenFacts(barcode);
            }

            if (product) {
                this.state.currentProduct = product;
                this.displayProduct(product);
            } else {
                this.showError('Nie znaleziono produktu o tym kodzie kreskowym');
            }

        } catch (error) {
            console.error('Blad wyszukiwania:', error);
            this.showError('Wystapil blad podczas wyszukiwania. Sprobuj ponownie.');
        }
    },

    // Pobieranie danych przez n8n webhook
    async fetchFromN8n(barcode) {
        const response = await fetch(this.config.n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ barcode: barcode })
        });

        if (!response.ok) {
            throw new Error('Blad odpowiedzi n8n');
        }

        const data = await response.json();

        if (data.status === 'error' || !data.product) {
            return null;
        }

        return data.product;
    },

    // Pobieranie danych bezposrednio z Open Food/Beauty Facts
    async fetchFromOpenFacts(barcode) {
        // Proba Open Food Facts
        try {
            const foodResponse = await fetch(
                `${this.config.openFoodFactsApi}${barcode}.json`,
                { headers: { 'User-Agent': 'SkanerSkladnikow/1.0' } }
            );

            if (foodResponse.ok) {
                const foodData = await foodResponse.json();
                if (foodData.status === 1 && foodData.product) {
                    foodData.product._source = 'openfoodfacts';
                    return foodData.product;
                }
            }
        } catch (err) {
            console.warn('Blad Open Food Facts:', err);
        }

        // Proba Open Beauty Facts
        try {
            const beautyResponse = await fetch(
                `${this.config.openBeautyFactsApi}${barcode}.json`,
                { headers: { 'User-Agent': 'SkanerSkladnikow/1.0' } }
            );

            if (beautyResponse.ok) {
                const beautyData = await beautyResponse.json();
                if (beautyData.status === 1 && beautyData.product) {
                    beautyData.product._source = 'openbeautyfacts';
                    return beautyData.product;
                }
            }
        } catch (err) {
            console.warn('Blad Open Beauty Facts:', err);
        }

        return null;
    },

    // Wyswietlanie produktu
    displayProduct(product) {
        this.hideAllSections();
        this.elements.resultsSection.classList.remove('hidden');
        this.elements.inputSection.classList.add('hidden');

        // Podstawowe informacje
        this.elements.productName.textContent = product.product_name || product.product_name_pl || 'Nieznana nazwa';
        this.elements.productBrand.textContent = product.brands || 'Nieznana marka';
        this.elements.productQuantity.textContent = product.quantity || '';

        // Zdjecie
        if (product.image_url || product.image_front_url) {
            this.elements.productImage.src = product.image_url || product.image_front_url;
            this.elements.productImage.alt = product.product_name || 'Zdjecie produktu';
        } else {
            this.elements.productImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
            this.elements.productImage.alt = 'Brak zdjecia';
        }

        // Wyswietlanie ocen
        this.displayScores(product);

        // Analiza produktu
        const analysis = Analyzer.analyzeProduct(product);

        // Ostrzezenia
        this.displayWarnings(analysis.warnings);

        // Alergeny
        this.displayAllergens(analysis.allergens);

        // Wartosci odzywcze
        this.displayNutrition(product.nutriments);

        // Sklad - najpierw sprawdz localStorage, potem API
        const barcode = product.code || product._id;
        const storedIngredients = barcode ? this.getStoredIngredients(barcode) : null;
        const ingredientsText = storedIngredients
            || product.ingredients_text
            || product.ingredients_text_pl
            || product.ingredients_text_en
            || product.ingredients_text_with_allergens
            || product.ingredients_text_with_allergens_pl
            || product.ingredients_text_with_allergens_en;
        this.displayIngredients(ingredientsText, !!storedIngredients);

        // Dodatki
        this.displayAdditives(analysis.additives);

        // Podsumowanie
        this.displaySummary(analysis.summary);
    },

    // Wyswietlanie ocen (Nutri-Score, NOVA, Eco-Score)
    displayScores(product) {
        // Nutri-Score
        if (product.nutriscore_grade) {
            const grade = product.nutriscore_grade.toUpperCase();
            this.elements.nutriscore.textContent = grade;
            this.elements.nutriscore.className = `score-badge grade-${grade.toLowerCase()}`;
            this.elements.nutriscoreContainer.classList.remove('hidden');
        } else {
            this.elements.nutriscore.textContent = '-';
            this.elements.nutriscore.className = 'score-badge grade-unknown';
        }

        // NOVA
        if (product.nova_group) {
            this.elements.novaScore.textContent = product.nova_group;
            this.elements.novaScore.className = `score-badge nova-${product.nova_group}`;
            this.elements.novaContainer.classList.remove('hidden');
        } else {
            this.elements.novaScore.textContent = '-';
            this.elements.novaScore.className = 'score-badge grade-unknown';
        }

        // Eco-Score
        if (product.ecoscore_grade) {
            const ecoGrade = product.ecoscore_grade.toUpperCase();
            this.elements.ecoscore.textContent = ecoGrade;
            this.elements.ecoscore.className = `score-badge grade-${ecoGrade.toLowerCase()}`;
            this.elements.ecoscoreContainer.classList.remove('hidden');
        } else {
            this.elements.ecoscore.textContent = '-';
            this.elements.ecoscore.className = 'score-badge grade-unknown';
        }
    },

    // Wyswietlanie ostrzezen
    displayWarnings(warnings) {
        if (warnings && warnings.length > 0) {
            this.elements.warningsList.innerHTML = warnings.map(w =>
                `<div class="warning-item">${w.message}</div>`
            ).join('');
            this.elements.warningsContainer.classList.remove('hidden');
        } else {
            this.elements.warningsContainer.classList.add('hidden');
        }
    },

    // Wyswietlanie alergenow
    displayAllergens(allergens) {
        if (allergens && allergens.length > 0) {
            this.elements.allergensList.innerHTML = allergens.map(a =>
                `<span class="allergen-tag">${a}</span>`
            ).join('');
            this.elements.allergensContainer.classList.remove('hidden');
        } else {
            this.elements.allergensContainer.classList.add('hidden');
        }
    },

    // Wyswietlanie wartosci odzywczych
    displayNutrition(nutriments) {
        if (!nutriments) {
            this.elements.nutritionContainer.classList.add('hidden');
            return;
        }

        const rows = Analyzer.formatNutritionTable(nutriments);

        if (rows.length === 0) {
            this.elements.nutritionContainer.classList.add('hidden');
            return;
        }

        this.elements.nutritionList.innerHTML = rows.map(row =>
            `<div class="nutrition-row ${row.level}">
                <span class="label"${row.indent ? ' style="padding-left: 16px;"' : ''}>${row.name}</span>
                <span class="value">${row.value}</span>
                <span class="rws">${row.rws}</span>
            </div>`
        ).join('');

        this.elements.nutritionContainer.classList.remove('hidden');
    },

    // Wyswietlanie skladu
    displayIngredients(ingredientsText, isUserAdded = false) {
        if (!ingredientsText) {
            this.elements.ingredientsText.innerHTML = '<span class="no-data">Brak danych o skladzie w bazie. Sprawdz etykiete produktu.</span>';
            this.elements.ingredientsContainer.classList.remove('hidden');
            return;
        }

        // Podswietlenie alergenow i dodatkow
        let formattedText = ingredientsText;

        // Podswietlenie dodatkow E
        formattedText = formattedText.replace(
            /\b(E\s?\d{3,4}[a-z]?)\b/gi,
            '<span class="additive" title="Kliknij aby zobaczyc szczegoly">$1</span>'
        );

        // Dodaj znacznik jesli sklad dodany przez uzytkownika
        if (isUserAdded) {
            formattedText = '<span class="user-added-badge">Dodane przez Ciebie</span>' + formattedText;
        }

        this.elements.ingredientsText.innerHTML = formattedText;
        this.elements.ingredientsContainer.classList.remove('hidden');
    },

    // Wyswietlanie dodatkow
    displayAdditives(additives) {
        if (!additives || additives.length === 0) {
            this.elements.additivesContainer.classList.add('hidden');
            return;
        }

        this.elements.additivesList.innerHTML = additives.map(additive => {
            const riskLabel = {
                'high': 'Wysokie ryzyko',
                'moderate': 'Umiarkowane',
                'low': 'Niskie ryzyko',
                'unknown': 'Nieznane'
            }[additive.risk];

            return `<div class="additive-item risk-${additive.risk}">
                <div class="additive-header">
                    <span class="additive-code">${additive.code}</span>
                    <span class="additive-risk">${riskLabel}</span>
                </div>
                <div class="additive-name">${additive.name}${additive.warning ? ' - ' + additive.warning : ''}</div>
            </div>`;
        }).join('');

        this.elements.additivesContainer.classList.remove('hidden');
    },

    // Wyswietlanie podsumowania analizy
    displaySummary(summary) {
        if (!summary || summary.length === 0) {
            return;
        }

        this.elements.analysisSummary.innerHTML = summary.map(item => {
            const iconClass = {
                'positive': 'positive',
                'negative': 'negative',
                'neutral': 'neutral'
            }[item.type];

            const iconSvg = {
                'positive': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
                'negative': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
                'neutral': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
            }[item.type];

            return `<div class="analysis-item">
                <div class="analysis-icon ${iconClass}">${iconSvg}</div>
                <div class="analysis-text">
                    <strong>${item.title}</strong>
                    <span>${item.description}</span>
                </div>
            </div>`;
        }).join('');
    },

    // Pokazanie ladowania
    showLoading() {
        this.hideAllSections();
        this.elements.loadingSection.classList.remove('hidden');
        this.elements.inputSection.classList.add('hidden');
    },

    // Pokazanie bledu
    showError(message) {
        this.hideAllSections();
        this.elements.errorMessage.textContent = message;
        this.elements.errorSection.classList.remove('hidden');
        this.elements.inputSection.classList.add('hidden');
    },

    // Ukrycie wszystkich sekcji
    hideAllSections() {
        this.elements.loadingSection.classList.add('hidden');
        this.elements.errorSection.classList.add('hidden');
        this.elements.resultsSection.classList.add('hidden');
    },

    // Reset do stanu poczatkowego
    resetToInput() {
        this.hideAllSections();
        this.elements.inputSection.classList.remove('hidden');
        this.elements.barcodeInput.value = '';
        this.elements.barcodeInput.focus();
        this.state.currentProduct = null;
    },

    // ========== OBSLUGA DODAWANIA SKLADU ==========

    // Stan kamery
    cameraStream: null,

    // Otwarcie modalu
    openIngredientsModal(mode) {
        this.elements.ingredientsModal.classList.remove('hidden');
        this.elements.editMode.classList.remove('hidden');
        this.elements.cameraMode.classList.add('hidden');
        this.elements.ocrMode.classList.add('hidden');

        // Wczytaj zapisany sklad jesli istnieje
        const barcode = this.state.currentProduct?.code || this.state.currentProduct?._id;
        if (barcode) {
            const saved = this.getStoredIngredients(barcode);
            if (saved) {
                this.elements.ingredientsInput.value = saved;
            } else {
                this.elements.ingredientsInput.value = '';
            }
        }

        if (mode === 'camera') {
            this.startCamera();
        } else {
            this.elements.modalTitle.textContent = 'Dodaj sklad produktu';
        }
    },

    // Zamkniecie modalu
    closeIngredientsModal() {
        this.elements.ingredientsModal.classList.add('hidden');
        this.stopCamera();
    },

    // Uruchomienie kamery
    async startCamera() {
        this.elements.modalTitle.textContent = 'Zrob zdjecie skladu';
        this.elements.editMode.classList.add('hidden');
        this.elements.cameraMode.classList.remove('hidden');
        this.elements.ocrMode.classList.add('hidden');

        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    focusMode: 'continuous'
                }
            });

            const video = document.createElement('video');
            video.srcObject = this.cameraStream;
            video.autoplay = true;
            video.playsInline = true;

            this.elements.cameraPreview.innerHTML = '';
            this.elements.cameraPreview.appendChild(video);
        } catch (error) {
            console.error('Blad kamery:', error);
            alert('Nie udalo sie uruchomic kamery. Sprawdz uprawnienia.');
            this.cancelCamera();
        }
    },

    // Zatrzymanie kamery
    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        this.elements.cameraPreview.innerHTML = '';
    },

    // Anulowanie trybu kamery
    cancelCamera() {
        this.stopCamera();
        this.elements.cameraMode.classList.add('hidden');
        this.elements.editMode.classList.remove('hidden');
        this.elements.modalTitle.textContent = 'Dodaj sklad produktu';
    },

    // Zrobienie zdjecia
    async capturePhoto() {
        const video = this.elements.cameraPreview.querySelector('video');
        if (!video) return;

        // Utworzenie canvas i zrobienie zdjecia
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Konwersja do obrazu
        const imageData = canvas.toDataURL('image/jpeg', 0.9);

        // Zatrzymanie kamery
        this.stopCamera();

        // Przejscie do trybu OCR
        this.elements.cameraMode.classList.add('hidden');
        this.elements.ocrMode.classList.remove('hidden');
        this.elements.ocrImage.src = imageData;
        this.elements.modalTitle.textContent = 'Rozpoznawanie tekstu...';

        // Uruchomienie OCR
        await this.performOCR(imageData);
    },

    // Wykonanie OCR
    async performOCR(imageData) {
        try {
            this.elements.ocrStatusText.textContent = 'Ladowanie modelu OCR...';

            const worker = await Tesseract.createWorker('pol', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        this.elements.ocrStatusText.textContent = `Rozpoznawanie tekstu... ${progress}%`;
                    }
                }
            });

            this.elements.ocrStatusText.textContent = 'Rozpoznawanie tekstu...';

            const { data: { text } } = await worker.recognize(imageData);

            await worker.terminate();

            // Przejscie do trybu edycji z rozpoznanym tekstem
            this.elements.ocrMode.classList.add('hidden');
            this.elements.editMode.classList.remove('hidden');
            this.elements.modalTitle.textContent = 'Sprawdz i popraw sklad';
            this.elements.ingredientsInput.value = this.cleanOCRText(text);

        } catch (error) {
            console.error('Blad OCR:', error);
            this.elements.ocrStatusText.textContent = 'Blad rozpoznawania. Sprobuj ponownie.';
            setTimeout(() => {
                this.elements.ocrMode.classList.add('hidden');
                this.elements.editMode.classList.remove('hidden');
                this.elements.modalTitle.textContent = 'Dodaj sklad produktu';
            }, 2000);
        }
    },

    // Czyszczenie tekstu z OCR
    cleanOCRText(text) {
        return text
            .replace(/\n+/g, ' ')  // Zamien nowe linie na spacje
            .replace(/\s+/g, ' ')  // Usun podwojne spacje
            .replace(/[|]/g, 'l') // Popraw typowe bledy OCR
            .trim();
    },

    // Obsluga uploadu zdjecia z galerii
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Reset inputa
        event.target.value = '';

        // Otworz modal w trybie OCR
        this.elements.ingredientsModal.classList.remove('hidden');
        this.elements.editMode.classList.add('hidden');
        this.elements.cameraMode.classList.add('hidden');
        this.elements.ocrMode.classList.remove('hidden');
        this.elements.modalTitle.textContent = 'Rozpoznawanie tekstu...';

        // Wczytaj obraz
        const reader = new FileReader();
        reader.onload = async (e) => {
            this.elements.ocrImage.src = e.target.result;
            await this.performOCR(e.target.result);
        };
        reader.readAsDataURL(file);
    },

    // Zapisanie skladu
    saveIngredients() {
        const ingredients = this.elements.ingredientsInput.value.trim();
        if (!ingredients) {
            alert('Wpisz sklad produktu');
            return;
        }

        const barcode = this.state.currentProduct?.code || this.state.currentProduct?._id;
        if (!barcode) {
            alert('Brak kodu produktu');
            return;
        }

        // Zapisz do localStorage
        this.storeIngredients(barcode, ingredients);

        // Zaktualizuj widok
        this.state.currentProduct.ingredients_text = ingredients;
        this.displayIngredients(ingredients);

        // Ponowna analiza produktu
        const analysis = Analyzer.analyzeProduct(this.state.currentProduct);
        this.displayAdditives(analysis.additives);
        this.displaySummary(analysis.summary);

        // Zamknij modal
        this.closeIngredientsModal();
    },

    // Zapis do localStorage
    storeIngredients(barcode, ingredients) {
        const stored = JSON.parse(localStorage.getItem('userIngredients') || '{}');
        stored[barcode] = ingredients;
        localStorage.setItem('userIngredients', JSON.stringify(stored));
    },

    // Odczyt z localStorage
    getStoredIngredients(barcode) {
        const stored = JSON.parse(localStorage.getItem('userIngredients') || '{}');
        return stored[barcode] || null;
    },

    // Sprawdzenie czy jest zapisany sklad dla produktu
    checkStoredIngredients(product) {
        const barcode = product?.code || product?._id;
        if (!barcode) return null;
        return this.getStoredIngredients(barcode);
    }
};

// Inicjalizacja po zaladowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
