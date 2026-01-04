/**
 * Analyzer - Modul do analizy skladnikow produktow
 */

const Analyzer = {
    // Baza skladnikow z ocena ryzyka zdrowotnego
    ingredientsDatabase: {
        // === CUKRY I SLODZIKI ===
        'cukier': { risk: 'high', category: 'cukry', description: 'Prosty cukier (sacharoza) - podnosi poziom glukozy we krwi, sprzyja otylosci, próchnicy, cukrzycy typu 2 i chorobom serca przy nadmiernym spozyciu.' },
        'sacharoza': { risk: 'high', category: 'cukry', description: 'Cukier stołowy - szybko podnosi poziom cukru we krwi, moze prowadzic do insulinoopornosci.' },
        'glukoza': { risk: 'high', category: 'cukry', description: 'Cukier prosty - natychmiast podnosi poziom cukru we krwi, nadmiar sprzyja otylosci.' },
        'fruktoza': { risk: 'high', category: 'cukry', description: 'Cukier owocowy - w duzych ilosciach obciaza watrobe, sprzyja stluszczeniu watroby i otylosci brzusznej.' },
        'syrop glukozowo-fruktozowy': { risk: 'high', category: 'cukry', description: 'Wysoko przetworzony slodzik - silnie sprzyja otylosci, stluszczeniu watroby i cukrzycy. Jeden z najbardziej szkodliwych skladnikow.' },
        'syrop glukozowy': { risk: 'high', category: 'cukry', description: 'Skoncentrowany cukier - szybko podnosi poziom glukozy, sprzyja otylosci i cukrzycy.' },
        'syrop fruktozowy': { risk: 'high', category: 'cukry', description: 'Wysokofruktozowy syrop - obciaza watrobe, sprzyja stluszczeniu i otylosci brzusznej.' },
        'dekstroza': { risk: 'high', category: 'cukry', description: 'Glukoza z kukurydzy - bardzo szybko podnosi poziom cukru we krwi.' },
        'maltodekstryna': { risk: 'moderate', category: 'cukry', description: 'Weglowodany o wysokim indeksie glikemicznym - szybko podnosi cukier we krwi, moze zaklocac mikrobiom jelitowy.' },
        'melasa': { risk: 'moderate', category: 'cukry', description: 'Produkt uboczny produkcji cukru - zawiera mineraly, ale nadal jest cukrem prostym.' },
        'miód': { risk: 'moderate', category: 'cukry', description: 'Naturalny slodzik - zawiera korzystne zwiazki, ale nadal jest cukrem. Lepszy niz bialy cukier, ale w umiarkowanych ilosciach.' },
        'cukier trzcinowy': { risk: 'high', category: 'cukry', description: 'Taki sam jak bialy cukier pod wzgledem wplywu na zdrowie, mimo marketingu "naturalnosci".' },
        'cukier brazowy': { risk: 'high', category: 'cukry', description: 'Cukier z melasa - minimalnie wiecej mineralow, ale identyczny wplyw na organizm jak bialy cukier.' },
        'cukier kokosowy': { risk: 'moderate', category: 'cukry', description: 'Nieco nizszy indeks glikemiczny, ale nadal cukier. Zawiera inuline.' },
        'syrop klonowy': { risk: 'moderate', category: 'cukry', description: 'Zawiera antyoksydanty i mineraly, ale jest wysoko skoncentrowanym cukrem.' },
        'syrop z agawy': { risk: 'high', category: 'cukry', description: 'Bardzo wysoka zawartosc fruktozy (do 90%) - silnie obciaza watrobe, gorszy niz zwykly cukier.' },
        'izoglukoza': { risk: 'high', category: 'cukry', description: 'Syrop glukozowo-fruktozowy - jeden z najbardziej szkodliwych slodzikow przemyslowych.' },

        // === TLUSZCZE ===
        'olej palmowy': { risk: 'high', category: 'tluszcze', description: 'Wysoka zawartosc tluszczów nasyconych - podnosi cholesterol LDL, zwieksza ryzyko chorób serca. Problematyczny ekologicznie.' },
        'tluszcz palmowy': { risk: 'high', category: 'tluszcze', description: 'Tluszcze nasycone - podnosza cholesterol, zwieksza ryzyko miazdzycy i zawalu.' },
        'olej kokosowy': { risk: 'moderate', category: 'tluszcze', description: 'Wysoka zawartosc tluszczów nasyconych, ale zawiera MCT. Kontrowersyjny - w umiarkowanych ilosciach.' },
        'tluszcz kokosowy': { risk: 'moderate', category: 'tluszcze', description: 'Tluszcze nasycone z kwasem laurynowym. Lepszy niz palmowy, ale nadal w umiarkowanych ilosciach.' },
        'maslo': { risk: 'moderate', category: 'tluszcze', description: 'Zrodlo tluszczów nasyconych - podnosi cholesterol, ale zawiera witaminy A, D, E, K. W umiarkowanych ilosciach.' },
        'smalec': { risk: 'high', category: 'tluszcze', description: 'Tluszcz zwierzecy - bardzo wysoka zawartosc tluszczów nasyconych i cholesterolu.' },
        'margaryna': { risk: 'moderate', category: 'tluszcze', description: 'Moze zawierac tluszcze trans (jesli czesciowo utwardzana). Sprawdz etykiete.' },
        'tluszcz roslinny': { risk: 'moderate', category: 'tluszcze', description: 'Zalezy od zrodla - moze byc utwardzony (tluszcze trans) lub zawierac olej palmowy.' },
        'tluszcz roslinny utwardzony': { risk: 'high', category: 'tluszcze', description: 'Zawiera tluszcze trans - najbardziej szkodliwe tluszcze, silnie zwieksza ryzyko chorób serca.' },
        'tluszcze utwardzone': { risk: 'high', category: 'tluszcze', description: 'Tluszcze trans - zwieksza LDL, obniza HDL, promuje stany zapalne i choroby serca.' },
        'olej rzepakowy': { risk: 'low', category: 'tluszcze', description: 'Korzystny profil kwasów tluszczowych - omega-3 i omega-6. Dobry wybór.' },
        'olej slonecznikowy': { risk: 'low', category: 'tluszcze', description: 'Bogaty w witamine E, ale wysoka zawartosc omega-6. W umiarkowanych ilosciach.' },
        'olej oliwkowy': { risk: 'low', category: 'tluszcze', description: 'Bardzo korzystny - bogaty w jednonienasycone kwasy tluszczowe i polifenole. Chroni serce.' },
        'oliwa z oliwek': { risk: 'low', category: 'tluszcze', description: 'Najzdrowszy tluszcz - przeciwzapalna, chroni serce, bogata w antyoksydanty.' },
        'olej lniany': { risk: 'low', category: 'tluszcze', description: 'Doskonale zrodlo omega-3. Bardzo korzystny dla zdrowia.' },
        'olej sojowy': { risk: 'moderate', category: 'tluszcze', description: 'Wysoka zawartosc omega-6 - w nadmiarze moze promowac stany zapalne.' },

        // === SÓL I SÓDOWANIE ===
        'sól': { risk: 'moderate', category: 'sol', description: 'Niezbedna w malych ilosciach, ale nadmiar podnosi cisnienie krwi i zwieksza ryzyko udaru i chorób serca.' },
        'sól morska': { risk: 'moderate', category: 'sol', description: 'Taka sama zawartosc sodu jak sól kuchenna. Sladowe ilosci mineralów nie rekompensuja ryzyka.' },
        'chlorek sodu': { risk: 'moderate', category: 'sol', description: 'Sól kuchenna - nadmiar zwieksza ryzyko nadcisnienia i chorób sercowo-naczyniowych.' },

        // === MĄKI I SKROBIE ===
        'maka pszenna': { risk: 'low', category: 'maki', description: 'Podstawowy skladnik - zawiera gluten. Rafinowana maka (biala) ma wysoki indeks glikemiczny.' },
        'maka pszenna rafinowana': { risk: 'moderate', category: 'maki', description: 'Pozbawiona blonnika i witamin - szybko podnosi cukier we krwi.' },
        'skrobia': { risk: 'low', category: 'maki', description: 'Naturalny weglowodany - w umiarkowanych ilosciach neutralna.' },
        'skrobia modyfikowana': { risk: 'moderate', category: 'maki', description: 'Chemicznie przetworzona skrobia - moze wplywac na mikrobiom jelitowy.' },
        'skrobia kukurydziana': { risk: 'low', category: 'maki', description: 'Naturalna skrobia - neutralna w umiarkowanych ilosciach.' },
        'maka pelnoziarnista': { risk: 'low', category: 'maki', description: 'Korzystna - zawiera blonnik, witaminy i mineraly. Nizszy indeks glikemiczny.' },

        // === NABIAŁ ===
        'mleko': { risk: 'low', category: 'nabial', description: 'Zrodlo wapnia i bialka. Dla osób tolerujacych laktoze - neutralne lub korzystne.' },
        'mleko w proszku': { risk: 'low', category: 'nabial', description: 'Mleko odwodnione - podobne wlasciwosci jak mleko, ale utleniony cholesterol.' },
        'serum mleczne': { risk: 'low', category: 'nabial', description: 'Produkt uboczny produkcji sera - zawiera laktoze i bialka serwatkowe.' },
        'serwatka': { risk: 'low', category: 'nabial', description: 'Bialko wysokiej jakosci - korzystne dla budowy miesni.' },
        'laktoza': { risk: 'low', category: 'nabial', description: 'Cukier mleczny - problematyczny tylko dla osób z nietolerancja laktozy.' },
        'kazeina': { risk: 'low', category: 'nabial', description: 'Bialko mleka - wolno trawione, dobre zrodlo aminokwasów.' },
        'smietana': { risk: 'moderate', category: 'nabial', description: 'Wysoka zawartosc tluszczów nasyconych - w umiarkowanych ilosciach.' },

        // === BIALKA ===
        'bialko sojowe': { risk: 'low', category: 'bialka', description: 'Pelne bialko roslinne - korzystne, ale niektórzy maja alergie.' },
        'izolat bialka sojowego': { risk: 'low', category: 'bialka', description: 'Skoncentrowane bialko soi - dobre zrodlo aminokwasów.' },
        'bialko pszenicy': { risk: 'low', category: 'bialka', description: 'Gluten - problematyczny dla celiakii i wrazliwosci na gluten.' },
        'gluten pszenny': { risk: 'moderate', category: 'bialka', description: 'Bialko pszenicy - szkodliwy dla osób z celiakia lub wrazliwoscia na gluten.' },

        // === WARZYWA I OWOCE ===
        'koncentrat pomidorowy': { risk: 'low', category: 'warzywa', description: 'Bogaty w likopen - antyoksydant chroniacy przed rakiem.' },
        'cebula': { risk: 'low', category: 'warzywa', description: 'Korzystna - zawiera prebiotyki i przeciwzapalne zwiazki siarkowe.' },
        'czosnek': { risk: 'low', category: 'warzywa', description: 'Bardzo korzystny - przeciwbakteryjny, obniza cisnienie, wspiera odpornosc.' },
        'marchew': { risk: 'low', category: 'warzywa', description: 'Bogata w beta-karoten - korzystna dla wzroku i skóry.' },
        'ziemniaki': { risk: 'low', category: 'warzywa', description: 'Zrodlo witaminy C i potasu. Wysoki indeks glikemiczny gdy gotowane.' },

        // === PRZYPRAWY ===
        'pieprz': { risk: 'low', category: 'przyprawy', description: 'Korzystny - zawiera piperyne poprawiajaca wchlaniaie skladników odzywczych.' },
        'papryka': { risk: 'low', category: 'przyprawy', description: 'Bogata w witamine C i antyoksydanty. Korzystna.' },
        'kurkuma': { risk: 'low', category: 'przyprawy', description: 'Silne wlasciwosci przeciwzapalne - kurkumina wspiera zdrowie.' },
        'imbir': { risk: 'low', category: 'przyprawy', description: 'Przeciwzapalny, wspomaga trawienie, lagodzi nudnosci.' },
        'cynamon': { risk: 'low', category: 'przyprawy', description: 'Moze pomagac regulowac cukier we krwi. Korzystny w umiarkowanych ilosciach.' },

        // === SUBSTANCJE PROBLEMATYCZNE ===
        'glutaminian sodu': { risk: 'moderate', category: 'dodatki', description: 'Wzmacniacz smaku (MSG) - u wrazliwych osób moze powodowac bóle glowy i rumienie.' },
        'aromaty': { risk: 'moderate', category: 'dodatki', description: 'Moga byc naturalne lub syntetyczne. Brak pelnej przejrzystosci co do skladu.' },
        'aromat': { risk: 'moderate', category: 'dodatki', description: 'Substancja smakowa - czesto ukrywa sie za tym wiele chemikaliów.' },
        'naturalny aromat': { risk: 'low', category: 'dodatki', description: 'Pochodzenie naturalne, ale moze byc przetworzony. Generalnie bezpieczny.' },
        'aromat naturalny': { risk: 'low', category: 'dodatki', description: 'Ekstrakt z naturalnych zródel - zazwyczaj bezpieczny.' },
        'sztuczny aromat': { risk: 'moderate', category: 'dodatki', description: 'Syntetyczne substancje smakowe - bezpieczenstwo niektórych kwestionowane.' },
        'barwnik': { risk: 'moderate', category: 'dodatki', description: 'Moze byc naturalny lub syntetyczny. Syntetyczne moga powodowac alergie.' },
        'regulator kwasowosci': { risk: 'low', category: 'dodatki', description: 'Zazwyczaj bezpieczne kwasy organiczne jak cytrynowy czy mlekowy.' },
        'emulgator': { risk: 'low', category: 'dodatki', description: 'Laczy tluszcze z woda - wiekszosc jest bezpieczna.' },
        'stabilizator': { risk: 'low', category: 'dodatki', description: 'Utrzymuje konsystencje - wiekszosc naturalnego pochodzenia.' },
        'przeciwutleniacz': { risk: 'low', category: 'dodatki', description: 'Zapobiega utlenianiu - czesto witamina C lub E, korzystne.' },
        'konserwant': { risk: 'moderate', category: 'dodatki', description: 'Przedluza trwalosc - niektóre bezpieczne, inne kontrowersyjne.' },
        'zagęszczacz': { risk: 'low', category: 'dodatki', description: 'Nadaje konsystencje - wiekszosc naturalna i bezpieczna.' },

        // === WODA ===
        'woda': { risk: 'low', category: 'podstawowe', description: 'Niezbedna do zycia - calkowicie bezpieczna.' }
    },

    // Baza dodatkow E z ocena ryzyka
    additives: {
        // Barwniki
        'e100': { name: 'Kurkumina', risk: 'low', category: 'barwnik' },
        'e101': { name: 'Ryboflawina (witamina B2)', risk: 'low', category: 'barwnik' },
        'e102': { name: 'Tartrazyna', risk: 'high', category: 'barwnik', warning: 'Moze powodowac alergie i nadpobudliwosc u dzieci' },
        'e104': { name: 'Zolcien chinolonowa', risk: 'moderate', category: 'barwnik' },
        'e110': { name: 'Zolcien pomaranczowa FCF', risk: 'high', category: 'barwnik', warning: 'Moze powodowac alergie i nadpobudliwosc u dzieci' },
        'e120': { name: 'Koszenila (karmin)', risk: 'moderate', category: 'barwnik', warning: 'Moze powodowac alergie' },
        'e122': { name: 'Azorubina', risk: 'high', category: 'barwnik', warning: 'Moze powodowac nadpobudliwosc u dzieci' },
        'e123': { name: 'Amarant', risk: 'high', category: 'barwnik', warning: 'Zakazany w USA' },
        'e124': { name: 'Ponceau 4R', risk: 'high', category: 'barwnik', warning: 'Moze powodowac nadpobudliwosc u dzieci' },
        'e127': { name: 'Erytrozyna', risk: 'moderate', category: 'barwnik' },
        'e129': { name: 'Czerwien Allura AC', risk: 'high', category: 'barwnik', warning: 'Moze powodowac nadpobudliwosc u dzieci' },
        'e131': { name: 'Blekit patentowy V', risk: 'moderate', category: 'barwnik' },
        'e132': { name: 'Indigotyna', risk: 'low', category: 'barwnik' },
        'e133': { name: 'Blekit brylantowy FCF', risk: 'moderate', category: 'barwnik' },
        'e140': { name: 'Chlorofile', risk: 'low', category: 'barwnik' },
        'e141': { name: 'Kompleksy miedziowe chlorofili', risk: 'low', category: 'barwnik' },
        'e150a': { name: 'Karmel', risk: 'low', category: 'barwnik' },
        'e150b': { name: 'Karmel siarczynowy', risk: 'moderate', category: 'barwnik' },
        'e150c': { name: 'Karmel amoniakalny', risk: 'moderate', category: 'barwnik' },
        'e150d': { name: 'Karmel amoniakalno-siarczynowy', risk: 'moderate', category: 'barwnik' },
        'e151': { name: 'Czern brylantowa BN', risk: 'high', category: 'barwnik' },
        'e153': { name: 'Wegiel roslinny', risk: 'low', category: 'barwnik' },
        'e160a': { name: 'Karoteny', risk: 'low', category: 'barwnik' },
        'e160b': { name: 'Annato', risk: 'low', category: 'barwnik' },
        'e160c': { name: 'Ekstrakt z papryki', risk: 'low', category: 'barwnik' },
        'e160d': { name: 'Likopen', risk: 'low', category: 'barwnik' },
        'e160e': { name: 'Beta-apo-8-karotenal', risk: 'low', category: 'barwnik' },
        'e161b': { name: 'Luteina', risk: 'low', category: 'barwnik' },
        'e162': { name: 'Czerwien buraczana', risk: 'low', category: 'barwnik' },
        'e163': { name: 'Antocyjany', risk: 'low', category: 'barwnik' },
        'e170': { name: 'Weglany wapnia', risk: 'low', category: 'barwnik' },
        'e171': { name: 'Dwutlenek tytanu', risk: 'high', category: 'barwnik', warning: 'Zakazany w UE od 2022 - potencjalnie rakotwórczy' },
        'e172': { name: 'Tlenki zelaza', risk: 'low', category: 'barwnik' },
        'e173': { name: 'Glin', risk: 'moderate', category: 'barwnik' },
        'e174': { name: 'Srebro', risk: 'low', category: 'barwnik' },
        'e175': { name: 'Zloto', risk: 'low', category: 'barwnik' },
        'e180': { name: 'Litolrubina BK', risk: 'moderate', category: 'barwnik' },

        // Konserwanty
        'e200': { name: 'Kwas sorbowy', risk: 'low', category: 'konserwant' },
        'e201': { name: 'Sorbinian sodu', risk: 'low', category: 'konserwant' },
        'e202': { name: 'Sorbinian potasu', risk: 'low', category: 'konserwant' },
        'e203': { name: 'Sorbinian wapnia', risk: 'low', category: 'konserwant' },
        'e210': { name: 'Kwas benzoesowy', risk: 'moderate', category: 'konserwant', warning: 'Moze powodowac alergie' },
        'e211': { name: 'Benzoesan sodu', risk: 'moderate', category: 'konserwant', warning: 'W polaczeniu z wit. C tworzy benzen (rakotwórczy)' },
        'e212': { name: 'Benzoesan potasu', risk: 'moderate', category: 'konserwant' },
        'e213': { name: 'Benzoesan wapnia', risk: 'moderate', category: 'konserwant' },
        'e214': { name: 'P-hydroksybenzoesan etylu', risk: 'moderate', category: 'konserwant' },
        'e215': { name: 'Sól sodowa p-hydroksybenzoesanu etylu', risk: 'moderate', category: 'konserwant' },
        'e218': { name: 'P-hydroksybenzoesan metylu', risk: 'moderate', category: 'konserwant' },
        'e219': { name: 'Sól sodowa p-hydroksybenzoesanu metylu', risk: 'moderate', category: 'konserwant' },
        'e220': { name: 'Dwutlenek siarki', risk: 'moderate', category: 'konserwant', warning: 'Moze powodowac alergie, astme' },
        'e221': { name: 'Siarczyn sodu', risk: 'moderate', category: 'konserwant' },
        'e222': { name: 'Wodorosiarczyn sodu', risk: 'moderate', category: 'konserwant' },
        'e223': { name: 'Pirosiarczyn sodu', risk: 'moderate', category: 'konserwant' },
        'e224': { name: 'Pirosiarczyn potasu', risk: 'moderate', category: 'konserwant' },
        'e226': { name: 'Siarczyn wapnia', risk: 'moderate', category: 'konserwant' },
        'e227': { name: 'Wodorosiarczyn wapnia', risk: 'moderate', category: 'konserwant' },
        'e228': { name: 'Wodorosiarczyn potasu', risk: 'moderate', category: 'konserwant' },
        'e230': { name: 'Bifenyl', risk: 'high', category: 'konserwant', warning: 'Stosowany do konserwacji cytrusów - moze byc szkodliwy' },
        'e231': { name: 'Ortofenylfenol', risk: 'high', category: 'konserwant' },
        'e232': { name: 'Ortofenylfenolan sodu', risk: 'high', category: 'konserwant' },
        'e234': { name: 'Nizyna', risk: 'low', category: 'konserwant' },
        'e235': { name: 'Natamycyna', risk: 'low', category: 'konserwant' },
        'e239': { name: 'Heksametylenotetramina', risk: 'high', category: 'konserwant', warning: 'Uwalnia formaldehyd - potencjalnie rakotwórczy' },
        'e242': { name: 'Dwuweglano dimetylu', risk: 'low', category: 'konserwant' },
        'e249': { name: 'Azotyn potasu', risk: 'high', category: 'konserwant', warning: 'Moze tworzyc rakotwórcze nitrozoaminy' },
        'e250': { name: 'Azotyn sodu', risk: 'high', category: 'konserwant', warning: 'Moze tworzyc rakotwórcze nitrozoaminy' },
        'e251': { name: 'Azotan sodu', risk: 'moderate', category: 'konserwant' },
        'e252': { name: 'Azotan potasu', risk: 'moderate', category: 'konserwant' },
        'e260': { name: 'Kwas octowy', risk: 'low', category: 'konserwant' },
        'e261': { name: 'Octan potasu', risk: 'low', category: 'konserwant' },
        'e262': { name: 'Octany sodu', risk: 'low', category: 'konserwant' },
        'e263': { name: 'Octan wapnia', risk: 'low', category: 'konserwant' },
        'e270': { name: 'Kwas mlekowy', risk: 'low', category: 'konserwant' },
        'e280': { name: 'Kwas propionowy', risk: 'low', category: 'konserwant' },
        'e281': { name: 'Propionian sodu', risk: 'low', category: 'konserwant' },
        'e282': { name: 'Propionian wapnia', risk: 'low', category: 'konserwant' },
        'e283': { name: 'Propionian potasu', risk: 'low', category: 'konserwant' },
        'e284': { name: 'Kwas borowy', risk: 'high', category: 'konserwant', warning: 'Toksyczny - ograniczone stosowanie' },
        'e285': { name: 'Tetraboran sodu (boraks)', risk: 'high', category: 'konserwant', warning: 'Toksyczny' },
        'e290': { name: 'Dwutlenek wegla', risk: 'low', category: 'konserwant' },
        'e296': { name: 'Kwas jablkowy', risk: 'low', category: 'konserwant' },
        'e297': { name: 'Kwas fumarowy', risk: 'low', category: 'konserwant' },

        // Przeciwutleniacze
        'e300': { name: 'Kwas askorbinowy (witamina C)', risk: 'low', category: 'przeciwutleniacz' },
        'e301': { name: 'Askorbinian sodu', risk: 'low', category: 'przeciwutleniacz' },
        'e302': { name: 'Askorbinian wapnia', risk: 'low', category: 'przeciwutleniacz' },
        'e304': { name: 'Palmitynian askorbylu', risk: 'low', category: 'przeciwutleniacz' },
        'e306': { name: 'Tokoferole (witamina E)', risk: 'low', category: 'przeciwutleniacz' },
        'e307': { name: 'Alfa-tokoferol', risk: 'low', category: 'przeciwutleniacz' },
        'e308': { name: 'Gamma-tokoferol', risk: 'low', category: 'przeciwutleniacz' },
        'e309': { name: 'Delta-tokoferol', risk: 'low', category: 'przeciwutleniacz' },
        'e310': { name: 'Galusan propylu', risk: 'moderate', category: 'przeciwutleniacz' },
        'e311': { name: 'Galusan oktylu', risk: 'moderate', category: 'przeciwutleniacz' },
        'e312': { name: 'Galusan dodecylu', risk: 'moderate', category: 'przeciwutleniacz' },
        'e315': { name: 'Kwas erytorbowy', risk: 'low', category: 'przeciwutleniacz' },
        'e316': { name: 'Erytorbian sodu', risk: 'low', category: 'przeciwutleniacz' },
        'e319': { name: 'TBHQ', risk: 'moderate', category: 'przeciwutleniacz' },
        'e320': { name: 'BHA', risk: 'high', category: 'przeciwutleniacz', warning: 'Potencjalnie rakotwórczy - zakazany w niektórych krajach' },
        'e321': { name: 'BHT', risk: 'moderate', category: 'przeciwutleniacz', warning: 'Kontrowersyjny - badania niejednoznaczne' },
        'e322': { name: 'Lecytyny', risk: 'low', category: 'przeciwutleniacz' },
        'e325': { name: 'Mleczan sodu', risk: 'low', category: 'przeciwutleniacz' },
        'e326': { name: 'Mleczan potasu', risk: 'low', category: 'przeciwutleniacz' },
        'e327': { name: 'Mleczan wapnia', risk: 'low', category: 'przeciwutleniacz' },
        'e330': { name: 'Kwas cytrynowy', risk: 'low', category: 'przeciwutleniacz' },
        'e331': { name: 'Cytryniany sodu', risk: 'low', category: 'przeciwutleniacz' },
        'e332': { name: 'Cytryniany potasu', risk: 'low', category: 'przeciwutleniacz' },
        'e333': { name: 'Cytryniany wapnia', risk: 'low', category: 'przeciwutleniacz' },
        'e334': { name: 'Kwas winowy', risk: 'low', category: 'przeciwutleniacz' },
        'e335': { name: 'Winiany sodu', risk: 'low', category: 'przeciwutleniacz' },
        'e336': { name: 'Winiany potasu', risk: 'low', category: 'przeciwutleniacz' },
        'e337': { name: 'Winian sodowo-potasowy', risk: 'low', category: 'przeciwutleniacz' },
        'e338': { name: 'Kwas fosforowy', risk: 'moderate', category: 'przeciwutleniacz', warning: 'W duzych ilosciach moze wplywac na kosci' },
        'e339': { name: 'Fosforany sodu', risk: 'moderate', category: 'przeciwutleniacz' },
        'e340': { name: 'Fosforany potasu', risk: 'moderate', category: 'przeciwutleniacz' },
        'e341': { name: 'Fosforany wapnia', risk: 'low', category: 'przeciwutleniacz' },

        // Emulgatory i stabilizatory
        'e400': { name: 'Kwas alginowy', risk: 'low', category: 'emulgator' },
        'e401': { name: 'Alginian sodu', risk: 'low', category: 'emulgator' },
        'e402': { name: 'Alginian potasu', risk: 'low', category: 'emulgator' },
        'e403': { name: 'Alginian amonu', risk: 'low', category: 'emulgator' },
        'e404': { name: 'Alginian wapnia', risk: 'low', category: 'emulgator' },
        'e405': { name: 'Alginian glikolu propylenowego', risk: 'low', category: 'emulgator' },
        'e406': { name: 'Agar', risk: 'low', category: 'emulgator' },
        'e407': { name: 'Karagen', risk: 'moderate', category: 'emulgator', warning: 'Moze powodowac problemy z trawieniem' },
        'e407a': { name: 'Przetworzone wodorosty Eucheuma', risk: 'moderate', category: 'emulgator' },
        'e410': { name: 'Maczka chleba swietojáskiego', risk: 'low', category: 'emulgator' },
        'e412': { name: 'Guma guar', risk: 'low', category: 'emulgator' },
        'e413': { name: 'Tragakanta', risk: 'low', category: 'emulgator' },
        'e414': { name: 'Guma arabska', risk: 'low', category: 'emulgator' },
        'e415': { name: 'Guma ksantanowa', risk: 'low', category: 'emulgator' },
        'e416': { name: 'Guma karaya', risk: 'low', category: 'emulgator' },
        'e417': { name: 'Guma tara', risk: 'low', category: 'emulgator' },
        'e418': { name: 'Guma gellan', risk: 'low', category: 'emulgator' },
        'e420': { name: 'Sorbitol', risk: 'low', category: 'emulgator', warning: 'W duzych ilosciach dziala przeczyszczajaco' },
        'e421': { name: 'Mannitol', risk: 'low', category: 'emulgator', warning: 'W duzych ilosciach dziala przeczyszczajaco' },
        'e422': { name: 'Glicerol', risk: 'low', category: 'emulgator' },
        'e425': { name: 'Konjac', risk: 'low', category: 'emulgator' },
        'e426': { name: 'Hemiceluloza sojowa', risk: 'low', category: 'emulgator' },
        'e427': { name: 'Guma cassia', risk: 'low', category: 'emulgator' },
        'e431': { name: 'Polioksyetyleno(40)stearynian', risk: 'moderate', category: 'emulgator' },
        'e432': { name: 'Polisorbat 20', risk: 'low', category: 'emulgator' },
        'e433': { name: 'Polisorbat 80', risk: 'low', category: 'emulgator' },
        'e434': { name: 'Polisorbat 40', risk: 'low', category: 'emulgator' },
        'e435': { name: 'Polisorbat 60', risk: 'low', category: 'emulgator' },
        'e436': { name: 'Polisorbat 65', risk: 'low', category: 'emulgator' },
        'e440': { name: 'Pektyny', risk: 'low', category: 'emulgator' },
        'e442': { name: 'Fosfolipidy amonowe', risk: 'low', category: 'emulgator' },
        'e444': { name: 'Octan izomaslanu sacharozy', risk: 'low', category: 'emulgator' },
        'e445': { name: 'Estry glicerolu i zywicy', risk: 'low', category: 'emulgator' },
        'e450': { name: 'Difosforany', risk: 'moderate', category: 'emulgator' },
        'e451': { name: 'Trifosforany', risk: 'moderate', category: 'emulgator' },
        'e452': { name: 'Polifosforany', risk: 'moderate', category: 'emulgator' },
        'e460': { name: 'Celuloza', risk: 'low', category: 'emulgator' },
        'e461': { name: 'Metyloceluloza', risk: 'low', category: 'emulgator' },
        'e462': { name: 'Etyloceluloza', risk: 'low', category: 'emulgator' },
        'e463': { name: 'Hydroksypropyloceluloza', risk: 'low', category: 'emulgator' },
        'e464': { name: 'Hydroksypropylometyloceluloza', risk: 'low', category: 'emulgator' },
        'e465': { name: 'Metyloetylceluloza', risk: 'low', category: 'emulgator' },
        'e466': { name: 'Karboksymetyloceluloza', risk: 'low', category: 'emulgator' },
        'e468': { name: 'Sieciowana karboksymetyloceluloza', risk: 'low', category: 'emulgator' },
        'e469': { name: 'Hydrolizowana karboksymetyloceluloza', risk: 'low', category: 'emulgator' },
        'e470a': { name: 'Sole sodowe/potasowe/wapniowe kwasów tluszczowych', risk: 'low', category: 'emulgator' },
        'e470b': { name: 'Sole magnezowe kwasów tluszczowych', risk: 'low', category: 'emulgator' },
        'e471': { name: 'Mono- i diglicerydy kwasów tluszczowych', risk: 'low', category: 'emulgator' },
        'e472a': { name: 'Estry kwasu octowego', risk: 'low', category: 'emulgator' },
        'e472b': { name: 'Estry kwasu mlekowego', risk: 'low', category: 'emulgator' },
        'e472c': { name: 'Estry kwasu cytrynowego', risk: 'low', category: 'emulgator' },
        'e472d': { name: 'Estry kwasu winowego', risk: 'low', category: 'emulgator' },
        'e472e': { name: 'Estry DATEM', risk: 'low', category: 'emulgator' },
        'e472f': { name: 'Mieszane estry', risk: 'low', category: 'emulgator' },
        'e473': { name: 'Estry sacharozy i kwasów tluszczowych', risk: 'low', category: 'emulgator' },
        'e474': { name: 'Cukroglicerydy', risk: 'low', category: 'emulgator' },
        'e475': { name: 'Estry poliglicerolu', risk: 'low', category: 'emulgator' },
        'e476': { name: 'Polirycynooleinian poliglicerolu', risk: 'low', category: 'emulgator' },
        'e477': { name: 'Estry glikolu propylenowego', risk: 'low', category: 'emulgator' },
        'e479b': { name: 'Utleniony olej sojowy', risk: 'low', category: 'emulgator' },
        'e481': { name: 'Stearoilo-2-mleczan sodu', risk: 'low', category: 'emulgator' },
        'e482': { name: 'Stearoilo-2-mleczan wapnia', risk: 'low', category: 'emulgator' },
        'e483': { name: 'Winian stearylu', risk: 'low', category: 'emulgator' },
        'e491': { name: 'Monostearynian sorbitanu', risk: 'low', category: 'emulgator' },
        'e492': { name: 'Tristearynian sorbitanu', risk: 'low', category: 'emulgator' },
        'e493': { name: 'Monooleinian sorbitanu', risk: 'low', category: 'emulgator' },
        'e494': { name: 'Monooleinian sorbitanu', risk: 'low', category: 'emulgator' },
        'e495': { name: 'Monopalmitynian sorbitanu', risk: 'low', category: 'emulgator' },

        // Wzmacniacze smaku
        'e620': { name: 'Kwas glutaminowy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e621': { name: 'Glutaminian sodu (MSG)', risk: 'moderate', category: 'wzmacniacz smaku', warning: 'Moze powodowac bóle glowy u wrazliwych osób' },
        'e622': { name: 'Glutaminian potasu', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e623': { name: 'Diglutaminian wapnia', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e624': { name: 'Glutaminian amonu', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e625': { name: 'Diglutaminian magnezu', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e626': { name: 'Kwas guanylowy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e627': { name: 'Guanylan disodowy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e628': { name: 'Guanylan dipotasowy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e629': { name: 'Guanylan wapnia', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e630': { name: 'Kwas inozynowy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e631': { name: 'Inozynian disodowy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e632': { name: 'Inozynian dipotasowy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e633': { name: 'Inozynian wapnia', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e634': { name: 'Wapniowe rybonukleotydy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e635': { name: 'Sodowe rybonukleotydy', risk: 'moderate', category: 'wzmacniacz smaku' },
        'e640': { name: 'Glicyna i jej sól sodowa', risk: 'low', category: 'wzmacniacz smaku' },
        'e650': { name: 'Octan cynku', risk: 'low', category: 'wzmacniacz smaku' },

        // Slodziki
        'e950': { name: 'Acesulfam K', risk: 'moderate', category: 'slodzik', warning: 'Sztuczny slodzik - badania niejednoznaczne' },
        'e951': { name: 'Aspartam', risk: 'moderate', category: 'slodzik', warning: 'Nie dla osób z fenyloketonuria' },
        'e952': { name: 'Cyklaminian', risk: 'moderate', category: 'slodzik', warning: 'Zakazany w USA' },
        'e953': { name: 'Izomalt', risk: 'low', category: 'slodzik', warning: 'Moze dzialac przeczyszczajaco' },
        'e954': { name: 'Sacharyna', risk: 'moderate', category: 'slodzik' },
        'e955': { name: 'Sukraloza', risk: 'low', category: 'slodzik' },
        'e957': { name: 'Taumatyna', risk: 'low', category: 'slodzik' },
        'e959': { name: 'Neohesperydyna DC', risk: 'low', category: 'slodzik' },
        'e960': { name: 'Glikozydy stewiolowe (stewia)', risk: 'low', category: 'slodzik' },
        'e961': { name: 'Neotam', risk: 'low', category: 'slodzik' },
        'e962': { name: 'Sól aspartamu i acesulfamu', risk: 'moderate', category: 'slodzik' },
        'e965': { name: 'Maltitol', risk: 'low', category: 'slodzik', warning: 'Moze dzialac przeczyszczajaco' },
        'e966': { name: 'Laktitol', risk: 'low', category: 'slodzik', warning: 'Moze dzialac przeczyszczajaco' },
        'e967': { name: 'Ksylitol', risk: 'low', category: 'slodzik', warning: 'Moze dzialac przeczyszczajaco' },
        'e968': { name: 'Erytrytol', risk: 'low', category: 'slodzik' },
        'e969': { name: 'Advantam', risk: 'low', category: 'slodzik' }
    },

    // Lista alergenow
    allergensList: [
        { id: 'gluten', names: ['gluten', 'pszenica', 'zyto', 'jeczmien', 'owies', 'orkisz', 'wheat', 'rye', 'barley', 'oats'] },
        { id: 'milk', names: ['mleko', 'laktoza', 'kazein', 'serwatka', 'milk', 'lactose', 'casein', 'whey', 'maslo', 'smietana', 'ser'] },
        { id: 'eggs', names: ['jaja', 'jajka', 'egg', 'albumina', 'lecytyna z jaj'] },
        { id: 'nuts', names: ['orzechy', 'migdaly', 'orzechy laskowe', 'orzechy wloskie', 'pistacje', 'nerkowce', 'pekan', 'makadamia', 'nuts', 'almonds', 'hazelnuts', 'walnuts'] },
        { id: 'peanuts', names: ['orzeszki ziemne', 'arachidowe', 'peanuts', 'arachidy'] },
        { id: 'soy', names: ['soja', 'soy', 'soya', 'lecytyna sojowa'] },
        { id: 'fish', names: ['ryba', 'ryby', 'fish', 'losos', 'tunczyk', 'dorsz', 'makrela'] },
        { id: 'shellfish', names: ['skorupiaki', 'krewetki', 'kraby', 'homary', 'langusty', 'shellfish', 'shrimp', 'crab', 'lobster'] },
        { id: 'celery', names: ['seler', 'celery'] },
        { id: 'mustard', names: ['musztarda', 'gorczyca', 'mustard'] },
        { id: 'sesame', names: ['sezam', 'sesame'] },
        { id: 'sulfites', names: ['siarczyny', 'dwutlenek siarki', 'sulfites', 'sulphites'] },
        { id: 'lupin', names: ['lubin', 'lupin', 'lupine'] },
        { id: 'molluscs', names: ['mieczaki', 'malze', 'ostrygi', 'slimaki', 'kalmar', 'molluscs', 'oysters', 'mussels', 'squid'] }
    ],

    // Analiza produktu
    analyzeProduct(product) {
        const analysis = {
            warnings: [],
            allergens: [],
            additives: [],
            nutritionLevel: {},
            summary: []
        };

        // Analiza skladnikow
        if (product.ingredients_text) {
            const ingredientsLower = product.ingredients_text.toLowerCase();

            // Wykrywanie alergenow
            analysis.allergens = this.detectAllergens(ingredientsLower, product.allergens_tags || []);

            // Wykrywanie dodatkow E
            analysis.additives = this.detectAdditives(ingredientsLower, product.additives_tags || []);
        }

        // Analiza wartosci odzywczych
        if (product.nutriments) {
            analysis.nutritionLevel = this.analyzeNutrition(product.nutriments);
        }

        // Generowanie ostrzezen
        analysis.warnings = this.generateWarnings(product, analysis);

        // Generowanie podsumowania
        analysis.summary = this.generateSummary(product, analysis);

        return analysis;
    },

    // Wykrywanie alergenow
    detectAllergens(ingredientsText, allergensTags) {
        const detected = new Set();

        // Z tagow API
        if (allergensTags && allergensTags.length > 0) {
            allergensTags.forEach(tag => {
                const allergenName = tag.replace('en:', '').replace('pl:', '');
                detected.add(this.translateAllergen(allergenName));
            });
        }

        // Z tekstu skladnikow
        this.allergensList.forEach(allergen => {
            allergen.names.forEach(name => {
                if (ingredientsText.includes(name.toLowerCase())) {
                    detected.add(this.translateAllergen(allergen.id));
                }
            });
        });

        return Array.from(detected);
    },

    // Tlumaczenie nazwy alergenu
    translateAllergen(allergenId) {
        const translations = {
            'gluten': 'Gluten',
            'milk': 'Mleko',
            'eggs': 'Jaja',
            'nuts': 'Orzechy',
            'peanuts': 'Orzeszki ziemne',
            'soy': 'Soja',
            'fish': 'Ryby',
            'shellfish': 'Skorupiaki',
            'celery': 'Seler',
            'mustard': 'Musztarda',
            'sesame': 'Sezam',
            'sulfites': 'Siarczyny',
            'lupin': 'Lubin',
            'molluscs': 'Mieczaki',
            'soybeans': 'Soja',
            'wheat': 'Pszenica (gluten)',
            'crustaceans': 'Skorupiaki'
        };
        return translations[allergenId.toLowerCase()] || allergenId;
    },

    // Wykrywanie dodatkow E
    detectAdditives(ingredientsText, additivesTags) {
        const detected = [];
        const foundCodes = new Set();

        // Z tagow API
        if (additivesTags && additivesTags.length > 0) {
            additivesTags.forEach(tag => {
                const code = tag.replace('en:', '').toLowerCase();
                if (!foundCodes.has(code)) {
                    foundCodes.add(code);
                    const additiveInfo = this.additives[code];
                    if (additiveInfo) {
                        detected.push({
                            code: code.toUpperCase(),
                            ...additiveInfo
                        });
                    } else {
                        detected.push({
                            code: code.toUpperCase(),
                            name: 'Nieznany dodatek',
                            risk: 'unknown',
                            category: 'inny'
                        });
                    }
                }
            });
        }

        // Wyszukiwanie w tekscie
        const ePattern = /e\s?(\d{3,4}[a-z]?)/gi;
        let match;
        while ((match = ePattern.exec(ingredientsText)) !== null) {
            const code = 'e' + match[1].toLowerCase();
            if (!foundCodes.has(code)) {
                foundCodes.add(code);
                const additiveInfo = this.additives[code];
                if (additiveInfo) {
                    detected.push({
                        code: code.toUpperCase(),
                        ...additiveInfo
                    });
                }
            }
        }

        // Sortowanie wg ryzyka
        const riskOrder = { 'high': 0, 'moderate': 1, 'low': 2, 'unknown': 3 };
        detected.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);

        return detected;
    },

    // Analiza wartosci odzywczych
    analyzeNutrition(nutriments) {
        const levels = {};

        // Progi dla 100g (na podstawie wytycznych WHO/UE)
        const thresholds = {
            'sugars': { low: 5, high: 22.5, unit: 'g' },
            'fat': { low: 3, high: 17.5, unit: 'g' },
            'saturated-fat': { low: 1.5, high: 5, unit: 'g' },
            'salt': { low: 0.3, high: 1.5, unit: 'g' },
            'sodium': { low: 0.12, high: 0.6, unit: 'g' },
            'fiber': { low: 3, high: 6, unit: 'g', inverted: true }
        };

        Object.keys(thresholds).forEach(nutrient => {
            const value = nutriments[nutrient + '_100g'] || nutriments[nutrient];
            if (value !== undefined) {
                const threshold = thresholds[nutrient];
                if (threshold.inverted) {
                    // Dla blonnika - wiecej jest lepiej
                    if (value >= threshold.high) levels[nutrient] = 'high-good';
                    else if (value >= threshold.low) levels[nutrient] = 'medium';
                    else levels[nutrient] = 'low-bad';
                } else {
                    // Dla cukru, tluszczu, soli - mniej jest lepiej
                    if (value <= threshold.low) levels[nutrient] = 'low';
                    else if (value >= threshold.high) levels[nutrient] = 'high';
                    else levels[nutrient] = 'medium';
                }
            }
        });

        return levels;
    },

    // Generowanie ostrzezen
    generateWarnings(product, analysis) {
        const warnings = [];

        // Ostrzezenia o wysokim ryzyku dodatkow
        const highRiskAdditives = analysis.additives.filter(a => a.risk === 'high');
        if (highRiskAdditives.length > 0) {
            warnings.push({
                type: 'additives',
                severity: 'high',
                message: `Zawiera ${highRiskAdditives.length} dodatek/ów o wysokim ryzyku: ${highRiskAdditives.map(a => a.code).join(', ')}`
            });
        }

        // Ostrzezenia o wartosciach odzywczych
        if (analysis.nutritionLevel['sugars'] === 'high') {
            const sugarValue = product.nutriments?.sugars_100g || product.nutriments?.sugars;
            warnings.push({
                type: 'nutrition',
                severity: 'high',
                message: `Wysoka zawartosc cukru: ${sugarValue?.toFixed(1) || '?'}g/100g`
            });
        }

        if (analysis.nutritionLevel['salt'] === 'high' || analysis.nutritionLevel['sodium'] === 'high') {
            const saltValue = product.nutriments?.salt_100g || product.nutriments?.salt;
            warnings.push({
                type: 'nutrition',
                severity: 'high',
                message: `Wysoka zawartosc soli: ${saltValue?.toFixed(1) || '?'}g/100g`
            });
        }

        if (analysis.nutritionLevel['saturated-fat'] === 'high') {
            const satFatValue = product.nutriments?.['saturated-fat_100g'] || product.nutriments?.['saturated-fat'];
            warnings.push({
                type: 'nutrition',
                severity: 'high',
                message: `Wysoka zawartosc tluszczów nasyconych: ${satFatValue?.toFixed(1) || '?'}g/100g`
            });
        }

        // NOVA 4 - ultra przetworzone
        if (product.nova_group === 4) {
            warnings.push({
                type: 'processing',
                severity: 'moderate',
                message: 'Produkt ultra-przetworzony (NOVA 4)'
            });
        }

        return warnings;
    },

    // Generowanie podsumowania
    generateSummary(product, analysis) {
        const summary = [];

        // Nutri-Score
        if (product.nutriscore_grade) {
            const grade = product.nutriscore_grade.toUpperCase();
            const descriptions = {
                'A': { text: 'Bardzo dobra wartosc odzywcza', type: 'positive' },
                'B': { text: 'Dobra wartosc odzywcza', type: 'positive' },
                'C': { text: 'Srednia wartosc odzywcza', type: 'neutral' },
                'D': { text: 'Niska wartosc odzywcza', type: 'negative' },
                'E': { text: 'Bardzo niska wartosc odzywcza', type: 'negative' }
            };
            const desc = descriptions[grade] || { text: 'Brak oceny', type: 'neutral' };
            summary.push({
                title: `Nutri-Score: ${grade}`,
                description: desc.text,
                type: desc.type
            });
        }

        // NOVA
        if (product.nova_group) {
            const novaDescriptions = {
                1: { text: 'Nieprzetworzone lub minimalnie przetworzone', type: 'positive' },
                2: { text: 'Przetworzone skladniki kulinarne', type: 'neutral' },
                3: { text: 'Zywnosc przetworzona', type: 'neutral' },
                4: { text: 'Produkty ultra-przetworzone', type: 'negative' }
            };
            const desc = novaDescriptions[product.nova_group] || { text: 'Nieznany', type: 'neutral' };
            summary.push({
                title: `NOVA: ${product.nova_group}`,
                description: desc.text,
                type: desc.type
            });
        }

        // Dodatki
        const highRisk = analysis.additives.filter(a => a.risk === 'high').length;
        const moderateRisk = analysis.additives.filter(a => a.risk === 'moderate').length;
        const totalAdditives = analysis.additives.length;

        if (totalAdditives > 0) {
            let additiveType = 'neutral';
            let additiveDesc = `${totalAdditives} dodatek/ów`;

            if (highRisk > 0) {
                additiveType = 'negative';
                additiveDesc = `${highRisk} o wysokim ryzyku`;
            } else if (moderateRisk > 0) {
                additiveType = 'neutral';
                additiveDesc = `${moderateRisk} o umiarkowanym ryzyku`;
            } else {
                additiveType = 'positive';
                additiveDesc = 'Wszystkie niskiego ryzyka';
            }

            summary.push({
                title: `Dodatki: ${totalAdditives}`,
                description: additiveDesc,
                type: additiveType
            });
        } else {
            summary.push({
                title: 'Dodatki: 0',
                description: 'Brak dodatkow E',
                type: 'positive'
            });
        }

        // Alergeny
        if (analysis.allergens.length > 0) {
            summary.push({
                title: `Alergeny: ${analysis.allergens.length}`,
                description: analysis.allergens.join(', '),
                type: 'neutral'
            });
        }

        return summary;
    },

    // Formatowanie wartosci odzywczych
    formatNutritionTable(nutriments) {
        const nutrients = [
            { key: 'energy-kcal', name: 'Energia', unit: 'kcal', rws: 2000 },
            { key: 'energy-kj', name: 'Energia', unit: 'kJ', rws: 8400 },
            { key: 'fat', name: 'Tluszcz', unit: 'g', rws: 70 },
            { key: 'saturated-fat', name: 'w tym kw. nasycone', unit: 'g', rws: 20, indent: true },
            { key: 'carbohydrates', name: 'Weglowodany', unit: 'g', rws: 260 },
            { key: 'sugars', name: 'w tym cukry', unit: 'g', rws: 90, indent: true },
            { key: 'fiber', name: 'Blonnik', unit: 'g', rws: 25 },
            { key: 'proteins', name: 'Bialko', unit: 'g', rws: 50 },
            { key: 'salt', name: 'Sól', unit: 'g', rws: 6 },
            { key: 'sodium', name: 'Sód', unit: 'mg', rws: 2400, multiply: 1000 }
        ];

        const rows = [];

        nutrients.forEach(nutrient => {
            let value = nutriments[nutrient.key + '_100g'] ?? nutriments[nutrient.key];

            if (value !== undefined && value !== null) {
                if (nutrient.multiply) value *= nutrient.multiply;

                const rwsPercent = nutrient.rws ? Math.round((value / nutrient.rws) * 100) : null;

                let level = '';
                if (['sugars', 'fat', 'saturated-fat', 'salt', 'sodium'].includes(nutrient.key)) {
                    if (rwsPercent > 25) level = 'high';
                    else if (rwsPercent > 10) level = 'medium';
                    else level = 'low';
                }

                rows.push({
                    name: nutrient.name,
                    value: `${value.toFixed(1)} ${nutrient.unit}`,
                    rws: rwsPercent ? `${rwsPercent}%` : '-',
                    level: level,
                    indent: nutrient.indent || false
                });
            }
        });

        return rows;
    },

    // Parsowanie i analiza skladnikow
    parseIngredients(ingredientsText) {
        if (!ingredientsText) return [];

        // Czyszczenie tekstu
        let text = ingredientsText
            .toLowerCase()
            .replace(/\([^)]*\)/g, '') // Usun nawiasy i ich zawartosc
            .replace(/\[[^\]]*\]/g, '') // Usun nawiasy kwadratowe
            .replace(/\d+(\.\d+)?%/g, '') // Usun procenty
            .replace(/:/g, ',') // Zamien dwukropki na przecinki
            .replace(/;/g, ',') // Zamien sredniki na przecinki
            .replace(/\./g, ',') // Zamien kropki na przecinki
            .replace(/\s+/g, ' '); // Usun podwojne spacje

        // Podziel na skladniki
        const rawIngredients = text.split(',')
            .map(i => i.trim())
            .filter(i => i.length > 1);

        // Analizuj kazdy skladnik
        const analyzedIngredients = [];
        const seenIngredients = new Set();

        rawIngredients.forEach((ingredient, index) => {
            // Pomin duplikaty
            if (seenIngredients.has(ingredient)) return;
            seenIngredients.add(ingredient);

            const analysis = this.analyzeIngredient(ingredient);
            analyzedIngredients.push({
                name: this.capitalizeFirst(ingredient),
                originalName: ingredient,
                position: index + 1,
                ...analysis
            });
        });

        return analyzedIngredients;
    },

    // Analiza pojedynczego skladnika
    analyzeIngredient(ingredient) {
        const ingredientLower = ingredient.toLowerCase().trim();

        // Sprawdz dodatki E
        const eMatch = ingredientLower.match(/e\s?(\d{3,4}[a-z]?)/i);
        if (eMatch) {
            const eCode = 'e' + eMatch[1].toLowerCase();
            const additiveInfo = this.additives[eCode];
            if (additiveInfo) {
                return {
                    risk: additiveInfo.risk,
                    category: additiveInfo.category,
                    description: additiveInfo.warning || this.getAdditiveDescription(additiveInfo),
                    isAdditive: true,
                    eCode: eCode.toUpperCase()
                };
            }
        }

        // Sprawdz baze skladnikow - dokladne dopasowanie
        if (this.ingredientsDatabase[ingredientLower]) {
            return {
                ...this.ingredientsDatabase[ingredientLower],
                isAdditive: false
            };
        }

        // Sprawdz czesciowe dopasowanie
        for (const [key, value] of Object.entries(this.ingredientsDatabase)) {
            if (ingredientLower.includes(key) || key.includes(ingredientLower)) {
                return {
                    ...value,
                    isAdditive: false,
                    matchedKey: key
                };
            }
        }

        // Sprawdz kategorie ogolne
        const categoryPatterns = [
            { pattern: /cukier|cukr|slod|syrop|miód|frukt|gluk|sachar|dekstr|maltoz/i, category: 'cukry', risk: 'moderate', description: 'Skladnik cukrowy - moze przyczynic sie do podwyzszenia poziomu cukru we krwi.' },
            { pattern: /tluszcz|olej|maslo|smalec|margar/i, category: 'tluszcze', risk: 'moderate', description: 'Skladnik tluszczowy - zawartosc i rodzaj tluszczu wplywa na zdrowie serca.' },
            { pattern: /sol|sod|chlorek/i, category: 'sol', risk: 'moderate', description: 'Skladnik zawierajacy sód - nadmiar moze podnosic cisnienie krwi.' },
            { pattern: /aromat|smak|zapach/i, category: 'dodatki', risk: 'moderate', description: 'Substancja smakowo-zapachowa - sklad czesto nieujawniony.' },
            { pattern: /barwnik|kolor|pigment/i, category: 'dodatki', risk: 'moderate', description: 'Barwnik - moze byc naturalny lub syntetyczny.' },
            { pattern: /konserwant|przedluz/i, category: 'dodatki', risk: 'moderate', description: 'Konserwant - przedluza trwalosc produktu.' },
            { pattern: /emulgat|stabiliz|zageszcz/i, category: 'dodatki', risk: 'low', description: 'Dodatek technologiczny - zazwyczaj bezpieczny.' },
            { pattern: /witamin|mineral/i, category: 'witaminy', risk: 'low', description: 'Witamina lub mineral - korzystne dla zdrowia.' },
            { pattern: /maka|mąka|zboz|pszen|zytn|owsian|orkisz/i, category: 'zboza', risk: 'low', description: 'Skladnik zbozowy - zrodlo weglowodanów.' },
            { pattern: /mleko|mlecz|serwatk|kazein|laktoz|smietana|masłanka/i, category: 'nabial', risk: 'low', description: 'Skladnik mleczny - zrodlo wapnia i bialka.' },
            { pattern: /jaj|albumin/i, category: 'jaja', risk: 'low', description: 'Skladnik jajeczny - zrodlo bialka.' },
            { pattern: /orzech|migdal|pistacj|nerkow/i, category: 'orzechy', risk: 'low', description: 'Orzech - zrodlo zdrowych tluszczów, ale potencjalny alergen.' },
            { pattern: /soja|sojow/i, category: 'soja', risk: 'low', description: 'Skladnik sojowy - bialko roslinne, ale potencjalny alergen.' },
            { pattern: /wod[ay]|h2o/i, category: 'podstawowe', risk: 'low', description: 'Woda - podstawowy, bezpieczny skladnik.' }
        ];

        for (const { pattern, category, risk, description } of categoryPatterns) {
            if (pattern.test(ingredientLower)) {
                return { risk, category, description, isAdditive: false };
            }
        }

        // Nieznany skladnik
        return {
            risk: 'unknown',
            category: 'inne',
            description: 'Skladnik nierozpoznany - brak informacji o wplywie na zdrowie.',
            isAdditive: false
        };
    },

    // Opis dodatku E na podstawie kategorii
    getAdditiveDescription(additiveInfo) {
        const categoryDescriptions = {
            'barwnik': 'Barwnik - nadaje produktowi kolor. Naturalne barwniki sa bezpieczne, syntetyczne moga powodowac reakcje u wrazliwych osób.',
            'konserwant': 'Konserwant - przedluza trwalosc produktu. Niektóre sa bezpieczne, inne moga byc problematyczne.',
            'przeciwutleniacz': 'Przeciwutleniacz - chroni przed psuciem. Wiele z nich to naturalne witaminy (C, E).',
            'emulgator': 'Emulgator - laczy wode z tluszczem. Wiekszosc jest bezpieczna.',
            'wzmacniacz smaku': 'Wzmacniacz smaku - intensyfikuje smak. Moze powodowac reakcje u wrazliwych osób.',
            'slodzik': 'Slodzik - zamiennik cukru. Niektóre moga miec skutki uboczne przy duzym spozyciu.',
            'stabilizator': 'Stabilizator - utrzymuje konsystencje. Zazwyczaj bezpieczny.'
        };
        return categoryDescriptions[additiveInfo.category] || `Dodatek ${additiveInfo.category} - ${additiveInfo.name}`;
    },

    // Pierwsza litera wielka
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Podsumowanie analizy skladnikow
    getIngredientsSummary(analyzedIngredients) {
        const summary = {
            total: analyzedIngredients.length,
            highRisk: analyzedIngredients.filter(i => i.risk === 'high').length,
            moderateRisk: analyzedIngredients.filter(i => i.risk === 'moderate').length,
            lowRisk: analyzedIngredients.filter(i => i.risk === 'low').length,
            unknown: analyzedIngredients.filter(i => i.risk === 'unknown').length,
            additives: analyzedIngredients.filter(i => i.isAdditive).length,
            categories: {}
        };

        // Zlicz kategorie
        analyzedIngredients.forEach(i => {
            summary.categories[i.category] = (summary.categories[i.category] || 0) + 1;
        });

        return summary;
    }
};

// Export dla uzycia w innych plikach
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analyzer;
}
