const translations = {
    "en": {
        // Portfolio Main
        "nav_about": "About",
        "nav_skills": "Skills",
        "nav_projects": "Projects",
        "nav_games": "Games",
        "nav_challenges": "Challenges",
        "hero_greeting": "Hello, I'm",
        "hero_title": "I build things for the web.",
        "hero_bio": "I'm a software developer passionate about building scalable, accessible, and human-centered digital products. I specialize in modern web technologies and continuous learning.",
        "hero_btn_work": "View My Work",
        "hero_btn_github": "GitHub Profile",
        "skills_title": "Technical Arsenal",
        "skills_frontend": "Frontend Development",
        "skills_backend": "Backend & Mobile",
        "skills_tools": "Tools & Workflows",
        "projects_title": "Open Source Projects",
        "footer_text": "© 2026 Barış Taş. Designed & built from scratch.",
        "game_try_catch": "Try Catch Errors",
        "game_terminal": "Terminal Runner",
        
        // Games
        "lang_toggle": "TR",
        "back_home": "Home",
        "diff_easy": "EASY",
        "diff_normal": "NORMAL",
        "diff_hard": "HARD",
        
        // Try Catch Errors
        "tce_title": "TRY CATCH ERRORS",
        "tce_desc": "Errors are attacking your server! Quickly type the exact code/error to catch and destroy them.",
        "tce_start": "Press 'ENTER' to Start",
        "tce_gameover": "SYSTEM CRASHED",
        "tce_final_score": "Caught Errors: ",
        "tce_restart": "Press 'ENTER' to Reboot",
        "tce_score": "SCORE: ",
        "tce_integrity": "INTEGRITY: ",
        "tce_high_score": "BEST: ",
        
        // Terminal Runner
        "tr_title": "TERMINAL RUNNER",
        "tr_desc": "Run from the errors! Press 'SPACE' or click to jump.",
        "tr_start": "Press 'SPACE' to Start",
        "tr_gameover": "KERNEL PANIC",
        "tr_final_uptime": "Connection Lost. Uptime: ",
        "tr_restart": "Press 'SPACE' to Reboot",
        "tr_uptime": "UPTIME: ",
        "tr_high_uptime": "BEST UPTIME: ",
        "tr_status_online": "STATUS: ONLINE",
        "tr_status_running": "STATUS: RUNNING",
        "tr_status_crashed": "STATUS: CRASHED",
        "tr_build": "BUILD COMPLETED"
    },
    "tr": {
        // Portfolio Main
        "nav_about": "Hakkımda",
        "nav_skills": "Yetenekler",
        "nav_projects": "Projeler",
        "nav_games": "Oyunlar",
        "nav_challenges": "Görevler",
        "hero_greeting": "Merhaba, ben",
        "hero_title": "Web için bir şeyler inşa ediyorum.",
        "hero_bio": "Ölçeklenebilir, erişilebilir ve insan odaklı dijital ürünler geliştirmeye tutkulu bir yazılım geliştiricisiyim. Modern web teknolojilerinde uzmanım.",
        "hero_btn_work": "Çalışmalarım",
        "hero_btn_github": "GitHub Profili",
        "skills_title": "Teknik Cephanelik",
        "skills_frontend": "Önyüz Geliştirme",
        "skills_backend": "Arkayüz & Mobil",
        "skills_tools": "Araçlar & İş Akışları",
        "projects_title": "Açık Kaynak Projeler",
        "footer_text": "© 2026 Barış Taş. Sıfırdan tasarlandı ve kodlandı.",
        "game_try_catch": "Try Catch Errors",
        "game_terminal": "Terminal Runner",
        
        // Games
        "lang_toggle": "EN",
        
        // Try Catch Errors
        "tce_title": "TRY CATCH ERRORS",
        "tce_desc": "Hatalar sunucuna saldırıyor! Onları yakalamak için ekrandaki kodları klavyeyle hızlıca yaz.",
        "tce_start": "Başlamak için 'ENTER' tuşuna bas",
        "tce_gameover": "SİSTEM ÇÖKTÜ",
        "tce_final_score": "Yakalanan Hatalar: ",
        "tce_restart": "Yeniden başlatmak için 'ENTER' tuşuna bas",
        "tce_score": "SKOR: ",
        "tce_integrity": "SAĞLAMLIK: ",
        "tce_high_score": "EN İYİ: ",
        
        // Terminal Runner
        "tr_title": "TERMINAL RUNNER",
        "tr_desc": "Hatalardan kaç! Zıplamak için 'BOŞLUK' tuşuna bas veya tıkla.",
        "tr_start": "Başlamak için 'BOŞLUK' tuşuna bas",
        "tr_gameover": "ÇEKİRDEK PANİĞİ (KERNEL PANIC)",
        "tr_final_uptime": "Bağlantı Koptu. Açık Kalma Süresi: ",
        "tr_restart": "Yeniden başlatmak için 'BOŞLUK' tuşuna bas",
        "tr_uptime": "SÜRE: ",
        "tr_high_uptime": "EN İYİ SÜRE: ",
        "tr_status_online": "DURUM: ÇEVRİMİÇİ",
        "tr_status_running": "DURUM: ÇALIŞIYOR",
        "tr_status_crashed": "DURUM: ÇÖKTÜ",
        "tr_build": "DERLEME TAMAMLANDI"
    }
};

let currentLang = localStorage.getItem('site_lang') || 'en';

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
    
    // Update toggle button text if exists
    const toggleBtn = document.getElementById('lang-toggle');
    if(toggleBtn) {
        toggleBtn.innerText = translations[currentLang]['lang_toggle'];
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'tr' : 'en';
    localStorage.setItem('site_lang', currentLang);
    applyTranslations();
    
    // Dispatch custom event for games that might need programmatic translation
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

function initI18n() {
    applyTranslations();
    const toggleBtn = document.getElementById('lang-toggle');
    if(toggleBtn) {
        // Remove existing listener to prevent duplicates if called twice
        const newBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLanguage();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}

// Helper for dynamic JS translations
window.t = function(key) {
    return translations[currentLang][key] || key;
};