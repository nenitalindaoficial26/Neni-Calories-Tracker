document.addEventListener('DOMContentLoaded', () => {
    // --- Translations & Quotes ---
    const i18n = {
        es: {
            title: "Neni Calories Tracker",
            home: "Inicio",
            stats: "Stats",
            diary: "Diario",
            settings: "Ajustes",
            calories: "CALORÍAS",
            protein: "PROTEÍNA",
            carbs: "CARBS",
            fats: "GRASAS",
            summary: "RESUMEN DE HOY",
            consumed: "Calorías consumidas",
            remaining: "Faltan",
            goal_text: "Meta: {0} kcal",
            remaining_text: "para tu meta",
            recent: "COMIDAS RECIENTES",
            no_meals: "Aún no has añadido comidas.",
            weekly: "CALORÍAS SEMANALES",
            streak: "RACHA ACTUAL",
            days: "DÍAS",
            habits: "HÁBITOS SALUDABLES",
            water: "💧 Agua",
            veggies: "🥗 Vegetales",
            steps: "🏃 Pasos",
            appearance: "APARIENCIA",
            dark_mode: "Modo Oscuro",
            language: "Idioma",
            theme_color: "Color de Tema",
            health_goals: "METAS DE SALUD",
            goal_cal: "Meta Calorías",
            weight: "Peso (kg)",
            data_mgmt: "GESTIÓN DE DATOS",
            reset_all: "Reiniciar todo",
            add_meal: "Añadir Comida",
            meal_name: "Nombre de la comida",
            calories_form: "Calorías (kcal)",
            save: "GUARDAR",
            quick_add: "Añadir kcal rápida...",
            kcal_today: "{0} kcal hoy"
        },
        en: {
            title: "Neni Calories Tracker",
            home: "Home",
            stats: "Stats",
            diary: "Diary",
            settings: "Settings",
            calories: "CALORIES",
            protein: "PROTEIN",
            carbs: "CARBS",
            fats: "FATS",
            summary: "TODAY'S SUMMARY",
            consumed: "Calories consumed",
            remaining: "Remaining",
            goal_text: "Goal: {0} kcal",
            remaining_text: "to reach goal",
            recent: "RECENT MEALS",
            no_meals: "No meals added yet.",
            weekly: "WEEKLY CALORIES",
            streak: "CURRENT STREAK",
            days: "DAYS",
            habits: "HEALTHY HABITS",
            water: "💧 Water",
            veggies: "🥗 Veggies",
            steps: "🏃 Steps",
            appearance: "APPEARANCE",
            dark_mode: "Dark Mode",
            language: "Language",
            theme_color: "Theme Color",
            health_goals: "HEALTH GOALS",
            goal_cal: "Calorie Goal",
            weight: "Weight (kg)",
            data_mgmt: "DATA MANAGEMENT",
            reset_all: "Reset all data",
            add_meal: "Add Meal",
            meal_name: "Meal Name",
            calories_form: "Calories (kcal)",
            save: "SAVE",
            quick_add: "Quick add kcal...",
            kcal_today: "{0} kcal today"
        }
    };

    const quotes = {
        es: [
            "Contar mis calorías no es una restricción, es el mapa para nutrir mi cuerpo con la elegancia y el amor que merece.",
            "La disciplina es el acto más alto de amor propio.",
            "Tu cuerpo es tu templo, nùtrelo con gracia.",
            "Pequeños pasos, grandes cambios. La constancia es la clave.",
            "Bienestar es sentirte bien en tu propia piel.",
            "Nutre tu alma, el resto vendrá por añadidura.",
            "Hoy elijo ser la mejor versión de mí misma."
        ],
        en: [
            "Counting my calories isn't a restriction, it's the map to nourish my body with the elegance and love it deserves.",
            "Discipline is the ultimate act of self-love.",
            "Your body is your temple, nourish it with grace.",
            "Small steps, big changes. Consistency is key.",
            "Wellness is feeling good in your own skin.",
            "Nourish your soul, and everything else will follow.",
            "Today I choose to be the best version of myself."
        ]
    };

    // --- State Management ---
    let state = {
        lang: 'es',
        darkMode: false,
        themeColor: 'pink',
        customColor: '#F69AB6',
        mainFont: 'Inter',
        goal: 2000,
        weight: 62,
        meals: [],
        habits: { water: false, veggies: false, steps: false },
        streak: 7,
        lastQuoteIndex: 0,
        lastQuoteTime: 0
    };

    // Load from LocalStorage
    const loadState = () => {
        const saved = localStorage.getItem('neni_wellness_state');
        if (saved) {
            state = { ...state, ...JSON.parse(saved) };
        }
    };

    const saveState = () => {
        localStorage.setItem('neni_wellness_state', JSON.stringify(state));
    };

    // --- Elements ---
    const el = (id) => document.getElementById(id);
    const elements = {
        body: document.body,
        pages: document.querySelectorAll('.page'),
        navItems: document.querySelectorAll('.nav-item'),
        themeToggle: el('theme-toggle-btn'),
        darkModeSwitch: el('dark-mode-switch'),
        langBtns: document.querySelectorAll('.lang-btn'),
        fontBtns: document.querySelectorAll('.font-btn'),
        colorDots: document.querySelectorAll('.color-dot'),
        customColorDot: el('custom-color-dot'),
        customColorPicker: el('custom-color-picker'),
        
        goalInput: el('goal-input'),
        weightInput: el('weight-input'),
        resetBtn: el('reset-data-btn'),
        
        quickAddInput: el('quick-calorie-input'),
        quickAddBtn: el('quick-add-btn'),
        openModalBtn: el('open-modal-btn'),
        closeModalBtn: el('close-modal-btn'),
        mealModal: el('meal-modal'),
        saveMealBtn: el('save-meal-btn'),
        
        timeline: el('timeline-container'),
        recentMeals: el('recent-meals-container'),
        weeklyChart: el('weekly-chart'),
        quoteText: el('quote-text'),
        dateDisplay: el('date-display'),
        
        progressCircle: el('progress-circle'),
        percentageText: el('percentage-text'),
        currentCaloriesText: el('current-calories'),
        goalCaloriesText: el('goal-calories'),
        badgeText: el('badge-text'),
        
        proteinVal: el('protein-value'),
        carbsVal: el('carbs-value'),
        fatsVal: el('fats-value'),
        proteinBar: el('protein-bar'),
        carbsBar: el('carbs-bar'),
        fatsBar: el('fats-bar'),
        proteinPct: el('protein-percent'),
        carbsPct: el('carbs-percent'),
        fatsPct: el('fats-percent'),
        
        summaryCurrent: el('summary-current'),
        summaryRemain: el('summary-remain'),
        streakNum: el('streak-num'),
        sparkles: el('sparkles-container')
    };

    // --- Render Engine ---
    const updateUI = () => {
        const dict = i18n[state.lang];
        
        // Text Content
        el('main-title').textContent = dict.title;
        el('nav-home').textContent = dict.home;
        el('nav-stats').textContent = dict.stats;
        el('nav-diary').textContent = dict.diary;
        el('nav-settings').textContent = dict.settings;
        el('label-calories').textContent = dict.calories;
        el('macro-protein').textContent = dict.protein;
        el('macro-carbs').textContent = dict.carbs;
        el('macro-fats').textContent = dict.fats;
        el('label-summary').textContent = dict.summary;
        el('label-consumed').textContent = dict.consumed;
        el('label-remaining').textContent = dict.remaining;
        el('label-goal-text').textContent = dict.goal_text.replace('{0}', state.goal.toLocaleString());
        el('label-remaining-text').textContent = dict.remaining_text;
        el('label-recent').textContent = dict.recent;
        el('label-weekly').textContent = dict.weekly;
        el('label-streak').textContent = dict.streak;
        el('label-days').textContent = dict.days;
        el('label-habits').textContent = dict.habits;
        el('label-water').textContent = dict.water;
        el('label-veggies').textContent = dict.veggies;
        el('label-steps').textContent = dict.steps;
        el('label-appearance').textContent = dict.appearance;
        el('label-dark-mode').textContent = dict.dark_mode;
        el('label-language').textContent = dict.language;
        el('label-theme-color').textContent = dict.theme_color;
        el('label-health-goals').textContent = dict.health_goals;
        el('label-goal-cal').textContent = dict.goal_cal;
        el('label-weight').textContent = dict.weight;
        el('label-data-management').textContent = dict.data_mgmt;
        el('label-reset-all').textContent = dict.reset_all;
        el('label-add-meal-title').textContent = dict.add_meal;
        el('label-meal-name').textContent = dict.meal_name;
        el('label-calories-form').textContent = dict.calories_form;
        el('save-meal-btn').textContent = dict.save;
        elements.quickAddInput.placeholder = dict.quick_add;

        // Theme & Color
        elements.body.classList.toggle('dark-mode', state.darkMode);
        if (elements.darkModeSwitch) elements.darkModeSwitch.classList.toggle('active', state.darkMode);
        
        const colors = { 
            pink: '#F69AB6', 
            matcha: '#A8D5BA', 
            lavender: '#B4AEE8',
            cream: '#FDF5E6',
            grey: '#B2B2B2',
            peach: '#FFCCB6',
            sky: '#B3E5FC',
            mint: '#C1E1C1',
            yellow: '#FFF9C4'
        };
        const activeColor = state.themeColor === 'custom' ? state.customColor : colors[state.themeColor];
        document.documentElement.style.setProperty('--primary-pink', activeColor);
        document.documentElement.style.setProperty('--primary-glow', activeColor + '66'); // 40% alpha

        // Settings Toggles
        elements.langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === state.lang));
        elements.fontBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.font === state.mainFont));
        elements.colorDots.forEach(dot => dot.classList.toggle('active', dot.dataset.color === state.themeColor));
        
        // Apply Font
        document.documentElement.style.setProperty('--main-font', `'${state.mainFont}', sans-serif`);
        if (state.mainFont === 'Playfair Display') document.documentElement.style.setProperty('--main-font', `'Playfair Display', serif`);
        if (state.mainFont === 'Caveat') document.documentElement.style.setProperty('--main-font', `'Caveat', cursive`);
        if (state.mainFont === 'Dancing Script') document.documentElement.style.setProperty('--main-font', `'Dancing Script', cursive`);

        // Date
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        elements.dateDisplay.textContent = now.toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', options).toUpperCase();

        renderProgress();
        renderDiary();
        renderRecentMeals();
        renderWeeklyChart();
        renderHabits();
        renderQuote();
    };

    const renderProgress = () => {
        const totalCals = state.meals.reduce((acc, m) => acc + (m.kcal || 0), 0);
        const totalProt = state.meals.reduce((acc, m) => acc + (m.prot || 0), 0);
        const totalCarbs = state.meals.reduce((acc, m) => acc + (m.carbs || 0), 0);
        const totalFats = state.meals.reduce((acc, m) => acc + (m.fats || 0), 0);

        const pct = Math.min(100, Math.round((totalCals / state.goal) * 100)) || 0;
        const circ = 100 * 2 * Math.PI;
        const offset = circ - (pct / 100) * circ;

        elements.progressCircle.style.strokeDasharray = `${circ} ${circ}`;
        elements.progressCircle.style.strokeDashoffset = offset;
        elements.percentageText.textContent = `${pct}%`;
        elements.currentCaloriesText.textContent = totalCals.toLocaleString();
        elements.goalCaloriesText.textContent = state.goal.toLocaleString();
        elements.summaryCurrent.textContent = totalCals.toLocaleString();
        elements.summaryRemain.textContent = Math.max(0, state.goal - totalCals).toLocaleString();
        elements.badgeText.textContent = i18n[state.lang].kcal_today.replace('{0}', totalCals.toLocaleString());
        elements.streakNum.textContent = state.streak;

        // Macros
        elements.proteinVal.textContent = `${totalProt}g`;
        elements.carbsVal.textContent = `${totalCarbs}g`;
        elements.fatsVal.textContent = `${totalFats}g`;

        // Macro Goals (simplified logic: 30/40/30 of cal goal)
        const protGoal = (state.goal * 0.3) / 4;
        const carbGoal = (state.goal * 0.4) / 4;
        const fatGoal = (state.goal * 0.3) / 9;

        const protPct = Math.min(100, Math.round((totalProt / protGoal) * 100));
        const carbPct = Math.min(100, Math.round((totalCarbs / carbGoal) * 100));
        const fatPct = Math.min(100, Math.round((totalFats / fatGoal) * 100));

        elements.proteinBar.style.width = `${protPct}%`;
        elements.carbsBar.style.width = `${carbPct}%`;
        elements.fatsBar.style.width = `${fatPct}%`;

        elements.proteinPct.textContent = `${protPct}%`;
        elements.carbsPct.textContent = `${carbPct}%`;
        elements.fatsPct.textContent = `${fatPct}%`;
    };

    const renderDiary = () => {
        elements.timeline.innerHTML = '';
        state.meals.slice().reverse().forEach(meal => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="time">${meal.time}</div>
                <div class="meal-details">
                    <strong>${meal.name}</strong>
                    <span>P: ${meal.prot}g | C: ${meal.carbs}g | F: ${meal.fats}g</span>
                </div>
                <div class="kcal-tag">+${meal.kcal} kcal</div>
                <button class="delete-meal-btn" data-id="${meal.id}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            elements.timeline.appendChild(item);
        });
        
        // Re-attach delete listeners
        document.querySelectorAll('.delete-meal-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                state.meals = state.meals.filter(m => m.id != id);
                saveState();
                updateUI();
            };
        });
    };

    const renderRecentMeals = () => {
        const container = elements.recentMeals;
        if (state.meals.length === 0) {
            container.innerHTML = `<div class="meals-placeholder"><div class="dish-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg></div><p>${i18n[state.lang].no_meals}</p></div>`;
            return;
        }
        
        container.innerHTML = '<div class="summary-list"></div>';
        const list = container.querySelector('.summary-list');
        state.meals.slice(-3).reverse().forEach(meal => {
            const div = document.createElement('div');
            div.className = 'summary-item';
            div.innerHTML = `
                <div class="item-text"><p>${meal.name}</p><small>${meal.time}</small></div>
                <span class="item-val">${meal.kcal} kcal</span>
            `;
            list.appendChild(div);
        });
    };

    const renderWeeklyChart = () => {
        elements.weeklyChart.innerHTML = '';
        const days = state.lang === 'es' ? ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0
        
        // Mock data for weekly chart based on today's calories
        const currentCals = state.meals.reduce((acc, m) => acc + (m.kcal || 0), 0);
        const weeklyData = [1800, 2100, currentCals, 1950, 2200, 1600, 1400]; // Mocking other days
        
        days.forEach((day, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'bar-wrapper';
            const h = Math.min(100, (weeklyData[i] / state.goal) * 100);
            wrapper.innerHTML = `
                <div class="bar ${i === todayIdx ? 'active' : ''}" style="height: ${h}%" title="${weeklyData[i]} kcal"></div>
                <span class="bar-label">${day}</span>
            `;
            elements.weeklyChart.appendChild(wrapper);
        });
    };

    const renderHabits = () => {
        document.querySelectorAll('.check').forEach(check => {
            const habit = check.dataset.habit;
            check.classList.toggle('done', state.habits[habit]);
            check.onclick = () => {
                state.habits[habit] = !state.habits[habit];
                saveState();
                updateUI();
            };
        });
    };

    const renderQuote = () => {
        const now = Date.now();
        const thirtyMins = 30 * 60 * 1000;
        
        if (now - state.lastQuoteTime > thirtyMins || !state.lastQuoteTime) {
            state.lastQuoteIndex = (state.lastQuoteIndex + 1) % quotes[state.lang].length;
            state.lastQuoteTime = now;
            saveState();
        }
        
        const q = quotes[state.lang][state.lastQuoteIndex];
        // Split for aesthetic styling if needed
        elements.quoteText.innerHTML = q;
    };

    // --- Interaction Logic ---
    
    // Page Switching
    elements.navItems.forEach(item => {
        item.onclick = () => {
            const pageId = item.dataset.page;
            elements.navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            elements.pages.forEach(p => {
                p.classList.toggle('active', p.id === `page-${pageId}`);
            });
        };
    });

    // Theme Toggle
    const toggleTheme = () => {
        state.darkMode = !state.darkMode;
        saveState();
        updateUI();
    };
    if (elements.themeToggle) elements.themeToggle.onclick = toggleTheme;
    if (elements.darkModeSwitch) elements.darkModeSwitch.onclick = toggleTheme;

    // Language Toggle
    elements.langBtns.forEach(btn => {
        btn.onclick = () => {
            state.lang = btn.dataset.lang;
            saveState();
            updateUI();
        };
    });

    // Font Toggle
    elements.fontBtns.forEach(btn => {
        btn.onclick = () => {
            state.mainFont = btn.dataset.font;
            saveState();
            updateUI();
        };
    });

    // Color Customization
    elements.colorDots.forEach(dot => {
        dot.onclick = (e) => {
            const color = dot.dataset.color;
            if (color === 'custom') {
                elements.customColorPicker.click();
            } else {
                state.themeColor = color;
                saveState();
                updateUI();
            }
        };
    });

    elements.customColorPicker.oninput = (e) => {
        state.themeColor = 'custom';
        state.customColor = e.target.value;
        elements.customColorDot.style.background = e.target.value;
        saveState();
        updateUI();
    };

    // Goals & Data
    elements.goalInput.onchange = (e) => { state.goal = parseInt(e.target.value) || 2000; saveState(); updateUI(); };
    elements.weightInput.onchange = (e) => { state.weight = parseInt(e.target.value) || 62; saveState(); updateUI(); };
    elements.resetBtn.onclick = () => {
        if (confirm("¿Estás segura de borrar todos tus datos?")) {
            state.meals = [];
            state.habits = { water: false, veggies: false, steps: false };
            saveState();
            updateUI();
        }
    };

    // Quick Add
    const quickAdd = () => {
        const val = parseInt(elements.quickAddInput.value);
        if (val > 0) {
            addMeal("Quick Add", val, Math.round(val*0.1), Math.round(val*0.1), Math.round(val*0.05));
            elements.quickAddInput.value = '';
        }
    };
    elements.quickAddBtn.onclick = quickAdd;
    elements.quickAddInput.onkeypress = (e) => { if (e.key === 'Enter') quickAdd(); };

    // Modal Meal Management
    elements.openModalBtn.onclick = () => elements.mealModal.style.display = 'flex';
    elements.closeModalBtn.onclick = () => elements.mealModal.style.display = 'none';
    window.onclick = (e) => { if (e.target === elements.mealModal) elements.mealModal.style.display = 'none'; };

    const addMeal = (name, kcal, prot, carbs, fats) => {
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        const meal = {
            id: Date.now(),
            name: name || "Comida",
            kcal: parseInt(kcal) || 0,
            prot: parseInt(prot) || 0,
            carbs: parseInt(carbs) || 0,
            fats: parseInt(fats) || 0,
            time: time
        };
        state.meals.push(meal);
        saveState();
        updateUI();
        elements.mealModal.style.display = 'none';
    };

    elements.saveMealBtn.onclick = () => {
        const name = el('meal-name-input').value;
        const kcal = el('meal-calories-input').value;
        const prot = el('meal-protein-input').value;
        const carbs = el('meal-carbs-input').value;
        const fats = el('meal-fats-input').value;
        
        if (kcal > 0) {
            addMeal(name, kcal, prot, carbs, fats);
            // Reset inputs
            el('meal-name-input').value = '';
            el('meal-calories-input').value = '';
            el('meal-protein-input').value = 0;
            el('meal-carbs-input').value = 0;
            el('meal-fats-input').value = 0;
        }
    };

    // --- Sparkles ---
    const createSparkle = () => {
        if (!elements.sparkles) return;
        const s = document.createElement('div');
        s.className = 'sparkle';
        const size = Math.random() * 4 + 3;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 100}%`;
        s.style.animationDuration = `${Math.random() * 2 + 3}s`;
        elements.sparkles.appendChild(s);
        setTimeout(() => s.remove(), 4000);
    };
    setInterval(createSparkle, 500);

    // --- Init ---
    loadState();
    // Update goal input values to match state
    elements.goalInput.value = state.goal;
    elements.weightInput.value = state.weight;
    updateUI();

    // Set interval for quote rotation check
    setInterval(renderQuote, 1000 * 60); // Check every minute
});

