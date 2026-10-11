
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Adhkar from "./Adhkar";

const API = "https://api.alquran.cloud/v1";
const STORAGE_KEY = "wird-quran-position";
const LANGUAGE_KEY = "wird-language";

const editions = {
  ar: "quran-uthmani",
  fr: "fr.hamidullah",
  en: "en.asad",
  es: "es.cortes",
};

const translations = {
  ar: {
    appName: "وِرْد",
    subtitle: "رفيقك اليومي مع القرآن الكريم",
    home: "الرئيسية",
    quran: "القرآن الكريم",
    adhkar: "الأذكار",
    search: "ابحث عن سورة...",
    surahs: "السور",
    read: "قراءة السورة",
    back: "العودة إلى السور",
    loading: "جاري التحميل...",
    error: "حدث خطأ أثناء تحميل البيانات.",
    retry: "إعادة المحاولة",
    ayah: "الآية",
    save: "حفظ موضع القراءة",
    saved: "تم حفظ موضع القراءة",
    resume: "متابعة القراءة",
    noResults: "لم يتم العثور على سورة.",
    number: "رقم",
    ayahs: "آية",
    meccan: "مكية",
    medinan: "مدنية",
    welcome: "السلام عليكم ورحمة الله وبركاته",
    welcomeText: "افتح قلبك للقرآن واجعل لك وردًا كل يوم.",
    choose: "اختر سورة وابدأ القراءة",
    language: "اللغة",
  },
  fr: {
    appName: "WIRD",
    subtitle: "Ton compagnon quotidien avec le Coran",
    home: "Accueil",
    quran: "Coran",
    adhkar: "Adhkar",
    search: "Rechercher une sourate...",
    surahs: "Les sourates",
    read: "Lire la sourate",
    back: "Retour aux sourates",
    loading: "Chargement...",
    error: "Une erreur est survenue lors du chargement.",
    retry: "Réessayer",
    ayah: "Verset",
    save: "Enregistrer ma position",
    saved: "Position de lecture enregistrée",
    resume: "Reprendre la lecture",
    noResults: "Aucune sourate trouvée.",
    number: "Numéro",
    ayahs: "versets",
    meccan: "Mecquoise",
    medinan: "Médinoise",
    welcome: "Bienvenue dans WIRD",
    welcomeText: "Lis le Coran chaque jour, à ton rythme.",
    choose: "Choisis une sourate pour commencer",
    language: "Langue",
  },
  en: {
    appName: "WIRD",
    subtitle: "Your daily companion with the Quran",
    home: "Home",
    quran: "Quran",
    adhkar: "Adhkar",
    search: "Search for a surah...",
    surahs: "Surahs",
    read: "Read surah",
    back: "Back to surahs",
    loading: "Loading...",
    error: "An error occurred while loading the data.",
    retry: "Try again",
    ayah: "Verse",
    save: "Save reading position",
    saved: "Reading position saved",
    resume: "Resume reading",
    noResults: "No surah found.",
    number: "Number",
    ayahs: "verses",
    meccan: "Meccan",
    medinan: "Medinan",
    welcome: "Welcome to WIRD",
    welcomeText: "Make time for the Quran every day.",
    choose: "Choose a surah to begin",
    language: "Language",
  },
  es: {
    appName: "WIRD",
    subtitle: "Tu compañero diario con el Corán",
    home: "Inicio",
    quran: "Corán",
    adhkar: "Adhkar",
    search: "Buscar una sura...",
    surahs: "Las suras",
    read: "Leer la sura",
    back: "Volver a las suras",
    loading: "Cargando...",
    error: "Ocurrió un error al cargar los datos.",
    retry: "Reintentar",
    ayah: "Aleya",
    save: "Guardar posición de lectura",
    saved: "Posición de lectura guardada",
    resume: "Continuar leyendo",
    noResults: "No se encontró ninguna sura.",
    number: "Número",
    ayahs: "aleyas",
    meccan: "Mecana",
    medinan: "Medinense",
    welcome: "Bienvenido a WIRD",
    welcomeText: "Dedica un momento al Corán cada día.",
    choose: "Elige una sura para comenzar",
    language: "Idioma",
  },
};

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  const result = await response.json();

  if (result.code !== 200) {
    throw new Error(result.status || "Erreur API");
  }

  return result.data;
}

function readSavedPosition() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function readSavedLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return ["ar", "fr", "en", "es"].includes(saved) ? saved : "ar";
  } catch {
    return "ar";
  }
}

export default function App() {
  const [lang, setLang] = useState(readSavedLanguage);
  const [page, setPage] = useState("home");
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [surahLoading, setSurahLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedPosition, setSavedPosition] = useState(readSavedPosition);
  const [savedMessage, setSavedMessage] = useState("");

  const t = translations[lang];
  const rtl = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";

    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // L'application reste utilisable sans stockage local.
    }
  }, [lang, rtl]);

  useEffect(() => {
    let cancelled = false;

    async function loadSurahs() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchJson(`${API}/surah`);

        if (!cancelled) {
          setSurahs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || t.error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSurahs();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSurahs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return surahs;

    return surahs.filter((surah) =>
      [
        surah.name,
        surah.englishName,
        surah.englishNameTranslation,
        String(surah.number),
      ].some((value) => String(value || "").toLowerCase().includes(query))
    );
  }, [surahs, search]);

  async function openSurah(surahNumber, requestedAyah = 1) {
    setPage("quran");
    setSurahLoading(true);
    setError("");
    setSavedMessage("");

    try {
      const arabicPromise = fetchJson(`${API}/surah/${surahNumber}`);
      const audioPromise = fetchJson(
        `${API}/surah/${surahNumber}/ar.alafasy`
      );

      const translationEdition = editions[lang];
      const translationPromise =
        lang === "ar"
          ? Promise.resolve(null)
          : fetchJson(
              `${API}/surah/${surahNumber}/${translationEdition}`
            ).catch(() => null);

      const [arabic, audio, translated] = await Promise.all([
        arabicPromise,
        audioPromise,
        translationPromise,
      ]);

      const translationByNumber = new Map(
        (translated?.ayahs || []).map((ayah) => [
          ayah.numberInSurah,
          ayah.text,
        ])
      );

      const audioByNumber = new Map(
        (audio?.ayahs || []).map((ayah) => [
          ayah.numberInSurah,
          ayah.audio,
        ])
      );

      const ayahs = arabic.ayahs.map((ayah) => ({
        ...ayah,
        translation: translationByNumber.get(ayah.numberInSurah) || "",
        audio: audioByNumber.get(ayah.numberInSurah) || "",
      }));

      setSelectedSurah({
        ...arabic,
        ayahs,
        initialAyah: requestedAyah,
      });

      setSavedMessage("");
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setSurahLoading(false);
    }
  }

  function savePosition(surahNumber, ayahNumber) {
    const position = {
      surahNumber,
      ayahNumber,
    };

    setSavedPosition(position);
    setSavedMessage(t.saved);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    } catch {
      setSavedMessage("");
    }
  }

  function resumeReading() {
    if (savedPosition?.surahNumber) {
      openSurah(
        savedPosition.surahNumber,
        savedPosition.ayahNumber || 1
      );
    }
  }

  function goHome() {
    setPage("home");
    setSelectedSurah(null);
    setError("");
  }

  function goToQuran() {
    setPage("quran");
    setSelectedSurah(null);
    setError("");
  }

  return (
    <div className="app" dir={rtl ? "rtl" : "ltr"}>
      <header className="app-header">
        <button
          type="button"
          className="brand-button"
          onClick={goHome}
          aria-label={t.home}
        >
          <span className="brand-symbol" aria-hidden="true">☾</span>
          <span className="brand-name">{t.appName}</span>
        </button>

        <p className="app-subtitle">{t.subtitle}</p>

        <label className="language-control">
          <span>{t.language}</span>
          <select
            value={lang}
            onChange={(event) => setLang(event.target.value)}
            aria-label={t.language}
          >
            <option value="ar">العربية</option>
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>

        <nav className="main-nav" aria-label="Navigation principale">
          <button
            type="button"
            className={page === "home" ? "active" : ""}
            onClick={goHome}
          >
            {t.home}
          </button>

          <button
            type="button"
            className={page === "quran" ? "active" : ""}
            onClick={goToQuran}
          >
            {t.quran}
          </button>

          <button
            type="button"
            className={page === "adhkar" ? "active" : ""}
            onClick={() => {
              setPage("adhkar");
              setError("");
            }}
          >
            {t.adhkar}
          </button>
        </nav>
      </header>

      <main className="app-main">
        {page === "home" && (
          <section className="home-panel">
            <div className="welcome-card">
              <div className="welcome-symbol" aria-hidden="true">۞</div>
              <h1>{t.welcome}</h1>
              <p>{t.welcomeText}</p>

              <button
                type="button"
                className="primary-button"
                onClick={goToQuran}
              >
                {t.quran}
              </button>

              {savedPosition?.surahNumber && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resumeReading}
                >
                  {t.resume}
                  {" "}
                  ({t.number} {savedPosition.surahNumber}, {t.ayah}{" "}
                  {savedPosition.ayahNumber || 1})
                </button>
              )}
            </div>

            <div className="home-actions">
              <button
                type="button"
                className="feature-card"
                onClick={goToQuran}
              >
                <span aria-hidden="true">📖</span>
                <strong>{t.quran}</strong>
                <span>{t.choose}</span>
              </button>

              <button
                type="button"
                className="feature-card"
                onClick={() => setPage("adhkar")}
              >
                <span aria-hidden="true">📿</span>
                <strong>{t.adhkar}</strong>
                <span>{translations[lang].subtitle}</span>
              </button>
            </div>
          </section>
        )}

        {page === "quran" && (
          <section className="reading-panel">
            {!selectedSurah && (
              <>
                <h1>{t.surahs}</h1>

                <label className="search-box">
                  <span className="visually-hidden">{t.search}</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t.search}
                  />
                </label>

                {loading && <p className="status-message">{t.loading}</p>}

                {error && (
                  <div className="error-message" role="alert">
                    <p>{t.error}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setLoading(true);
                        fetchJson(`${API}/surah`)
                          .then(setSurahs)
                          .catch(() => setError(t.error))
                          .finally(() => setLoading(false));
                      }}
                    >
                      {t.retry}
                    </button>
                  </div>
                )}

                {!loading && !error && filteredSurahs.length === 0 && (
                  <p className="status-message">{t.noResults}</p>
                )}

                <div className="surah-grid">
                  {filteredSurahs.map((surah) => (
                    <button
                      type="button"
                      className="surah-card"
                      key={surah.number}
                      onClick={() => openSurah(surah.number)}
                    >
                      <span className="surah-number">{surah.number}</span>

                      <span className="surah-card-info">
                        <strong>{surah.name}</strong>
                        <span>{surah.englishName}</span>
                        <small>
                          {surah.numberOfAyahs} {t.ayahs}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {selectedSurah && (
              <div className="surah-reading">
                <button
                  type="button"
                  className="secondary-button back-button"
                  onClick={() => {
                    setSelectedSurah(null);
                    setError("");
                  }}
                >
                  ← {t.back}
                </button>

                <header className="surah-heading">
                  <h1>{selectedSurah.name}</h1>
                  <p>{selectedSurah.englishName}</p>
                  <p>
                    {selectedSurah.numberOfAyahs} {t.ayahs}
                    {" · "}
                    {selectedSurah.revelationType === "Meccan"
                      ? t.meccan
                      : t.medinan}
                  </p>
                </header>

                {surahLoading && (
                  <p className="status-message">{t.loading}</p>
                )}

                {error && (
                  <div className="error-message" role="alert">
                    <p>{t.error}</p>
                    <button
                      type="button"
                      onClick={() => openSurah(selectedSurah.number)}
                    >
                      {t.retry}
                    </button>
                  </div>
                )}

                {!surahLoading && !error && (
                  <div className="ayah-list">
                    {selectedSurah.ayahs.map((ayah) => (
                      <article
                        className="ayah-card"
                        key={ayah.number}
                        id={`ayah-${ayah.numberInSurah}`}
                      >
                        <div className="ayah-heading">
                          <span className="ayah-number">
                            {t.ayah} {ayah.numberInSurah}
                          </span>

                          <button
                            type="button"
                            className="save-position-button"
                            onClick={() =>
                              savePosition(
                                selectedSurah.number,
                                ayah.numberInSurah
                              )
                            }
                          >
                            {t.save}
                          </button>
                        </div>

                        <p className="ayah-arabic">{ayah.text}</p>

                        {lang !== "ar" && ayah.translation && (
                          <p className="ayah-translation">
                            {ayah.translation}
                          </p>
                        )}

                        {ayah.audio && (
                          <audio
                            className="ayah-audio"
                            controls
                            preload="none"
                            src={ayah.audio}
                            onPlay={() =>
                              savePosition(
                                selectedSurah.number,
                                ayah.numberInSurah
                              )
                            }
                          >
                            Your browser does not support audio playback.
                          </audio>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                {savedMessage && (
                  <p className="saved-message" role="status">
                    {savedMessage}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {page === "adhkar" && <Adhkar language={lang} />}
      </main>

      
<footer className="app-footer">
  <p className="app-footer-brand">
    {t.appName} · {t.subtitle}
  </p>

  <div className="app-dedication" dir="rtl">
    <span className="dedication-symbol" aria-hidden="true">🤍</span>
    <p className="dedication-title">
      صدقة جارية على روح سامية بنت محمد الطاهر بالهوشات
    </p>
    <p className="dedication-prayer">
      اللهم اغفر لها وارحمها واجعل هذا العمل في ميزان حسناتها.
    </p>
  </div>

  <p className="app-developer" dir="rtl">
    تطوير التطبيق: آمنة بنت المنجي بالهوشات
  </p>
</footer>
 </div>
  );
}
