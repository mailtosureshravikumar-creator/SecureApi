"use strict";

// Guard — redirect if not authenticated
const authParams = new URLSearchParams(window.location.search);
const authFromQuery = authParams.get("auth") === "1";
const userFromQuery = authParams.get("user");

let sessionLoggedIn = false;
let localLoggedIn = false;

try {
    sessionLoggedIn = sessionStorage.getItem("vlinkLoggedIn") === "1";
} catch (e) { }

try {
    localLoggedIn = localStorage.getItem("vlinkLoggedIn") === "1";
} catch (e) { }

if (authFromQuery || localLoggedIn) {
    try {
        sessionStorage.setItem("vlinkLoggedIn", "1");
    } catch (e) { }

    try {
        localStorage.setItem("vlinkLoggedIn", "1");
    } catch (e) { }

    if (userFromQuery) {
        try {
            sessionStorage.setItem("vlinkUserEmail", userFromQuery);
        } catch (e) { }
        try {
            localStorage.setItem("vlinkUserEmail", userFromQuery);
        } catch (e) { }
    }
}

if (!authFromQuery && !sessionLoggedIn && !localLoggedIn) {
    window.location.replace("login.html");
}

// Load user email and display
let userEmail = "User";
try {
    userEmail =
        sessionStorage.getItem("vlinkUserEmail") ||
        localStorage.getItem("vlinkUserEmail") ||
        userFromQuery ||
        "User";
} catch (e) {
    userEmail = userFromQuery || "User";
}

if (authFromQuery || userFromQuery) {
    try {
        if (window.location.protocol !== "file:") {
            window.history.replaceState({}, "", "dashboard.html");
        }
    } catch (e) { }
}

const userEmailDisplay = document.getElementById("userEmailDisplay");
const headerUserEmail = document.getElementById("headerUserEmail");
const accountWelcomeEmail = document.getElementById("accountWelcomeEmail");
if (userEmailDisplay) {
    userEmailDisplay.textContent = userEmail;
}
if (headerUserEmail) {
    headerUserEmail.textContent = userEmail;
}
if (accountWelcomeEmail) {
    accountWelcomeEmail.textContent = userEmail;
}

// DOM refs
const siteHeader = document.getElementById("siteHeader");
const appAccount = document.getElementById("appAccount");
const headerAccountBtn = document.getElementById("headerAccountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const logoutAction = document.getElementById("logoutAction");

const testApiModal = document.getElementById("testApiModal");
const closeTestModal = document.getElementById("closeTestModal");
const cancelTestModal = document.getElementById("cancelTestModal");
const testModalApiName = document.getElementById("testModalApiName");
const testEndpoint = document.getElementById("testEndpoint");
const testPayload = document.getElementById("testPayload");
const runTestBtn = document.getElementById("runTestBtn");
const testResponse = document.getElementById("testResponse");
const testResponseBody = document.getElementById("testResponseBody");
const availableApisTrack = document.getElementById("availableApisTrack");
const availablePrevBtn = document.getElementById("availablePrevBtn");
const availableNextBtn = document.getElementById("availableNextBtn");

document.body.classList.add("js-enabled");
window.requestAnimationFrame(() => document.body.classList.add("page-ready"));

// ── API sandbox configs ────────────────────────────────────────────────
const apiConfigs = {
    "pan-gst": {
        name: "PAN-GST Link Verification",
        endpoint: "https://api.vlink.com/v1/pan-gst/verify",
        payload: '{\n  "pan": "ABCDE1234F",\n  "gstin": "22ABCDE1234F1Z5"\n}',
    },
    "gst-search": {
        name: "GST Number Search",
        endpoint: "https://api.vlink.com/v1/gst/search",
        payload: '{\n  "gstin": "22ABCDE1234F1Z5"\n}',
    },
    email: {
        name: "Email Verification",
        endpoint: "https://api.vlink.com/v1/email/verify",
        payload: '{\n  "email": "user@example.com"\n}',
    },
    name: {
        name: "Name Similarity Match",
        endpoint: "https://api.vlink.com/v1/name/match",
        payload: '{\n  "name1": "Ramesh Kumar",\n  "name2": "R. Kumar"\n}',
    },
};


// ── Logout ─────────────────────────────────────────────────────────────
function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem("vlinkLoggedIn");
    sessionStorage.removeItem("vlinkUserEmail");
    localStorage.removeItem("vlinkLoggedIn");
    localStorage.removeItem("vlinkUserEmail");
    window.location.href = "index.html";
}

if (logoutAction) logoutAction.addEventListener("click", handleLogout);

function setAccountDropdownOpen(isOpen) {
    if (!accountDropdown || !headerAccountBtn) return;
    accountDropdown.hidden = !isOpen;
    headerAccountBtn.setAttribute("aria-expanded", String(isOpen));
}

if (headerAccountBtn) {
    headerAccountBtn.addEventListener("click", () => {
        const isExpanded = headerAccountBtn.getAttribute("aria-expanded") === "true";
        setAccountDropdownOpen(!isExpanded);
    });
}

const dropdownRegisterUserBtn = document.getElementById("dropdownRegisterUserBtn");
if (dropdownRegisterUserBtn) {
    dropdownRegisterUserBtn.addEventListener("click", () => {
        setAccountDropdownOpen(false);
        window.location.href = "register.html";
    });
}

const dropdownResetPasswordBtn = document.getElementById("dropdownResetPasswordBtn");
if (dropdownResetPasswordBtn) {
    dropdownResetPasswordBtn.addEventListener("click", () => {
        setAccountDropdownOpen(false);
        window.location.href = "reset-password.html";
    });
}

const dropdownLeadsBtn = document.getElementById("dropdownLeadsBtn");
if (dropdownLeadsBtn) {
    dropdownLeadsBtn.addEventListener("click", () => {
        setAccountDropdownOpen(false);
        window.location.href = "leads-management.html";
    });
}

document.addEventListener("click", (e) => {
    if (!appAccount || !accountDropdown) return;
    if (!appAccount.contains(e.target)) {
        setAccountDropdownOpen(false);
    }
});

// ── Scroll header ──────────────────────────────────────────────────────
window.addEventListener(
    "scroll",
    () => {
        if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 18);
    },
    { passive: true }
);

// ── Test API Modal ─────────────────────────────────────────────────────
function setTestModalOpen(isOpen) {
    if (!testApiModal) return;
    testApiModal.classList.toggle("open", isOpen);
    testApiModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);
}

function openTestModal(apiKey) {
    const config = apiConfigs[apiKey];
    if (!config) return;
    if (testModalApiName) testModalApiName.textContent = config.name;
    if (testEndpoint) testEndpoint.value = config.endpoint;
    if (testPayload) testPayload.value = config.payload;
    if (testResponse) testResponse.hidden = true;
    if (testResponseBody) testResponseBody.textContent = "";
    setTestModalOpen(true);
}

function openApiTestingPage(apiKey) {
    window.location.href = `api-testing.html?api=${encodeURIComponent(apiKey)}`;
}

function openTargetSection(targetId) {
    if (!targetId) return;
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    const targetSection = targetEl.closest(".dash-section");
    if (!targetSection) return;

    targetSection.classList.remove("is-highlight");
    void targetSection.offsetWidth;
    targetSection.classList.add("is-highlight");
}

document.querySelectorAll(".dash-side-method-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const apiKey = btn.dataset.apiKey;
        if (
            btn.classList.contains("dash-method-type") &&
            (apiKey === "pan-gst" || apiKey === "gst-search")
        ) {
            openApiTestingPage(apiKey);
            return;
        }

        if (apiKey && apiConfigs[apiKey]) {
            openTestModal(apiKey);
            return;
        }

        openTargetSection(btn.dataset.target);
    });
});

document.querySelectorAll(".dash-carousel-card").forEach((card) => {
    const activateCard = () => {
        const apiKey = card.dataset.apiKey;
        if (apiKey === "pan-gst" || apiKey === "gst-search") {
            openApiTestingPage(apiKey);
            return;
        }

        if (apiKey && apiConfigs[apiKey]) {
            openTestModal(apiKey);
            return;
        }

        openTargetSection(card.dataset.target);
    };

    card.addEventListener("click", activateCard);
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activateCard();
        }
    });
});

if (availableApisTrack && availablePrevBtn && availableNextBtn) {
    const cards = Array.from(availableApisTrack.children);
    let currentIndex = 0;

    const getVisibleCards = () => {
        if (window.innerWidth <= 640) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };

    const getStepWidth = () => {
        if (cards.length < 2) return cards[0]?.getBoundingClientRect().width || 0;
        const firstRect = cards[0].getBoundingClientRect();
        const secondRect = cards[1].getBoundingClientRect();
        return secondRect.left - firstRect.left;
    };

    const updateCarousel = () => {
        const maxIndex = Math.max(0, cards.length - getVisibleCards());
        currentIndex = Math.min(currentIndex, maxIndex);
        availableApisTrack.style.transform = `translateX(-${currentIndex * getStepWidth()}px)`;
        availablePrevBtn.disabled = currentIndex === 0;
        availableNextBtn.disabled = currentIndex >= maxIndex;
    };

    availablePrevBtn.addEventListener("click", () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
    });

    availableNextBtn.addEventListener("click", () => {
        const maxIndex = Math.max(0, cards.length - getVisibleCards());
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
}

if (closeTestModal) closeTestModal.addEventListener("click", () => setTestModalOpen(false));
if (cancelTestModal) cancelTestModal.addEventListener("click", () => setTestModalOpen(false));
if (testApiModal) {
    testApiModal.addEventListener("click", (e) => {
        if (e.target === testApiModal) setTestModalOpen(false);
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        setAccountDropdownOpen(false);
    }
    if (e.key === "Escape") setTestModalOpen(false);
});

// ── Simulate sandbox request ───────────────────────────────────────────
if (runTestBtn) {
    runTestBtn.addEventListener("click", () => {
        runTestBtn.textContent = "Sending…";
        runTestBtn.disabled = true;

        setTimeout(() => {
            if (testResponse) testResponse.hidden = false;
            if (testResponseBody) {
                testResponseBody.textContent = JSON.stringify(
                    {
                        status: "success",
                        code: 200,
                        message: "Sandbox response. Authenticate with your API key for live data.",
                        data: { verified: true, environment: "sandbox" },
                    },
                    null,
                    2
                );
            }
            runTestBtn.textContent = "Send Request";
            runTestBtn.disabled = false;
        }, 900);
    });
}


