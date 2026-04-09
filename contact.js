const contactForm = document.getElementById("contactForm");
const phoneInput = document.getElementById("contactPhone");
const phoneError = document.getElementById("contactPhoneError");
const messageInput = document.getElementById("contactMessage");
const messageCounter = document.getElementById("messageCounter");
const contactFormStatus = document.getElementById("contactFormStatus");

function updateMessageCounter() {
    if (!messageInput || !messageCounter) {
        return;
    }

    const count = messageInput.value.length;
    messageCounter.textContent = `${count} / 5000 characters`;
}

if (messageInput) {
    messageInput.addEventListener("input", updateMessageCounter);
    updateMessageCounter();
}

if (phoneInput) {
    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);

        if (!phoneError) {
            return;
        }

        const hasValue = phoneInput.value.length > 0;
        const isValid = phoneInput.value.length === 10;
        phoneError.classList.toggle("show", hasValue && !isValid);
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const phone = phoneInput ? phoneInput.value.trim() : "";
        if (phone.length > 0 && !/^\d{10}$/.test(phone)) {
            if (phoneError) {
                phoneError.classList.add("show");
            }
            if (phoneInput) {
                phoneInput.focus();
            }
            return;
        }

        if (phoneError) {
            phoneError.classList.remove("show");
        }

        if (contactFormStatus) {
            contactFormStatus.textContent = "Message sent successfully. We'll respond as soon as possible.";
        }

        contactForm.reset();
        updateMessageCounter();
    });
}
