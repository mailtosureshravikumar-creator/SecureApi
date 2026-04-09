"use strict";

const backToDashboardBtn = document.getElementById("backToDashboardBtn");
const headerUserEmail = document.getElementById("headerUserEmail");
const accountWelcomeEmail = document.getElementById("accountWelcomeEmail");
const appAccount = document.getElementById("appAccount");
const headerAccountBtn = document.getElementById("headerAccountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const logoutAction = document.getElementById("logoutAction");
const envSelect = document.getElementById("envSelect");
const apiInput = document.getElementById("apiInput");
const inputLabel = document.getElementById("inputLabel");
const inputHint = document.getElementById("inputHint");
const executeBtn = document.getElementById("executeBtn");
const responseBox = document.getElementById("responseBox");
const responseBody = document.getElementById("responseBody");
const apiSide = document.querySelector(".api-side");
const apiContent = document.querySelector(".api-content");
const detailsCard = document.querySelector(".details-card");
const testingCard = document.querySelector(".testing-card");

const detailsName = document.getElementById("detailsName");
const detailsDescription = document.getElementById("detailsDescription");
const detailsMethod = document.getElementById("detailsMethod");
const detailsPath = document.getElementById("detailsPath");
const detailsCategory = document.getElementById("detailsCategory");

const apiConfigs = {
    "pan-gst": {
        title: "PAN-GST Link Verification",
        description:
            "Verify PAN and link GST status. Check if a PAN is linked to one or more GSTs and retrieve detailed linkage information with verification status.",
        method: "POST",
        path: "/api/SearchByPan",
        category: "Verification",
        inputLabel: "PAN Number:",
        placeholder: "e.g. ABCPD1234E",
        hint: "Enter 10-character PAN (e.g. ABCPD1234E)",
        maxLength: 10,
        defaultEnv: "uat",
        validate: (value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value),
        validationMessage: "Please enter a valid 10-character PAN (e.g. ABCPD1234E)",
    },
    "gst-search": {
        title: "GST Number Search",
        description:
            "Fetch complete GST details including legal name, status, and registration type. Perform fast and accurate GST number verification.",
        method: "POST",
        path: "/api/SearchByGst",
        category: "Verification",
        inputLabel: "GST Number:",
        placeholder: "e.g. 07AAIXXX787F2ZH",
        hint: "Enter 15-character GSTIN (e.g. 07AAIXXX787F2ZH)",
        maxLength: 15,
        defaultEnv: "prod",
        validate: (value) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/.test(value),
        validationMessage: "Please enter a valid 15-character GSTIN (e.g. 07AAIXXX787F2ZH)",
    },
    email: {
        title: "Email Verification",
        description:
            "Validate email address format and verify mailbox status for onboarding and risk checks.",
        method: "POST",
        path: "/api/VerifyEmail",
        category: "Verification",
        inputLabel: "Email Address:",
        placeholder: "e.g. user@example.com",
        hint: "Enter a valid email address",
        maxLength: 120,
        defaultEnv: "uat",
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        validationMessage: "Please enter a valid email address",
    },
    name: {
        title: "Name Similarity Match",
        description:
            "Compare two names and return similarity confidence for verification workflows.",
        method: "POST",
        path: "/api/NameSimilarity",
        category: "Verification",
        inputLabel: "Primary Name:",
        placeholder: "e.g. Ramesh Kumar",
        hint: "Enter the name to compare",
        maxLength: 80,
        defaultEnv: "uat",
        validate: (value) => value.length >= 3,
        validationMessage: "Please enter at least 3 characters",
    },
    "pan-verification": {
        title: "PAN Verification",
        description:
            "Verify PAN details and validate PAN status from trusted data sources.",
        method: "POST",
        path: "/api/VerifyPan",
        category: "Verification",
        inputLabel: "PAN Number:",
        placeholder: "e.g. ABCPD1234E",
        hint: "Enter 10-character PAN",
        maxLength: 10,
        defaultEnv: "uat",
        validate: (value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value),
        validationMessage: "Please enter a valid PAN number",
    },
    "company-search": {
        title: "Company Name Search",
        description:
            "Search and validate company details by name for compliance checks.",
        method: "POST",
        path: "/api/SearchCompany",
        category: "Verification",
        inputLabel: "Company Name:",
        placeholder: "e.g. VLink Technologies Pvt Ltd",
        hint: "Enter at least 3 characters",
        maxLength: 100,
        defaultEnv: "uat",
        validate: (value) => value.length >= 3,
        validationMessage: "Please enter a valid company name",
    },
    "pan-ocr": {
        title: "PAN OCR",
        description:
            "Extract PAN details from document image using OCR processing.",
        method: "POST",
        path: "/api/OcrPan",
        category: "OCR",
        inputLabel: "Document URL:",
        placeholder: "e.g. https://example.com/pan-card.jpg",
        hint: "Enter an accessible image URL",
        maxLength: 200,
        defaultEnv: "uat",
        validate: (value) => /^https?:\/\/.+/.test(value),
        validationMessage: "Please enter a valid document URL",
    },
    "aadhaar-ocr": {
        title: "Aadhaar OCR",
        description:
            "Extract Aadhaar details from uploaded document using OCR.",
        method: "POST",
        path: "/api/OcrAadhaar",
        category: "OCR",
        inputLabel: "Document URL:",
        placeholder: "e.g. https://example.com/aadhaar-front.jpg",
        hint: "Enter an accessible image URL",
        maxLength: 200,
        defaultEnv: "uat",
        validate: (value) => /^https?:\/\/.+/.test(value),
        validationMessage: "Please enter a valid document URL",
    },
    "udyam-ocr": {
        title: "Udyam OCR",
        description:
            "Extract Udyam registration details from certificate documents.",
        method: "POST",
        path: "/api/OcrUdyam",
        category: "OCR",
        inputLabel: "Document URL:",
        placeholder: "e.g. https://example.com/udyam-certificate.jpg",
        hint: "Enter an accessible image URL",
        maxLength: 200,
        defaultEnv: "uat",
        validate: (value) => /^https?:\/\/.+/.test(value),
        validationMessage: "Please enter a valid document URL",
    },
    "gst-certificate-ocr": {
        title: "GST Certificate OCR",
        description:
            "Extract GST certificate details from document image.",
        method: "POST",
        path: "/api/OcrGstCertificate",
        category: "OCR",
        inputLabel: "Document URL:",
        placeholder: "e.g. https://example.com/gst-certificate.jpg",
        hint: "Enter an accessible image URL",
        maxLength: 200,
        defaultEnv: "uat",
        validate: (value) => /^https?:\/\/.+/.test(value),
        validationMessage: "Please enter a valid document URL",
    },
    "bank-statement": {
        title: "Bank Statement Extraction",
        description:
            "Extract and structure bank statement transaction data for analysis.",
        method: "POST",
        path: "/api/ExtractBankStatement",
        category: "Verification",
        inputLabel: "Statement URL:",
        placeholder: "e.g. https://example.com/statement.pdf",
        hint: "Enter an accessible PDF/image URL",
        maxLength: 200,
        defaultEnv: "uat",
        validate: (value) => /^https?:\/\/.+/.test(value),
        validationMessage: "Please enter a valid statement URL",
    },
};

let activeApiKey = "pan-gst";

const userEmail = sessionStorage.getItem("vlinkUserEmail") || "user@example.com";
if (headerUserEmail) {
    headerUserEmail.textContent = userEmail;
}
if (accountWelcomeEmail) {
    accountWelcomeEmail.textContent = userEmail;
}

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

document.addEventListener("click", (e) => {
    if (!appAccount || !accountDropdown) return;
    if (!appAccount.contains(e.target)) {
        setAccountDropdownOpen(false);
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        setAccountDropdownOpen(false);
    }
});

if (logoutAction) {
    logoutAction.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("vlinkLoggedIn");
        sessionStorage.removeItem("vlinkUserEmail");
        window.location.href = "index.html";
    });
}

function setActiveSidebar(apiKey) {
    document.querySelectorAll(".api-side-list li").forEach((li) => {
        const btn = li.querySelector(".api-side-btn.verify");
        li.classList.toggle("is-active", btn?.dataset.apiKey === apiKey);
    });
}

function applyApi(apiKey) {
    const config = apiConfigs[apiKey];
    if (!config) return;

    activeApiKey = apiKey;
    detailsName.textContent = config.title;
    detailsDescription.textContent = config.description;
    detailsMethod.textContent = config.method;
    detailsPath.textContent = config.path;
    detailsCategory.textContent = config.category;

    inputLabel.textContent = config.inputLabel;
    apiInput.placeholder = config.placeholder;
    apiInput.maxLength = config.maxLength;
    inputHint.textContent = config.hint;
    envSelect.value = config.defaultEnv;
    apiInput.value = "";

    responseBox.hidden = true;
    responseBody.textContent = "";
    setActiveSidebar(apiKey);
    requestAnimationFrame(syncSidebarHeight);
}

function syncSidebarHeight() {
    if (!apiSide || !apiContent) return;

    if (window.innerWidth <= 1024) {
        apiSide.style.height = "";
        apiSide.style.minHeight = "";
        return;
    }

    let targetHeight = apiContent.getBoundingClientRect().height;

    if (detailsCard && testingCard) {
        const detailsRect = detailsCard.getBoundingClientRect();
        const testingRect = testingCard.getBoundingClientRect();
        targetHeight = testingRect.bottom - detailsRect.top;
    }

    apiSide.style.height = `${Math.ceil(targetHeight)}px`;
    apiSide.style.minHeight = `${Math.ceil(targetHeight)}px`;
}

function initializeFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const requestedApi = params.get("api");
    if (requestedApi && apiConfigs[requestedApi]) {
        applyApi(requestedApi);
        return;
    }
    applyApi("pan-gst");
}

document.querySelectorAll(".api-side-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const apiKey = btn.dataset.apiKey;
        if (!apiKey || !apiConfigs[apiKey]) return;
        applyApi(apiKey);
    });
});

if (executeBtn) {
    executeBtn.addEventListener("click", () => {
        const config = apiConfigs[activeApiKey];
        const inputValue = apiInput.value.trim().toUpperCase();

        if (!config.validate(inputValue)) {
            alert(config.validationMessage);
            return;
        }

        executeBtn.textContent = "Executing...";
        executeBtn.disabled = true;

        setTimeout(() => {
            responseBox.hidden = false;
            responseBody.textContent = JSON.stringify(
                {
                    status: "success",
                    code: 200,
                    message: `${config.title} executed successfully`,
                    data: {
                        input: inputValue,
                        api: activeApiKey,
                        environment: envSelect.value,
                        verified: true,
                    },
                },
                null,
                2
            );

            executeBtn.textContent = "Execute API button";
            executeBtn.disabled = false;
            syncSidebarHeight();
        }, 750);
    });
}

if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}

initializeFromQuery();
syncSidebarHeight();
window.addEventListener("resize", syncSidebarHeight);

window.addEventListener("load", syncSidebarHeight);

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncSidebarHeight).catch(() => { });
}

if (window.ResizeObserver && apiContent) {
    const sidebarResizeObserver = new ResizeObserver(() => {
        syncSidebarHeight();
    });
    sidebarResizeObserver.observe(apiContent);
}
