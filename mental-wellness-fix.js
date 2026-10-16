// INTEGRATEDHEALTHAI_MENTAL_BREATHING_REPAIR_V1
(function () {
    "use strict";

    let timer = null;
    let elapsed = 0;
    const duration = 60;

    function byId(id) {
        return document.getElementById(id);
    }

    function setText(id, value) {
        const element = byId(id);
        if (element) element.textContent = value;
    }

    function stopTimer() {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }

    function renderBreathing() {
        const circle = byId("mental-breathing-circle");
        if (!circle) return;

        const remaining = Math.max(0, duration - elapsed);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        setText(
            "mental-breathing-count",
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0")
        );

        circle.classList.remove(
            "mental-inhale",
            "mental-hold",
            "mental-exhale"
        );

        const phase = elapsed % 14;

        if (phase < 4) {
            setText("mental-breathing-stage", "Breathe in");
            setText(
                "mental-breathing-instruction",
                "Breathe in gently at a comfortable pace. Do not force a deep breath."
            );
            circle.classList.add("mental-inhale");
        } else if (phase < 6) {
            setText("mental-breathing-stage", "Pause");
            setText(
                "mental-breathing-instruction",
                "Pause only if comfortable. You can continue breathing naturally."
            );
            circle.classList.add("mental-hold");
        } else {
            setText("mental-breathing-stage", "Breathe out");
            setText(
                "mental-breathing-instruction",
                "Let your breath out gently. Return to normal breathing whenever you wish."
            );
            circle.classList.add("mental-exhale");
        }
    }

    function startBreathing() {
        if (!byId("mental-breathing-circle")) {
            console.error("Mental Wellbeing breathing display was not found.");
            return;
        }

        if (timer !== null) return;

        if (elapsed >= duration) elapsed = 0;

        renderBreathing();

        timer = setInterval(function () {
            elapsed += 1;

            if (elapsed >= duration) {
                stopTimer();
                elapsed = duration;

                const circle = byId("mental-breathing-circle");
                if (circle) {
                    circle.classList.remove(
                        "mental-inhale",
                        "mental-hold",
                        "mental-exhale"
                    );
                }

                setText("mental-breathing-stage", "Complete");
                setText("mental-breathing-count", "00:00");
                setText(
                    "mental-breathing-instruction",
                    "Your minute is complete. Notice how you feel, or return to normal breathing."
                );
                return;
            }

            renderBreathing();
        }, 1000);
    }

    function resetBreathing() {
        stopTimer();
        elapsed = 0;

        const circle = byId("mental-breathing-circle");
        if (circle) {
            circle.classList.remove(
                "mental-inhale",
                "mental-hold",
                "mental-exhale"
            );
        }

        setText("mental-breathing-stage", "Ready");
        setText("mental-breathing-count", "01:00");
        setText(
            "mental-breathing-instruction",
            "Stopped. Return to normal breathing and restart whenever you feel ready."
        );
    }

    // Capture the button click before any older handler can interfere.
    document.addEventListener("click", function (event) {
        const target = event.target instanceof Element
            ? event.target.closest("#mental-breathing-start, #mental-breathing-stop")
            : null;

        if (!target) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        if (target.id === "mental-breathing-start") {
            startBreathing();
        } else {
            resetBreathing();
        }
    }, true);

    console.log("Mental Wellbeing breathing repair loaded.");
})();
// END INTEGRATEDHEALTHAI_MENTAL_BREATHING_REPAIR_V1

// INTEGRATEDHEALTHAI_GROUNDING_GRATITUDE_FIX_V1
(function () {
    "use strict";

    const groundingPrompts = [
        "Look around slowly. Name five things you can see, four things you can feel, and three things you can hear. Take your time.",
        "Place your feet comfortably on the floor. Notice the support beneath you and the sensations around you.",
        "Choose one object nearby. Notice its colour, shape, texture and details without rushing.",
        "Notice three sounds around you. Let them come and go without needing to change them."
    ];

    const gratitudePrompts = [
        "What is one small thing you appreciated today?",
        "Who or what helped you feel supported recently?",
        "What is one kind thing you could do for yourself tomorrow?",
        "What is something ordinary in your life that brings you comfort?"
    ];

    let groundingIndex = 0;
    let gratitudeIndex = 0;

    document.addEventListener("click", function (event) {
        const target = event.target instanceof Element
            ? event.target.closest(
                "#mental-grounding-start, #mental-gratitude-start"
              )
            : null;

        if (!target) return;

        const isGrounding = target.id === "mental-grounding-start";
        const output = document.getElementById(
            isGrounding
                ? "mental-grounding-content"
                : "mental-gratitude-content"
        );

        if (!output) {
            console.error("Mental Wellness exercise output was not found.");
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        if (isGrounding) {
            output.textContent = groundingPrompts[
                groundingIndex % groundingPrompts.length
            ];
            groundingIndex++;
        } else {
            output.textContent = gratitudePrompts[
                gratitudeIndex % gratitudePrompts.length
            ];
            gratitudeIndex++;
        }

        output.style.display = "block";
    }, true);

    console.log("Grounding and Gratitude repair loaded.");
})();
// END INTEGRATEDHEALTHAI_GROUNDING_GRATITUDE_FIX_V1
