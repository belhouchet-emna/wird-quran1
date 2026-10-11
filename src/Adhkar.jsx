
import { useEffect, useState } from "react";
import "./Adhkar.css";

const STORAGE_KEY = "wird-adhkar-progress";

const categories = {
  ar: [
    { id: "morning", name: "أذكار الصباح" },
    { id: "evening", name: "أذكار المساء" },
    { id: "sleep", name: "أذكار النوم" },
    { id: "travel", name: "أذكار السفر" },
    { id: "home", name: "أذكار المنزل" },
  ],
  fr: [
    { id: "morning", name: "Adhkar du matin" },
    { id: "evening", name: "Adhkar du soir" },
    { id: "sleep", name: "Adhkar du sommeil" },
    { id: "travel", name: "Adhkar du voyage" },
    { id: "home", name: "Adhkar de la maison" },
  ],
  en: [
    { id: "morning", name: "Morning adhkar" },
    { id: "evening", name: "Evening adhkar" },
    { id: "sleep", name: "Bedtime adhkar" },
    { id: "travel", name: "Travel adhkar" },
    { id: "home", name: "Home adhkar" },
  ],
  es: [
    { id: "morning", name: "Recuerdos de la mañana" },
    { id: "evening", name: "Recuerdos de la tarde" },
    { id: "sleep", name: "Recuerdos antes de dormir" },
    { id: "travel", name: "Recuerdos del viaje" },
    { id: "home", name: "Recuerdos del hogar" },
  ],
};

const adhkar = {
  morning: [
    {
      id: "m1",
      text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
      count: 1,
      note: "من أذكار الصباح",
    },
    {
      id: "m2",
      text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      count: 100,
      note: "التسبيح",
    },
    {
      id: "m3",
      text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      count: 100,
      note: "الاستغفار",
    },
    {
      id: "m4",
      text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      count: 10,
      note: "الصلاة على النبي ﷺ",
    },
    {
      id: "m5",
      text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
      count: 3,
      note: "يُقال ثلاث مرات",
    },
  ],
  evening: [
    {
      id: "e1",
      text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
      count: 1,
      note: "من أذكار المساء",
    },
    {
      id: "e2",
      text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      count: 100,
      note: "التسبيح",
    },
    {
      id: "e3",
      text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      count: 100,
      note: "الاستغفار",
    },
    {
      id: "e4",
      text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      count: 10,
      note: "الصلاة على النبي ﷺ",
    },
    {
      id: "e5",
      text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
      count: 3,
      note: "يُقال ثلاث مرات",
    },
  ],
  sleep: [
    {
      id: "s1",
      text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      count: 1,
      note: "ذكر النوم",
    },
    {
      id: "s2",
      text: "سُبْحَانَ اللَّهِ",
      count: 33,
      note: "التسبيح",
    },
    {
      id: "s3",
      text: "الْحَمْدُ لِلَّهِ",
      count: 33,
      note: "التحميد",
    },
    {
      id: "s4",
      text: "اللَّهُ أَكْبَرُ",
      count: 34,
      note: "التكبير",
    },
  ],
  travel: [
    {
      id: "t1",
      text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
      count: 1,
      note: "من دعاء الركوب والسفر",
    },
    {
      id: "t2",
      text: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى",
      count: 1,
      note: "دعاء السفر",
    },
  ],
  home: [
    {
      id: "h1",
      text: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
      count: 1,
      note: "عند دخول المنزل",
    },
    {
      id: "h2",
      text: "السَّلَامُ عَلَيْكُمْ",
      count: 1,
      note: "إلقاء السلام عند الدخول",
    },
  ],
};

const labels = {
  ar: {
    intro: "اذكر الله وطمئن قلبك",
    select: "اختر مجموعة الأذكار",
    repetitions: "التكرار",
    done: "اكتمل",
    reset: "إعادة ضبط المجموعة",
    progress: "التقدم",
    friday: "تذكير يوم الجمعة",
    kahf: "لا تنسَ قراءة سورة الكهف يوم الجمعة.",
    empty: "لا توجد أذكار في هذه المجموعة بعد.",
  },
  fr: {
    intro: "Rappelle-toi d’Allah et apaise ton cœur",
    select: "Choisir une catégorie",
    repetitions: "Répétitions",
    done: "Terminé",
    reset: "Réinitialiser la catégorie",
    progress: "Progression",
    friday: "Rappel du vendredi",
    kahf: "Pense à lire la sourate Al-Kahf le vendredi.",
    empty: "Aucun dhikr dans cette catégorie.",
  },
  en: {
    intro: "Remember Allah and bring peace to your heart",
    select: "Choose a category",
    repetitions: "Repetitions",
    done: "Completed",
    reset: "Reset category",
    progress: "Progress",
    friday: "Friday reminder",
    kahf: "Remember to read Surah Al-Kahf on Friday.",
    empty: "No adhkar in this category yet.",
  },
  es: {
    intro: "Recuerda a Allah y calma tu corazón",
    select: "Elegir una categoría",
    repetitions: "Repeticiones",
    done: "Completado",
    reset: "Reiniciar categoría",
    progress: "Progreso",
    friday: "Recordatorio del viernes",
    kahf: "Recuerda leer la sura Al-Kahf el viernes.",
    empty: "Todavía no hay adhkar en esta categoría.",
  },
};

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function Adhkar({ language = "ar" }) {
  const lang = labels[language] ? language : "ar";
  const rtl = lang === "ar";
  const [category, setCategory] = useState("morning");
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // L'application continue même si le stockage est indisponible.
    }
  }, [progress]);

  const items = adhkar[category] || [];
  const completed = items.reduce(
    (sum, item) =>
      sum + Math.min(progress[`${category}-${item.id}`] || 0, item.count),
    0
  );
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const percent = total ? Math.round((completed / total) * 100) : 0;

  function increment(item) {
    const key = `${category}-${item.id}`;
    setProgress((current) => ({
      ...current,
      [key]: Math.min((current[key] || 0) + 1, item.count),
    }));
  }

  function resetCategory() {
    setProgress((current) => {
      const next = { ...current };
      items.forEach((item) => {
        delete next[`${category}-${item.id}`];
      });
      return next;
    });
  }

  return (
    <section className="wird-adhkar" dir={rtl ? "rtl" : "ltr"}>
      <header className="adhkar-header">
        <div className="adhkar-moon" aria-hidden="true">☾</div>
        <h2>{categories[lang].find((item) => item.id === category)?.name}</h2>
        <p>{labels[lang].intro}</p>
      </header>

      <div className="adhkar-category-list" aria-label={labels[lang].select}>
        {categories[lang].map((item) => (
          <button
            type="button"
            key={item.id}
            className={`adhkar-category ${category === item.id ? "active" : ""}`}
            onClick={() => setCategory(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {category === "morning" || category === "evening" ? (
        <div className="adhkar-progress">
          <div className="adhkar-progress-heading">
            <span>{labels[lang].progress}</span>
            <strong>{percent}%</strong>
          </div>
          <div
            className="adhkar-progress-track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="adhkar-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="adhkar-list">
        {items.length === 0 ? (
          <p>{labels[lang].empty}</p>
        ) : (
          items.map((item) => {
            const current = Math.min(
              progress[`${category}-${item.id}`] || 0,
              item.count
            );
            const finished = current >= item.count;

            return (
              <article
                className={`dhikr-card ${finished ? "completed" : ""}`}
                key={item.id}
              >
                <p className="dhikr-text">{item.text}</p>
                <p className="dhikr-note">{item.note}</p>

                <div className="dhikr-card-footer">
                  <span>
                    {labels[lang].repetitions}: {current}/{item.count}
                  </span>
                  <button
                    type="button"
                    className="dhikr-count-button"
                    onClick={() => increment(item)}
                    disabled={finished}
                    aria-label={`${item.text} ${current}/${item.count}`}
                  >
                    {finished ? `✓ ${labels[lang].done}` : `+1 · ${current}/${item.count}`}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <button
        type="button"
        className="adhkar-reset"
        onClick={resetCategory}
      >
        {labels[lang].reset}
      </button>

      {new Date().getDay() === 5 && (
        <aside className="adhkar-friday">
          <strong>{labels[lang].friday}</strong>
          <p>{labels[lang].kahf}</p>
        </aside>
      )}
    </section>
  );
}
