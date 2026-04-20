document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const dateDisplay = document.getElementById('date-display');
    const calorieInput = document.getElementById('calorie-input');
    const addBtn = document.getElementById('add-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    const progressCircle = document.getElementById('progress-circle');
    const percentageText = document.getElementById('percentage-text');
    const currentCaloriesText = document.getElementById('current-calories');
    
    const proteinValue = document.getElementById('protein-value');
    const carbsValue = document.getElementById('carbs-value');
    const fatsValue = document.getElementById('fats-value');
    const motivationalPhrase = document.getElementById('motivational-phrase');

    // Settings Elements
    const settingsToggleBtn = document.getElementById('settings-toggle-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettingsBtn = document.getElementById('close-settings');
    
    const colorDots = document.querySelectorAll('.color-dot');
    const fontBtns = document.querySelectorAll('.font-btn');
    const langBtns = document.querySelectorAll('.lang-btn');

    // Labels for Translation
    const labelCalories = document.getElementById('label-calories');
    const labelProtein = document.getElementById('label-protein');
    const labelCarbs = document.getElementById('label-carbs');
    const labelFats = document.getElementById('label-fats');
    const settingsTitle = document.getElementById('settings-title');
    const labelTheme = document.getElementById('label-theme');
    const labelFont = document.getElementById('label-font');
    const labelLang = document.getElementById('label-lang');

    // --- State ---
    let totalCalories = 0;
    const goalCalories = 2000;
    let currentLang = 'es';
    
    const circleRadius = progressCircle.r.baseVal.value;
    const circumference = circleRadius * 2 * Math.PI;

    // Dictionaries
    const dict = {
        es: {
            calories: "CALORÍAS",
            addKcal: "Añadir kcal...",
            protein: "Proteína",
            carbs: "Carbs",
            fats: "Grasas",
            settingsTitle: "Personalizar",
            theme: "Color de Tema",
            font: "Tipografía (Números)",
            lang: "Idioma",
            phrases: [
                '"Contar mis calorías no es una restricción, es el mapa para nutrir mi cuerpo con la elegancia y el amor que merece."',
                '"Nutriendo tu brillo hoy. Un paso a la vez, con amor y consciencia."',
                '"Lo estás haciendo increíble. Tu cuerpo es tu templo."',
                '"Casi llegas a tu meta, reina. Sigue dándole a tu cuerpo lo mejor."',
                '"¡Meta alcanzada! Tu cuerpo agradece toda esta energía y cuidado constante."'
            ]
        },
        en: {
            calories: "CALORIES",
            addKcal: "Add kcal...",
            protein: "Protein",
            carbs: "Carbs",
            fats: "Fats",
            settingsTitle: "Customize",
            theme: "Theme Color",
            font: "Typography (Numbers)",
            lang: "Language",
            phrases: [
                '"Counting my calories isn\'t a restriction, it\'s the map to nourish my body with the elegance and love it deserves."',
                '"Nourishing your glow today. One step at a time, with love and awareness."',
                '"You\'re doing amazing. Your body is your temple."',
                '"Almost at your goal, queen. Keep giving your body the best."',
                '"Goal reached! Your body appreciates all this energy and constant care."'
            ]
        }
    };

    // Set initial stroke-dasharray and offset
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;

    // --- Core Functions ---
    const updateDate = () => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const today = new Date();
        const locale = currentLang === 'es' ? 'es-ES' : 'en-US';
        let dateString = today.toLocaleDateString(locale, options);
        // Capitalize first letter
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        dateDisplay.textContent = dateString;
    };

    const updateProgress = () => {
        // Calculate progress percentage
        let percentage = (totalCalories / goalCalories) * 100;
        const cappedPercentage = Math.min(percentage, 100);
        
        // Update circle offset
        const offset = circumference - (cappedPercentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        
        // Update text
        percentageText.textContent = `${Math.round(percentage)}%`;
        currentCaloriesText.textContent = totalCalories.toLocaleString();

        // Update Macros
        const protein = Math.round((totalCalories * 0.30) / 4);
        const carbs = Math.round((totalCalories * 0.40) / 4);
        const fats = Math.round((totalCalories * 0.30) / 9);

        proteinValue.textContent = `${protein}g`;
        carbsValue.textContent = `${carbs}g`;
        fatsValue.textContent = `${fats}g`;

        // Update Phrase based on language and progress
        const phrases = dict[currentLang].phrases;
        if (totalCalories === 0) {
            motivationalPhrase.textContent = phrases[0];
        } else if (percentage < 30) {
            motivationalPhrase.textContent = phrases[1];
        } else if (percentage < 70) {
            motivationalPhrase.textContent = phrases[2];
        } else if (percentage < 100) {
            motivationalPhrase.textContent = phrases[3];
        } else {
            motivationalPhrase.textContent = phrases[4];
        }
    };

    const applyLanguage = (lang) => {
        currentLang = lang;
        const texts = dict[lang];
        
        labelCalories.textContent = texts.calories;
        calorieInput.placeholder = texts.addKcal;
        labelProtein.textContent = texts.protein;
        labelCarbs.textContent = texts.carbs;
        labelFats.textContent = texts.fats;
        
        settingsTitle.textContent = texts.settingsTitle;
        labelTheme.textContent = texts.theme;
        labelFont.textContent = texts.font;
        labelLang.textContent = texts.lang;
        
        updateDate();
        updateProgress(); // Recalculate phrase
    };

    // --- Init ---
    applyLanguage('es');

    // --- Action Event Listeners ---
    addBtn.addEventListener('click', () => {
        const addedValue = parseInt(calorieInput.value);
        if (!isNaN(addedValue) && addedValue > 0) {
            totalCalories += addedValue;
            updateProgress();
            calorieInput.value = ''; // Clear input
        }
    });

    calorieInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    resetBtn.addEventListener('click', () => {
        totalCalories = 0;
        updateProgress();
    });

    // --- Settings Event Listeners ---
    settingsToggleBtn.addEventListener('click', () => {
        settingsPanel.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });

    // Theme Switch
    colorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            colorDots.forEach(d => d.classList.remove('active'));
            e.target.classList.add('active');
            const theme = e.target.getAttribute('data-color');
            if (theme === 'pink') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }
        });
    });

    // Font Switch
    fontBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            fontBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const fontChoice = e.target.getAttribute('data-font');
            if (fontChoice === 'sans') {
                document.documentElement.style.setProperty('--font-serif', "'Inter', sans-serif");
            } else if (fontChoice === 'soft') {
                document.documentElement.style.setProperty('--font-serif', "'Quicksand', sans-serif");
            } else if (fontChoice === 'script') {
                document.documentElement.style.setProperty('--font-serif', "'Caveat', cursive");
            } else {
                document.documentElement.style.setProperty('--font-serif', "'Playfair Display', serif");
            }
        });
    });

    // Language Switch
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            langBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyLanguage(e.target.getAttribute('data-lang'));
        });
    });
});
