const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const apiMarketplaceItem = document.getElementById("apiMarketplaceItem");
const apiDropdownTrigger = document.getElementById("apiDropdownTrigger");
const siteHeader = document.querySelector(".site-header");
const backToTop = document.getElementById("backToTop");
const integrationCode = document.getElementById("integrationCode");
const codeTabs = document.querySelectorAll(".code-tab");
const revealElements = document.querySelectorAll(".reveal");
const statValues = document.querySelectorAll(".stat-value");
const sectionEls = document.querySelectorAll("main [id]");
const navLinks = document.querySelectorAll('.menu-list a[href^="#"]');
const filterChips = document.querySelectorAll(".filter-chip");
const apiCards = document.querySelectorAll(".api-card[data-category]");
const capabilityGroups = document.querySelectorAll(".capability-group");
const accessTriggers = document.querySelectorAll(".access-trigger");
const accessModal = document.getElementById("accessModal");
const closeAccessModal = document.getElementById("closeAccessModal");
const cancelAccessModal = document.getElementById("cancelAccessModal");
const accessForm = document.getElementById("accessForm");
const formStatus = document.getElementById("formStatus");
const mobileNumber = document.getElementById("mobileNumber");
const mobileError = document.getElementById("mobileError");
const valuePropCards = document.querySelectorAll("#valuePropCards .feature-card");
const valuePropTag = document.getElementById("valuePropTag");
const valuePropTitle = document.getElementById("valuePropTitle");
const valuePropText = document.getElementById("valuePropText");

document.body.classList.add("js-enabled");
window.requestAnimationFrame(() => {
    document.body.classList.add("page-ready");
});

function closeDropdown() {
    apiMarketplaceItem.classList.remove("open");
    apiDropdownTrigger.setAttribute("aria-expanded", "false");
}

function toggleDropdown() {
    const isOpen = apiMarketplaceItem.classList.toggle("open");
    apiDropdownTrigger.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
    primaryNav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
}

function setActiveNav(hash) {
    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === hash);
    });
}

function animateStat(element) {
    const originalText = element.textContent.trim();

    if (originalText.includes("/")) {
        return;
    }

    const hasPlus = originalText.includes("+");
    const hasPercent = originalText.includes("%");
    const numericValue = Number.parseFloat(originalText.replace(/[^\d.]/g, ""));

    if (!Number.isFinite(numericValue)) {
        return;
    }

    const duration = 1200;
    const startTime = performance.now();
    const decimals = originalText.includes(".") ? 1 : 0;

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = numericValue * progress;
        const formatted = current.toFixed(decimals);
        element.textContent = `${formatted}${hasPercent ? "%" : ""}${hasPlus ? "+" : ""}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = originalText;
        }
    }

    requestAnimationFrame(update);
}

menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
        closeDropdown();
    }
});

apiDropdownTrigger.addEventListener("click", toggleDropdown);

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 1024) {
            closeMobileMenu();
        }
        closeDropdown();
    });
});

filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        const selectedFilter = chip.dataset.filter;

        filterChips.forEach((btn) => {
            btn.classList.toggle("active", btn === chip);
        });

        apiCards.forEach((card) => {
            const cardCategory = card.dataset.category;
            const showCard = selectedFilter === "all" || cardCategory === selectedFilter;
            card.classList.toggle("is-hidden", !showCard);
        });

        capabilityGroups.forEach((group) => {
            const visibleCards = group.querySelectorAll(".api-card:not(.is-hidden)");
            group.classList.toggle("is-hidden", visibleCards.length === 0);
        });
    });
});

function setValuePropActive(card) {
    valuePropCards.forEach((item) => {
        const isActive = item === card;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
    });

    if (valuePropTag && valuePropTitle && valuePropText) {
        valuePropTag.textContent = card.dataset.propTag || "Value";
        valuePropTitle.textContent = card.dataset.propTitle || "";
        valuePropText.textContent = card.dataset.propDescription || "";
    }
}

valuePropCards.forEach((card) => {
    card.addEventListener("click", () => {
        setValuePropActive(card);
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setValuePropActive(card);
        }
    });

    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", `${x}%`);
        card.style.setProperty("--my", `${y}%`);
    });

    card.addEventListener("mouseleave", () => {
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "50%");
    });
});

document.addEventListener("click", (event) => {
    if (!apiMarketplaceItem.contains(event.target)) {
        closeDropdown();
    }

    if (window.innerWidth <= 1024 && !primaryNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
        primaryNav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveNav(`#${entry.target.id}`);
            }
        });
    },
    { threshold: 0.3, rootMargin: "-100px 0px -45% 0px" }
);

sectionEls.forEach((section) => sectionObserver.observe(section));

const statObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                statValues.forEach((stat) => animateStat(stat));
                statObserver.disconnect();
            }
        });
    },
    { threshold: 0.4 }
);

const statsContainer = document.querySelector(".hero-stats");
if (statsContainer) {
    statObserver.observe(statsContainer);
}

const snippets = {
    curl: `curl --location 'https://api.vlink.com/pan' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer YOUR_API_KEY' \\
--data '{\n  "document_base64": "base64_encoded_image"\n}'`,
    python: `import requests\n\nurl = "https://api.vlink.com/pan"\nheaders = {\n    "Content-Type": "application/json",\n    "Authorization": "Bearer YOUR_API_KEY"\n}\npayload = {"document_base64": "base64_encoded_image"}\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`,
    javascript: `const response = await fetch("https://api.vlink.com/pan", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "Authorization": "Bearer YOUR_API_KEY"\n  },\n  body: JSON.stringify({ document_base64: "base64_encoded_image" })\n});\nconst data = await response.json();\nconsole.log(data);`,
    java: `HttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.vlink.com/pan"))\n    .header("Content-Type", "application/json")\n    .header("Authorization", "Bearer YOUR_API_KEY")\n    .POST(HttpRequest.BodyPublishers.ofString("{\\\"document_base64\\\":\\\"base64_encoded_image\\\"}"))\n    .build();`,
    dotnet: `using var client = new HttpClient();\nclient.DefaultRequestHeaders.Authorization =\n    new AuthenticationHeaderValue("Bearer", "YOUR_API_KEY");\n\nvar payload = JsonSerializer.Serialize(new { document_base64 = "base64_encoded_image" });\nvar response = await client.PostAsync(\n    "https://api.vlink.com/pan",\n    new StringContent(payload, Encoding.UTF8, "application/json")\n);`
};

codeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const selectedLang = tab.dataset.lang;
        codeTabs.forEach((btn) => {
            const isActive = btn === tab;
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-selected", String(isActive));
        });

        if (integrationCode && snippets[selectedLang]) {
            integrationCode.textContent = snippets[selectedLang];
        }
    });
});

function handleScrollUI() {
    const y = window.scrollY;
    if (siteHeader) {
        siteHeader.classList.toggle("scrolled", y > 18);
    }
    if (backToTop) {
        backToTop.classList.toggle("show", y > 320);
    }
}

window.addEventListener("scroll", handleScrollUI, { passive: true });
handleScrollUI();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function setModalState(isOpen) {
    if (!accessModal) {
        return;
    }

    accessModal.classList.toggle("open", isOpen);
    accessModal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);
}

accessTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        event.preventDefault();
        setModalState(true);
    });
});

if (closeAccessModal) {
    closeAccessModal.addEventListener("click", () => {
        setModalState(false);
    });
}

if (cancelAccessModal) {
    cancelAccessModal.addEventListener("click", () => {
        setModalState(false);
    });
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
    accessForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (mobileNumber && !/^\d{10}$/.test(mobileNumber.value.trim())) {
            if (mobileError) {
                mobileError.classList.add("show");
            }
            mobileNumber.focus();
            return;
        }

        if (mobileError) {
            mobileError.classList.remove("show");
        }

        if (formStatus) {
            formStatus.textContent = "Demo request submitted successfully. We will contact you shortly.";
        }

        accessForm.reset();

        window.setTimeout(() => {
            setModalState(false);
            if (formStatus) {
                formStatus.textContent = "";
            }
        }, 1200);
    });
}

if (mobileNumber) {
    mobileNumber.addEventListener("input", () => {
        mobileNumber.value = mobileNumber.value.replace(/\D/g, "").slice(0, 10);
        if (mobileError) {
            mobileError.classList.remove("show");
        }
    });
}

