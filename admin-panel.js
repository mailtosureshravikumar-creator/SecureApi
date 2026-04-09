"use strict";

let sessionLoggedIn = false;
let localLoggedIn = false;
let sessionAdminLoggedIn = false;
let localAdminLoggedIn = false;

try {
    sessionLoggedIn = sessionStorage.getItem("vlinkLoggedIn") === "1";
} catch (e) { }

try {
    localLoggedIn = localStorage.getItem("vlinkLoggedIn") === "1";
} catch (e) { }

try {
    const sessionAdminValue = sessionStorage.getItem("vlinkAdminAuthenticated");
    sessionAdminLoggedIn = sessionAdminValue === "1" || sessionAdminValue === "true";
} catch (e) { }

try {
    const localAdminValue = localStorage.getItem("vlinkAdminAuthenticated");
    localAdminLoggedIn = localAdminValue === "1" || localAdminValue === "true";
} catch (e) { }

if (!sessionLoggedIn && localLoggedIn) {
    try {
        sessionStorage.setItem("vlinkLoggedIn", "1");
        const localUser = localStorage.getItem("vlinkUserEmail") || "";
        if (localUser) {
            sessionStorage.setItem("vlinkUserEmail", localUser);
        }
    } catch (e) { }
    sessionLoggedIn = true;
}

if (!sessionLoggedIn && !localLoggedIn) {
    window.location.replace("login.html");
}

if (!sessionAdminLoggedIn && localAdminLoggedIn) {
    try {
        sessionStorage.setItem("vlinkAdminAuthenticated", "1");
        const localAdminEmail = localStorage.getItem("vlinkAdminEmail") || "";
        if (localAdminEmail) {
            sessionStorage.setItem("vlinkAdminEmail", localAdminEmail);
        }
    } catch (e) { }
    sessionAdminLoggedIn = true;
}

if (!sessionAdminLoggedIn && !localAdminLoggedIn) {
    window.location.replace("admin-panel-login.html");
}

const siteHeader = document.getElementById("siteHeader");
const appAccount = document.getElementById("appAccount");
const headerAccountBtn = document.getElementById("headerAccountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const headerUserEmail = document.getElementById("headerUserEmail");
const accountWelcomeEmail = document.getElementById("accountWelcomeEmail");
const logoutAction = document.getElementById("logoutAction");
const adminContent = document.getElementById("adminContent");
const createApiBtn = document.getElementById("createApiBtn");
const adminTableBody = document.getElementById("adminTableBody");
const apiModalOverlay = document.getElementById("apiModalOverlay");
const closeApiModal = document.getElementById("closeApiModal");
const cancelApiModal = document.getElementById("cancelApiModal");
const apiForm = document.getElementById("apiForm");
const apiModalTitle = document.getElementById("apiModalTitle");
const apiEditId = document.getElementById("apiEditId");
const apiNameInput = document.getElementById("apiNameInput");
const apiDescriptionInput = document.getElementById("apiDescriptionInput");
const apiMethodInput = document.getElementById("apiMethodInput");
const apiPathInput = document.getElementById("apiPathInput");
const apiCategoryInput = document.getElementById("apiCategoryInput");

let apiRows = [
    {
        id: 1,
        name: "PAN-GST Link Verification",
        description: "Verifies the linkage between a PAN and GSTIN in real-time.",
        method: "POST",
        path: "/api/SearchByPan",
        category: "Verification",
    },
    {
        id: 2,
        name: "GST Number Search",
        description: "Fetches GST registration details using a GSTIN.",
        method: "POST",
        path: "/api/SearchByGst",
        category: "Verification",
    },
    {
        id: 3,
        name: "Email Verification",
        description: "Validates email address format and domain existence.",
        method: "POST",
        path: "/api/VerifyEmail",
        category: "Verification",
    },
    {
        id: 4,
        name: "PAN OCR",
        description: "Extracts data from a PAN card image using OCR.",
        method: "POST",
        path: "/api/OcrPan",
        category: "OCR",
    },
];

let userEmail = "user@example.com";
try {
    userEmail =
        sessionStorage.getItem("vlinkUserEmail") ||
        localStorage.getItem("vlinkUserEmail") ||
        "user@example.com";
} catch (e) {
    userEmail = "user@example.com";
}

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

function setAdminPanelAccess(isAllowed) {
    if (adminContent) {
        adminContent.hidden = !isAllowed;
        adminContent.style.display = isAllowed ? "block" : "none";
    }
}

function updateBodyModalState() {
    const anyModalOpen =
        (apiModalOverlay && !apiModalOverlay.hidden);
    document.body.classList.toggle("modal-open", Boolean(anyModalOpen));
}

function setModalOpen(overlay, isOpen) {
    if (!overlay) return;
    overlay.hidden = !isOpen;
    overlay.style.display = isOpen ? "grid" : "none";
    overlay.setAttribute("aria-hidden", String(!isOpen));
    updateBodyModalState();
}

function renderTable() {
    if (!adminTableBody) return;

    adminTableBody.innerHTML = apiRows
        .map((row, index) => {
            const methodClass = ["GET", "DELETE"].includes(row.method) ? "method-get" : "method-post";
            const escapedName = row.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const escapedDesc = (row.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

            return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${escapedName}</td>
                  <td>${escapedDesc}</td>
                  <td>${row.category}</td>
                  <td><span class="admin-badge ${methodClass}">${row.method}</span></td>
                  <td>${row.path}</td>
                  <td>
                    <div class="admin-row-actions">
                      <button class="admin-mini-btn edit" type="button" data-action="edit" data-id="${row.id}">Edit</button>
                      <button class="admin-mini-btn delete" type="button" data-action="delete" data-id="${row.id}">Delete</button>
                    </div>
                  </td>
                </tr>
            `;
        })
        .join("");
}

function resetApiForm() {
    if (!apiForm) return;
    apiForm.reset();
    if (apiEditId) apiEditId.value = "";
    if (apiMethodInput) apiMethodInput.value = "GET";
}

function openApiModal(mode, row) {
    if (!apiModalOverlay || !apiModalTitle) return;

    if (mode === "edit" && row) {
        apiModalTitle.textContent = "Edit API";
        if (saveApiBtn) saveApiBtn.textContent = "Save Changes";
        if (apiEditId) apiEditId.value = String(row.id);
        if (apiNameInput) apiNameInput.value = row.name;
        if (apiDescriptionInput) apiDescriptionInput.value = row.description || "";
        if (apiMethodInput) apiMethodInput.value = row.method;
        if (apiPathInput) apiPathInput.value = row.path;
        if (apiCategoryInput) apiCategoryInput.value = row.category;
    } else {
        apiModalTitle.textContent = "Create New API";
        if (saveApiBtn) saveApiBtn.textContent = "Create API";
        resetApiForm();
    }

    setModalOpen(apiModalOverlay, true);
}

function closeApiFormModal() {
    setModalOpen(apiModalOverlay, false);
    resetApiForm();
}

function handleApiModalCloseAction(target) {
    const closeTrigger = target.closest("#closeApiModal, #cancelApiModal, [data-close-api-modal]");
    if (!closeTrigger) return false;
    closeApiFormModal();
    return true;
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
    if (handleApiModalCloseAction(e.target)) {
        return;
    }

    if (!appAccount || !accountDropdown) return;
    if (!appAccount.contains(e.target)) {
        setAccountDropdownOpen(false);
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        setAccountDropdownOpen(false);
        closeApiFormModal();
    }
});

window.addEventListener(
    "scroll",
    () => {
        if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 18);
    },
    { passive: true }
);

if (logoutAction) {
    logoutAction.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("vlinkLoggedIn");
        sessionStorage.removeItem("vlinkUserEmail");
        sessionStorage.removeItem("vlinkAdminAuthenticated");
        sessionStorage.removeItem("vlinkAdminEmail");
        localStorage.removeItem("vlinkLoggedIn");
        localStorage.removeItem("vlinkUserEmail");
        localStorage.removeItem("vlinkAdminAuthenticated");
        localStorage.removeItem("vlinkAdminEmail");
        window.location.href = "index.html";
    });
}

if (createApiBtn) {
    createApiBtn.addEventListener("click", () => {
        openApiModal("create");
    });
}

if (closeApiModal) {
    closeApiModal.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeApiFormModal();
    });
}

if (cancelApiModal) {
    cancelApiModal.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeApiFormModal();
    });
}

if (apiModalOverlay) {
    apiModalOverlay.addEventListener("click", (e) => {
        if (e.target === apiModalOverlay) {
            closeApiFormModal();
        }
    });
}

const saveApiBtn = document.getElementById("saveApiBtn");

if (apiForm) {
    apiForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = apiNameInput ? apiNameInput.value.trim() : "";
        const description = apiDescriptionInput ? apiDescriptionInput.value.trim() : "";
        const category = apiCategoryInput ? apiCategoryInput.value.trim() : "";
        const method = apiMethodInput ? apiMethodInput.value : "GET";
        const path = apiPathInput ? apiPathInput.value.trim() : "";

        if (!name || !description || !category || !path) return;

        const editId = apiEditId ? Number(apiEditId.value) : 0;

        if (editId) {
            apiRows = apiRows.map((item) =>
                item.id === editId
                    ? { ...item, name, description, category, method, path }
                    : item
            );
        } else {
            const newId = apiRows.length > 0 ? Math.max(...apiRows.map((r) => r.id)) + 1 : 1;
            apiRows.push({ id: newId, name, description, category, method, path });
        }

        renderTable();
        closeApiFormModal();
    });
}

if (adminTableBody) {
    adminTableBody.addEventListener("click", (e) => {
        const actionButton = e.target.closest("button[data-action]");
        if (!actionButton) return;

        const rowId = Number(actionButton.dataset.id);
        const action = actionButton.dataset.action;
        const row = apiRows.find((item) => item.id === rowId);

        if (!row) return;

        if (action === "edit") {
            openApiModal("edit", row);
            return;
        }

        if (action === "delete") {
            const confirmed = window.confirm(`Delete ${row.name}?`);
            if (!confirmed) return;
            apiRows = apiRows.filter((item) => item.id !== rowId);
            renderTable();
            return;
        }

        if (action === "update") {
            apiRows = apiRows.map((item) =>
                item.id === rowId
                    ? {
                        ...item,
                        status: item.status === "Active" ? "Draft" : "Active",
                    }
                    : item
            );
            renderTable();
        }
    });
}

renderTable();
setModalOpen(apiModalOverlay, false);
setAdminPanelAccess(true);
