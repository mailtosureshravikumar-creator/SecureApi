const revealItems = document.querySelectorAll(".reveal");
const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const apiMarketplaceItem = document.getElementById("apiMarketplaceItem");
const apiDropdownTrigger = document.getElementById("apiDropdownTrigger");
const accessTriggers = document.querySelectorAll(".access-trigger");
const accessModal = document.getElementById("pgAccessModal");
const closeAccessModal = document.getElementById("pgCloseAccessModal");
const cancelAccessModal = document.getElementById("pgCancelAccessModal");
const accessForm = document.getElementById("pgAccessForm");
const mobileInput = document.getElementById("pgMobileNumber");
const mobileError = document.getElementById("pgMobileError");
const formStatus = document.getElementById("pgFormStatus");
const backToTop = document.getElementById("pgBackToTop");
const submitButton = accessForm ? accessForm.querySelector('button[type="submit"]') : null;
const nameInput = accessForm ? accessForm.querySelector('input[name="name"]') : null;
const emailInput = accessForm ? accessForm.querySelector('input[name="email"]') : null;
const requiredInputs = accessForm ? Array.from(accessForm.querySelectorAll("input[required]")) : [];

document.body.classList.add("js-enabled");

function closeDropdown() {
    if (!apiMarketplaceItem || !apiDropdownTrigger) {
        return;
    }
    apiMarketplaceItem.classList.remove("open");
    apiDropdownTrigger.setAttribute("aria-expanded", "false");
}

function closeMobileMenu() {
    if (!primaryNav || !menuToggle) {
        return;
    }
    primaryNav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = primaryNav.classList.toggle("open");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));

        if (!isOpen) {
            closeDropdown();
        }
    });
}

if (apiDropdownTrigger && apiMarketplaceItem) {
    apiDropdownTrigger.addEventListener("click", () => {
        const isOpen = apiMarketplaceItem.classList.toggle("open");
        apiDropdownTrigger.setAttribute("aria-expanded", String(isOpen));
    });
}

document.addEventListener("click", (event) => {
    if (apiMarketplaceItem && !apiMarketplaceItem.contains(event.target)) {
        closeDropdown();
    }

    if (
        window.innerWidth <= 1024 &&
        primaryNav &&
        menuToggle &&
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
        closeMobileMenu();
    }
});

if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

if (mobileInput) {
    mobileInput.addEventListener("input", () => {
        mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);

        if (mobileError) {
            const isValidLength = mobileInput.value.length === 10;
            mobileError.classList.toggle("show", mobileInput.value.length > 0 && !isValidLength);
        }

        updateSubmitState();
    });
}

function markFieldValidity(input, isValid) {
    if (!input) {
        return;
    }
    input.classList.toggle("input-invalid", !isValid && input.value.trim().length > 0);
}

function isFieldValid(input) {
    if (!input) {
        return true;
    }

    if (input === nameInput) {
        return input.value.trim().length >= 2;
    }

    if (input === emailInput) {
        return input.validity.valid;
    }

    if (input === mobileInput) {
        return /^\d{10}$/.test(input.value.trim());
    }

    return input.validity.valid;
}

function updateSubmitState() {
    if (!submitButton) {
        return;
    }

    const allRequiredFilled = requiredInputs.every((input) => input.value.trim().length > 0);
    const allRequiredValid = requiredInputs.every((input) => isFieldValid(input));
    submitButton.disabled = !(allRequiredFilled && allRequiredValid);
}

function setModalState(isOpen) {
    if (!accessModal) {
        return;
    }

    accessModal.classList.toggle("open", isOpen);
    accessModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);

    if (isOpen && nameInput) {
        window.setTimeout(() => nameInput.focus(), 80);
    }

    if (!isOpen && accessForm) {
        accessForm.reset();
        requiredInputs.forEach((input) => input.classList.remove("input-invalid"));
        if (mobileError) {
            mobileError.classList.remove("show");
        }
        if (formStatus) {
            formStatus.textContent = "";
            formStatus.classList.remove("is-error", "is-success");
        }
        if (submitButton) {
            submitButton.textContent = "Submit Request";
            submitButton.disabled = true;
        }
    }
}

accessTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        event.preventDefault();
        setModalState(true);
    });
});

if (closeAccessModal) {
    closeAccessModal.addEventListener("click", () => setModalState(false));
}

if (cancelAccessModal) {
    cancelAccessModal.addEventListener("click", () => setModalState(false));
}

if (accessModal) {
    accessModal.addEventListener("click", (event) => {
        if (event.target === accessModal) {
            setModalState(false);
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setModalState(false);
    }
});

if (accessForm) {
    requiredInputs.forEach((input) => {
        input.addEventListener("input", () => {
            markFieldValidity(input, isFieldValid(input));
            if (formStatus) {
                formStatus.textContent = "";
                formStatus.classList.remove("is-error", "is-success");
            }
            updateSubmitState();
        });

        input.addEventListener("blur", () => {
            markFieldValidity(input, isFieldValid(input));
        });
    });

    updateSubmitState();

    accessForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!accessForm.reportValidity()) {
            return;
        }

        const mobileValue = mobileInput ? mobileInput.value.trim() : "";
        const isMobileValid = /^\d{10}$/.test(mobileValue);

        if (!isMobileValid) {
            if (mobileError) {
                mobileError.classList.add("show");
            }
            if (formStatus) {
                formStatus.textContent = "Please correct the mobile number and try again.";
                formStatus.classList.remove("is-success");
                formStatus.classList.add("is-error");
            }
            markFieldValidity(mobileInput, false);
            return;
        }

        if (mobileError) {
            mobileError.classList.remove("show");
        }

        if (formStatus) {
            formStatus.textContent = "Request submitted successfully. Our team will contact you shortly.";
            formStatus.classList.remove("is-error");
            formStatus.classList.add("is-success");
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        window.setTimeout(() => {
            setModalState(false);
        }, 1200);
    });
}

if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 280);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
