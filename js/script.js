
"use strict";

/* =========================================
   TECHNOVA SOLUTIONS
   BUSINESS SERVICES WEBSITE
   JavaScript Functionality
========================================= */

document.body.classList.add("js-enabled");

/* ========== 1. HELPER FUNCTIONS ========== */

const select = (selector, parent = document) =>
    parent.querySelector(selector);

const selectAll = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* ========== 2. MOBILE NAVIGATION ========== */

const menuToggle = select("#menu-toggle");
const navMenu = select("#nav-menu");
const navLinks = selectAll(".nav-link");

function closeMobileMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = select("i", menuToggle);

    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = select("i", menuToggle);

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            navMenu.classList.contains("is-open") &&
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            closeMobileMenu();
        }
    });
}


/* ========== 3. ACTIVE NAVIGATION LINKS ========== */

const observedSections = selectAll(
    "#about, #services, #projects, #team, #contact"
);

function setActiveNavigation(id) {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

if ("IntersectionObserver" in window && observedSections.length) {
    const navObserver = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (a, b) =>
                        b.intersectionRatio - a.intersectionRatio
                );

            if (visibleEntries.length) {
                setActiveNavigation(visibleEntries[0].target.id);
            }
        },
        {
            rootMargin: "-20% 0px -60% 0px",
            threshold: [0, 0.1, 0.3, 0.5]
        }
    );

    observedSections.forEach((section) => {
        navObserver.observe(section);
    });
}


/* ========== 4. SERVICE SEARCH AND FILTERS ========== */

const serviceCards = selectAll(".service-card");
const filterButtons = selectAll(".filter-btn");
const searchInput = select("#service-search");
const emptyState = select("#empty-state");
const resetFiltersButton = select("#reset-filters");
const filterStatus = select("#filter-status");

let currentCategory = "all";
let currentSearch = "";

function filterServices() {
    const searchTerm = currentSearch.trim().toLowerCase();
    let visibleCount = 0;

    serviceCards.forEach((card) => {
        const category = card.dataset.category || "";
        const searchableText = (
            (card.dataset.search || "") +
            " " +
            card.textContent
        ).toLowerCase();

        const matchesCategory =
            currentCategory === "all" ||
            category === currentCategory;

        const matchesSearch =
            !searchTerm ||
            searchableText.includes(searchTerm);

        const shouldShow = matchesCategory && matchesSearch;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }
    });

    if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
    }

    if (filterStatus) {
        filterStatus.textContent =
            visibleCount === 0
                ? "No matching services found."
                : `Showing ${visibleCount} ${
                    visibleCount === 1 ? "service" : "services"
                }.`;
    }
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentCategory = button.dataset.filter || "all";

        filterButtons.forEach((item) => {
            const isActive = item === button;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        filterServices();
    });
});

if (searchInput) {
    searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value;
        filterServices();
    });
}

function resetServiceFilters() {
    currentCategory = "all";
    currentSearch = "";

    if (searchInput) {
        searchInput.value = "";
    }

    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === "all";

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    filterServices();
}

if (resetFiltersButton) {
    resetFiltersButton.addEventListener(
        "click",
        resetServiceFilters
    );
}

filterServices();


/* ========== 5. SERVICE DETAILS DATA ========== */

const serviceDetails = {
    web: {
        category: "DEVELOPMENT",
        title: "Web Development",
        description:
            "Build a professional website that explains your services, " +
            "works across screen sizes and helps customers find the " +
            "information they need.",
        features: [
            "Responsive layouts for mobile, tablet and desktop.",
            "Semantic HTML and accessible interface elements.",
            "Interactive components and client-side validation.",
            "SEO-friendly page structure and performance-conscious assets."
        ],
        benefits:
            "Improve online presentation, make information easier to find " +
            "and provide a consistent experience across devices.",
        technologies: ["HTML5", "CSS3", "JavaScript", "React"],
        useCases:
            "Business websites, service pages, landing pages, portfolios " +
            "and product information websites."
    },

    mobile: {
        category: "DEVELOPMENT",
        title: "Mobile App Development",
        description:
            "Plan mobile experiences that make important features and " +
            "services convenient to use on smartphones and tablets.",
        features: [
            "Mobile-first interface planning.",
            "Clear navigation and accessible controls.",
            "API integration planning.",
            "Testing across supported device sizes."
        ],
        benefits:
            "Make your service more convenient for mobile users and " +
            "support customer tasks while on the move.",
        technologies: ["React Native", "JavaScript", "REST APIs", "Figma"],
        useCases:
            "Customer portals, booking applications, service apps and " +
            "business productivity tools."
    },

    design: {
        category: "DESIGN",
        title: "UI/UX Design",
        description:
            "Create understandable interfaces and user journeys based " +
            "on user needs, business objectives and usability principles.",
        features: [
            "User flows and information architecture.",
            "Wireframes and interactive prototypes.",
            "Reusable interface components.",
            "Responsive design and accessibility considerations."
        ],
        benefits:
            "Help users navigate more confidently, understand key actions " +
            "and complete important tasks with less confusion.",
        technologies: ["Figma", "Wireframes", "Prototyping", "Design Systems"],
        useCases:
            "Web applications, mobile applications, dashboards, " +
            "onboarding flows and website redesigns."
    },

    software: {
        category: "DEVELOPMENT",
        title: "Custom Software Development",
        description:
            "Plan and build software around your organization's actual " +
            "workflows, data requirements and operational goals.",
        features: [
            "Requirement analysis and feature planning.",
            "Reusable application components.",
            "API and integration planning.",
            "Testing and maintainable project structure."
        ],
        benefits:
            "Reduce dependence on unsuitable workflows and make room " +
            "for features that match your organization's requirements.",
        technologies: ["Node.js", "Express.js", "JavaScript", "REST APIs"],
        useCases:
            "Internal business tools, booking systems, inventory " +
            "applications and custom customer portals."
    },

    ai: {
        category: "AI & AUTOMATION",
        title: "AI & Automation",
        description:
            "Identify repetitive tasks and explore appropriate AI " +
            "or rule-based automation to improve everyday workflows.",
        features: [
            "Workflow and task analysis.",
            "Automation opportunity identification.",
            "Chatbot and API integration planning.",
            "Human review and error-handling considerations."
        ],
        benefits:
            "Reduce repetitive manual work and help teams handle " +
            "routine tasks more consistently.",
        technologies: ["Python", "REST APIs", "Node.js", "AI APIs"],
        useCases:
            "Frequently asked questions, document processing, " +
            "routine notifications and workflow automation."
    },

    wordpress: {
        category: "DEVELOPMENT",
        title: "WordPress Development",
        description:
            "Create websites that authorized content editors can " +
            "update without manually editing every page.",
        features: [
            "Theme and page customization.",
            "Responsive content layouts.",
            "Content management configuration.",
            "Basic SEO and plugin compatibility checks."
        ],
        benefits:
            "Make routine content updates easier and provide a " +
            "manageable publishing workflow.",
        technologies: ["WordPress", "PHP", "CSS", "JavaScript"],
        useCases:
            "Business websites, blogs, company profiles, " +
            "service directories and content-focused websites."
    },

    erp: {
        category: "BUSINESS SOLUTIONS",
        title: "ERP Solutions",
        description:
            "Plan a unified system for related business operations, " +
            "with access and workflows designed around organizational needs.",
        features: [
            "Business process and requirement mapping.",
            "Inventory and order workflow planning.",
            "Reporting interface design.",
            "Role and permission planning."
        ],
        benefits:
            "Improve visibility across related processes and reduce " +
            "the need to manage disconnected information manually.",
        technologies: ["Node.js", "SQL", "REST APIs", "Dashboards"],
        useCases:
            "Inventory management, order processing, purchasing " +
            "and internal operational reporting."
    },

    database: {
        category: "BUSINESS SOLUTIONS",
        title: "Database Solutions",
        description:
            "Design data structures that support reliable information " +
            "storage, retrieval and application workflows.",
        features: [
            "Data modeling and relationship design.",
            "Query and indexing considerations.",
            "Validation and data integrity planning.",
            "Backup and access-control planning."
        ],
        benefits:
            "Keep information organized and make it easier for " +
            "applications to retrieve relevant records.",
        technologies: ["MySQL", "PostgreSQL", "MongoDB", "SQL"],
        useCases:
            "Customer records, product catalogs, booking systems, " +
            "inventory applications and reporting tools."
    }
};


/* ========== 6. SERVICE DETAILS MODAL ========== */

const serviceModal = select("#service-modal");
const modalClose = select("#modal-close");
const modalTitle = select("#modal-title");
const modalCategory = select("#modal-category");
const modalDescription = select("#modal-description");
const modalFeatures = select("#modal-features");
const modalBenefits = select("#modal-benefits");
const modalTechnologies = select("#modal-technologies");
const modalUseCases = select("#modal-use-cases");
const modalCta = select("#modal-cta");

let previouslyFocusedElement = null;

function openServiceModal(serviceKey, triggerButton) {
    const service = serviceDetails[serviceKey];

    if (!service || !serviceModal) return;

    previouslyFocusedElement = triggerButton || document.activeElement;

    modalCategory.textContent = service.category;
    modalTitle.textContent = service.title;
    modalDescription.textContent = service.description;
    modalBenefits.textContent = service.benefits;
    modalUseCases.textContent = service.useCases;

    modalFeatures.replaceChildren();

    service.features.forEach((feature) => {
        const listItem = document.createElement("li");
        const icon = document.createElement("i");
        const text = document.createElement("span");

        icon.className = "fa-solid fa-check";
        icon.setAttribute("aria-hidden", "true");
        text.textContent = feature;

        listItem.append(icon, text);
        modalFeatures.appendChild(listItem);
    });

    modalTechnologies.replaceChildren();

    service.technologies.forEach((technology) => {
        const tag = document.createElement("span");

        tag.textContent = technology;
        modalTechnologies.appendChild(tag);
    });

    if (typeof serviceModal.showModal === "function") {
        serviceModal.showModal();
        document.body.classList.add("modal-open");
        modalClose.focus();
    } else {
        window.alert(
            `${service.title}\n\n${service.description}\n\n` +
            `Benefits: ${service.benefits}`
        );
    }
}

selectAll(".learn-more").forEach((button) => {
    button.addEventListener("click", () => {
        openServiceModal(button.dataset.service, button);
    });
});

function closeServiceModal() {
    if (serviceModal && serviceModal.open) {
        serviceModal.close();
    }
}

if (modalClose) {
    modalClose.addEventListener("click", closeServiceModal);
}

if (serviceModal) {
    serviceModal.addEventListener("close", () => {
        document.body.classList.remove("modal-open");

        if (
            previouslyFocusedElement &&
            document.contains(previouslyFocusedElement)
        ) {
            previouslyFocusedElement.focus();
        }
    });

    serviceModal.addEventListener("click", (event) => {
        if (event.target === serviceModal) {
            closeServiceModal();
        }
    });
}

if (modalCta) {
    modalCta.addEventListener("click", () => {
        closeServiceModal();

        const serviceName = modalTitle.textContent;
        const serviceSelect = select("#service");

        if (serviceSelect) {
            const matchingOption = [...serviceSelect.options].find(
                (option) => option.value === serviceName
            );

            if (matchingOption) {
                serviceSelect.value = matchingOption.value;
            }
        }
    });
}


/* ========== 7. FORM VALIDATION ========== */

const inquiryForm = select("#inquiry-form");
const formMessage = select("#form-message");
const descriptionInput = select("#project-description");
const characterCount = select("#character-count");

const fieldErrorIds = {
    fullName: "name-error",
    email: "email-error",
    phone: "phone-error",
    service: "service-error",
    description: "description-error",
    consent: "consent-error"
};

function setFieldError(field, message) {
    const errorId = fieldErrorIds[field.name];
    const errorElement = errorId ? select(`#${errorId}`) : null;

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (message) {
        field.setAttribute("aria-invalid", "true");
    } else {
        field.removeAttribute("aria-invalid");
    }
}

function clearFormErrors() {
    Object.keys(fieldErrorIds).forEach((fieldName) => {
        const field = inquiryForm.elements.namedItem(fieldName);

        if (field) {
            setFieldError(field, "");
        }
    });

    if (formMessage) {
        formMessage.hidden = true;
        formMessage.textContent = "";
        formMessage.className = "form-message";
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    if (!phone) return true;

    const digits = phone.replace(/\D/g, "");

    return (
        /^[+\d\s().-]+$/.test(phone) &&
        digits.length >= 7 &&
        digits.length <= 15
    );
}

function validateInquiryForm() {
    clearFormErrors();

    let isValid = true;
    let firstInvalidField = null;

    function invalidate(field, message) {
        setFieldError(field, message);
        isValid = false;

        if (!firstInvalidField) {
            firstInvalidField = field;
        }
    }

    const fullName = inquiryForm.elements.namedItem("fullName");
    const email = inquiryForm.elements.namedItem("email");
    const phone = inquiryForm.elements.namedItem("phone");
    const service = inquiryForm.elements.namedItem("service");
    const description = inquiryForm.elements.namedItem("description");
    const consent = inquiryForm.elements.namedItem("consent");

    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const descriptionValue = description.value.trim();

    if (nameValue.length < 2) {
        invalidate(fullName, "Please enter your full name (at least 2 characters).");
    }

    if (nameValue.length > 100) {
        invalidate(fullName, "Your name must be 100 characters or fewer.");
    }

    if (!emailValue) {
        invalidate(email, "Please enter your email address.");
    } else if (
        emailValue.length > 254 ||
        !isValidEmail(emailValue)
    ) {
        invalidate(email, "Please enter a valid email address.");
    }

    if (!isValidPhone(phoneValue)) {
        invalidate(phone, "Enter a valid phone number with 7–15 digits.");
    }

    if (!service.value) {
        invalidate(service, "Please select a service.");
    }

    if (descriptionValue.length < 10) {
        invalidate(
            description,
            "Please describe your project in at least 10 characters."
        );
    } else if (descriptionValue.length > 3000) {
        invalidate(
            description,
            "Your project description must be 3000 characters or fewer."
        );
    }

    if (!consent.checked) {
        invalidate(consent, "Please confirm your information is accurate.");
    }

    return {
        isValid,
        firstInvalidField
    };
}


/* ========== 8. LIVE FORM FEEDBACK ========== */

if (inquiryForm) {
    const watchedFields = [
        "fullName",
        "email",
        "phone",
        "service",
        "description",
        "consent"
    ];

    watchedFields.forEach((fieldName) => {
        const field = inquiryForm.elements.namedItem(fieldName);

        if (!field) return;

        const eventName =
            field.type === "checkbox" || field.tagName === "SELECT"
                ? "change"
                : "input";

        field.addEventListener(eventName, () => {
            if (field.getAttribute("aria-invalid") === "true") {
                validateInquiryForm();
            }
        });
    });

    inquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const result = validateInquiryForm();

        if (!result.isValid) {
            if (formMessage) {
                formMessage.hidden = false;
                formMessage.className = "form-message error";
                formMessage.textContent =
                    "Please correct the highlighted fields and try again.";
            }

            if (result.firstInvalidField) {
                result.firstInvalidField.focus();
            }

            return;
        }

        /*
         * FRONT-END DEMONSTRATION ONLY.
         *
         * This form does not send data to a server.
         * A backend API and server-side validation
         * will be required for real inquiry submission.
         */

        const submittedName =
            inquiryForm.elements.namedItem("fullName").value.trim();

        if (formMessage) {
            formMessage.hidden = false;
            formMessage.className = "form-message success";
            formMessage.textContent =
                `Thank you, ${submittedName}! Your form passed front-end ` +
                "validation. This demonstration does not send or store " +
                "your inquiry. Connect a backend to submit it for real.";

            formMessage.focus();
        }

        inquiryForm.reset();
        updateCharacterCount();
        clearFormErrors();

        /*
         * clearFormErrors() also clears the message,
         * so display the success message again.
         */

        if (formMessage) {
            formMessage.hidden = false;
            formMessage.className = "form-message success";
            formMessage.textContent =
                `Thank you, ${submittedName}! Your form passed front-end ` +
                "validation. This demonstration does not send or store " +
                "your inquiry. Connect a backend to submit it for real.";
            formMessage.focus();
        }
    });
}


/* ========== 9. DESCRIPTION CHARACTER COUNTER ========== */

function updateCharacterCount() {
    if (!descriptionInput || !characterCount) return;

    characterCount.textContent =
        `${descriptionInput.value.length} / 3000`;
}

if (descriptionInput) {
    descriptionInput.addEventListener("input", updateCharacterCount);
    updateCharacterCount();
}


/* ========== 10. SCROLL REVEAL ANIMATION ========== */

const revealElements = selectAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}


/* ========== 11. AUTOMATIC COPYRIGHT YEAR ========== */

const currentYear = select("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* ========== 12. INITIALIZE PAGE ========== */

filterServices();

console.log("TechNova Solutions website initialized successfully.");
