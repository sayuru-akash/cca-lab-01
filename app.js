/* app.js
  CCA Lab: JS essentials for modern UI work
  Mindset: "state drives UI" (exactly what you'll do in React/Next.js later)
*/

/* Structure
    1. State: the data that represents our app's current situation
    2. Data: the set of information we have regarding features, pricing, etc.
    3. Helpers: functions that perform specific tasks (e.g., localStorage, utilities, updating the UI)
    4. Rendering functions: functions that take the current state and data to update the UI accordingly
    5. Event handlers: functions that respond to user interactions (e.g., clicks, form submissions) and update the state
    6. Initialization (Boot) function: the function that sets up our app when the page loads
*/

/* 1. State */
const state = {
  billing: "monthly", // "monthly" or "annual"
  activeTab: "speed", // "speed", "quality" or "scale"
};

/* 2. Get the elements we need to interact with */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const tabPanel = document.getElementById("tabPanel");
const tabs = Array.from(document.querySelectorAll(".Tab"));

const billingToggle = document.getElementById("billingToggle");
const pricingCards = document.getElementById("pricingCards");

/* 3. Data for the app */

const featureCopy = {
  speed: {
    title: "Speed that actually matters",
    body: "Less waiting, fewer clicks, cleaner UI. You’ll feel it instantly.",
    points: [
      "Fast layout patterns (Grid/Flex used properly)",
      "No messy DOM updates all over the place",
      "Clear separation: data -> render -> events",
    ],
  },
  quality: {
    title: "Quality by default",
    body: "Semantic HTML, accessible basics, and maintainable CSS. Not vibes-only code.",
    points: [
      "Structure that makes sense even without CSS",
      "Reusable styles instead of copy/paste classes",
      "Predictable behaviour from clean JS logic",
    ],
  },
  scale: {
    title: "Scale into React/Next.js",
    body: "Same idea: state drives UI, UI is a function of data.",
    points: [
      "State object is your single source of truth",
      "Render functions are your ‘components’ today",
      "Events update state, then you re-render",
    ],
  },
};

// Pricing plans are also plain data.
// We render cards from this array.
const pricing = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    perks: ["1 project", "Basic components", "Community"],
  },
  {
    name: "Pro",
    monthly: 12,
    annual: 99,
    perks: ["Unlimited projects", "Reusable UI", "Faster workflow"],
  },
  {
    name: "Team",
    monthly: 29,
    annual: 249,
    perks: ["Team setup", "Shared patterns", "Review checklist"],
  },
];

/* 4. Helpers */

function savePref() {
  // Store only what we need to remember
  localStorage.setItem(
    "cca_lab_pref",
    JSON.stringify({
      billing: state.billing,
      activeTab: state.activeTab,
    }),
  );
}

function loadPref() {
  // Read saved preferences safely
  try {
    const saved = JSON.parse(localStorage.getItem("cca_lab_pref"));
    if (!saved) return;

    if (saved.billing === "monthly" || saved.billing === "annual") {
      state.billing = saved.billing;
    }
    if (featureCopy[saved.activeTab]) {
      state.activeTab = saved.activeTab;
    }
  } catch {
    // If something is corrupted, ignore it
  }
}

// Small helper to smooth scroll to a section
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
}

/* 5. Rendering functions */

function renderNavButton(open) {
  // Keep accessibility state in sync
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

function renderTabs() {
  //Render the content based on the active tab in state
  const data = featureCopy[state.activeTab];

  tabPanel.innerHTML = `
    <div>
      <h3 style="margin:0 0 12px;">${data.title}</h3>
      <p>${data.body}</p>
      <ul>
        ${data.points.map((p) => `<li>${p}</li>`).join("")}
      </ul>
    </div>
    `;

  // Update the tab buttons style (active/inactive)
  tabs.forEach((btn) => {
    const isActive = btn.dataset.tab === state.activeTab;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function renderBillingToggle() {
  // Set the checkbox based on state
  billingToggle.checked = state.billing === "annual";
}

function renderPricing() {
  const isAnnual = state.billing === "annual";

  // Build the cards HTML by mapping the pricing data to card markup
  pricingCards.innerHTML = pricing
    .map((plan) => {
      const price = isAnnual ? plan.annual : plan.monthly;
      const suffix = isAnnual ? "/yr" : "/mo";

      return `
      <article class="Card">
        <h3 style="margin:0;">${plan.name}</h3>
        <div class="Card__price">$${price}${suffix}</div>
        <ul>
          ${plan.perks.map((p) => `<li>${p}</li>`).join("")}
        </ul>
        <!-- data-plan lets us know which plan was clicked -->
        <button class="Btn Btn--primary" type="button" data-plan="${plan.name}">
          Choose ${plan.name}
        </button>
      </article>
    `;
    })
    .join("");
}

function renderAll() {
  // One place to refresh the UI from state
  renderBillingToggle();
  renderTabs();
  renderPricing();
}

/* 6. Event handlers */

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  renderNavButton(open);
});

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.activeTab = btn.dataset.tab;
    savePref();
    renderTabs(); // Only re-render the tabs section, not the whole page
  });
});

billingToggle.addEventListener("change", () => {
  state.billing = billingToggle.checked ? "annual" : "monthly";
  savePref();
  renderPricing(); // Only re-render the pricing cards, not the whole page
});

pricingCards.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-plan]");
  if (!btn) return;

  const plan = btn.dataset.plan;

  // Give the user a simple prompt + move them to the form
  formMsg.textContent = `Nice — you selected ${plan}. Now sign up below.`;
  scrollToId("signup");
});


