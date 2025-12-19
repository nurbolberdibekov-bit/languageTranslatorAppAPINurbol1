// Get DOM elements
const fromText = document.getElementById("from-text");
const toText = document.getElementById("to-text");
const swapIcon = document.getElementById("swap-languages");
const translateBtn = document.getElementById("translate-btn");
const clearInput = document.getElementById("clear-input");
const micBtn = document.getElementById("mic-btn");
const speakInput = document.getElementById("speak-input");
const speakOutput = document.getElementById("speak-output");
const copyOutput = document.getElementById("copy-output");
const shareOutput = document.getElementById("share-output");
const favoriteOutput = document.getElementById("favorite-output");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const darkModeIcon = document.getElementById("dark-mode-icon");
const langModal = document.getElementById("lang-modal");
const closeModal = document.getElementById("close-modal");
const langList = document.getElementById("lang-list");
const searchLang = document.getElementById("search-lang");
const fromLangName = document.getElementById("from-lang-name");
const toLangName = document.getElementById("to-lang-name");
const inputLangName = document.getElementById("input-lang-name");
const outputLangName = document.getElementById("output-lang-name");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");

// Get flag URL from language code
function getFlagUrl(langCode) {
    // Extract country code from language code (e.g., "en-GB" -> "gb", "es-ES" -> "es")
    const parts = langCode.split("-");
    if (parts.length >= 2) {
        const countryCode = parts[1].toLowerCase();
        return `https://flagcdn.com/w40/${countryCode}.png`;
    }
    // Fallback for codes without country
    return "https://flagcdn.com/w40/us.png";
}

// Current language selection
let currentFromLang = "en-GB";
let currentToLang = "es-ES";
let currentLangSelector = null;

// Initialize
function init() {
    // Populate select elements (original logic)
    [fromSelect, toSelect].forEach((select, id) => {
        for (let country_code in countries) {
            let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "es-ES" ? "selected" : "";
            let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
            select.insertAdjacentHTML("beforeend", option);
        }
    });
    
    // Set initial languages
    updateLanguageDisplay();
    
    // Load dark mode preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        updateDarkModeIcon(savedTheme === "dark");
    }
    
    // Populate language list
    populateLanguageList();
}

// Update language display
function updateLanguageDisplay() {
    // Sync select elements with current language variables
    if (fromSelect) fromSelect.value = currentFromLang;
    if (toSelect) toSelect.value = currentToLang;
    
    const fromLangName_text = countries[currentFromLang] || "English";
    const toLangName_text = countries[currentToLang] || "Spanish";
    
    fromLangName.textContent = fromLangName_text;
    toLangName.textContent = toLangName_text;
    inputLangName.textContent = fromLangName_text;
    outputLangName.textContent = toLangName_text;
    fromFlag.src = getFlagUrl(currentFromLang);
    toFlag.src = getFlagUrl(currentToLang);
}

// Populate language list in modal
function populateLanguageList(filter = "") {
    langList.innerHTML = "";
    const filterLower = filter.toLowerCase();
    
    for (let code in countries) {
        const langName = countries[code];
        if (filterLower && !langName.toLowerCase().includes(filterLower)) continue;
        
        const flagUrl = getFlagUrl(code);
        
        const langOption = document.createElement("div");
        langOption.className = "lang-option";
        langOption.innerHTML = `
            <img src="${flagUrl}" alt="${langName}" onerror="this.src='https://flagcdn.com/w40/us.png'">
            <span>${langName}</span>
        `;
        langOption.addEventListener("click", () => selectLanguage(code));
        langList.appendChild(langOption);
    }
}

// Select language
function selectLanguage(code) {
    if (currentLangSelector === "from") {
        currentFromLang = code;
        if (fromSelect) fromSelect.value = code;
    } else if (currentLangSelector === "to") {
        currentToLang = code;
        if (toSelect) toSelect.value = code;
    }
    updateLanguageDisplay();
    closeLanguageModal();
}

// Open language modal
function openLanguageModal(selector) {
    currentLangSelector = selector;
    langModal.classList.add("show");
}

// Close language modal
function closeLanguageModal() {
    langModal.classList.remove("show");
    searchLang.value = "";
    populateLanguageList();
}

// Swap languages (original logic)
swapIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = fromSelect.value;
    fromText.value = toText.value;
    toText.value = tempText;
    fromSelect.value = toSelect.value;
    toSelect.value = tempLang;
    
    // Update current language variables
    currentFromLang = fromSelect.value;
    currentToLang = toSelect.value;
    
    updateLanguageDisplay();
});

// Language selection
fromLangName.parentElement.addEventListener("click", () => openLanguageModal("from"));
toLangName.parentElement.addEventListener("click", () => openLanguageModal("to"));
fromFlag.parentElement.addEventListener("click", () => openLanguageModal("from"));
toFlag.parentElement.addEventListener("click", () => openLanguageModal("to"));

// Close modal
closeModal.addEventListener("click", closeLanguageModal);
langModal.addEventListener("click", (e) => {
    if (e.target === langModal) closeLanguageModal();
});

// Search languages
searchLang.addEventListener("input", (e) => {
    populateLanguageList(e.target.value);
});

// Clear input
clearInput.addEventListener("click", () => {
    fromText.value = "";
    toText.value = "";
});

// Translate (original logic using select elements)
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = fromSelect.value;
    let translateTo = toSelect.value;
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});

// Auto translate on input
fromText.addEventListener("input", () => {
    if (!fromText.value) {
        toText.value = "";
        return;
    }
    // Optional: Auto-translate on typing (debounced)
    clearTimeout(fromText.translateTimeout);
    fromText.translateTimeout = setTimeout(() => {
        if (fromText.value.trim()) {
            translateBtn.click();
        }
    }, 1000);
});

// Speak input
speakInput.addEventListener("click", () => {
    if (!fromText.value) return;
    const utterance = new SpeechSynthesisUtterance(fromText.value);
    utterance.lang = fromSelect.value;
    speechSynthesis.speak(utterance);
});

// Speak output
speakOutput.addEventListener("click", () => {
    if (!toText.value) return;
    const utterance = new SpeechSynthesisUtterance(toText.value);
    utterance.lang = toSelect.value;
    speechSynthesis.speak(utterance);
});

// Microphone (voice input)
let recognition = null;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    micBtn.addEventListener("click", () => {
        if (recognition && !recognition.isListening) {
            recognition.lang = fromSelect.value;
            recognition.start();
            micBtn.style.background = "#ef4444";
            micBtn.innerHTML = '<i class="fas fa-stop"></i>';
        } else if (recognition && recognition.isListening) {
            recognition.stop();
            micBtn.style.background = "";
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        fromText.value = transcript;
        translateBtn.click();
        micBtn.style.background = "";
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.onerror = () => {
        micBtn.style.background = "";
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
    
    recognition.onend = () => {
        micBtn.style.background = "";
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
} else {
    micBtn.style.opacity = "0.5";
    micBtn.style.cursor = "not-allowed";
}

// Copy output
copyOutput.addEventListener("click", () => {
    if (!toText.value) return;
    navigator.clipboard.writeText(toText.value).then(() => {
        copyOutput.style.color = "#10b981";
        setTimeout(() => {
            copyOutput.style.color = "";
        }, 1000);
    });
});

// Share output
shareOutput.addEventListener("click", () => {
    if (!toText.value) return;
    if (navigator.share) {
        navigator.share({
            title: "Translation",
            text: toText.value
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(toText.value);
        shareOutput.style.color = "#10b981";
        setTimeout(() => {
            shareOutput.style.color = "";
        }, 1000);
    }
});

// Favorite
favoriteOutput.addEventListener("click", () => {
    favoriteOutput.classList.toggle("active");
    if (favoriteOutput.classList.contains("active")) {
        favoriteOutput.classList.remove("far");
        favoriteOutput.classList.add("fas");
    } else {
        favoriteOutput.classList.remove("fas");
        favoriteOutput.classList.add("far");
    }
});

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateDarkModeIcon(newTheme === "dark");
});

function updateDarkModeIcon(isDark) {
    if (isDark) {
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
    } else {
        darkModeIcon.classList.remove("fa-sun");
        darkModeIcon.classList.add("fa-moon");
    }
}

// Bottom navigation
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
    });
});

// Initialize app
init();
