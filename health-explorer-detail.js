(function () {
  "use strict";

  const topics = {
    "Heart and Circulation": {
      overview: "The cardiovascular system consists of the heart and blood vessels. It circulates blood to deliver oxygen and nutrients throughout the body.",
      learn: [
        "Blood pressure measures the force of blood against artery walls.",
        "Cholesterol, diabetes, smoking, inactivity and family history can influence cardiovascular risk.",
        "A healthcare professional can assess personal risk and recommend appropriate checks."
      ],
      prevention: [
        "Stay physically active according to your abilities.",
        "Choose a balanced diet and avoid tobacco.",
        "Follow prescribed treatment and attend recommended health checks."
      ],
      care: "Seek emergency care for chest pressure, severe breathlessness, fainting with concerning symptoms, or sudden weakness or difficulty speaking."
    },
    "Digestive Health": {
      overview: "The digestive system breaks food down, absorbs nutrients and removes waste. The stomach, intestines, liver and pancreas all contribute to digestion.",
      learn: [
        "Bowel habits vary between individuals.",
        "Persistent abdominal pain, ongoing changes in bowel habits and unexplained weight loss need assessment.",
        "Digestive symptoms can have many different causes."
      ],
      prevention: [
        "Eat a varied diet with appropriate fibre.",
        "Drink enough fluids for your needs.",
        "Wash hands and handle food safely."
      ],
      care: "Seek urgent assessment for severe abdominal pain, vomiting blood, black or bloody stools, or persistent vomiting with dehydration."
    },
    "Respiratory Health": {
      overview: "The respiratory system moves air into and out of the lungs, allowing oxygen uptake and carbon dioxide removal.",
      learn: [
        "Cough and breathlessness can have many causes.",
        "Asthma and respiratory infections require assessment based on symptoms and history.",
        "Air pollution and tobacco smoke can harm respiratory health."
      ],
      prevention: [
        "Avoid smoking and second-hand smoke.",
        "Reduce exposure to air pollution where possible.",
        "Keep recommended vaccinations up to date."
      ],
      care: "Severe difficulty breathing, blue or grey lips, confusion, or sudden severe chest pain require emergency medical care."
    },
    "Brain and Nervous System": {
      overview: "The brain, spinal cord and peripheral nerves coordinate movement, sensation, memory, thinking and many automatic body functions.",
      learn: [
        "Sleep, physical activity and general health influence brain function.",
        "New weakness, numbness or changes in coordination require appropriate assessment.",
        "Sudden neurological symptoms can be time-critical."
      ],
      prevention: [
        "Maintain a regular sleep routine.",
        "Use seatbelts and appropriate protective equipment.",
        "Manage health conditions with professional guidance."
      ],
      care: "Sudden facial drooping, weakness on one side, speech difficulty, a seizure or a sudden severe headache may be an emergency."
    },
    "Diabetes and Blood Sugar": {
      overview: "Diabetes is a group of conditions affecting blood glucose regulation. Diagnosis requires appropriate clinical assessment and laboratory testing.",
      learn: [
        "Type 1 and type 2 diabetes have different mechanisms.",
        "Risk factors differ by diabetes type.",
        "Monitoring and treatment depend on the individual and the type of diabetes."
      ],
      prevention: [
        "Balanced eating and regular physical activity support general metabolic health.",
        "Attend recommended screening if you have risk factors.",
        "Do not stop prescribed diabetes medicines without medical advice."
      ],
      care: "Confusion, unconsciousness, severe weakness or other signs of a serious blood glucose problem require urgent help."
    },
    "High Blood Pressure": {
      overview: "High blood pressure is a persistent elevation in arterial pressure. It often causes no obvious symptoms, so accurate measurement matters.",
      learn: [
        "One reading alone may not establish a diagnosis.",
        "Correct cuff size, posture and rest before measurement improve accuracy.",
        "A clinician can interpret readings in the context of your health."
      ],
      prevention: [
        "Limit excessive dietary salt.",
        "Be physically active and avoid tobacco.",
        "Take prescribed medicines as directed."
      ],
      care: "Very high readings accompanied by chest pain, breathlessness, confusion, vision changes or neurological symptoms require emergency assessment."
    },
    "Bones, Joints and Muscles": {
      overview: "Bones support the body, joints allow movement and muscles generate force. Pain can arise from many different conditions.",
      learn: [
        "Strength, balance and mobility are important across the lifespan.",
        "Persistent joint or bone pain may need examination and investigations.",
        "Bone health can be affected by age, nutrition, medicines and medical conditions."
      ],
      prevention: [
        "Choose suitable weight-bearing and strengthening activities when safe.",
        "Maintain adequate nutrition and discuss bone health risk factors with a clinician.",
        "Increase activity gradually and use appropriate injury prevention."
      ],
      care: "Seek urgent care for a suspected fracture, a hot swollen joint with fever, or new weakness or loss of sensation."
    },
    "Nutrition and Healthy Eating": {
      overview: "A balanced dietary pattern supplies energy, protein, fats, carbohydrates, vitamins, minerals and fibre.",
      learn: [
        "Nutritional needs vary with age, activity, pregnancy and health conditions.",
        "No single food provides every nutrient.",
        "Restrictive diets may create nutritional deficiencies."
      ],
      prevention: [
        "Include a variety of vegetables, fruit, pulses, whole grains and appropriate protein sources.",
        "Drink fluids regularly according to your needs.",
        "Seek qualified advice for special diets or diagnosed deficiencies."
      ],
      care: "Unintentional weight loss, persistent difficulty swallowing or signs of severe dehydration should be medically assessed."
    },
    "Movement and Lifestyle": {
      overview: "Physical activity, sleep, stress management and social connection can contribute to overall wellbeing.",
      learn: [
        "Activity can include walking, household movement, exercise and appropriate yoga.",
        "Sleep needs vary, although consistent routines can help.",
        "Rest and recovery matter when building an activity routine."
      ],
      prevention: [
        "Start with manageable activities and increase gradually.",
        "Maintain a regular sleep schedule.",
        "Choose stress-management practices that feel comfortable and sustainable."
      ],
      care: "Stop exercising and seek assessment for chest pain, fainting or unusual severe breathlessness."
    },
    "Ayurveda and Daily Routine": {
      overview: "Ayurveda is a traditional Indian system of healthcare. Concepts such as Dosha, Prakriti and Dinacharya belong to its traditional framework.",
      learn: [
        "Vata, Pitta and Kapha are traditional Ayurvedic concepts, not equivalent to laboratory measurements.",
        "Dinacharya refers to daily routine practices in Ayurveda.",
        "Traditional explanations and clinical evidence should be distinguished clearly."
      ],
      prevention: [
        "Maintain regular meals, sleep and appropriate movement.",
        "Discuss herbal products and therapies with a qualified professional.",
        "Check potential interactions with medicines and underlying conditions."
      ],
      care: "Do not delay urgent assessment or discontinue prescribed treatment in favour of a traditional remedy. Some herbal products can cause adverse effects or interact with medicines."
    },
    "Explore Healthcare Systems": {
      overview: "Healthcare systems differ in their history, diagnostic approaches, training and treatment methods. Individual treatment choices should be informed and safe.",
      learn: [
        "Modern medicine uses clinical examination, investigations and evidence-based treatment guidelines.",
        "Ayurveda, Unani and Siddha have their own traditional theories and practices.",
        "Naturopathy and Yoga include varied practices; evidence and safety differ by intervention."
      ],
      prevention: [
        "Ask about evidence, expected benefits, risks and alternatives.",
        "Share all medicines, supplements and therapies with your healthcare team.",
        "Use qualified practitioners and reliable sources of information."
      ],
      care: "Seek urgent medical care for emergencies regardless of the healthcare system you usually use."
    },
    "Health Across the Lifespan": {
      overview: "Health needs evolve through childhood, adolescence, adulthood and older age. Screening and preventive care should reflect age, history and individual risk.",
      learn: [
        "Children need age-appropriate growth and developmental monitoring.",
        "Adults may benefit from preventive screening based on risk and local guidance.",
        "Older adults may need additional attention to mobility, medicines, vision and falls."
      ],
      prevention: [
        "Attend appropriate preventive health appointments.",
        "Keep recommended vaccinations up to date.",
        "Discuss personal and family history with a healthcare professional."
      ],
      care: "New, persistent or rapidly worsening symptoms deserve appropriate assessment at any age."
    }
  };

  let activeModal = null;
  let previousFocus = null;

  function makeElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.remove();
    activeModal = null;
    document.removeEventListener("keydown", onKeyDown);
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
  }

  function onKeyDown(event) {
    if (event.key === "Escape") closeModal();
  }

  function openTopic(card, button) {
    closeModal();
    previousFocus = button;

    const heading = card.querySelector("h3");
    const title = heading ? heading.textContent.trim() : "Health Topic";
    const data = topics[title];

    if (!data) {
      window.alert("Detailed information for this topic is not available yet.");
      return;
    }

    const overlay = makeElement("div", "explorer-detail-overlay");
    overlay.setAttribute("role", "presentation");

    const dialog = makeElement("section", "explorer-detail-dialog");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "explorer-detail-title");

    const header = makeElement("div", "explorer-detail-header");
    const headingWrap = makeElement("div");
    headingWrap.appendChild(makeElement("span", "explorer-detail-eyebrow", "HEALTH KNOWLEDGE"));
    headingWrap.appendChild(makeElement("h2", "", title));
    header.appendChild(headingWrap);

    const close = makeElement("button", "explorer-detail-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close topic details");
    close.addEventListener("click", closeModal);
    header.appendChild(close);
    dialog.appendChild(header);

    dialog.appendChild(makeElement("p", "explorer-detail-overview", data.overview));

    function addListSection(titleText, items) {
      const section = makeElement("div", "explorer-detail-section");
      section.appendChild(makeElement("h3", "", titleText));
      const list = makeElement("ul");
      items.forEach(item => list.appendChild(makeElement("li", "", item)));
      section.appendChild(list);
      dialog.appendChild(section);
    }

    addListSection("What to know", data.learn);
    addListSection("Everyday health and prevention", data.prevention);

    const warning = makeElement("div", "explorer-detail-care");
    warning.appendChild(makeElement("h3", "", "When to seek medical care"));
    warning.appendChild(makeElement("p", "", data.care));
    dialog.appendChild(warning);

    dialog.appendChild(makeElement(
      "p",
      "explorer-detail-disclaimer",
      "Educational information only. This content is not a diagnosis or personalised treatment plan. For individual advice, consult an appropriately qualified healthcare professional."
    ));

    overlay.appendChild(dialog);
    overlay.addEventListener("click", event => {
      if (event.target === overlay) closeModal();
    });

    document.body.appendChild(overlay);
    activeModal = overlay;
    close.focus();
    document.addEventListener("keydown", onKeyDown);
  }

  document.addEventListener("click", function (event) {
    const button = event.target instanceof Element
      ? event.target.closest(".explorer-open-topic")
      : null;

    if (!button) return;
    const card = button.closest(".explorer-topic-card");
    if (!card) return;

    event.preventDefault();
    openTopic(card, button);
  });

  console.log("Health Explorer detail panels loaded.");
})();
