(function () {
    "use strict";

    function initNutritionConnect() {
        const page = document.getElementById("page-nutrition");

        if (!page || document.getElementById("nutrition-connect-hub")) {
            return;
        }

        const hub = document.createElement("section");
        hub.id = "nutrition-connect-hub";
        hub.className = "nutrition-connect-hub";

        hub.innerHTML = `
            <div class="nc-heading">
                <span class="nc-eyebrow">INTEGRATED HEALTHCARE</span>
                <h2>Nutrition Connect Hub</h2>
                <p>Connect your nutrition goals with professionals and food providers near you.</p>
            </div>

            <div class="nc-location-card">
                <label for="nc-location">Your city, area or PIN code</label>
                <div class="nc-search-row">
                    <input id="nc-location" type="text"
                        placeholder="Enter city, area or PIN code"
                        autocomplete="postal-code">
                    <button type="button" id="nc-use-location" class="nc-button nc-secondary">
                        Use my location
                    </button>
                </div>
                <small>Your location is used to create a search. It is not sent to a private database by this feature.</small>
                <p id="nc-location-status" class="nc-status" aria-live="polite"></p>
            </div>

            <div class="nc-grid">
                <article class="nc-card">
                    <div class="nc-icon">01</div>
                    <h3>Dietitian or Nutritionist</h3>
                    <p>Look for nutrition professionals for personalised guidance.</p>
                    <label for="nc-professional">Professional type</label>
                    <select id="nc-professional">
                        <option value="dietitian">Dietitian</option>
                        <option value="nutritionist">Nutritionist</option>
                        <option value="clinical dietitian">Clinical dietitian</option>
                        <option value="sports nutritionist">Sports nutritionist</option>
                    </select>
                    <button type="button" id="nc-find-professional" class="nc-button">
                        Find professionals
                    </button>
                </article>

                <article class="nc-card">
                    <div class="nc-icon">02</div>
                    <h3>Customised Healthy Meals</h3>
                    <p>Explore restaurants, tiffin services and healthy meal providers.</p>
                    <label for="nc-food-type">Meal provider</label>
                    <select id="nc-food-type">
                        <option value="healthy meal delivery">Healthy meal delivery</option>
                        <option value="custom diet food restaurant">Custom diet food restaurant</option>
                        <option value="healthy tiffin service">Healthy tiffin service</option>
                        <option value="high protein meals">High-protein meals</option>
                        <option value="vegetarian healthy meals">Vegetarian healthy meals</option>
                        <option value="vegan food">Vegan food</option>
                        <option value="diabetic friendly meal options">Diabetes-conscious meal options</option>
                        <option value="low sodium meals">Low-sodium meal options</option>
                        <option value="Ayurvedic healthy food">Ayurvedic-inspired food</option>
                    </select>
                    <button type="button" id="nc-find-food" class="nc-button">
                        Find food providers
                    </button>
                </article>
            </div>

            <div class="nc-request-card">
                <span class="nc-eyebrow">YOUR FOOD PREFERENCES</span>
                <h3>Create a Custom Meal Request</h3>
                <p>Prepare a summary to share with a qualified professional or meal provider.</p>

                <div class="nc-form-grid">
                    <div>
                        <label for="nc-diet">Diet preference</label>
                        <select id="nc-diet">
                            <option>Vegetarian</option>
                            <option>Vegan</option>
                            <option>Eggetarian</option>
                            <option>Non-vegetarian</option>
                            <option>Flexible</option>
                        </select>
                    </div>
                    <div>
                        <label for="nc-goal">Main goal</label>
                        <select id="nc-goal">
                            <option>General healthy eating</option>
                            <option>Weight management</option>
                            <option>Muscle building</option>
                            <option>Sports nutrition</option>
                            <option>Digestive comfort</option>
                            <option>Support for a medical dietary need</option>
                            <option>Ayurvedic-inspired meal preferences</option>
                        </select>
                    </div>
                    <div>
                        <label for="nc-meals">Meals required</label>
                        <select id="nc-meals">
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                            <option>Breakfast and lunch</option>
                            <option>Lunch and dinner</option>
                            <option>All daily meals</option>
                        </select>
                    </div>
                    <div>
                        <label for="nc-budget">Approximate budget per meal</label>
                        <select id="nc-budget">
                            <option>Under Rs. 150</option>
                            <option>Rs. 150-300</option>
                            <option>Rs. 300-500</option>
                            <option>Rs. 500 or more</option>
                            <option>Flexible</option>
                        </select>
                    </div>
                </div>

                <label for="nc-allergies">Food allergies or ingredients to avoid</label>
                <input id="nc-allergies" type="text"
                    placeholder="For example: peanuts, dairy, gluten">

                <label for="nc-notes">Additional meal requirements</label>
                <textarea id="nc-notes" rows="3"
                    placeholder="For example: home delivery, less spicy, preferred ingredients"></textarea>

                <div class="nc-actions">
                    <button type="button" id="nc-create-request" class="nc-button">
                        Prepare my request
                    </button>
                    <button type="button" id="nc-copy-request" class="nc-button nc-secondary">
                        Copy request
                    </button>
                    <button type="button" id="nc-share-request" class="nc-button nc-secondary">
                        Share request
                    </button>
                </div>

                <textarea id="nc-request-output" rows="8"
                    aria-label="Prepared meal request" readonly
                    placeholder="Your meal request will appear here."></textarea>
                <p id="nc-request-status" class="nc-status" aria-live="polite"></p>
            </div>

            <div class="nc-disclaimer">
                <strong>Important:</strong> Search results are provided by Google Maps.
                Provider credentials, availability, prices, ingredients, preparation practices
                and delivery options must be confirmed directly. Food preferences do not
                replace medical advice. For allergies or medical dietary restrictions,
                consult an appropriately qualified professional.
            </div>
        `;

        page.appendChild(hub);

        function getLocation() {
            return document.getElementById("nc-location").value.trim();
        }

        function openMaps(query) {
            const location = getLocation();

            if (!location) {
                document.getElementById("nc-location-status").textContent =
                    "Enter your city, area or PIN code first.";
                document.getElementById("nc-location").focus();
                return;
            }

            const url = "https://www.google.com/maps/search/" +
                encodeURIComponent(query + " near " + location);

            window.open(url, "_blank", "noopener,noreferrer");
            document.getElementById("nc-location-status").textContent =
                "Search opened. Confirm provider details and availability directly.";
        }

        document.getElementById("nc-find-professional").addEventListener("click", function () {
            const type = document.getElementById("nc-professional").value;
            openMaps(type);
        });

        document.getElementById("nc-find-food").addEventListener("click", function () {
            const type = document.getElementById("nc-food-type").value;
            openMaps(type);
        });

        document.getElementById("nc-use-location").addEventListener("click", function () {
            const status = document.getElementById("nc-location-status");

            if (!navigator.geolocation) {
                status.textContent = "Location access is not available in this browser. Enter your area manually.";
                return;
            }

            status.textContent = "Requesting location permission...";

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    document.getElementById("nc-location").value = lat + ", " + lon;
                    status.textContent = "Location added. Choose a search option to explore nearby results.";
                },
                function () {
                    status.textContent = "Location unavailable or permission denied. Enter your city or PIN code manually.";
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
            );
        });

        function makeRequest() {
            const fields = [
                ["Location", getLocation() || "Not specified"],
                ["Diet preference", document.getElementById("nc-diet").value],
                ["Goal", document.getElementById("nc-goal").value],
                ["Meals required", document.getElementById("nc-meals").value],
                ["Budget per meal", document.getElementById("nc-budget").value],
                ["Allergies or ingredients to avoid", document.getElementById("nc-allergies").value.trim() || "Not specified"],
                ["Additional requirements", document.getElementById("nc-notes").value.trim() || "Not specified"]
            ];

            return "CUSTOM MEAL ENQUIRY\n\n" +
                fields.map(function (field) {
                    return field[0] + ": " + field[1];
                }).join("\n") +
                "\n\nPlease confirm menu options, ingredients, allergen handling, price, delivery availability and suitability for my requirements.";
        }

        document.getElementById("nc-create-request").addEventListener("click", function () {
            document.getElementById("nc-request-output").value = makeRequest();
            document.getElementById("nc-request-status").textContent =
                "Request prepared. Review it before sharing with a provider.";
        });

        document.getElementById("nc-copy-request").addEventListener("click", async function () {
            const output = document.getElementById("nc-request-output");
            if (!output.value) {
                output.value = makeRequest();
            }

            try {
                await navigator.clipboard.writeText(output.value);
                document.getElementById("nc-request-status").textContent = "Request copied.";
            } catch (error) {
                output.focus();
                output.select();
                const copied = document.execCommand("copy");
                document.getElementById("nc-request-status").textContent =
                    copied ? "Request copied." : "Select the text above and copy it manually.";
            }
        });

        document.getElementById("nc-share-request").addEventListener("click", async function () {
            const output = document.getElementById("nc-request-output");
            if (!output.value) {
                output.value = makeRequest();
            }

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Custom Meal Enquiry",
                        text: output.value
                    });
                    document.getElementById("nc-request-status").textContent = "Share menu opened.";
                } catch (error) {
                    if (error.name !== "AbortError") {
                        document.getElementById("nc-request-status").textContent =
                            "Sharing was unavailable. Use Copy request instead.";
                    }
                }
            } else {
                try {
                    await navigator.clipboard.writeText(output.value);
                    document.getElementById("nc-request-status").textContent =
                        "Sharing is unavailable here. Request copied so you can paste it into a message.";
                } catch (error) {
                    document.getElementById("nc-request-status").textContent =
                        "Use Copy request or select the prepared text manually.";
                }
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNutritionConnect);
    } else {
        initNutritionConnect();
    }
})();
