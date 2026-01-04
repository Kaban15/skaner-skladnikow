/**
 * Analyzer - Modul do analizy skladnikow produktow
 */

const Analyzer = {
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
    }
};

// Export dla uzycia w innych plikach
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analyzer;
}
