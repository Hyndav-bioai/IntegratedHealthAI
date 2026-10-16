"use strict";

/* INTEGRATEDHEALTHAI CONSOLIDATED APPLICATION */

(function () {

    const STORAGE = {
        profile: "integratedhealthai_profile_v1",
        family: "integratedhealthai_family_v1",
        journey: "integratedhealthai_journey_v1"
    };

    const pageInfo = {
        dashboard: ["Dashboard", "Generations connected for a healthier tomorrow."],
        profile: ["My Profile", "Manage your personal information."],
        family: ["Family Members", "Manage connected family profiles."],
        care: ["Healthcare Connecting", "Explore different healthcare systems."],
        journey: ["My Health Journey", "Record personal notes and goals."],
        labs: ["Labs & Diagnostics", "Organize laboratory information."],
        records: ["Health Records", "Organize health documents."],
        wellness: ["Wellness & Lifestyle", "Build practical everyday habits."],
        nutrition: ["Advanced Nutrition", "Track meals and estimated nutritional intake."],
        mental: ["Mental Wellbeing", "Explore wellbeing support."],
        cycle: ["Cycle Tracking", "Organize cycle information."],
        explorer: ["Health Explorer", "Explore general health information."],
        ai: ["AI Health Support", "Patient-centred healthcare navigation."],
        age: ["Age-Wise Health Guide", "Explore health education by age."]
    };

    const healthcareSystems = [
        {
            id: "ayurveda",
            name: "Ayurveda",
            symbol: "",
            category: "Traditional Healthcare",
            description: "An Indian traditional healthcare system emphasizing individualized care, lifestyle, diet and traditional therapies."
        },
        {
            id: "modern",
            name: "Modern Medicine",
            symbol: "",
            category: "Evidence-Based Healthcare",
            description: "Healthcare based on contemporary medical science, clinical research and diagnostic assessment."
        },
        {
            id: "naturopathy",
            name: "Naturopathy",
            symbol: "",
            category: "Natural Health Approaches",
            description: "Lifestyle and natural approaches to supporting general health and wellbeing."
        },
        {
            id: "siddha",
            name: "Siddha",
            symbol: "",
            category: "Traditional Healthcare",
            description: "A traditional medical system originating in South India."
        },
        {
            id: "unani",
            name: "Unani",
            symbol: "",
            category: "Traditional Healthcare",
            description: "A traditional system of medicine incorporating individualized approaches to health."
        },
        {
            id: "yoga",
            name: "Yoga & Meditation",
            symbol: "",
            category: "Mind-Body Wellness",
            description: "Practices supporting movement, flexibility, relaxation and awareness."
        }
    ];

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function readStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Storage write error:", error);
            showToast("Could not save data in this browser.");
            return false;
        }
    }

    function showToast(message) {
        const toast = $("toast");
        toast.textContent = message;
        toast.style.display = "block";

        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(function () {
            toast.style.display = "none";
        }, 2600);
    }

    // NAVIGATION
    function showPage(pageId) {
        const target = $("page-" + pageId);
        if (!target || !pageInfo[pageId]) return;

        document.querySelectorAll(".page").forEach(function (page) {
            page.classList.remove("active");
        });

        target.classList.add("active");

        document.querySelectorAll(".nav-item").forEach(function (button) {
            button.classList.toggle("active", button.dataset.page === pageId);
        });

        $("page-title").textContent = pageInfo[pageId][0];
        $("page-subtitle").textContent = pageInfo[pageId][1];

        $("sidebar").classList.remove("open");

        if (pageId === "profile") loadProfile();
        if (pageId === "family") renderFamily();
        if (pageId === "care") renderCare();
        if (pageId === "journey") renderJourney();
        if (pageId === "dashboard") updateDashboard();

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.querySelectorAll("[data-page]").forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.page);
        });
    });

    document.querySelectorAll("[data-go]").forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.go);
        });
    });

    $("menu-toggle").addEventListener("click", function () {
        $("sidebar").classList.toggle("open");
    });

    // MY PROFILE
    function getProfile() {
        return readStorage(STORAGE.profile, {});
    }

    function loadProfile() {
        const profile = getProfile();

        const fields = {
            "p-name": "name",
            "p-dob": "dob",
            "p-gender": "gender",
            "p-blood": "blood",
            "p-email": "email",
            "p-phone": "phone",
            "p-city": "city",
            "p-healthcare": "healthcare",
            "p-allergies": "allergies",
            "p-emergency": "emergency",
            "p-emergency-phone": "emergencyPhone"
        };

        Object.entries(fields).forEach(function ([id, key]) {
            $(id).value = profile[key] || "";
        });
    }

    $("profile-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const profile = {
            name: $("p-name").value.trim(),
            dob: $("p-dob").value,
            gender: $("p-gender").value,
            blood: $("p-blood").value,
            email: $("p-email").value.trim(),
            phone: $("p-phone").value.trim(),
            city: $("p-city").value.trim(),
            healthcare: $("p-healthcare").value,
            allergies: $("p-allergies").value.trim(),
            emergency: $("p-emergency").value.trim(),
            emergencyPhone: $("p-emergency-phone").value.trim()
        };

        if (!profile.name) {
            $("profile-status").textContent = "Please enter your full name.";
            return;
        }

        if (writeStorage(STORAGE.profile, profile)) {
            $("profile-status").textContent = "Profile saved successfully.";
            updateDashboard();
            showToast("Profile saved.");
        }
    });

    $("profile-reset").addEventListener("click", function () {
        $("profile-form").reset();
        $("profile-status").textContent =
            "Form cleared. Previously saved profile information is unchanged.";
    });

    // FAMILY MEMBERS
    function getFamily() {
        const family = readStorage(STORAGE.family, []);
        return Array.isArray(family) ? family : [];
    }

    function resetFamilyForm() {
        $("family-form").reset();
        $("f-id").value = "";
        $("family-form-heading").textContent = "Add a family member";
        $("family-save").textContent = "Add Family Member";
        $("family-cancel").hidden = true;
    }

    function renderFamily() {
        const family = getFamily();

        $("family-count").textContent =
            family.length + (family.length === 1 ? " member" : " members");

        $("family-empty").hidden = family.length > 0;

        $("family-list").innerHTML = family.map(function (member) {
            const initial = (member.name || "?").trim().charAt(0).toUpperCase();

            return `
                <article class="family-card">
                    <div class="family-card-top">
                        <div class="avatar">${escapeHTML(initial)}</div>
                        <div>
                            <h3>${escapeHTML(member.name)}</h3>
                            <p>${escapeHTML(member.relation)}</p>
                        </div>
                    </div>

                    <p>Date of birth: ${escapeHTML(member.dob || "Not provided")}</p>
                    <p>Gender: ${escapeHTML(member.gender || "Not specified")}</p>
                    <p>Healthcare: ${escapeHTML(member.healthcare || "Not selected")}</p>

                    <div class="card-actions">
                        <button type="button" class="btn btn-secondary"
                            data-family-edit="${escapeHTML(member.id)}">Edit</button>
                        <button type="button" class="btn btn-secondary"
                            data-family-delete="${escapeHTML(member.id)}">Remove</button>
                    </div>
                </article>
            `;
        }).join("");

        updateDashboard();
    }

    $("family-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = $("f-name").value.trim();
        const relation = $("f-relation").value;
        const editingId = $("f-id").value;

        if (!name || !relation) {
            $("family-status").textContent =
                "Please enter a name and relationship.";
            return;
        }

        const family = getFamily();

        const member = {
            id: editingId || (
                window.crypto && crypto.randomUUID
                    ? crypto.randomUUID()
                    : String(Date.now()) + Math.random().toString(16).slice(2)
            ),
            name: name,
            relation: relation,
            dob: $("f-dob").value,
            gender: $("f-gender").value,
            healthcare: $("f-healthcare").value
        };

        let updated;

        if (editingId) {
            updated = family.map(function (existing) {
                return existing.id === editingId ? member : existing;
            });
        } else {
            updated = family.concat(member);
        }

        if (writeStorage(STORAGE.family, updated)) {
            $("family-status").textContent =
                editingId ? "Family member updated." : "Family member added.";

            resetFamilyForm();
            renderFamily();
            showToast(editingId ? "Family member updated." : "Family member added.");
        }
    });

    $("family-list").addEventListener("click", function (event) {
        const editButton = event.target.closest("[data-family-edit]");
        const deleteButton = event.target.closest("[data-family-delete]");

        if (editButton) {
            const member = getFamily().find(function (item) {
                return item.id === editButton.dataset.familyEdit;
            });

            if (!member) return;

            $("f-id").value = member.id;
            $("f-name").value = member.name || "";
            $("f-relation").value = member.relation || "";
            $("f-dob").value = member.dob || "";
            $("f-gender").value = member.gender || "";
            $("f-healthcare").value = member.healthcare || "Not selected";

            $("family-form-heading").textContent = "Edit family member";
            $("family-save").textContent = "Save Changes";
            $("family-cancel").hidden = false;
            $("family-status").textContent = "Editing " + member.name + ".";

            $("family-form-heading").scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (deleteButton) {
            const id = deleteButton.dataset.familyDelete;
            const member = getFamily().find(function (item) {
                return item.id === id;
            });

            if (!member) return;

            if (!window.confirm("Remove " + member.name + " from Family Members?")) {
                return;
            }

            const updated = getFamily().filter(function (item) {
                return item.id !== id;
            });

            if (writeStorage(STORAGE.family, updated)) {
                renderFamily();
                showToast("Family member removed.");
            }
        }
    });

    $("family-cancel").addEventListener("click", function () {
        resetFamilyForm();
        $("family-status").textContent = "";
    });

    // HEALTHCARE CONNECTING
    function renderCare(filter) {
        const query = (filter || $("care-search").value || "").trim().toLowerCase();

        const systems = healthcareSystems.filter(function (system) {
            return [
                system.name,
                system.category,
                system.description
            ].join(" ").toLowerCase().includes(query);
        });

        $("care-grid").hidden = false;
        $("care-detail").hidden = true;

        const careCardDetails = {
            ayurveda: {
                focus: "Individualized traditional healthcare, daily routines, diet and wellbeing.",
                approach: "A qualified practitioner may assess your health and discuss suitable traditional therapies and medicines.",
                remember: "Tell your practitioner about your current medicines, allergies and health conditions."
            },
            modern: {
                focus: "Prevention, medical assessment, diagnosis and evidence-based treatment.",
                approach: "Depending on your needs, care may include a consultation, physical examination, laboratory tests or referral.",
                remember: "Seek emergency care for severe or rapidly worsening symptoms."
            },
            unani: {
                focus: "A traditional system of medicine with individualized approaches to health and wellbeing.",
                approach: "A qualified practitioner may discuss your health history, lifestyle and appropriate traditional care.",
                remember: "Check practitioner qualifications and disclose all medicines you use."
            },
            siddha: {
                focus: "A traditional medical system originating in Tamil Nadu, with approaches to diet, lifestyle and therapeutic care.",
                approach: "Consult a qualified practitioner for an individual assessment and discussion of appropriate care.",
                remember: "Ask about the ingredients, safety and possible interactions of any prescribed products."
            },
            naturopathy: {
                focus: "Lifestyle, nutrition, physical activity, rest and general wellbeing.",
                approach: "Depending on the practitioner and service, guidance may include healthy routines and lifestyle support.",
                remember: "Do not delay necessary medical assessment or stop prescribed treatment without medical advice."
            },
            yoga: {
                focus: "Movement, breathing, relaxation, flexibility and mind-body awareness.",
                approach: "Sessions may include appropriately adapted postures, breathing practices and relaxation.",
                remember: "Tell the instructor about injuries or health limitations and avoid movements that cause pain."
            }
        };

        $("care-grid").innerHTML = systems.map(function (system) {
            const details = careCardDetails[system.id] || {
                focus: system.category,
                approach: system.description,
                remember: "Consult an appropriately qualified healthcare professional."
            };

            return `
                <article class="care-card care-info-card">
                    <div class="care-symbol">${system.symbol}</div>
                    <p class="help-text">${escapeHTML(system.category)}</p>
                    <h3>${escapeHTML(system.name)}</h3>

                    <p class="care-card-description">
                        ${escapeHTML(system.description)}
                    </p>

                    <div class="care-info-section">
                        <strong>Areas of focus</strong>
                        <p>${escapeHTML(details.focus)}</p>
                    </div>

                    <div class="care-info-section">
                        <strong>What to expect</strong>
                        <p>${escapeHTML(details.approach)}</p>
                    </div>

                    <div class="care-info-section care-info-note">
                        <strong>Good to know</strong>
                        <p>${escapeHTML(details.remember)}</p>
                    </div>

                    <button type="button" class="btn btn-secondary"
                        data-care-id="${escapeHTML(system.id)}">
                        Explore System ->
                    </button>
                </article>
            `;
        }).join("");

        if (!systems.length) {
            $("care-grid").innerHTML =
                '<div class="empty-state">No matching healthcare systems found.</div>';
        }
    }

    $("care-search").addEventListener("input", function () {
        renderCare($("care-search").value);
    });

    $("care-grid").addEventListener("click", function (event) {
        const button = event.target.closest("[data-care-id]");
        if (!button) return;

        const system = healthcareSystems.find(function (item) {
            return item.id === button.dataset.careId;
        });

        if (!system) return;

        $("care-grid").hidden = true;
        $("care-detail").hidden = false;

        $("care-detail-content").innerHTML = `
            <div class="care-symbol">${system.symbol}</div>
            <div class="eyebrow">${escapeHTML(system.category)}</div>
            <h2>${escapeHTML(system.name)}</h2>
            <p>${escapeHTML(system.description)}</p>
            <div class="safety-note">
                <strong>Professional guidance</strong>
                <p>
                    Consult an appropriately qualified practitioner for personal
                    medical advice. This educational page does not diagnose,
                    prescribe or determine which system is medically suitable.
                </p>
            </div>
        `;
    });

    $("care-back").addEventListener("click", function () {
        $("care-detail").hidden = true;
        $("care-grid").hidden = false;
    });

    
// CARE CONNECTION HUB LOGIC
(function () {
    const locationInput = document.getElementById("care-location");
    const locationStatus = document.getElementById("care-location-status");
    const searchStatus = document.getElementById("care-search-status");
    const mapLink = document.getElementById("care-map-link");
    const locationButton = document.getElementById("care-use-location");

    if (!locationInput || !locationStatus || !searchStatus ||
        !mapLink || !locationButton) {
        console.error("Healthcare connection controls are missing.");
        return;
    }

    let coordinates = null;

    function performCareSearch(type) {
        let category = "";

        if (type === "practitioner") {
            category = document.getElementById("care-practitioner-system").value;
            const specialty =
                document.getElementById("care-practitioner-specialty").value.trim();

            if (specialty) category += " " + specialty;
        }

        if (type === "center") {
            category = document.getElementById("care-center-type").value;
        }

        if (type === "pharmacy") {
            category = document.getElementById("care-pharmacy-type").value;
        }

        const location = locationInput.value.trim();

        if (!coordinates && !location) {
            locationStatus.textContent =
                "Enter your city or PIN code, or use the current-location button.";
            locationInput.focus();
            return;
        }

        const destination = coordinates
            ? coordinates.latitude + "," + coordinates.longitude
            : location;

        const query = category + " near " + destination;

        const url = "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(query);

        mapLink.href = url;
        searchStatus.textContent =
            "Search prepared for " + query + ". Open Google Maps to view available listings.";

        window.open(url, "_blank", "noopener,noreferrer");
    }

    document.querySelectorAll("[data-care-search]").forEach(function (button) {
        button.addEventListener("click", function () {
            performCareSearch(button.dataset.careSearch);
        });
    });

    locationButton.addEventListener("click", function () {
        if (!navigator.geolocation) {
            locationStatus.textContent =
                "Location is unavailable in this browser. Enter a city or PIN code.";
            return;
        }

        locationButton.disabled = true;
        locationStatus.textContent = "Requesting location permission...";

        navigator.geolocation.getCurrentPosition(
            function (position) {
                coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                locationStatus.textContent =
                    "Location obtained. Choose a search button to continue.";
                locationButton.disabled = false;
            },
            function () {
                coordinates = null;
                locationStatus.textContent =
                    "Could not access location. Enter a city or PIN code instead.";
                locationButton.disabled = false;
            },
            { timeout: 10000, maximumAge: 120000 }
        );
    });

    locationInput.addEventListener("input", function () {
        coordinates = null;
        locationStatus.textContent = locationInput.value.trim()
            ? "Using your entered location for the next search."
            : "Enter a location or allow location access.";
    });
})();

// PRACTITIONER VOICE INPUT
(function () {
    const button = document.getElementById("care-practitioner-voice");
    const language = document.getElementById("care-practitioner-voice-language");
    const specialty = document.getElementById("care-practitioner-specialty");
    const status = document.getElementById("care-practitioner-voice-status");

    if (!button || !language || !specialty || !status) {
        console.warn("Practitioner voice controls are unavailable.");
        return;
    }

    button.addEventListener("click", function () {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            status.textContent =
                "Voice recognition is not supported by this browser. Please type your requirement instead.";
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language.value;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        button.disabled = true;
        status.textContent = "Listening... Please speak now.";

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript.trim();

            if (transcript) {
                specialty.value = specialty.value.trim()
                    ? specialty.value.trim() + " " + transcript
                    : transcript;

                specialty.dispatchEvent(new Event("input", { bubbles: true }));
                status.textContent = "Speech captured. Please review the text before searching.";
            } else {
                status.textContent = "No speech detected. Please try again or type your requirement.";
            }
        };

        recognition.onerror = function (event) {
            status.textContent =
                "Voice input failed (" + event.error +
                "). Check microphone permission or type your requirement.";
        };

        recognition.onend = function () {
            button.disabled = false;
        };

        try {
            recognition.start();
        } catch (error) {
            button.disabled = false;
            status.textContent = "Could not start voice input. Please try again.";
        }
    });
})();
// HEALTH JOURNEY
    function getJourney() {
        const entries = readStorage(STORAGE.journey, []);
        return Array.isArray(entries) ? entries : [];
    }

    function renderJourney() {
        const entries = getJourney();

        if (!filteredEntries.length) {
            $("journey-list").innerHTML =
                '<div class="empty-state">No health journey entries yet.</div>';
            return;
        }

        $("journey-list").innerHTML = entries.slice().reverse().map(function (entry) {
            return `
                <article class="stack-card">
                    <h3>${escapeHTML(entry.title)}</h3>
                    <p class="help-text">${escapeHTML(entry.date || "Date not specified")}</p>
                    <p>${escapeHTML(entry.notes || "No notes added.")}</p>
                    <button type="button" class="btn btn-secondary"
                        data-journey-delete="${escapeHTML(entry.id)}">Remove entry</button>
                </article>
            `;
        }).join("");
    }

    $("journey-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const title = $("j-title").value.trim();
        if (!title) return;

        const entries = getJourney();

        entries.push({
            id: String(Date.now()) + Math.random().toString(16).slice(2),
            title: title,
            date: $("j-date").value,
            notes: $("j-notes").value.trim()
        });

        if (writeStorage(STORAGE.journey, entries)) {
            $("journey-form").reset();
            $("journey-status").textContent = "Entry saved.";
            renderJourney();
            showToast("Health journey entry saved.");
        }
    });

    $("journey-list").addEventListener("click", function (event) {
        const button = event.target.closest("[data-journey-delete]");
        if (!button) return;

        if (!window.confirm("Remove this health journey entry?")) return;

        const entries = getJourney().filter(function (entry) {
            return entry.id !== button.dataset.journeyDelete;
        });

        if (writeStorage(STORAGE.journey, entries)) {
            renderJourney();
        }
    });

    // SMARTCARE NAVIGATOR
    function selectedPathway() {
        const selected = document.querySelector('input[name="sc-pathway"]:checked');
        return selected ? selected.value : "choose";
    }

    function updateSmartCarePathway() {
        $("sc-system-picker").hidden = selectedPathway() !== "choose";
        $("sc-result").hidden = true;
    }

    document.querySelectorAll('input[name="sc-pathway"]').forEach(function (radio) {
        radio.addEventListener("change", updateSmartCarePathway);
    });

    $("sc-language").addEventListener("change", function () {
        $("sc-status").textContent =
            "Selected language: " +
            $("sc-language").selectedOptions[0].textContent +
            ". Please review any voice transcript.";
    });

    $("sc-speak").addEventListener("click", function () {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            $("sc-status").textContent =
                "Voice input is not supported in this browser. Please type your symptoms.";
            return;
        }

        const language = $("sc-language").value;
        const recognition = new SpeechRecognition();

        recognition.lang = language;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = function () {
            $("sc-status").textContent = "Listening. Speak clearly.";
        };

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            const input = $("sc-symptoms");

            input.value = input.value.trim()
                ? input.value.trim() + " " + transcript
                : transcript;

            $("sc-status").textContent =
                "Transcript captured. Please review it before continuing.";
        };

        recognition.onerror = function (event) {
            $("sc-status").textContent =
                "Voice input could not be completed (" + event.error +
                "). Check microphone permission or type instead.";
        };

        recognition.start();
    });

    $("sc-read").addEventListener("click", function () {
        const text = $("sc-symptoms").value.trim();

        if (!text) {
            $("sc-status").textContent = "Enter symptoms first.";
            return;
        }

        if (!("speechSynthesis" in window)) {
            $("sc-status").textContent = "Read aloud is not supported in this browser.";
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = $("sc-language").value;

        window.speechSynthesis.speak(utterance);

        $("sc-status").textContent =
            "Reading text aloud with an available browser voice.";
    });

    $("sc-clear").addEventListener("click", function () {
        $("sc-symptoms").value = "";
        $("sc-result").hidden = true;
        $("sc-status").textContent = "Description cleared.";
    });

    $("sc-continue").addEventListener("click", function () {
        const symptoms = $("sc-symptoms").value.trim();
        const language = $("sc-language").selectedOptions[0].textContent;
        const result = $("sc-result");
        const pathway = selectedPathway();
        const chosenSystem = $("sc-system").value;

        result.hidden = false;

        if (!symptoms) {
            result.textContent =
                "Please describe your symptoms first. Do not delay urgent medical care.";
            return;
        }

        const context = {
            symptoms: symptoms,
            language: language,
            pathway: pathway,
            healthcareSystem: pathway === "choose" ? chosenSystem : "",
            savedAt: new Date().toISOString()
        };

        try {
            sessionStorage.setItem(
                "integratedhealthai_current_symptom_context_v1",
                JSON.stringify(context)
            );
        } catch (error) {
            console.error("Could not save temporary symptom context.", error);
        }

        result.innerHTML = `
            <div class="care-next-step">
                <div class="eyebrow">YOUR NEXT STEP</div>
                <h3>Connect with Healthcare</h3>

                <p>
                    <strong>Your symptoms:</strong>
                    <span id="sc-summary-text"></span>
                </p>

                <p><strong>Preferred language:</strong>
                    <span id="sc-summary-language"></span>
                </p>

                <p>
                    Your description is ready to carry into Healthcare Connecting.
                    This prototype has not diagnosed your symptoms or determined
                    which healthcare system is suitable.
                </p>

                <div class="care-next-step-buttons">
                    <button type="button" class="btn btn-primary"
                        data-sc-connect="practitioner">
                        Find a Practitioner ->
                    </button>

                    <button type="button" class="btn btn-secondary"
                        data-sc-connect="center">
                        Find a Healthcare Center ->
                    </button>

                    <button type="button" class="btn btn-secondary"
                        data-sc-connect="pharmacy">
                        Find a Pharmacy ->
                    </button>
                </div>

                <p class="help-text">
                    Pharmacy searches do not replace medical assessment.
                    If symptoms are severe, rapidly worsening or potentially
                    life-threatening, seek urgent medical attention.
                </p>
            </div>
        `;

        $("sc-summary-text").textContent = symptoms;
        $("sc-summary-language").textContent = language;

        result.querySelectorAll("[data-sc-connect]").forEach(function (button) {
            button.addEventListener("click", function () {
                const service = button.dataset.scConnect;

                try {
                    sessionStorage.setItem(
                        "integratedhealthai_current_symptom_context_v1",
                        JSON.stringify(context)
                    );
                } catch (error) {
                    console.error("Could not retain symptom context.", error);
                }

                if (typeof showPage === "function") {
                    showPage("care");
                } else {
                    console.error("Could not navigate to Healthcare Connecting.");
                    return;
                }

                const hub = $("care-connect-hub");

                if (hub) {
                    let summary = $("care-symptom-context");

                    if (!summary) {
                        summary = document.createElement("div");
                        summary.id = "care-symptom-context";
                        summary.className = "care-symptom-context";
                        hub.insertBefore(summary, hub.firstChild);
                    }

                    summary.replaceChildren();

                    const heading = document.createElement("h3");
                    heading.textContent = "Your Symptom Summary";

                    const description = document.createElement("p");
                    description.textContent = symptoms;

                    const languageLine = document.createElement("p");
                    languageLine.textContent = "Preferred language: " + language;

                    const privacyNote = document.createElement("p");
                    privacyNote.className = "help-text";
                    privacyNote.textContent =
                        "This summary stays within this app during this session. " +
                        "It is not automatically sent to Google Maps.";

                    summary.append(heading, description, languageLine, privacyNote);

                    const searchHeading = hub.querySelector(".care-connect-heading");
                    if (searchHeading) {
                        searchHeading.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                }

                const target = {
                    practitioner: "care-practitioner-system",
                    center: "care-center-type",
                    pharmacy: "care-pharmacy-type"
                }[service];

                const targetElement = target ? $(target) : null;

                if (targetElement) {
                    targetElement.focus();
                }

                const status = $("care-search-status");
                if (status) {
                    status.textContent =
                        "Selected service: " +
                        ({
                            practitioner: "Practitioner Connect",
                            center: "Healthcare Centers",
                            pharmacy: "Pharmacy Connect"
                        }[service]) +
                        ". Your symptom summary is available above. Enter your location " +
                        "and start the search when ready.";
                }
            });
        });
    });
    // DASHBOARD
    function updateDashboard() {
        const profile = getProfile();
        const family = getFamily();

        $("stat-profile").textContent =
            profile.name ? "Completed" : "Not completed";

        $("stat-family").textContent = String(family.length);
    }

    // INITIALIZE
    function initialize() {
        loadProfile();
        renderFamily();
        renderCare("");
        renderJourney();
        updateSmartCarePathway();
        updateDashboard();

        console.log("IntegratedHealthAI initialized successfully.");
    }

    initialize();


// INTEGRATEDHEALTHAI_LABS_V1
(function () {
    const RESULT_KEY = "integratedhealthai_lab_results_v1";
    const DB_NAME = "IntegratedHealthAI_LabReports";
    const STORE_NAME = "reports";
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const byId = function (id) {
        return document.getElementById(id);
    };

    const safe = function (value) {
        return String(value ?? "").replace(/[&<>"']/g, function (c) {
            return {
                "&": "&amp;", "<": "&lt;", ">": "&gt;",
                '"': "&quot;", "'": "&#39;"
            }[c];
        });
    };

    const getResults = function () {
        try {
            const data = JSON.parse(localStorage.getItem(RESULT_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    };

    const saveResults = function (data) {
        try {
            localStorage.setItem(RESULT_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            alert("Could not save results. Browser storage may be full.");
            return false;
        }
    };

    const openDatabase = function () {
        return new Promise(function (resolve, reject) {
            if (!("indexedDB" in window)) {
                reject(new Error("This browser does not support local report storage."));
                return;
            }

            const request = indexedDB.open(DB_NAME, 1);

            request.onupgradeneeded = function () {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error || new Error("Could not open report storage."));
            };
        });
    };

    const saveReportFile = async function (report) {
        const db = await openDatabase();

        return new Promise(function (resolve, reject) {
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put(report);

            tx.oncomplete = function () {
                db.close();
                resolve();
            };

            tx.onerror = function () {
                db.close();
                reject(tx.error || new Error("Could not save report."));
            };

            tx.onabort = function () {
                db.close();
                reject(tx.error || new Error("Report storage was interrupted."));
            };
        });
    };

    const getReports = async function () {
        const db = await openDatabase();

        return new Promise(function (resolve, reject) {
            const tx = db.transaction(STORE_NAME, "readonly");
            const request = tx.objectStore(STORE_NAME).getAll();

            request.onsuccess = function () {
                const reports = request.result || [];
                db.close();
                resolve(reports.sort(function (a, b) {
                    return String(b.date).localeCompare(String(a.date));
                }));
            };

            request.onerror = function () {
                db.close();
                reject(request.error || new Error("Could not load reports."));
            };
        });
    };

    const deleteReport = async function (id) {
        const db = await openDatabase();

        return new Promise(function (resolve, reject) {
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).delete(id);

            tx.oncomplete = function () {
                db.close();
                resolve();
            };

            tx.onerror = function () {
                db.close();
                reject(tx.error || new Error("Could not delete report."));
            };
        });
    };

    const renderResults = function () {
        const all = getResults();
        const query = (byId("labs-search").value || "").trim().toLowerCase();
        const patient = (byId("labs-patient-filter").value || "").trim().toLowerCase();

        const filtered = all.filter(function (item) {
            const text = [
                item.patient, item.test, item.value, item.unit,
                item.range, item.laboratory, item.notes
            ].join(" ").toLowerCase();

            return text.includes(query) &&
                String(item.patient || "").toLowerCase().includes(patient);
        }).sort(function (a, b) {
            return String(b.date).localeCompare(String(a.date));
        });

        byId("labs-count").textContent = String(all.length);
        byId("labs-latest").textContent = all.length
            ? all.reduce(function (latest, item) {
                return String(item.date) > latest ? String(item.date) : latest;
            }, "")
            : "—";

        if (!filtered.length) {
            byId("labs-results-list").innerHTML =
                '<p class="help-text">No matching results. Add a result using the form above.</p>';
            return;
        }

        byId("labs-results-list").innerHTML = filtered.map(function (item) {
            return '<article class="labs-record">' +
                '<div class="labs-record-main">' +
                '<strong>' + safe(item.test) + '</strong>' +
                '<span>' + safe(item.patient) + ' · ' + safe(item.date) + '</span>' +
                '<span>Result: <b>' + safe(item.value) + '</b> ' + safe(item.unit) + '</span>' +
                '<span>Reference range: ' + safe(item.range || "Not entered") + '</span>' +
                '<span>Laboratory: ' + safe(item.laboratory || "Not entered") + '</span>' +
                (item.notes ? '<span>Notes: ' + safe(item.notes) + '</span>' : '') +
                '</div>' +
                '<button type="button" class="btn btn-secondary labs-delete-result" data-id="' +
                safe(item.id) + '">Delete</button>' +
                '</article>';
        }).join("");
    };

    const renderReports = async function () {
        try {
            const reports = await getReports();
            byId("reports-count").textContent = String(reports.length);

            if (!reports.length) {
                byId("labs-reports-list").innerHTML =
                    '<p class="help-text">No reports uploaded yet.</p>';
                return;
            }

            byId("labs-reports-list").innerHTML = reports.map(function (report) {
                return '<article class="labs-record">' +
                    '<div class="labs-record-main">' +
                    '<strong>' + safe(report.name || report.fileName) + '</strong>' +
                    '<span>' + safe(report.patient) + ' · ' + safe(report.date) + '</span>' +
                    '<span>' + safe(report.fileName) + ' · ' +
                    (report.size / 1024).toFixed(1) + ' KB</span>' +
                    '</div>' +
                    '<div class="labs-record-actions">' +
                    '<button type="button" class="btn btn-secondary labs-view-report" data-id="' +
                    safe(report.id) + '">Open</button>' +
                    '<button type="button" class="btn btn-secondary labs-delete-report" data-id="' +
                    safe(report.id) + '">Delete</button>' +
                    '</div></article>';
            }).join("");
        } catch (error) {
            byId("labs-reports-list").innerHTML =
                '<p class="help-text">Report storage could not be opened. ' +
                safe(error.message) + '</p>';
        }
    };

    byId("labs-result-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const item = {
            id: (window.crypto && crypto.randomUUID)
                ? crypto.randomUUID()
                : String(Date.now()) + Math.random().toString(16).slice(2),
            patient: byId("labs-patient").value.trim(),
            test: byId("labs-test").value.trim(),
            date: byId("labs-date").value,
            value: byId("labs-value").value.trim(),
            unit: byId("labs-unit").value.trim(),
            range: byId("labs-range").value.trim(),
            laboratory: byId("labs-laboratory").value.trim(),
            notes: byId("labs-notes").value.trim()
        };

        if (!item.patient || !item.test || !item.date || !item.value) {
            alert("Please complete the patient, test, date and result fields.");
            return;
        }

        const results = getResults();
        results.push(item);

        if (saveResults(results)) {
            this.reset();
            byId("labs-date").value = new Date().toISOString().slice(0, 10);
            renderResults();
            alert("Lab result saved in this browser.");
        }
    });

    byId("labs-report-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const fileInput = byId("labs-report-file");
        const file = fileInput.files && fileInput.files[0];
        const status = byId("labs-upload-status");

        if (!file) {
            status.textContent = "Please choose a report file.";
            return;
        }

        const allowed = [
            "application/pdf", "image/jpeg", "image/png", "image/webp"
        ];

        if (!allowed.includes(file.type)) {
            status.textContent = "Choose a PDF, JPG, PNG or WebP image.";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            status.textContent = "The file is too large. Maximum size is 10 MB.";
            return;
        }

        status.textContent = "Saving report locally…";

        try {
            await saveReportFile({
                id: (window.crypto && crypto.randomUUID)
                    ? crypto.randomUUID()
                    : String(Date.now()) + Math.random().toString(16).slice(2),
                patient: byId("labs-report-patient").value.trim(),
                date: byId("labs-report-date").value,
                name: byId("labs-report-name").value.trim(),
                fileName: file.name,
                type: file.type,
                size: file.size,
                blob: file
            });

            this.reset();
            byId("labs-report-date").value = new Date().toISOString().slice(0, 10);
            status.textContent = "Report saved in this browser.";
            await renderReports();
        } catch (error) {
            status.textContent = "Could not save report: " + error.message;
        }
    });

    byId("labs-results-list").addEventListener("click", function (event) {
        const button = event.target.closest(".labs-delete-result");
        if (!button) return;

        if (!confirm("Delete this saved lab result?")) return;

        const remaining = getResults().filter(function (item) {
            return item.id !== button.dataset.id;
        });

        if (saveResults(remaining)) renderResults();
    });

    byId("labs-reports-list").addEventListener("click", async function (event) {
        const viewButton = event.target.closest(".labs-view-report");
        const deleteButton = event.target.closest(".labs-delete-report");

        try {
            if (viewButton) {
                const reports = await getReports();
                const report = reports.find(function (item) {
                    return item.id === viewButton.dataset.id;
                });

                if (!report || !report.blob) {
                    alert("Report file was not found.");
                    return;
                }

                const url = URL.createObjectURL(report.blob);
                const opened = window.open(url, "_blank");

                if (!opened) {
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = report.fileName;
                    link.click();
                }

                setTimeout(function () {
                    URL.revokeObjectURL(url);
                }, 60000);
            }

            if (deleteButton && confirm("Delete this uploaded report?")) {
                await deleteReport(deleteButton.dataset.id);
                await renderReports();
            }
        } catch (error) {
            alert("Report action failed: " + error.message);
        }
    });

    byId("labs-search").addEventListener("input", renderResults);
    byId("labs-patient-filter").addEventListener("input", renderResults);

    byId("labs-export-results").addEventListener("click", function () {
        const results = getResults();

        if (!results.length) {
            alert("There are no results to export.");
            return;
        }

        const columns = [
            "patient", "test", "date", "value", "unit",
            "range", "laboratory", "notes"
        ];

        const csvCell = function (value) {
            return '"' + String(value ?? "").replace(/"/g, '""') + '"';
        };

        const csv = [
            columns.join(","),
            ...results.map(function (item) {
                return columns.map(function (key) {
                    return csvCell(item[key]);
                }).join(",");
            })
        ].join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "integratedhealthai-lab-results.csv";
        link.click();
        URL.revokeObjectURL(url);
    });

    byId("labs-finder-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const location = byId("labs-location").value.trim();
        const service = byId("labs-service").value;

        if (!location) {
            alert("Enter a city, town or PIN code.");
            return;
        }

        const url = "https://www.google.com/maps/search/" +
            encodeURIComponent(service + " near " + location);

        window.open(url, "_blank", "noopener,noreferrer");
    });

    const today = new Date().toISOString().slice(0, 10);
    byId("labs-date").value = today;
    byId("labs-report-date").value = today;

    renderResults();
    renderReports();
})();

// INTEGRATEDHEALTHAI_RECORDS_V1
(function () {

    const DB_NAME = "IntegratedHealthAI_HealthRecords";
    const STORE_NAME = "documents";
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const $r = function (id) {
        return document.getElementById(id);
    };

    const safeRecordText = function (value) {
        return String(value ?? "").replace(/[&<>"']/g, function (c) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c];
        });
    };

    const openRecordsDB = function () {
        return new Promise(function (resolve, reject) {

            if (!("indexedDB" in window)) {
                reject(new Error("IndexedDB is not supported by this browser."));
                return;
            }

            const request = indexedDB.open(DB_NAME, 1);

            request.onupgradeneeded = function () {
                const db = request.result;

                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, {
                        keyPath: "id"
                    });
                }
            };

            request.onsuccess = function () {
                resolve(request.result);
            };

            request.onerror = function () {
                reject(request.error || new Error("Could not open record storage."));
            };
        });
    };

    const getAllRecords = async function () {
        const db = await openRecordsDB();

        return new Promise(function (resolve, reject) {

            const tx = db.transaction(STORE_NAME, "readonly");
            const request = tx.objectStore(STORE_NAME).getAll();

            request.onsuccess = function () {
                const result = request.result || [];
                db.close();

                result.sort(function (a, b) {
                    return String(b.date).localeCompare(String(a.date));
                });

                resolve(result);
            };

            request.onerror = function () {
                db.close();
                reject(request.error || new Error("Could not read health records."));
            };
        });
    };

    const saveRecord = async function (record) {
        const db = await openRecordsDB();

        return new Promise(function (resolve, reject) {

            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put(record);

            tx.oncomplete = function () {
                db.close();
                resolve();
            };

            tx.onerror = function () {
                db.close();
                reject(tx.error || new Error("Could not save the document."));
            };

            tx.onabort = function () {
                db.close();
                reject(tx.error || new Error("Document storage was interrupted."));
            };
        });
    };

    const removeRecord = async function (id) {
        const db = await openRecordsDB();

        return new Promise(function (resolve, reject) {

            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).delete(id);

            tx.oncomplete = function () {
                db.close();
                resolve();
            };

            tx.onerror = function () {
                db.close();
                reject(tx.error || new Error("Could not delete the document."));
            };
        });
    };

    const renderRecords = async function () {

        const list = $r("records-list");

        try {

            const records = await getAllRecords();

            const search = ($r("records-search").value || "")
                .trim().toLowerCase();

            const category = $r("records-filter-category").value;

            const patientFilter = ($r("records-filter-patient").value || "")
                .trim().toLowerCase();

            const filtered = records.filter(function (record) {

                const searchable = [
                    record.patient,
                    record.title,
                    record.provider,
                    record.category,
                    record.notes,
                    record.fileName
                ].join(" ").toLowerCase();

                return searchable.includes(search) &&
                    (!category || record.category === category) &&
                    String(record.patient || "")
                        .toLowerCase().includes(patientFilter);
            });

            const patients = new Set(
                records.map(function (record) {
                    return String(record.patient || "").trim().toLowerCase();
                }).filter(Boolean)
            );

            $r("records-count").textContent = String(records.length);
            $r("records-patients-count").textContent = String(patients.size);

            $r("records-latest-date").textContent = records.length
                ? records.reduce(function (latest, record) {
                    return String(record.date) > latest
                        ? String(record.date)
                        : latest;
                }, "")
                : "--";

            if (!filtered.length) {
                list.innerHTML =
                    '<p class="help-text">No matching medical history. Try different filters or add a record.</p>';
                return;
            }

            list.innerHTML = filtered.map(function (record) {

                return '<article class="records-document">' +

                    '<div class="records-document-main">' +

                    '<span class="records-category-label">' +
                    safeRecordText(record.category) +
                    '</span>' +

                    '<strong>' +
                    safeRecordText(record.title) +
                    '</strong>' +

                    '<span>Patient: ' +
                    safeRecordText(record.patient) +
                    '</span>' +

                    '<span>Date: ' +
                    safeRecordText(record.date) +
                    '</span>' +

                    '<span>Provider: ' +
                    safeRecordText(record.provider || "Not specified") +
                    '</span>' +

                    '<span>File: ' +
                    safeRecordText(record.fileName) +
                    '</span>' +

                    (record.notes
                        ? '<span>Notes: ' +
                          safeRecordText(record.notes) +
                          '</span>'
                        : '') +

                    '</div>' +

                    '<div class="records-document-actions">' +

                    '<button type="button" class="btn btn-secondary records-open" data-id="' +
                    safeRecordText(record.id) +
                    '">Open</button>' +

                    '<button type="button" class="btn btn-secondary records-download" data-id="' +
                    safeRecordText(record.id) +
                    '">Download</button>' +

                    '<button type="button" class="btn btn-secondary records-delete" data-id="' +
                    safeRecordText(record.id) +
                    '">Delete</button>' +

                    '</div>' +

                    '</article>';

            }).join("");

        } catch (error) {

            list.innerHTML =
                '<p class="help-text">Could not load records: ' +
                safeRecordText(error.message) +
                '</p>';

        }
    };

    $r("records-upload-form").addEventListener("submit", async function (event) {

        event.preventDefault();

        const status = $r("records-upload-status");
        const input = $r("records-file");
        const file = input.files && input.files[0];

        if (!file) {
            status.textContent = "Please select a document.";
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "text/plain"
        ];

        if (!allowedTypes.includes(file.type)) {
            status.textContent =
                "Unsupported file type. Choose PDF, JPG, PNG, WebP or TXT.";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            status.textContent = "File exceeds the 10 MB limit.";
            return;
        }

        const record = {
            id: (window.crypto && crypto.randomUUID)
                ? crypto.randomUUID()
                : String(Date.now()) + Math.random().toString(16).slice(2),

            patient: $r("records-patient").value.trim(),
            category: $r("records-category").value,
            title: $r("records-title").value.trim(),
            date: $r("records-date").value,
            provider: $r("records-provider").value.trim(),
            notes: $r("records-notes").value.trim(),
            fileName: file.name,
            type: file.type,
            size: file.size,
            blob: file
        };

        if (!record.patient || !record.title || !record.date) {
            status.textContent =
                "Please complete the patient, title and date fields.";
            return;
        }

        status.textContent = "Saving document locally...";

        try {

            await saveRecord(record);

            this.reset();

            $r("records-date").value = new Date()
                .toISOString().slice(0, 10);

            status.textContent = "Health record saved successfully.";

            await renderRecords();

        } catch (error) {

            status.textContent =
                "Could not save the document: " + error.message;

        }
    });

    $r("records-list").addEventListener("click", async function (event) {

        const openButton = event.target.closest(".records-open");
        const downloadButton = event.target.closest(".records-download");
        const deleteButton = event.target.closest(".records-delete");

        if (!openButton && !downloadButton && !deleteButton) {
            return;
        }

        const id = (
            openButton || downloadButton || deleteButton
        ).dataset.id;

        try {

            const records = await getAllRecords();

            const record = records.find(function (item) {
                return item.id === id;
            });

            if (!record) {
                alert("Document not found.");
                return;
            }

            if (deleteButton) {

                if (!confirm("Permanently delete this document from this browser?")) {
                    return;
                }

                await removeRecord(id);
                await renderRecords();
                return;
            }

            if (!record.blob) {
                alert("The stored document file is unavailable.");
                return;
            }

            const url = URL.createObjectURL(record.blob);

            if (downloadButton) {

                const link = document.createElement("a");
                link.href = url;
                link.download = record.fileName;
                document.body.appendChild(link);
                link.click();
                link.remove();

                setTimeout(function () {
                    URL.revokeObjectURL(url);
                }, 60000);

                return;
            }

            const opened = window.open(url, "_blank");

            if (!opened) {
                const link = document.createElement("a");
                link.href = url;
                link.download = record.fileName;
                link.click();
            }

            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 60000);

        } catch (error) {

            alert("Document action failed: " + error.message);

        }
    });

    [
        "records-search",
        "records-filter-category",
        "records-filter-patient"
    ].forEach(function (id) {
        $r(id).addEventListener("input", renderRecords);
        $r(id).addEventListener("change", renderRecords);
    });

    $r("records-export").addEventListener("click", async function () {

        try {

            const records = await getAllRecords();

            if (!records.length) {
                alert("There are no health records to export.");
                return;
            }

            const columns = [
                "patient",
                "category",
                "title",
                "date",
                "provider",
                "fileName",
                "size",
                "notes"
            ];

            const csvCell = function (value) {
                return '"' + String(value ?? "").replace(/"/g, '""') + '"';
            };

            const csv = [
                columns.join(","),
                ...records.map(function (record) {
                    return columns.map(function (key) {
                        return csvCell(record[key]);
                    }).join(",");
                })
            ].join("\r\n");

            const blob = new Blob(["\uFEFF" + csv], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "integratedhealthai-health-records.csv";
            link.click();

            URL.revokeObjectURL(url);

        } catch (error) {

            alert("Could not export records: " + error.message);

        }
    });

    $r("records-date").value = new Date()
        .toISOString().slice(0, 10);

    renderRecords();

})();
})();



// INTEGRATEDHEALTHAI_UNIFIED_TIMELINE_V1
(function () {
    "use strict";

    const FAMILY_KEY = "integratedhealthai_family_v1";
    const LAB_KEY = "integratedhealthai_lab_results_v1";
    const RECORDS_DB = "IntegratedHealthAI_HealthRecords";
    const LAB_DB = "IntegratedHealthAI_LabReports";

    const escapeText = function (value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c];
        });
    };

    const readArray = function (key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    };

    const getFamily = function () {
        return readArray(FAMILY_KEY);
    };

    // Populate suggestions without replacing existing form fields.
    const setupFamilySuggestions = function () {
        let datalist = document.getElementById("ihai-family-options");

        if (!datalist) {
            datalist = document.createElement("datalist");
            datalist.id = "ihai-family-options";
            document.body.appendChild(datalist);
        }

        datalist.innerHTML = getFamily().map(function (member) {
            const name = String(member.name || "").trim();
            if (!name) return "";

            const relation = String(member.relation || "").trim();

            return '<option value="' + escapeText(name) +
                '" label="' + escapeText(relation ? name + " - " + relation : name) +
                '"></option>';
        }).join("");

        [
            "records-patient",
            "records-filter-patient",
            "labs-patient",
            "labs-report-patient",
            "labs-patient-filter"
        ].forEach(function (id) {
            const input = document.getElementById(id);

            if (input && input.tagName === "INPUT") {
                input.setAttribute("list", "ihai-family-options");
                input.setAttribute("autocomplete", "on");
            }
        });
    };

    const openDatabase = function (name, storeName) {
        return new Promise(function (resolve, reject) {
            if (!window.indexedDB) {
                reject(new Error("IndexedDB is unavailable."));
                return;
            }

            const request = indexedDB.open(name);

            request.onsuccess = function () {
                const db = request.result;

                if (!db.objectStoreNames.contains(storeName)) {
                    db.close();
                    resolve([]);
                    return;
                }

                const transaction = db.transaction(storeName, "readonly");
                const getRequest = transaction.objectStore(storeName).getAll();

                getRequest.onsuccess = function () {
                    const rows = getRequest.result || [];
                    db.close();
                    resolve(rows);
                };

                getRequest.onerror = function () {
                    db.close();
                    reject(getRequest.error || new Error("Could not read stored items."));
                };
            };

            request.onerror = function () {
                reject(request.error || new Error("Could not open database."));
            };
        });
    };

    const addTimeline = function (entries) {
        let section = document.getElementById("ihai-medical-timeline");
        const recordList = document.getElementById("records-list");

        if (!recordList) return null;

        if (!section) {
            section = document.createElement("section");
            section.id = "ihai-medical-timeline";
            section.className = "ihai-timeline-section";

            section.innerHTML =
                '<div class="ihai-timeline-heading">' +
                    '<div><span class="ihai-timeline-kicker">CONNECTED HEALTH HISTORY</span>' +
                    '<h3>Unified Medical Timeline</h3>' +
                    '<p>Laboratory results and saved health documents, arranged by date.</p></div>' +
                    '<button type="button" class="btn btn-secondary" id="ihai-timeline-refresh">Refresh</button>' +
                '</div>' +
                '<div class="ihai-timeline-filters">' +
                    '<label>Patient<select id="ihai-timeline-family"><option value="">All patients</option></select></label>' +
                    '<label>Record type<select id="ihai-timeline-type"><option value="">All record types</option></select></label>' +
                '</div>' +
                '<div class="ihai-timeline-summary" id="ihai-timeline-summary"></div>' +
                '<div id="ihai-timeline-items" class="ihai-timeline-items" aria-live="polite"></div>';

            recordList.parentNode.insertBefore(section, recordList);

            section.addEventListener("change", function (event) {
                if (
                    event.target &&
                    (
                        event.target.id === "ihai-timeline-family" ||
                        event.target.id === "ihai-timeline-type"
                    )
                ) {
                    renderTimeline();
                }
            });
        }

        return section;
    };

    const renderTimeline = async function () {
        const section = addTimeline();
        if (!section) return;

        const container = document.getElementById("ihai-timeline-items");
        const summary = document.getElementById("ihai-timeline-summary");

        if (!container || !summary) return;

        container.innerHTML = '<p class="help-text">Loading medical history...</p>';

        try {
            const family = getFamily();
            const labResults = readArray(LAB_KEY);

            const results = labResults.map(function (item) {
                return {
                    kind: "Lab result",
                    patient: item.patient || "Patient not specified",
                    title: item.test || "Laboratory test",
                    date: item.date || "",
                    detail: [
                        item.value ? "Result: " + item.value : "",
                        item.unit || "",
                        item.range ? "Reference range: " + item.range : "",
                        item.laboratory ? "Laboratory: " + item.laboratory : "",
                        item.notes || ""
                    ].filter(Boolean).join(" | ")
                };
            });

            const tasks = await Promise.allSettled([
                openDatabase(RECORDS_DB, "documents"),
                openDatabase(LAB_DB, "reports")
            ]);

            const documents = tasks[0].status === "fulfilled"
                ? tasks[0].value : [];

            const labFiles = tasks[1].status === "fulfilled"
                ? tasks[1].value : [];

            const documentEntries = documents.map(function (item) {
                return {
                    kind: item.category || "Health document",
                    patient: item.patient || "Patient not specified",
                    title: item.title || item.fileName || "Health document",
                    date: item.date || "",
                    detail: [
                        item.provider ? "Provider: " + item.provider : "",
                        item.fileName ? "File: " + item.fileName : "",
                        item.notes || ""
                    ].filter(Boolean).join(" | ")
                };
            });

            const reportEntries = labFiles.map(function (item) {
                return {
                    kind: "Uploaded lab report",
                    patient: item.patient || "Patient not specified",
                    title: item.name || item.title || item.fileName || "Laboratory report",
                    date: item.date || "",
                    detail: item.fileName ? "File: " + item.fileName : ""
                };
            });

            const entries = results.concat(documentEntries, reportEntries);

            // INTEGRATEDHEALTHAI_TIMELINE_FILTERS_V1
            const patientSelect = document.getElementById("ihai-timeline-family");
            const typeSelect = document.getElementById("ihai-timeline-type");

            const previousPatient = patientSelect ? patientSelect.value : "";
            const previousType = typeSelect ? typeSelect.value : "";

            const patientNames = Array.from(new Set(
                entries.map(function (entry) {
                    return String(entry.patient || "").trim();
                }).filter(Boolean)
            )).sort(function (a, b) {
                return a.localeCompare(b);
            });

            const recordTypes = Array.from(new Set(
                entries.map(function (entry) {
                    return String(entry.kind || "Health document");
                })
            )).sort(function (a, b) {
                return a.localeCompare(b);
            });

            if (patientSelect) {
                patientSelect.innerHTML =
                    '<option value="">All patients</option>' +
                    patientNames.map(function (name) {
                        return '<option value="' + escapeText(name) + '">' +
                            escapeText(name) + '</option>';
                    }).join("");

                patientSelect.value = patientNames.includes(previousPatient)
                    ? previousPatient : "";
            }

            if (typeSelect) {
                typeSelect.innerHTML =
                    '<option value="">All record types</option>' +
                    recordTypes.map(function (type) {
                        return '<option value="' + escapeText(type) + '">' +
                            escapeText(type) + '</option>';
                    }).join("");

                typeSelect.value = recordTypes.includes(previousType)
                    ? previousType : "";
            }

            const selectedPatient = patientSelect ? patientSelect.value : "";
            const selectedType = typeSelect ? typeSelect.value : "";

            const filteredEntries = entries.filter(function (entry) {
                return (!selectedPatient || entry.patient === selectedPatient) &&
                    (!selectedType || entry.kind === selectedType);
            });

            filteredEntries.sort(function (a, b) {
                return String(b.date).localeCompare(String(a.date));
            });

            summary.innerHTML =
                '<span class="ihai-summary-chip">' + entries.length +
                ' total entries</span>' +
                '<span class="ihai-summary-chip">' + labResults.length +
                ' lab results</span>' +
                '<span class="ihai-summary-chip">' + documents.length +
                ' health documents</span>' +
                '<span class="ihai-summary-chip">' + family.length +
                ' family members</span>';

            if (!filteredEntries.length) {
                container.innerHTML =
                    '<p class="help-text">No medical history is available yet. Add a lab result or upload a health document to begin.</p>';
                return;
            }

            container.innerHTML = filteredEntries.map(function (entry) {
                const knownMember = family.find(function (member) {
                    return String(member.name || "").trim().toLowerCase() ===
                        String(entry.patient).trim().toLowerCase();
                });

                const relation = knownMember && knownMember.relation
                    ? " - " + knownMember.relation : "";

                return '<article class="ihai-timeline-card">' +
                    '<div class="ihai-timeline-marker"></div>' +
                    '<div class="ihai-timeline-content">' +
                        '<div class="ihai-timeline-meta">' +
                            '<span class="ihai-timeline-type">' +
                                escapeText(entry.kind) +
                            '</span>' +
                            '<time>' + escapeText(entry.date || "Date not recorded") + '</time>' +
                        '</div>' +
                        '<h4>' + escapeText(entry.title) + '</h4>' +
                        '<p class="ihai-timeline-patient">Patient: ' +
                            escapeText(entry.patient + relation) + '</p>' +
                        (entry.detail
                            ? '<p class="ihai-timeline-detail">' +
                                escapeText(entry.detail) + '</p>'
                            : '') +
                    '</div>' +
                '</article>';
            }).join("");

        } catch (error) {
            container.innerHTML =
                '<p class="help-text">Could not load the timeline. Refresh to try again.</p>';
            console.error("IntegratedHealthAI timeline:", error);
        }
    };

    const scheduleRefresh = function (delay) {
        window.setTimeout(function () {
            setupFamilySuggestions();
            renderTimeline();
        }, delay || 500);
    };

    document.addEventListener("DOMContentLoaded", function () {
        setupFamilySuggestions();
        renderTimeline();
    });

    // Also works if this script is loaded after DOMContentLoaded.
    setupFamilySuggestions();
    renderTimeline();

    document.addEventListener("submit", function (event) {
        const id = event.target && event.target.id;

        if ([
            "records-upload-form",
            "labs-result-form",
            "labs-report-form",
            "family-form"
        ].includes(id)) {
            scheduleRefresh(id === "records-upload-form" ? 1200 : 500);
        }
    }, true);

    document.addEventListener("click", function (event) {
        if (event.target.closest("#ihai-timeline-refresh")) {
            renderTimeline();
        }

        if (
            event.target.closest("[data-family-delete]") ||
            event.target.closest(".labs-delete-result") ||
            event.target.closest(".labs-delete-report")
        ) {
            scheduleRefresh(700);
        }
    });

    window.addEventListener("focus", function () {
        setupFamilySuggestions();
        renderTimeline();
    });

})();


// INTEGRATEDHEALTHAI_WELLNESS_V1
(function () {
    "use strict";

    const KEY = "integratedhealthai_wellness_v1";
    const $ = function (id) { return document.getElementById(id); };
    const form = $("wellness-form");

    if (!form) return;

    let logs = [];

    try {
        const saved = localStorage.getItem(KEY);
        logs = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(logs)) logs = [];
    } catch (error) {
        logs = [];
    }

    const today = function () {
        const now = new Date();
        return now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");
    };

    $("wellness-date").value = today();

    const habits = function () {
        return Array.from(form.querySelectorAll('input[name="wellness-habit"]'));
    };

    const getSelectedHabits = function () {
        return habits().filter(function (item) {
            return item.checked;
        }).map(function (item) {
            return item.value;
        });
    };

    const escapeHtml = function (value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    };

    const getFormData = function () {
        return {
            date: $("wellness-date").value,
            water: Number($("wellness-water").value || 0),
            sleep: Number($("wellness-sleep").value || 0),
            activity: Number($("wellness-activity").value || 0),
            mood: $("wellness-mood").value,
            meals: $("wellness-meals").value.trim(),
            notes: $("wellness-notes").value.trim(),
            habits: getSelectedHabits()
        };
    };

    const calculateScore = function (entry) {
        const checks = [
            entry.water > 0,
            entry.sleep > 0,
            entry.activity > 0,
            Boolean(entry.mood),
            Boolean(entry.meals),
            Boolean(entry.notes),
            Array.isArray(entry.habits) && entry.habits.length > 0
        ];
        return Math.round(checks.filter(Boolean).length / checks.length * 100);
    };

    const showStatus = function (message) {
        $("wellness-status").textContent = message;
    };

    const saveToBrowser = function () {
        try {
            localStorage.setItem(KEY, JSON.stringify(logs));
            return true;
        } catch (error) {
            showStatus("Unable to save. Check browser storage availability.");
            return false;
        }
    };

    const updateDashboard = function () {
        const entry = getFormData();
        const score = calculateScore(entry);

        $("wellness-score").textContent = score + "%";
        $("wellness-water-stat").textContent = entry.water + " / 8";
        $("wellness-sleep-stat").textContent = entry.sleep + " hrs";
        $("wellness-activity-stat").textContent = entry.activity + " min";

        const greeting = $("wellness-greeting");
        greeting.textContent = score >= 70
            ? "You're building healthy habits."
            : score >= 30
                ? "Every small step counts."
                : "Small habits. Better days.";
    };

    const renderHistory = function () {
        const container = $("wellness-history");
        const sorted = logs.slice().sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });

        $("wellness-history-count").textContent =
            sorted.length + (sorted.length === 1 ? " entry" : " entries");

        if (!sorted.length) {
            container.innerHTML = "<p>Your saved daily logs will appear here.</p>";
            return;
        }

        container.innerHTML = sorted.slice(0, 30).map(function (entry) {
            const completed = Array.isArray(entry.habits) ? entry.habits : [];
            const details = [
                "Water: " + Number(entry.water || 0) + " glasses",
                "Sleep: " + Number(entry.sleep || 0) + " hours",
                "Activity: " + Number(entry.activity || 0) + " minutes"
            ];

            if (entry.mood) details.push("Mood: " + entry.mood);
            if (completed.length) details.push("Habits: " + completed.join(", "));
            if (entry.meals) details.push("Meals: " + entry.meals);
            if (entry.notes) details.push("Notes: " + entry.notes);

            return '<article class="wellness-history-item">' +
                '<div class="wellness-history-date"><strong>' +
                escapeHtml(entry.date) + '</strong><span>' +
                calculateScore(entry) + '% completion</span></div>' +
                '<p>' + escapeHtml(details.join(" · ")) + '</p>' +
                '<button type="button" class="btn btn-secondary wellness-edit" data-date="' +
                escapeHtml(entry.date) + '">Open log</button>' +
                '</article>';
        }).join("");
    };

    const loadDate = function (date) {
        const entry = logs.find(function (item) {
            return item.date === date;
        });

        form.reset();
        $("wellness-date").value = date;

        if (entry) {
            $("wellness-water").value = entry.water || 0;
            $("wellness-sleep").value = entry.sleep || 0;
            $("wellness-activity").value = entry.activity || 0;
            $("wellness-mood").value = entry.mood || "";
            $("wellness-meals").value = entry.meals || "";
            $("wellness-notes").value = entry.notes || "";

            habits().forEach(function (item) {
                item.checked = Array.isArray(entry.habits) &&
                    entry.habits.includes(item.value);
            });

            showStatus("Loaded saved log for " + date + ".");
        } else {
            showStatus("");
        }

        updateDashboard();
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const entry = getFormData();

        if (!entry.date) {
            showStatus("Please choose a date.");
            return;
        }

        if (entry.water < 0 || entry.water > 50 ||
            entry.sleep < 0 || entry.sleep > 24 ||
            entry.activity < 0 || entry.activity > 1440) {
            showStatus("Please check the water, sleep and activity values.");
            return;
        }

        const index = logs.findIndex(function (item) {
            return item.date === entry.date;
        });

        if (index >= 0) {
            logs[index] = entry;
        } else {
            logs.push(entry);
        }

        if (saveToBrowser()) {
            showStatus("Daily wellness log saved in this browser.");
            renderHistory();
            updateDashboard();
        }
    });

    form.addEventListener("input", updateDashboard);
    form.addEventListener("change", updateDashboard);

    $("wellness-date").addEventListener("change", function () {
        loadDate(this.value || today());
    });

    $("wellness-water-plus").addEventListener("click", function () {
        const input = $("wellness-water");
        input.value = Math.min(50, Number(input.value || 0) + 1);
        updateDashboard();
    });

    $("wellness-water-minus").addEventListener("click", function () {
        const input = $("wellness-water");
        input.value = Math.max(0, Number(input.value || 0) - 1);
        updateDashboard();
    });

    $("wellness-clear").addEventListener("click", function () {
        loadDate($("wellness-date").value || today());
        showStatus("Form restored to the saved log for this date.");
    });

    $("wellness-history").addEventListener("click", function (event) {
        const button = event.target.closest(".wellness-edit");
        if (button) {
            loadDate(button.getAttribute("data-date"));
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    loadDate(today());
    renderHistory();
})();
// END INTEGRATEDHEALTHAI_WELLNESS_V1



// INTEGRATEDHEALTHAI_NUTRITION_LOGIC_V1
(function () {
    "use strict";

    const $ = function (id) {
        return document.getElementById(id);
    };

    const form = $("nutrition-food-form");
    if (!form) return;

    const LOG_KEY = "integratedhealthai_nutrition_logs_v1";
    const GOAL_KEY = "integratedhealthai_nutrition_goals_v1";

    // Approximate nutrition per serving shown in the food selector.
    // Values are illustrative estimates and vary by recipe and portion.
    const foods = {
        idli:     { name: "Idli — 2 medium", kcal: 130, protein: 4, carbs: 28, fat: 1 },
        dosa:     { name: "Plain dosa — 1 medium", kcal: 170, protein: 4, carbs: 27, fat: 5 },
        upma:     { name: "Vegetable upma — 1 cup", kcal: 230, protein: 6, carbs: 36, fat: 7 },
        rice:     { name: "Cooked rice — 1 cup", kcal: 205, protein: 4, carbs: 45, fat: 0.5 },
        roti:     { name: "Chapati — 1 medium", kcal: 110, protein: 3, carbs: 20, fat: 3 },
        dal:      { name: "Cooked dal — 1 cup", kcal: 180, protein: 11, carbs: 30, fat: 2 },
        curd:     { name: "Plain curd — 1 cup", kcal: 150, protein: 8, carbs: 11, fat: 8 },
        milk:     { name: "Milk — 1 cup", kcal: 150, protein: 8, carbs: 12, fat: 8 },
        banana:   { name: "Banana — 1 medium", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        apple:    { name: "Apple — 1 medium", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3 },
        sprouts:  { name: "Sprouts — 1 cup", kcal: 100, protein: 7, carbs: 18, fat: 1 },
        egg:      { name: "Boiled egg — 1 large", kcal: 78, protein: 6, carbs: 0.6, fat: 5 },
        paneer:   { name: "Paneer — 100 g", kcal: 265, protein: 18, carbs: 3, fat: 20 },
        oats:     { name: "Cooked oats — 1 cup", kcal: 160, protein: 6, carbs: 28, fat: 3 },
        khichdi:  { name: "Vegetable khichdi — 1 cup", kcal: 210, protein: 7, carbs: 35, fat: 5 }
    };

    const escapeHtml = function (value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
            return {
                "&": "&amp;", "<": "&lt;", ">": "&gt;",
                '"': "&quot;", "'": "&#39;"
            }[c];
        });
    };

    const today = function () {
        const d = new Date();
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    };

    const readJson = function (key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    };

    let logs = readJson(LOG_KEY, []);
    if (!Array.isArray(logs)) logs = [];

    let goals = readJson(GOAL_KEY, { calories: 2000, protein: 50 });
    if (!goals || typeof goals !== "object") {
        goals = { calories: 2000, protein: 50 };
    }

    const selectedDate = function () {
        return $("nutrition-date").value || today();
    };

    const entriesForDate = function () {
        const log = logs.find(function (item) {
            return item.date === selectedDate();
        });
        return log && Array.isArray(log.entries) ? log.entries : [];
    };

    const totalsFor = function (entries) {
        return entries.reduce(function (total, entry) {
            const food = foods[entry.food];
            const servings = Number(entry.servings) || 0;
            if (!food) return total;

            total.calories += food.kcal * servings;
            total.protein += food.protein * servings;
            total.carbs += food.carbs * servings;
            total.fat += food.fat * servings;
            return total;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    const saveLogs = function () {
        try {
            localStorage.setItem(LOG_KEY, JSON.stringify(logs));
            return true;
        } catch (error) {
            $("nutrition-status").textContent =
                "Could not save. Browser storage may be full.";
            return false;
        }
    };

    const saveGoals = function () {
        try {
            localStorage.setItem(GOAL_KEY, JSON.stringify(goals));
            return true;
        } catch (error) {
            $("nutrition-goal-status").textContent =
                "Could not save nutrition targets.";
            return false;
        }
    };

    const updateSummary = function () {
        const totals = totalsFor(entriesForDate());

        $("nutrition-calories").textContent =
            Math.round(totals.calories) + " kcal";
        $("nutrition-protein").textContent =
            totals.protein.toFixed(1) + " g";
        $("nutrition-carbs").textContent =
            totals.carbs.toFixed(1) + " g";
        $("nutrition-fat").textContent =
            totals.fat.toFixed(1) + " g";

        const calorieGoal = Math.max(1, Number(goals.calories) || 2000);
        const proteinGoal = Math.max(1, Number(goals.protein) || 50);
        const caloriePercent = Math.round(totals.calories / calorieGoal * 100);
        const proteinPercent = Math.round(totals.protein / proteinGoal * 100);

        $("nutrition-calorie-progress-text").textContent = caloriePercent + "%";
        $("nutrition-protein-progress-text").textContent = proteinPercent + "%";
        $("nutrition-calorie-progress").style.width =
            Math.min(100, caloriePercent) + "%";
        $("nutrition-protein-progress").style.width =
            Math.min(100, proteinPercent) + "%";
    };

    const renderEntries = function () {
        const container = $("nutrition-food-list");
        const entries = entriesForDate();

        if (!entries.length) {
            container.innerHTML = "<p>No food entries for this date yet.</p>";
            updateSummary();
            return;
        }

        container.innerHTML = entries.map(function (entry, index) {
            const food = foods[entry.food];
            if (!food) return "";

            const servings = Number(entry.servings) || 1;
            const calories = Math.round(food.kcal * servings);

            return '<article class="nutrition-entry">' +
                '<div><strong>' + escapeHtml(food.name) + '</strong>' +
                '<span>' + escapeHtml(entry.meal) + ' · ' +
                servings + ' serving(s) · ' + calories + ' kcal</span></div>' +
                '<button type="button" class="btn btn-secondary nutrition-remove" ' +
                'data-index="' + index + '" aria-label="Remove food entry">Remove</button>' +
                '</article>';
        }).join("");

        updateSummary();
    };

    const renderHistory = function () {
        const container = $("nutrition-history");
        const sorted = logs.slice().sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });

        if (!sorted.length) {
            container.innerHTML = "<p>Your saved food diaries will appear here.</p>";
            return;
        }

        container.innerHTML = sorted.slice(0, 30).map(function (log) {
            const totals = totalsFor(log.entries || []);

            return '<article class="nutrition-history-entry">' +
                '<strong>' + escapeHtml(log.date) + '</strong>' +
                '<span>' + Math.round(totals.calories) + ' kcal · ' +
                totals.protein.toFixed(1) + ' g protein · ' +
                (log.entries || []).length + ' food entries</span>' +
                '<button type="button" class="btn btn-secondary nutrition-open-date" ' +
                'data-date="' + escapeHtml(log.date) + '">Open day</button>' +
                '</article>';
        }).join("");
    };

    const refresh = function () {
        renderEntries();
        renderHistory();
    };

    $("nutrition-date").value = today();

    $("nutrition-goal-calories").value = goals.calories || 2000;
    $("nutrition-goal-protein").value = goals.protein || 50;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const foodKey = $("nutrition-food").value;
        const servings = Number($("nutrition-servings").value);
        const food = foods[foodKey];

        if (!food || !Number.isFinite(servings) || servings < 0.25 || servings > 20) {
            $("nutrition-status").textContent =
                "Choose a food and enter between 0.25 and 20 servings.";
            return;
        }

        let log = logs.find(function (item) {
            return item.date === selectedDate();
        });

        if (!log) {
            log = { date: selectedDate(), entries: [] };
            logs.push(log);
        }

        log.entries.push({
            meal: $("nutrition-meal").value,
            food: foodKey,
            servings: servings
        });

        if (saveLogs()) {
            $("nutrition-status").textContent = "Food entry saved.";
            $("nutrition-servings").value = "1";
            refresh();
        }
    });

    $("nutrition-food-list").addEventListener("click", function (event) {
        const button = event.target.closest(".nutrition-remove");
        if (!button) return;

        const log = logs.find(function (item) {
            return item.date === selectedDate();
        });
        if (!log || !Array.isArray(log.entries)) return;

        const index = Number(button.getAttribute("data-index"));
        if (!Number.isInteger(index) || index < 0 || index >= log.entries.length) return;

        log.entries.splice(index, 1);

        if (!log.entries.length) {
            logs = logs.filter(function (item) {
                return item.date !== selectedDate();
            });
        }

        if (saveLogs()) {
            $("nutrition-status").textContent = "Food entry removed.";
            refresh();
        }
    });

    $("nutrition-date").addEventListener("change", function () {
        $("nutrition-status").textContent = "";
        refresh();
    });

    $("nutrition-goals-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const calories = Number($("nutrition-goal-calories").value);
        const protein = Number($("nutrition-goal-protein").value);

        if (!Number.isFinite(calories) || calories < 1 ||
            !Number.isFinite(protein) || protein < 1) {
            $("nutrition-goal-status").textContent =
                "Enter valid calorie and protein targets.";
            return;
        }

        goals = { calories: calories, protein: protein };

        if (saveGoals()) {
            $("nutrition-goal-status").textContent = "Targets saved.";
            updateSummary();
        }
    });

    $("nutrition-history").addEventListener("click", function (event) {
        const button = event.target.closest(".nutrition-open-date");
        if (!button) return;

        $("nutrition-date").value = button.getAttribute("data-date");
        refresh();
        $("nutrition-food-form").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    refresh();
})();
// END INTEGRATEDHEALTHAI_NUTRITION_LOGIC_V1


// INTEGRATEDHEALTHAI_MENTAL_WELLNESS_V1
(function () {
    "use strict";

    const $ = function (id) {
        return document.getElementById(id);
    };

    const form = $("mental-wellness-form");
    if (!form) return;

    const STORAGE_KEY = "integratedhealthai_mental_wellness_v1";

    function today() {
        const date = new Date();
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c];
        });
    }

    function readLogs() {
        try {
            const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    let logs = readLogs();

    function selectedDate() {
        return $("mental-date").value || today();
    }

    function currentEntry() {
        return logs.find(function (entry) {
            return entry.date === selectedDate();
        });
    }

    function showStatus(message) {
        $("mental-save-status").textContent = message;
    }

    function loadDate(date) {
        $("mental-date").value = date;
        const entry = currentEntry();

        $("mental-mood").value = entry ? entry.mood : "";
        $("mental-stress").value = entry ? entry.stress : 3;
        $("mental-stress-value").textContent =
            $("mental-stress").value + "/10";
        $("mental-sleep-hours").value =
            entry && entry.sleepHours !== "" ? entry.sleepHours : "";
        $("mental-sleep-quality").value = entry ? entry.sleepQuality || "" : "";
        $("mental-journal").value = entry ? entry.journal || "" : "";

        showStatus(entry ? "Saved check-in loaded." : "");
    }

    function renderHistory() {
        const container = $("mental-wellness-history");

        const sorted = logs.slice().sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });

        if (!sorted.length) {
            container.innerHTML =
                '<p class="mental-muted">Your saved check-ins will appear here.</p>';
            return;
        }

        container.innerHTML = sorted.slice(0, 60).map(function (entry) {
            const sleepText = entry.sleepHours !== "" &&
                entry.sleepHours != null
                ? escapeHtml(entry.sleepHours) + " hours sleep"
                : "Sleep not recorded";

            const journalText = entry.journal
                ? escapeHtml(entry.journal.slice(0, 100)) +
                    (entry.journal.length > 100 ? "…" : "")
                : "No written reflection";

            return '<article class="mental-history-entry">' +
                '<div><strong>' + escapeHtml(entry.date) + '</strong>' +
                '<p>Mood: ' + escapeHtml(entry.mood || "Not recorded") +
                ' · Stress: ' + escapeHtml(entry.stress) + '/10 · ' +
                sleepText + '</p>' +
                '<p>' + journalText + '</p></div>' +
                '<button type="button" class="btn btn-secondary mental-history-open" ' +
                'data-date="' + escapeHtml(entry.date) + '">Open</button>' +
                '</article>';
        }).join("");
    }

    function saveLogs() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
            return true;
        } catch (error) {
            showStatus("Could not save. Browser storage may be unavailable or full.");
            return false;
        }
    }

    $("mental-date").value = today();
    $("mental-stress-value").textContent =
        $("mental-stress").value + "/10";

    $("mental-stress").addEventListener("input", function () {
        $("mental-stress-value").textContent = this.value + "/10";
    });

    $("mental-date").addEventListener("change", function () {
        loadDate(this.value || today());
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const sleepValue = $("mental-sleep-hours").value;
        const sleepHours = sleepValue === "" ? "" : Number(sleepValue);

        if (sleepHours !== "" &&
            (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24)) {
            showStatus("Enter a sleep duration between 0 and 24 hours.");
            return;
        }

        const entry = {
            date: selectedDate(),
            mood: $("mental-mood").value,
            stress: Number($("mental-stress").value),
            sleepHours: sleepHours,
            sleepQuality: $("mental-sleep-quality").value,
            journal: $("mental-journal").value.trim(),
            updatedAt: new Date().toISOString()
        };

        logs = logs.filter(function (item) {
            return item.date !== entry.date;
        });
        logs.push(entry);

        if (saveLogs()) {
            showStatus("Your daily check-in has been saved.");
            renderHistory();
        }
    });

    $("mental-wellness-history").addEventListener("click", function (event) {
        const button = event.target.closest(".mental-history-open");
        if (!button) return;

        loadDate(button.getAttribute("data-date"));
        form.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Gentle one-minute breathing guide.
    let breathingInterval = null;
    let breathingElapsed = 0;
    const breathingDuration = 60;

    function updateBreathing() {
        const remaining = Math.max(0, breathingDuration - breathingElapsed);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        $("mental-breathing-count").textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

        const phase = breathingElapsed % 14;
        const circle = $("mental-breathing-circle");

        circle.classList.remove(
            "mental-inhale", "mental-hold", "mental-exhale"
        );

        if (phase < 4) {
            $("mental-breathing-stage").textContent = "Breathe in";
            $("mental-breathing-instruction").textContent =
                "Gently breathe in at a comfortable pace. Do not force a deep breath.";
            circle.classList.add("mental-inhale");
        } else if (phase < 6) {
            $("mental-breathing-stage").textContent = "Pause";
            $("mental-breathing-instruction").textContent =
                "Pause briefly only if comfortable. You can keep breathing naturally.";
            circle.classList.add("mental-hold");
        } else {
            $("mental-breathing-stage").textContent = "Breathe out";
            $("mental-breathing-instruction").textContent =
                "Let your breath out gently. Return to normal breathing whenever you wish.";
            circle.classList.add("mental-exhale");
        }

        if (breathingElapsed >= breathingDuration) {
            stopBreathing();
            $("mental-breathing-stage").textContent = "Complete";
            $("mental-breathing-count").textContent = "00:00";
            $("mental-breathing-instruction").textContent =
                "Your minute is complete. Notice how you feel, or return to your usual breathing.";
        }
    }

    function stopBreathing() {
        if (breathingInterval !== null) {
            clearInterval(breathingInterval);
            breathingInterval = null;
        }
        $("mental-breathing-circle").classList.remove(
            "mental-inhale", "mental-hold", "mental-exhale"
        );
    }

    $("mental-breathing-start").addEventListener("click", function () {
        if (breathingInterval !== null) return;

        if (breathingElapsed >= breathingDuration) {
            breathingElapsed = 0;
        }

        updateBreathing();

        breathingInterval = setInterval(function () {
            breathingElapsed += 1;
            updateBreathing();
        }, 1000);
    });

    $("mental-breathing-stop").addEventListener("click", function () {
        stopBreathing();
        breathingElapsed = 0;
        $("mental-breathing-stage").textContent = "Ready";
        $("mental-breathing-count").textContent = "01:00";
        $("mental-breathing-instruction").textContent =
            "Stopped. Return to normal breathing and restart whenever you feel ready.";
    });

    const groundingPrompts = [
        "Name five things you can see, four things you can feel, and three things you can hear. Take your time.",
        "Notice your feet touching the floor. Feel the support beneath you and gently look around your surroundings.",
        "Choose one object nearby. Notice its colour, shape, texture and details without rushing."
    ];
    let groundingIndex = 0;

    $("mental-grounding-start").addEventListener("click", function () {
        $("mental-grounding-content").textContent =
            groundingPrompts[groundingIndex];
        groundingIndex = (groundingIndex + 1) % groundingPrompts.length;
    });

    const gratitudePrompts = [
        "What is one small thing you appreciated today?",
        "Who or what helped you feel supported recently?",
        "What is one kind thing you could do for yourself tomorrow?"
    ];
    let gratitudeIndex = 0;

    $("mental-gratitude-start").addEventListener("click", function () {
        $("mental-gratitude-content").textContent =
            gratitudePrompts[gratitudeIndex];
        gratitudeIndex = (gratitudeIndex + 1) % gratitudePrompts.length;
    });

    loadDate(today());
    renderHistory();
})();
// END INTEGRATEDHEALTHAI_MENTAL_WELLNESS_V1

// INTEGRATEDHEALTHAI_CYCLE_TRACKING_LOGIC_V1
(function () {
  "use strict";

  const STORAGE_KEY = "integratedhealthai_cycle_tracking_v1";
  const $ = id => document.getElementById(id);

  function loadRecords() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Could not read cycle records.", error);
      return [];
    }
  }

  function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function parseDate(value) {
    if (!value) return null;
    const parts = value.split("-").map(Number);
    if (parts.length !== 3) return null;
    return new Date(parts[0], parts[1] - 1, parts[2], 12);
  }

  function dateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatDate(value) {
    const date = parseDate(value);
    return date ? date.toLocaleDateString(undefined, {
      day: "numeric", month: "short", year: "numeric"
    }) : "Not recorded";
  }

  function dayDifference(first, second) {
    return Math.round((second - first) / 86400000);
  }

  function getCycleStats(records) {
    const starts = [...new Set(
      records.map(r => r.start).filter(Boolean)
    )].sort();

    const lengths = [];
    for (let i = 1; i < starts.length; i++) {
      const gap = dayDifference(parseDate(starts[i - 1]), parseDate(starts[i]));
      if (gap > 0 && gap <= 100) lengths.push(gap);
    }

    const recent = lengths.slice(-6);
    const average = recent.length
      ? Math.round(recent.reduce((sum, n) => sum + n, 0) / recent.length)
      : null;

    return { starts, average };
  }

  function render() {
    const records = loadRecords().sort((a, b) => b.start.localeCompare(a.start));
    const stats = getCycleStats(records);
    const latestStart = stats.starts.length ? stats.starts[stats.starts.length - 1] : null;

    $("cycle-last-period").textContent = latestStart ? formatDate(latestStart) : "Not recorded";
    $("cycle-average").textContent = stats.average ? `${stats.average} days` : "Not enough data";
    $("cycle-total").textContent = String(stats.starts.length);

    if (latestStart && stats.average) {
      const next = parseDate(latestStart);
      next.setDate(next.getDate() + stats.average);
      $("cycle-next-period").textContent = formatDate(dateString(next));
    } else {
      $("cycle-next-period").textContent = latestStart ? "Log another period" : "Add a period record";
    }

    const list = $("cycle-history-list");
    list.replaceChildren();

    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "cycle-empty";
      empty.textContent = "No period records yet. Save your first entry above.";
      list.appendChild(empty);
      return;
    }

    records.forEach(record => {
      const card = document.createElement("article");
      card.className = "cycle-record";

      const top = document.createElement("div");
      top.className = "cycle-record-top";

      const details = document.createElement("div");
      const heading = document.createElement("h4");
      heading.textContent = formatDate(record.start);
      details.appendChild(heading);

      const meta = document.createElement("p");
      meta.className = "cycle-record-meta";
      meta.textContent = [
        record.end ? `Ended ${formatDate(record.end)}` : "End date not recorded",
        record.flow ? `Flow: ${record.flow}` : "",
        `Pain: ${record.pain || 0}/10`
      ].filter(Boolean).join(" · ");
      details.appendChild(meta);
      top.appendChild(details);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cycle-delete";
      remove.textContent = "Delete";
      remove.dataset.cycleDelete = record.id;
      remove.setAttribute("aria-label", `Delete record for ${formatDate(record.start)}`);
      top.appendChild(remove);
      card.appendChild(top);

      const lines = [
        record.symptoms ? `Symptoms: ${record.symptoms}` : "",
        record.mood ? `Mood: ${record.mood}` : "",
        record.sleep !== "" && record.sleep != null ? `Sleep: ${record.sleep} hours` : "",
        record.weight ? `Weight: ${record.weight} kg` : "",
        record.activity ? `Activity: ${record.activity}` : "",
        record.notes ? `Notes: ${record.notes}` : ""
      ].filter(Boolean);

      lines.forEach(line => {
        const p = document.createElement("p");
        p.textContent = line;
        card.appendChild(p);
      });

      list.appendChild(card);
    });
  }

  function init() {
    const form = $("cycle-entry-form");
    if (!form || form.dataset.cycleReady === "true") return;
    form.dataset.cycleReady = "true";

    $("cycle-pain").addEventListener("input", () => {
      $("cycle-pain-value").textContent = $("cycle-pain").value;
    });

    form.addEventListener("submit", event => {
      event.preventDefault();

      const start = $("cycle-start").value;
      const end = $("cycle-end").value;
      const message = $("cycle-form-message");

      if (!start) {
        message.textContent = "Please select the period start date.";
        return;
      }
      if (end && end < start) {
        message.textContent = "The end date cannot be before the start date.";
        return;
      }

      const records = loadRecords();
      const entry = {
        id: `${start}_${Date.now()}`,
        start,
        end,
        flow: $("cycle-flow").value,
        pain: Number($("cycle-pain").value || 0),
        sleep: $("cycle-sleep").value,
        mood: $("cycle-mood").value,
        weight: $("cycle-weight").value,
        activity: $("cycle-activity").value,
        symptoms: $("cycle-symptoms").value.trim(),
        notes: $("cycle-notes").value.trim(),
        savedAt: new Date().toISOString()
      };

      try {
        const existing = records.findIndex(r => r.start === start);
        if (existing >= 0) records[existing] = { ...records[existing], ...entry };
        else records.push(entry);

        saveRecords(records);
        render();
        form.reset();
        $("cycle-pain-value").textContent = "0";
        message.textContent = existing >= 0
          ? "Record updated successfully."
          : "Period record saved successfully.";
      } catch (error) {
        console.error(error);
        message.textContent = "Could not save. Check browser storage settings.";
      }
    });

    form.addEventListener("reset", () => {
      setTimeout(() => { $("cycle-pain-value").textContent = "0"; }, 0);
    });

    $("cycle-history-list").addEventListener("click", event => {
      const button = event.target.closest("[data-cycle-delete]");
      if (!button) return;
      const records = loadRecords().filter(r => r.id !== button.dataset.cycleDelete);
      saveRecords(records);
      render();
    });

    $("cycle-export").addEventListener("click", () => {
      const records = loadRecords();
      const blob = new Blob([JSON.stringify(records, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "integratedhealthai-cycle-records.json";
      link.click();
      URL.revokeObjectURL(url);
    });

    render();
    console.log("IntegratedHealthAI Cycle Tracking loaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
// END INTEGRATEDHEALTHAI_CYCLE_TRACKING_LOGIC_V1

// INTEGRATEDHEALTHAI_CYCLE_EXPORT_REPAIR_V1
(function () {
  "use strict";

  document.addEventListener("click", function (event) {
    const button = event.target instanceof Element
      ? event.target.closest("#cycle-export")
      : null;

    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    try {
      const records = JSON.parse(
        localStorage.getItem("integratedhealthai_cycle_tracking_v1") || "[]"
      );

      if (!Array.isArray(records) || records.length === 0) {
        alert("No cycle records to export. Save a period record first.");
        return;
      }

      const columns = [
        ["start", "Period start"],
        ["end", "Period end"],
        ["flow", "Flow"],
        ["pain", "Pain level"],
        ["sleep", "Sleep hours"],
        ["mood", "Mood"],
        ["weight", "Weight kg"],
        ["activity", "Physical activity"],
        ["symptoms", "Symptoms"],
        ["notes", "Notes"]
      ];

      function csvCell(value) {
        let text = value == null ? "" : String(value);

        // Prevent spreadsheet formula execution for text fields.
        if (/^[\s]*[=+\-@]/.test(text)) {
          text = "'" + text;
        }

        return '"' + text.replace(/"/g, '""') + '"';
      }

      const rows = [
        columns.map(column => csvCell(column[1])).join(","),
        ...records.map(record =>
          columns.map(column => csvCell(record[column[0]])).join(",")
        )
      ];

      const csv = "\uFEFF" + rows.join("\r\n");
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "IntegratedHealthAI_Cycle_History.csv";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) {
      console.error("Cycle export failed:", error);
      alert("Export failed. Please check the browser console for details.");
    }
  }, true);

  console.log("Cycle history export repair loaded.");
})();
// END INTEGRATEDHEALTHAI_CYCLE_EXPORT_REPAIR_V1

// INTEGRATEDHEALTHAI_EXPLORER_LOGIC_V1
(function () {
  "use strict";

  function initHealthExplorer() {
    const page = document.getElementById("page-explorer");
    if (!page || page.dataset.explorerReady === "true") return;

    const search = document.getElementById("explorer-search");
    const cards = Array.from(page.querySelectorAll(".explorer-topic-card"));
    const filters = Array.from(page.querySelectorAll("[data-explorer-filter]"));
    const count = document.getElementById("explorer-results-count");
    const empty = document.getElementById("explorer-empty");
    const clearButton = document.getElementById("explorer-clear");

    if (!search || !cards.length || !count || !empty) {
      console.warn("Health Explorer content or controls are missing.");
      return;
    }

    page.dataset.explorerReady = "true";
    let activeCategory = "all";

    function updateResults() {
      const query = search.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(card => {
        const category = card.dataset.explorerCategory || "";
        const searchable = (card.dataset.explorerSearch + " " + card.textContent).toLowerCase();
        const categoryMatches = activeCategory === "all" || category === activeCategory;
        const queryMatches = !query || searchable.includes(query);
        const show = categoryMatches && queryMatches;

        card.hidden = !show;
        if (show) visible++;
      });

      count.textContent = `${visible} educational topic${visible === 1 ? "" : "s"}`;
      empty.hidden = visible !== 0;
    }

    search.addEventListener("input", updateResults);

    filters.forEach(button => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.explorerFilter || "all";

        filters.forEach(item => {
          const selected = item === button;
          item.classList.toggle("active", selected);
          item.setAttribute("aria-pressed", String(selected));
        });

        updateResults();
      });
    });

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        search.value = "";
        activeCategory = "all";

        filters.forEach(item => {
          const selected = item.dataset.explorerFilter === "all";
          item.classList.toggle("active", selected);
          item.setAttribute("aria-pressed", String(selected));
        });

        updateResults();
      });
    }

    filters.forEach(item => {
      item.setAttribute("aria-pressed", String(item.dataset.explorerFilter === "all"));
    });

    updateResults();
    console.log("IntegratedHealthAI Health Explorer loaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHealthExplorer, { once: true });
  } else {
    initHealthExplorer();
  }
})();
// END INTEGRATEDHEALTHAI_EXPLORER_LOGIC_V1

