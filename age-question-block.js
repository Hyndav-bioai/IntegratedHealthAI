(function () {
    "use strict";

    function installAgeQuestions() {
        const page = document.getElementById("page-age");

        if (!page || document.getElementById("age-question-corner")) {
            return;
        }

        const box = document.createElement("section");
        box.id = "age-question-corner";
        box.className = "age-question-corner";

        box.innerHTML = `
            <div class="aq-header">
                <span class="aq-label">YOUR HEALTH QUESTIONS</span>
                <h2>Ask Your Health Doubt</h2>
                <p>Choose an age group, type your question and explore health education relevant to that stage of life.</p>
            </div>

            <label for="aq-age">Select age group</label>
            <select id="aq-age">
                <option value="baby">Babies: 0-2 years</option>
                <option value="preschool">Preschool: 3-5 years</option>
                <option value="child">Children: 6-12 years</option>
                <option value="teen">Teenagers: 13-17 years</option>
                <option value="adult">Adults: 18-39 years</option>
                <option value="middle">Adults: 40-59 years</option>
                <option value="older">Older adults: 60+ years</option>
            </select>

            <label for="aq-question">What would you like to know?</label>
            <textarea id="aq-question" rows="3"
                placeholder="Example: What are the important milestones for an 18-month-old child?"></textarea>

            <div class="aq-actions">
                <button type="button" id="aq-ask">Find Information</button>
                <button type="button" id="aq-clear" class="aq-secondary">Ask Another Question</button>
            </div>

            <div id="aq-answer" class="aq-answer" aria-live="polite" hidden></div>

            <p class="aq-disclaimer">
                Educational information only. This tool does not diagnose illness or replace
                an examination by a qualified healthcare professional.
            </p>
        `;

        page.appendChild(box);

        const questionInput = document.getElementById("aq-question");
        const ageInput = document.getElementById("aq-age");
        const answerBox = document.getElementById("aq-answer");

        const knowledge = [
            {
                keys: ["milestone", "development", "talking", "speech", "walking", "crawl"],
                title: "Child development and milestones",
                text: "Children develop communication, movement, learning and social skills at different rates. Track skills over time and discuss concerns with a paediatrician. If a child loses a skill they previously had, seek prompt medical assessment."
            },
            {
                keys: ["weight", "underweight", "gain weight", "growth", "height", "growth chart"],
                title: "Growth and healthy nutrition",
                text: "Growth is assessed using age-appropriate growth charts and measurements over time, not a single weight alone. Offer varied, age-appropriate foods and regular meals. A paediatrician or qualified dietitian can assess poor growth, feeding difficulties or unexpected weight changes."
            },
            {
                keys: ["food", "diet", "nutrition", "eat", "meal", "feeding", "protein", "vitamin"],
                title: "Nutrition and healthy eating",
                text: "Nutritional needs vary with age, growth, activity and health. Aim for a varied diet with suitable sources of protein, grains, vegetables, fruits and other locally available nutritious foods. Infants have special feeding needs; babies under about 6 months generally need breast milk or infant formula unless a clinician advises otherwise. Introduce complementary foods at around 6 months with appropriate texture and safety. Seek individual advice for allergies, poor growth or medical conditions."
            },
            {
                keys: ["sleep", "insomnia", "sleeping", "tired", "fatigue"],
                title: "Sleep and rest",
                text: "Sleep needs change with age. A consistent bedtime, regular waking time, a comfortable sleep environment and reduced screen use before bed may help. Persistent sleep problems, loud snoring, breathing pauses or severe daytime sleepiness deserve medical assessment."
            },
            {
                keys: ["fever", "temperature", "hot body"],
                title: "Fever and warning signs",
                text: "Fever can have many causes. Encourage appropriate fluids and monitor the person's general condition. A baby younger than 3 months with a temperature of 38 C or higher needs urgent medical assessment. At any age, breathing difficulty, confusion, seizure, severe dehydration or unusual difficulty waking requires emergency care."
            },
            {
                keys: ["vaccine", "vaccination", "immunization", "immunisation"],
                title: "Vaccination",
                text: "Vaccination schedules depend on age, previous doses and local recommendations. Check the current national immunisation schedule and discuss missed doses or special medical circumstances with a qualified healthcare professional."
            },
            {
                keys: ["acne", "pimple", "puberty", "period", "menstruation", "teenager"],
                title: "Adolescence and puberty",
                text: "Puberty can bring changes in skin, body shape, emotions and sleep. Gentle skin care and regular routines may help. Persistent severe acne, very painful periods, absent periods when expected or distressing emotional changes should be discussed with a healthcare professional."
            },
            {
                keys: ["exercise", "fitness", "physical activity", "walking", "strength", "balance"],
                title: "Movement and physical activity",
                text: "Choose activities suited to age, ability and health. Children benefit from active play; adults benefit from regular aerobic activity and muscle-strengthening exercise. Older adults may benefit from strength and balance activities. Start gradually and seek clinical advice when symptoms or medical conditions make exercise uncertain."
            },
            {
                keys: ["memory", "forgetful", "confusion", "dementia"],
                title: "Memory and cognitive health",
                text: "Memory changes can have many causes, including sleep problems, medication effects, mood changes and medical conditions. New or worsening problems that affect daily activities should be assessed by a healthcare professional. Sudden confusion requires urgent medical attention."
            },
            {
                keys: ["stress", "anxiety", "sad", "depression", "mood", "mental health"],
                title: "Emotional wellbeing",
                text: "Regular sleep, movement, social connection and relaxation practices can support wellbeing. If distress persists or affects daily life, consider speaking with a qualified mental health professional. Thoughts of self-harm or immediate danger require urgent local crisis or emergency support."
            },
            {
                keys: ["blood pressure", "diabetes", "sugar", "cholesterol", "heart"],
                title: "Preventive health and chronic conditions",
                text: "Blood pressure, blood glucose and cholesterol checks may be appropriate depending on age, risk factors and medical history. Healthy eating, physical activity and avoiding tobacco can support long-term health. Screening intervals and treatment decisions should be individualised by a qualified clinician."
            },
            {
                keys: ["fall", "falling", "joint pain", "bone", "osteoporosis", "fracture"],
                title: "Bone health and fall prevention",
                text: "Adequate nutrition, suitable strength and balance exercises, vision checks and review of medicines can help support bone health and reduce fall risk. New severe pain after a fall, inability to bear weight or suspected fracture needs prompt medical assessment."
            }
        ];

        function showAnswer(title, text) {
            answerBox.replaceChildren();

            const heading = document.createElement("h3");
            heading.textContent = title;

            const paragraph = document.createElement("p");
            paragraph.textContent = text;

            answerBox.append(heading, paragraph);
            answerBox.hidden = false;
        }

        function askQuestion() {
            const question = questionInput.value.trim().toLowerCase();
            const age = ageInput.options[ageInput.selectedIndex].text;

            if (question.length < 3) {
                showAnswer(
                    "Please enter your question",
                    "Type a little more about what you would like to know, then select Find Information."
                );
                return;
            }

            const matches = knowledge.filter(function (item) {
                return item.keys.some(function (keyword) {
                    return question.includes(keyword);
                });
            });

            if (matches.length) {
                showAnswer(
                    matches[0].title + " | " + age,
                    matches[0].text +
                    " These are general educational suggestions. The information may not apply to every person in this age group."
                );
            } else {
                showAnswer(
                    "More information may be needed",
                    "This question is not covered by the built-in topics yet. Try asking about nutrition, growth, milestones, sleep, fever, vaccination, puberty, exercise, memory, stress, blood pressure, diabetes or bone health. For a question about an individual symptom or treatment, consult a qualified healthcare professional."
                );
            }
        }

        document.getElementById("aq-ask").addEventListener("click", askQuestion);

        questionInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                askQuestion();
            }
        });

        document.getElementById("aq-clear").addEventListener("click", function () {
            questionInput.value = "";
            answerBox.replaceChildren();
            answerBox.hidden = true;
            questionInput.focus();
        });
    }

    function start() {
        installAgeQuestions();

        const page = document.getElementById("page-age");
        if (!page) return;

        const observer = new MutationObserver(function () {
            installAgeQuestions();
        });

        observer.observe(page, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
