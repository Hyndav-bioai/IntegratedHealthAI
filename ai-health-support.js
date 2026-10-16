(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  let currentSummary = "";

  function addLine(container, label, value) {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value || "Not provided"));
    container.appendChild(p);
  }

  function getSummaryText() {
    const values = [
      ["Main concern", $("ai-concern").value.trim()],
      ["When it started", $("ai-duration").value.trim()],
      ["Severity", $("ai-severity").value],
      ["Pattern", $("ai-pattern").value],
      ["Other symptoms", $("ai-associated").value.trim()],
      ["Relevant medical history", $("ai-history").value.trim()],
      ["Medicines and supplements", $("ai-medicines").value.trim()]
    ];

    return [
      "INTEGRATEDHEALTHAI — HEALTH SUMMARY",
      "Prepared on: " + new Date().toLocaleString(),
      "",
      ...values.map(([label, value]) => label + ": " + (value || "Not provided")),
      "",
      "This summary records information provided by the user. It is not a diagnosis."
    ].join("\n");
  }

  function renderSummary() {
    const concern = $("ai-concern").value.trim();
    if (!concern) {
      $("ai-support-status").textContent = "Enter your main health concern first.";
      $("ai-concern").focus();
      return false;
    }

    const output = $("ai-summary-output");
    output.replaceChildren();

    const title = document.createElement("h4");
    title.textContent = "Your health summary";
    output.appendChild(title);

    addLine(output, "Main concern", concern);
    addLine(output, "When it started", $("ai-duration").value.trim());
    addLine(output, "Severity", $("ai-severity").value);
    addLine(output, "Pattern", $("ai-pattern").value);
    addLine(output, "Other symptoms", $("ai-associated").value.trim());
    addLine(output, "Relevant medical history", $("ai-history").value.trim());
    addLine(output, "Medicines and supplements", $("ai-medicines").value.trim());

    const note = document.createElement("p");
    note.textContent = "Review this information for accuracy before sharing it with your healthcare professional.";
    output.appendChild(note);

    currentSummary = getSummaryText();
    $("ai-support-status").textContent = "Summary prepared. Please review it.";
    return true;
  }

  function prepareQuestions() {
    const type = $("ai-visit-type").value;
    const questionSets = {
      general: [
        "What are the possible explanations for my concern?",
        "Do I need an examination or any tests?",
        "What changes or symptoms should I monitor?",
        "When should I seek follow-up care?"
      ],
      new: [
        "What conditions should be considered based on my history and examination?",
        "Are any tests or examinations appropriate?",
        "Which warning signs require urgent attention?",
        "What should I do if symptoms persist or worsen?"
      ],
      followup: [
        "How is my condition progressing?",
        "Are my current treatment goals being met?",
        "Do I need any follow-up tests or adjustments?",
        "When should my next review take place?"
      ],
      medication: [
        "What is the purpose of each medicine I take?",
        "What side effects or interactions should I know about?",
        "How should I take these medicines safely?",
        "Should any medicines be reviewed or monitored?"
      ],
      ayurveda: [
        "What is the proposed purpose and expected benefit of this treatment?",
        "What are the known risks, contraindications and alternatives?",
        "Could the treatment interact with my current medicines or supplements?",
        "How will progress and adverse effects be monitored?"
      ],
      tests: [
        "What does this test measure and why was it ordered?",
        "Do I need any preparation for the test?",
        "How should the results be interpreted in my clinical context?",
        "Is any repeat testing or follow-up needed?"
      ]
    };

    const output = $("ai-question-output");
    output.replaceChildren();

    const title = document.createElement("h4");
    title.textContent = "Questions for your appointment";
    output.appendChild(title);

    const list = document.createElement("ol");
    questionSets[type].forEach(question => {
      const item = document.createElement("li");
      item.textContent = question;
      list.appendChild(item);
    });
    output.appendChild(list);

    if ($("ai-concern").value.trim()) {
      const item = document.createElement("p");
      item.textContent = "Remember to explain when your concern started, how it has changed, and what medicines or supplements you use.";
      output.appendChild(item);
    }
  }

  function navigateCare() {
    const system = $("ai-health-system").value;
    const purpose = $("ai-care-purpose").value;
    const output = $("ai-care-output");
    output.replaceChildren();

    const pathways = {
      new: "Arrange an assessment with an appropriately qualified healthcare professional. They can review your history, examine you and decide whether investigations are needed.",
      ongoing: "Arrange follow-up with a professional familiar with your condition. Bring previous reports and a current list of medicines.",
      prevention: "Discuss age-appropriate screening, vaccination, nutrition, physical activity and individual risk factors.",
      review: "Bring all prescribed medicines, over-the-counter products and supplements. Ask about benefits, risks, interactions and monitoring.",
      second: "Organize your previous reports and treatment history and ask another appropriately qualified professional for an independent assessment."
    };

    const heading = document.createElement("h4");
    heading.textContent = "Suggested next step";
    output.appendChild(heading);

    addLine(output, "Selected healthcare system", system);

    const p = document.createElement("p");
    p.textContent = pathways[purpose];
    output.appendChild(p);

    const safety = document.createElement("p");
    safety.textContent =
      system === "Modern Medicine"
        ? "For new, severe or worsening symptoms, timely medical assessment is important."
        : "Check practitioner qualifications, evidence, contraindications and possible interactions. Do not delay emergency care or stop prescribed medicines.";
    output.appendChild(safety);

    const note = document.createElement("p");
    note.textContent = "This navigator provides general direction only. It does not verify practitioners or book appointments.";
    output.appendChild(note);
  }

  async function copySummary() {
    if (!currentSummary && !renderSummary()) return;

    try {
      await navigator.clipboard.writeText(currentSummary);
      $("ai-support-status").textContent = "Summary copied to clipboard.";
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = currentSummary;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();

      let copied = false;
      try { copied = document.execCommand("copy"); } catch (_) {}

      area.remove();
      $("ai-support-status").textContent = copied
        ? "Summary copied to clipboard."
        : "Copy was blocked by the browser. Use Download Summary instead.";
    }
  }

  function downloadSummary() {
    if (!currentSummary && !renderSummary()) return;

    const blob = new Blob([currentSummary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "IntegratedHealthAI_Health_Summary.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    $("ai-support-status").textContent = "Summary download requested.";
  }

  function clearEntries() {
    $("ai-support-form").reset();
    $("ai-summary-output").replaceChildren();
    const message = document.createElement("p");
    message.textContent = "Your organized summary will appear here after you submit your health concern.";
    $("ai-summary-output").appendChild(message);
    currentSummary = "";
    $("ai-support-status").textContent = "Entries cleared from this form.";
  }

  function init() {
    const page = $("page-ai");
    if (!page || page.dataset.aiSupportReady === "true") return;
    page.dataset.aiSupportReady = "true";

    $("ai-support-form").addEventListener("submit", event => {
      event.preventDefault();
      renderSummary();
    });

    $("ai-prepare-questions").addEventListener("click", prepareQuestions);
    $("ai-navigate-care").addEventListener("click", navigateCare);
    $("ai-copy-summary").addEventListener("click", copySummary);
    $("ai-download-summary").addEventListener("click", downloadSummary);
    $("ai-clear-summary").addEventListener("click", clearEntries);

    console.log("IntegratedHealthAI Health Support tools loaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
