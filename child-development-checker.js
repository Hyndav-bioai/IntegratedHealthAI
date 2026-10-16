(() => {
"use strict";

const CHECKPOINTS = [
{
  age: 2, label: "2 months",
  items: [
    ["social","Looks at a caregiver's face"],
    ["social","Smiles when spoken to or smiled at"],
    ["communication","Reacts to loud sounds"],
    ["communication","Makes sounds other than crying"],
    ["motor","Holds the head up briefly during tummy time"]
  ]
},
{
  age: 4, label: "4 months",
  items: [
    ["social","Smiles to get attention or responds with a smile"],
    ["social","Looks at the caregiver to maintain interaction"],
    ["communication","Makes sounds such as 'oooo' or 'aahh'"],
    ["communication","Turns toward the sound of a familiar voice"],
    ["motor","Holds the head steady when being held"],
    ["motor","Brings hands to the mouth"]
  ]
},
{
  age: 6, label: "6 months",
  items: [
    ["social","Recognises familiar people"],
    ["social","Laughs"],
    ["communication","Takes turns making sounds with a caregiver"],
    ["communication","Blows raspberries or squeals"],
    ["motor","Reaches to grab a toy"],
    ["motor","Rolls from tummy to back"],
    ["learning","Looks at objects nearby with interest"]
  ]
},
{
  age: 9, label: "9 months",
  items: [
    ["social","Shows different facial expressions"],
    ["social","Looks when their name is called"],
    ["communication","Babbles repeated sounds such as 'mamama' or 'bababa'"],
    ["communication","Lifts their arms to be picked up"],
    ["motor","Sits without support"],
    ["motor","Moves objects from one hand to the other"],
    ["learning","Looks for an object when it drops out of sight"]
  ]
},
{
  age: 12, label: "12 months",
  items: [
    ["social","Plays simple social games such as pat-a-cake"],
    ["communication","Waves bye-bye or uses another familiar gesture"],
    ["communication","Calls a parent 'mama', 'dada' or another special name"],
    ["motor","Pulls up to stand"],
    ["motor","Walks while holding furniture"],
    ["learning","Puts an object into a container"]
  ]
},
{
  age: 15, label: "15 months",
  items: [
    ["social","Copies another child or adult during play"],
    ["communication","Looks toward a familiar object when it is named"],
    ["communication","Tries to say one or two words besides names for parents"],
    ["motor","Takes a few steps independently"],
    ["motor","Uses fingers to feed themselves some food"],
    ["learning","Uses familiar objects in a simple way, such as drinking from a cup"]
  ]
},
{
  age: 18, label: "18 months",
  items: [
    ["social","Moves away to explore but checks that a caregiver is nearby"],
    ["social","Points to show something interesting"],
    ["communication","Tries to say at least three words besides names for parents"],
    ["communication","Follows a simple one-step direction without a gesture"],
    ["motor","Walks without holding on"],
    ["motor","Tries to use a spoon"],
    ["learning","Copies simple household actions"]
  ]
},
{
  age: 24, label: "2 years",
  items: [
    ["social","Notices when another person is upset and may show concern"],
    ["communication","Points to things in a book when asked"],
    ["communication","Uses at least two words together, such as 'more milk'"],
    ["motor","Runs"],
    ["motor","Kicks a ball"],
    ["learning","Uses both hands together to manipulate a toy"],
    ["learning","Tries switches, knobs or buttons on toys"]
  ]
},
{
  age: 30, label: "30 months",
  items: [
    ["social","Plays alongside other children and sometimes with them"],
    ["communication","Says around 50 words"],
    ["communication","Uses two or more words together, including an action word"],
    ["communication","Follows a two-step instruction"],
    ["motor","Jumps with both feet leaving the ground"],
    ["learning","Uses objects in pretend play, such as feeding a doll"],
    ["learning","Follows a simple routine"]
  ]
},
{
  age: 36, label: "3 years",
  items: [
    ["social","Calms down after a caregiver leaves in familiar settings"],
    ["social","Notices other children and joins them to play"],
    ["communication","Has a short back-and-forth conversation"],
    ["communication","Asks who, what, where or why questions"],
    ["communication","Is understood by others most of the time"],
    ["motor","Uses a fork"],
    ["learning","Draws a circle after being shown how"]
  ]
},
{
  age: 48, label: "4 years",
  items: [
    ["social","Pretends to be another character during play"],
    ["social","Comforts someone who is hurt or upset"],
    ["communication","Uses sentences of four or more words"],
    ["communication","Answers simple questions about something that happened"],
    ["motor","Catches a large ball much of the time"],
    ["motor","Unbuttons some buttons"],
    ["learning","Names a few colours"]
  ]
},
{
  age: 60, label: "5 years",
  items: [
    ["social","Follows rules or takes turns during games with other children"],
    ["social","Does simple household tasks"],
    ["communication","Tells a story with at least two events"],
    ["communication","Answers simple questions about a story"],
    ["motor","Hops on one foot"],
    ["motor","Buttons some buttons"],
    ["learning","Writes some letters in their name"]
  ]
}
];

const categories = {
  social: "Social and emotional development",
  communication: "Speech and communication",
  motor: "Movement and coordination",
  learning: "Learning and thinking"
};

function mount() {
  const page = document.getElementById("page-age");
  if (!page || !page.querySelector(".age-guide-grid")) return;
  if (page.querySelector("#child-milestone-checker")) return;

  const wrap = document.createElement("section");
  wrap.id = "child-milestone-checker";
  wrap.className = "milestone-checker";
  wrap.innerHTML = `
    <div class="milestone-heading">
      <div class="eyebrow">CHILD HEALTH • DEVELOPMENT</div>
      <h2>Child Development &amp; Milestone Checker</h2>
      <p>Answer questions about skills you have seen your child perform.
      Receive a guidance summary to help you decide what to discuss with a clinician.</p>
    </div>

    <div class="milestone-notice">
      <strong>This is a developmental monitoring aid, not a diagnostic test.</strong>
      Children develop at different rates. A reassuring result cannot rule out a developmental
      concern, and a concerning result does not establish a diagnosis.
    </div>

    <form id="milestone-form">
      <div class="milestone-field">
        <label for="milestone-child-age">Child's age</label>
        <select id="milestone-child-age" required>
          <option value="">Select an age checkpoint</option>
          ${CHECKPOINTS.map(c => `<option value="${c.age}">${c.label}</option>`).join("")}
        </select>
        <small>Choose the closest checklist age. For children born prematurely, ask a clinician whether corrected age should be used.</small>
      </div>

      <div class="milestone-field">
        <label for="milestone-premature">Was the child born more than 3 weeks early?</label>
        <select id="milestone-premature">
          <option value="unknown">Not sure / prefer not to say</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div class="milestone-field">
        <label for="milestone-regression">Has your child lost a skill they previously had?</label>
        <select id="milestone-regression" required>
          <option value="">Please select</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
          <option value="unsure">Not sure</option>
        </select>
        <small>Examples include no longer using words, losing movement abilities or no longer responding as before.</small>
      </div>

      <div id="milestone-questions" class="milestone-questions">
        <p>Select an age checkpoint above to begin.</p>
      </div>

      <div class="milestone-actions">
        <button type="submit" class="milestone-primary">Review Answers</button>
        <button type="button" id="milestone-reset" class="milestone-secondary">Start Again</button>
      </div>
    </form>

    <div id="milestone-result" class="milestone-result" aria-live="polite" hidden></div>

    <div class="milestone-reference">
      <strong>Reference:</strong>
      <a href="https://www.cdc.gov/act-early/resources/milestones-checklist-by-age.html"
         target="_blank" rel="noopener noreferrer">CDC developmental milestone checklists</a>.
      These sample questions are not a substitute for a validated developmental screening tool.
    </div>
  `;

  const intro = page.querySelector(".page-intro");
  if (intro) intro.insertAdjacentElement("afterend", wrap);
  else page.prepend(wrap);

  const form = wrap.querySelector("#milestone-form");
  const ageSelect = wrap.querySelector("#milestone-child-age");
  const questionBox = wrap.querySelector("#milestone-questions");
  const result = wrap.querySelector("#milestone-result");

  function renderQuestions() {
    result.hidden = true;
    const checkpoint = CHECKPOINTS.find(c => c.age === Number(ageSelect.value));

    if (!checkpoint) {
      questionBox.innerHTML = "<p>Select an age checkpoint above to begin.</p>";
      return;
    }

    questionBox.innerHTML = `
      <h3>Questions for ${checkpoint.label}</h3>
      <p class="milestone-help">For each skill, choose the answer that best describes what you have observed.</p>
      ${checkpoint.items.map((item, i) => `
        <fieldset class="milestone-question">
          <legend><span>${i + 1}.</span> ${item[1]}</legend>
          <div class="milestone-options">
            <label><input type="radio" name="milestone-${i}" value="yes" required> Yes, usually</label>
            <label><input type="radio" name="milestone-${i}" value="notyet"> Not yet</label>
            <label><input type="radio" name="milestone-${i}" value="unsure"> Not sure</label>
          </div>
          <input type="hidden" name="category-${i}" value="${item[0]}">
        </fieldset>
      `).join("")}
    `;
  }

  ageSelect.addEventListener("change", renderQuestions);

  form.addEventListener("submit", event => {
    event.preventDefault();

    const checkpoint = CHECKPOINTS.find(c => c.age === Number(ageSelect.value));
    if (!checkpoint) {
      ageSelect.focus();
      return;
    }

    const regression = wrap.querySelector("#milestone-regression").value;
    if (!regression) {
      wrap.querySelector("#milestone-regression").focus();
      return;
    }

    const answers = checkpoint.items.map((item, i) => {
      const selected = form.querySelector(`[name="milestone-${i}"]:checked`);
      return { category: item[0], question: item[1], answer: selected ? selected.value : "" };
    });

    if (answers.some(a => !a.answer)) {
      const firstMissing = answers.findIndex(a => !a.answer);
      const firstInput = form.querySelector(`[name="milestone-${firstMissing}"]`);
      if (firstInput) firstInput.focus();
      alert("Please answer every milestone question before reviewing the results.");
      return;
    }

    const yes = answers.filter(a => a.answer === "yes").length;
    const notYet = answers.filter(a => a.answer === "notyet");
    const unsure = answers.filter(a => a.answer === "unsure");
    const missingCount = notYet.length + unsure.length;
    const premature = wrap.querySelector("#milestone-premature").value;

    let heading, message, level;

    if (regression === "yes") {
      level = "concern";
      heading = "Please arrange a prompt medical assessment";
      message = "Losing a previously acquired skill is an important reason to contact your child's paediatrician or developmental clinician promptly, regardless of the checklist score. Do not wait for the next age checkpoint.";
    } else if (regression === "unsure") {
      level = "review";
      heading = "Discuss your concern with a clinician";
      message = "If you suspect your child has lost a skill, contact a paediatric clinician for advice. They can help clarify what you have observed and whether assessment is needed.";
    } else if (missingCount === 0) {
      level = "reassuring";
      heading = "Reported skills are reassuring for this checklist";
      message = "You reported that all listed skills are usually present. Continue observing development and attend routine health visits. This result does not rule out every developmental concern.";
    } else if (missingCount <= 2) {
      level = "review";
      heading = "Some skills need a closer look";
      message = "You marked one or more skills as not yet observed or were unsure. Children vary, but it is worth discussing these answers with your child's healthcare professional, particularly if a skill remains absent or you have concerns.";
    } else {
      level = "concern";
      heading = "A developmental review is recommended";
      message = "Several listed skills were not yet observed or were uncertain. Please arrange a discussion with a paediatrician or developmental professional. They can assess the child's full developmental history and decide whether formal screening or further assessment is appropriate.";
    }

    const categorySummary = Object.keys(categories).map(key => {
      const group = answers.filter(a => a.category === key);
      return {
        name: categories[key],
        yes: group.filter(a => a.answer === "yes").length,
        total: group.length,
        missing: group.filter(a => a.answer !== "yes").map(a => a.question)
      };
    }).filter(g => g.total > 0);

    result.hidden = false;
    result.className = "milestone-result level-" + level;
    result.innerHTML = `
      <div class="milestone-result-top">
        <span class="milestone-result-label">GUIDANCE SUMMARY • ${checkpoint.label}</span>
        <h3>${heading}</h3>
        <p>${message}</p>
      </div>

      ${premature === "yes" ? `<div class="milestone-result-alert"><strong>Prematurity:</strong> For children born more than 3 weeks early, corrected age may be relevant when discussing early milestones. Ask your clinician which age to use.</div>` : ""}

      <h4>Skills reported by area</h4>
      <div class="milestone-category-list">
        ${categorySummary.map(g => `
          <div class="milestone-category">
            <strong>${g.name}</strong>
            <span>${g.yes} of ${g.total} reported</span>
            ${g.missing.length ? `<small>To discuss: ${g.missing.join("; ")}</small>` : `<small>All listed skills reported</small>`}
          </div>
        `).join("")}
      </div>

      <h4>What to do next</h4>
      <ul>
        <li>Share these answers with your child's paediatrician or primary healthcare clinician.</li>
        <li>Describe what you observe at home and in other settings, and bring any previous developmental records.</li>
        <li>Ask whether a standardised developmental screening or hearing, vision, speech-language or other assessment is appropriate.</li>
        <li>If you remain concerned, seek an assessment even if many skills are present.</li>
      </ul>

      <div class="milestone-result-alert">
        <strong>Seek urgent help</strong> if your child has a sudden loss of abilities, new weakness,
        seizures, reduced responsiveness or another acute or severe symptom. Sudden symptoms need
        urgent assessment rather than a checklist.
      </div>

      <p class="milestone-score-note">This summary is based on your answers only. It is not a diagnosis, a probability score or a determination that development is normal or abnormal.</p>

      <div class="milestone-actions">
        <button type="button" id="milestone-print" class="milestone-primary">Print Summary</button>
      </div>
    `;

    const printButton = result.querySelector("#milestone-print");
    printButton.addEventListener("click", () => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Allow pop-ups for this local website to print the summary.");
        return;
      }
      printWindow.document.write(`
        <!doctype html><html><head><meta charset="utf-8">
        <title>Child Development Guidance Summary</title>
        <style>
          body{font:16px Arial,sans-serif;max-width:800px;margin:30px auto;padding:0 20px;line-height:1.6;color:#222}
          h1,h2,h3,h4{line-height:1.3}li{margin:6px 0}.milestone-category{padding:10px;border-bottom:1px solid #ccc}
          .milestone-result-alert{border:1px solid #aaa;padding:12px;margin:14px 0}
        </style></head><body>
        <h1>IntegratedHealthAI</h1>
        <h2>Child Development Guidance Summary</h2>
        <p>Checklist age: ${checkpoint.label}</p>
        ${result.innerHTML.replace(/<button[\s\S]*?<\/button>/g, "")}
        <p><small>Educational guidance only; not a diagnostic assessment.</small></p>
        </body></html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });

    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  wrap.querySelector("#milestone-reset").addEventListener("click", () => {
    form.reset();
    questionBox.innerHTML = "<p>Select an age checkpoint above to begin.</p>";
    result.hidden = true;
    ageSelect.focus();
  });
}

function watchPage() {
  const page = document.getElementById("page-age");
  if (!page) return;
  const observer = new MutationObserver(() => mount());
  observer.observe(page, { childList: true, subtree: true });
  mount();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", watchPage);
} else {
  watchPage();
}
})();
