/*menu search and category filter (menu.html)*/
//DOM element to retrieve the search input and category select elements(dropdown selection box)

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const categorySelect = document.getElementById("category");

    if (searchInput || categorySelect) {
        const menuArticles = document.querySelectorAll("main article, section article");

        function filterMenu() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
            const selectedCategory = categorySelect ? categorySelect.value.toLowerCase() : "all";

            menuArticles.forEach(article => {
                const articleText = article.textContent.toLowerCase();
                const altText = article.querySelector("img") ? article.querySelector("img").alt.toLowerCase() : "";
                const datasetCategory = article.getAttribute("data-category") || "";

                // Match category via attribute or fallback text parsing
                let matchesCategory = (selectedCategory === "all") || (datasetCategory === selectedCategory);
                if (!datasetCategory && selectedCategory !== "all") {
                    if (selectedCategory === "bao" && (articleText.includes("bao") || altText.includes("bao"))) matchesCategory = true;
                    if (selectedCategory === "dimsum" && (articleText.includes("shumai") || articleText.includes("dimsum"))) matchesCategory = true;
                    if (selectedCategory === "drinks" && (articleText.includes("matcha") || articleText.includes("drink"))) matchesCategory = true;
                }

                const matchesSearch = articleText.includes(searchTerm) || altText.includes(searchTerm);

                if (matchesSearch && matchesCategory) {
                    article.style.display = "";
                } else {
                    article.style.display = "none";
                }
            });
        }

        if (searchInput) searchInput.addEventListener("input", filterMenu);
        if (categorySelect) categorySelect.addEventListener("change", filterMenu);
    }
    /*lightbox & modal pop up*/
    // Lightbox for expanding images on click
    const pageImages = document.querySelectorAll("article img");
    pageImages.forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener("click", function () {
            createLightbox(this.src, this.alt);
        });
    });

    function createLightbox(src, alt) {
        const overlay = document.createElement("div");
        overlay.id = "lightbox-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0,0,0,0.85)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "10000";
        overlay.style.cursor = "pointer";

        const imgElement = document.createElement("img");
        imgElement.src = src;
        imgElement.alt = alt;
        imgElement.style.maxWidth = "90%";
        imgElement.style.maxHeight = "80%";
        imgElement.style.borderRadius = "8px";
        imgElement.style.border = "3px solid #e60000";

        overlay.appendChild(imgElement);
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function () {
            document.body.removeChild(overlay);
        });
    }

    // Modal Trigger for "Order/Info" buttons
    const infoButtons = document.querySelectorAll(".btn-info");
    infoButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const card = this.closest("article");
            const title = card ? card.querySelector("h3").innerText : "Menu Item";
            alert(`Item Detail Modal:\n\n${title}\nStatus: Available for store pickup and delivery.\nVisit our Enquiry page to place custom orders!`);
        });
    });
    /*enquiry form , cost estimation*/
const enquiryForm = document.getElementById("enquiry-form");

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // Clear existing error messages
            clearInlineErrors(enquiryForm);

            const firstName = document.getElementById("firstName");
            const surname = document.getElementById("surname");
            const email = document.getElementById("email");
            const enquiryType = document.getElementById("enquiryType").value;

            let isValid = true;

            if (!firstName.value.trim()) {
                showInlineError(firstName, "First name is required.");
                isValid = false;
            }
            if (!surname.value.trim()) {
                showInlineError(surname, "Surname is required.");
                isValid = false;
            }
            if (!email.value.trim() || !validateEmail(email.value.trim())) {
                showInlineError(email, "Please enter a valid email address.");
                isValid = false;
            }

            if (!isValid) return;

            // Calculate cost & availability details
            let estimate = "";
            if (enquiryType === "products") {
                estimate = "R150.00 - R450.00 (Standard Menu Range)";
            } else if (enquiryType === "catering") {
                estimate = "R1,200.00 base package (Custom quotation will follow)";
            } else if (enquiryType === "events") {
                estimate = "R3,500.00 minimum booking deposit";
            }

            alert(`Enquiry Submitted Successfully!\n\n` +
                  `Client: ${firstName.value.trim()} ${surname.value.trim()}\n` +
                  `Category: ${enquiryType.toUpperCase()}\n` +
                  `Estimated Pricing: ${estimate}\n` +
                  `Turnaround Time: 24-48 hours`);

            enquiryForm.reset();
        });
    }
    /*Contact form , mail to automation (contact.html)*/
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            clearInlineErrors(contactForm);

            const firstName = document.getElementById("contactFirstName");
            const surname = document.getElementById("contactSurname");
            const email = document.getElementById("contactEmail");
            const messageType = document.getElementById("messageType").value;
            const messageBody = document.getElementById("contactMessage");

            let isValid = true;

            if (!firstName.value.trim()) {
                showInlineError(firstName, "First name is required.");
                isValid = false;
            }
            if (!surname.value.trim()) {
                showInlineError(surname, "Surname is required.");
                isValid = false;
            }
            if (!email.value.trim() || !validateEmail(email.value.trim())) {
                showInlineError(email, "Please enter a valid email address.");
                isValid = false;
            }
            if (!messageBody.value.trim()) {
                showInlineError(messageBody, "Message body cannot be empty.");
                isValid = false;
            }

            if (!isValid) return;

            const recipient = "Info@1bao2.co.za";
            const subject = encodeURIComponent(`[Website ${messageType}] from ${firstName.value.trim()} ${surname.value.trim()}`);
            const body = encodeURIComponent(
                `Sender Name: ${firstName.value.trim()} ${surname.value.trim()}\n` +
                `Sender Email: ${email.value.trim()}\n` +
                `Message Category: ${messageType}\n\n` +
                `Message Content:\n${messageBody.value.trim()}`
            );

            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        });
    }
    /*helper utilities*/
    function showInlineError(inputElement, message) {
        inputElement.style.borderColor = "#ff3333";
        const errorSpan = document.createElement("span");
        errorSpan.className = "inline-error-msg";
        errorSpan.style.color = "#ff3333";
        errorSpan.style.fontSize = "0.85rem";
        errorSpan.style.display = "block";
        errorSpan.style.marginTop = "4px";
        errorSpan.innerText = message;
        inputElement.parentNode.appendChild(errorSpan);
    }

    function clearInlineErrors(formElement) {
        const errors = formElement.querySelectorAll(".inline-error-msg");
        errors.forEach(err => err.remove());
        const inputs = formElement.querySelectorAll("input, textarea, select");
        inputs.forEach(input => input.style.borderColor = "");
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});