(() => {
  "use strict";

  const mount = () => {
    const page = document.getElementById("page-age");
    if (!page || page.dataset.ageGuideReady === "true") return;

    page.dataset.ageGuideReady = "true";

    const groups = [
      {
        id: "infant",
        range: "0–2 years",
        title: "Infants & Toddlers",
        subtitle: "Early growth, development and everyday care",
        tags: ["growth", "nutrition", "vaccination", "development"],
        sections: [
          ["Growth and development",
           "Discuss developmental milestones and growth with a paediatric clinician. Seek assessment if you notice loss of previously acquired skills or concerns about hearing, vision, movement or communication."],
          ["Nutrition",
           "Breast milk or appropriate infant formula is the main nutrition source in early infancy. Around 6 months, complementary foods are generally introduced when the child is developmentally ready. Seek individual feeding advice when needed."],
          ["Sleep and safety",
           "For infants, use a firm, flat sleep surface and place the baby on their back for every sleep. Keep pillows, loose blankets and soft objects out of the sleep space."],
          ["Preventive care",
           "Follow the local immunisation schedule and attend recommended growth, hearing, vision and developmental checks."]
        ]
      },
      {
        id: "preschool",
        range: "3–5 years",
        title: "Early Childhood",
        subtitle: "Building healthy routines and developmental skills",
        tags: ["growth", "nutrition", "sleep", "development"],
        sections: [
          ["Nutrition",
           "Offer a varied diet with vegetables, fruits, whole grains, protein sources and appropriate dairy or alternatives. Encourage water and limit sugary drinks."],
          ["Movement and play",
           "Encourage active play, outdoor time and age-appropriate movement. Balance screen use with sleep, play and family interaction."],
          ["Development",
           "Support language, social interaction and independence. Discuss persistent speech, hearing, vision, behavioural or developmental concerns with a paediatric clinician."],
          ["Prevention",
           "Maintain dental hygiene, routine dental visits, immunisations and regular health checks."]
        ]
      },
      {
        id: "school",
        range: "6–12 years",
        title: "School-age Children",
        subtitle: "Learning, growth, activity and emotional health",
        tags: ["nutrition", "school", "activity", "mental health"],
        sections: [
          ["Food and hydration",
           "Provide balanced meals, regular meal times and water. Avoid using food or body weight as a source of shame or punishment."],
          ["Physical activity",
           "Encourage enjoyable daily movement, sports and play, with suitable rest and recovery."],
          ["Sleep and learning",
           "Keep a consistent sleep schedule and a supportive bedtime routine. Persistent sleep problems, concentration difficulties or school struggles deserve attention."],
          ["Emotional wellbeing",
           "Ask about friendships, bullying, stress and mood. Listen without judgement and involve a trusted adult or clinician when concerns persist."]
        ]
      },
      {
        id: "teen",
        range: "13–17 years",
        title: "Adolescence",
        subtitle: "Puberty, independence and mental wellbeing",
        tags: ["puberty", "mental health", "nutrition", "prevention"],
        sections: [
          ["Puberty and body changes",
           "Puberty timing varies. Provide respectful, age-appropriate information about menstruation, sexual development, personal hygiene and consent."],
          ["Nutrition and movement",
           "Adolescents need adequate nutrition to support growth. Avoid extreme dieting, unprescribed supplements and appearance-based pressure."],
          ["Mental health",
           "Watch for persistent sadness, anxiety, isolation, major sleep changes or declining daily functioning. Seek professional support when these persist or worsen."],
          ["Preventive health",
           "Discuss immunisations, vision, dental care, healthy relationships, substance-use prevention and confidential healthcare options with a qualified clinician."]
        ]
      },
      {
        id: "young-adult",
        range: "18–39 years",
        title: "Young Adults",
        subtitle: "Establishing lifelong health habits",
        tags: ["prevention", "nutrition", "fitness", "mental health"],
        sections: [
          ["Everyday habits",
           "Build a routine around balanced meals, regular movement, adequate sleep and avoiding tobacco. Limit or avoid alcohol."],
          ["Preventive checks",
           "Discuss blood pressure, weight-related risks, dental and vision care, vaccination and other screening needs based on personal history."],
          ["Reproductive health",
           "Seek appropriate guidance about menstrual health, contraception, fertility, pregnancy planning and sexually transmitted infections when relevant."],
          ["Mental wellbeing",
           "Make time for social connection, stress management and recovery. Seek help if distress interferes with everyday life."]
        ]
      },
      {
        id: "midlife",
        range: "40–59 years",
        title: "Midlife Health",
        subtitle: "Prevention and early identification of health risks",
        tags: ["heart", "diabetes", "screening", "bone health"],
        sections: [
          ["Heart and metabolic health",
           "Discuss blood pressure, cholesterol and diabetes screening with a clinician according to your individual risk factors."],
          ["Cancer screening",
           "Ask about locally recommended screening based on age, sex, family history and previous results. Not every screening test is appropriate for everyone."],
          ["Muscle and bone health",
           "Combine appropriate resistance and weight-bearing activity with adequate nutrition. Persistent pain or suspected osteoporosis requires clinical assessment."],
          ["Sleep and life transitions",
           "Discuss sleep problems, menopause-related symptoms, sexual health or ongoing stress when relevant."]
        ]
      },
      {
        id: "older-adult",
        range: "60+ years",
        title: "Healthy Ageing",
        subtitle: "Maintaining independence, mobility and quality of life",
        tags: ["mobility", "medicines", "falls", "memory"],
        sections: [
          ["Mobility and falls",
           "Maintain suitable strength and balance activities. Review vision, footwear, home hazards and medicines that may increase falls risk."],
          ["Medication safety",
           "Keep an updated medicine list and review prescription medicines, over-the-counter products and herbal preparations with a clinician or pharmacist."],
          ["Nutrition and hydration",
           "Pay attention to protein and overall food intake, hydration, dental health and swallowing difficulties. Seek advice if appetite or weight changes unexpectedly."],
          ["Memory and social wellbeing",
           "Persistent changes in memory, mood or daily functioning deserve assessment. Encourage meaningful activities, social connection and routine preventive care."]
        ]
      }
    ];

    page.innerHTML = `
      <div class="page-intro">
        <div class="eyebrow">PERSONALISED HEALTH EDUCATION</div>
        <h2>Age-wise Health Guide</h2>
        <p>Explore age-specific guidance for growth, prevention, daily wellbeing and healthy ageing.</p>
      </div>

      <div class="age-guide-panel">
        <label for="age-guide-search">Search health topics</label>
        <input id="age-guide-search" type="search"
          placeholder="Try nutrition, sleep, diabetes, puberty or bone health">

        <div class="age-guide-filters" aria-label="Filter by age group">
          <button type="button" class="age-filter active" data-age="all">All ages</button>
          ${groups.map(g => `<button type="button" class="age-filter" data-age="${g.id}">${g.range}</button>`).join("")}
        </div>

        <div class="age-guide-note">
          Educational information only. Recommendations may vary according to medical history,
          development, pregnancy status, medicines and local clinical guidelines.
        </div>

        <div id="age-guide-results" class="age-guide-grid">
          ${groups.map(g => `
            <article class="age-guide-card" data-group="${g.id}"
              data-search="${(g.title + " " + g.range + " " + g.subtitle + " " + g.tags.join(" ")).toLowerCase()}">
              <span class="age-guide-range">${g.range}</span>
              <h3>${g.title}</h3>
              <p>${g.subtitle}</p>
              <div class="age-guide-tags">${g.tags.slice(0,3).map(t => `<span>${t}</span>`).join("")}</div>
              <button type="button" class="age-guide-open" data-open-age="${g.id}"
                aria-expanded="false">Explore Guide ↓</button>
              <div class="age-guide-details" id="age-details-${g.id}" hidden>
                ${g.sections.map(s => `<section><h4>${s[0]}</h4><p>${s[1]}</p></section>`).join("")}
              </div>
            </article>
          `).join("")}
        </div>
        <p id="age-guide-empty" hidden>No matching age groups or topics. Try another search.</p>
      </div>

      <div class="age-guide-disclaimer">
        <strong>Important:</strong> This guide does not diagnose or treat illness. It does not replace
        individual medical advice, vaccination schedules or recommended screening. Seek urgent medical
        help for severe breathing difficulty, unconsciousness, seizure, major bleeding or other
        potentially life-threatening symptoms.
      </div>
    `;

    let activeAge = "all";

    const filterCards = () => {
      const query = document.getElementById("age-guide-search").value.trim().toLowerCase();
      let count = 0;

      page.querySelectorAll(".age-guide-card").forEach(card => {
        const group = groups.find(g => g.id === card.dataset.group);
        const detailText = group.sections.flat().join(" ").toLowerCase();
        const matchesAge = activeAge === "all" || card.dataset.group === activeAge;
        const matchesText = !query ||
          (card.dataset.search + " " + detailText).includes(query);

        card.hidden = !(matchesAge && matchesText);
        if (!card.hidden) count++;
      });

      document.getElementById("age-guide-empty").hidden = count > 0;
    };

    page.querySelectorAll(".age-filter").forEach(button => {
      button.addEventListener("click", () => {
        activeAge = button.dataset.age;
        page.querySelectorAll(".age-filter").forEach(b =>
          b.classList.toggle("active", b === button)
        );
        filterCards();
      });
    });

    document.getElementById("age-guide-search").addEventListener("input", filterCards);

    page.querySelectorAll(".age-guide-open").forEach(button => {
      button.addEventListener("click", () => {
        const details = document.getElementById("age-details-" + button.dataset.openAge);
        const opening = details.hidden;
        details.hidden = !opening;
        button.setAttribute("aria-expanded", String(opening));
        button.textContent = opening ? "Close Guide ↑" : "Explore Guide ↓";
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  document.addEventListener("click", event => {
    const nav = event.target.closest('[data-page="age"]');
    if (nav) setTimeout(mount, 0);
  });
})();
