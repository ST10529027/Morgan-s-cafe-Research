/*
    Morgan's Café - Main JavaScript
    Module: WEDE5020 - Web Development (Introduction)
    Formative Part 3
 * Morgan's Café - Website Interactivity
 * JavaScript DOM manipulation and event handling.
 * Reference: MDN Web Docs (n.d.), JavaScript and DOM documentation.
 

    Features:
    - Mobile navigation
    - Product search, filtering and sorting
    - Accordion sections
    - Image gallery lightbox
    - Smooth scrolling
    - Back-to-top button
    - Dynamic current year
    - Accessible interactive controls
*/

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================

    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav-links");

    if (navbar && navLinks) {
        let menuButton = document.getElementById("menu-toggle");

        if (!menuButton) {
            menuButton = document.createElement("button");
            menuButton.id = "menu-toggle";
            menuButton.type = "button";
            menuButton.className = "menu-toggle";
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.setAttribute("aria-expanded", "false");

            const logo = navbar.querySelector(".logo");

            if (logo) {
                logo.insertAdjacentElement("afterend", menuButton);
            } else {
                navbar.prepend(menuButton);
            }
        }

        menuButton.addEventListener("click", function () {
            const isExpanded =
                menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute("aria-expanded", String(!isExpanded));
            menuButton.setAttribute(
                "aria-label",
                isExpanded ? "Open navigation menu" : "Close navigation menu"
            );

            navLinks.classList.toggle("nav-open", !isExpanded);
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("nav-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation menu");
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                navLinks.classList.remove("nav-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation menu");
            }
        });
    }


    // ==========================================
    // 2. PRODUCT SEARCH, FILTERING AND SORTING
    // ==========================================

    const productContainer = document.querySelector(
        ".product-grid, #product-list, [data-product-list]"
    );

    const searchInput = document.getElementById("product-search");
    const categoryFilter = document.getElementById("category-filter");
    const sortSelect = document.getElementById("sort-products");
    const noProductsMessage = document.getElementById("no-products-message");

    if (productContainer) {
        const originalProducts = Array.from(
            productContainer.querySelectorAll(
                ".product-card, [data-product]"
            )
        );

        function getProductName(product) {
            const heading = product.querySelector("h2, h3, h4");

            return heading
                ? heading.textContent.trim()
                : product.textContent.trim();
        }

        function getProductPrice(product) {
            const priceElement = product.querySelector(
                "[data-price], .product-price, .price"
            );

            if (!priceElement) {
                return NaN;
            }

            const priceText =
                priceElement.getAttribute("data-price") ||
                priceElement.textContent;

            const cleanedPrice = priceText.replace(/[^0-9.]/g, "");

            return cleanedPrice ? Number(cleanedPrice) : NaN;
        }

        function getProductCategory(product) {
            return (
                product.dataset.category ||
                product.getAttribute("data-category") ||
                "all"
            ).toLowerCase();
        }

        function updateProducts() {
            const searchTerm = searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

            const selectedCategory = categoryFilter
                ? categoryFilter.value.toLowerCase()
                : "all";

            const sortOption = sortSelect ? sortSelect.value : "default";

            let visibleProducts = originalProducts.filter(function (product) {
                const matchesSearch = product.textContent
                    .toLowerCase()
                    .includes(searchTerm);

                const productCategory = getProductCategory(product);

                const matchesCategory =
                    selectedCategory === "all" ||
                    selectedCategory === "" ||
                    productCategory === selectedCategory;

                return matchesSearch && matchesCategory;
            });

            if (sortOption === "name-asc") {
                visibleProducts.sort(function (a, b) {
                    return getProductName(a).localeCompare(getProductName(b));
                });
            } else if (sortOption === "name-desc") {
                visibleProducts.sort(function (a, b) {
                    return getProductName(b).localeCompare(getProductName(a));
                });
            } else if (sortOption === "price-asc") {
                visibleProducts.sort(function (a, b) {
                    return getProductPrice(a) - getProductPrice(b);
                });
            } else if (sortOption === "price-desc") {
                visibleProducts.sort(function (a, b) {
                    return getProductPrice(b) - getProductPrice(a);
                });
            }

            visibleProducts.forEach(function (product) {
                productContainer.appendChild(product);
                product.hidden = false;
            });

            originalProducts.forEach(function (product) {
                if (!visibleProducts.includes(product)) {
                    product.hidden = true;
                }
            });

            if (noProductsMessage) {
                noProductsMessage.hidden = visibleProducts.length > 0;
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", updateProducts);
        }

        if (categoryFilter) {
            categoryFilter.addEventListener("change", updateProducts);
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", updateProducts);
        }

        updateProducts();
    }


    // ==========================================
    // 3. ACCORDION FUNCTIONALITY
    // ==========================================

    const accordionButtons = document.querySelectorAll(
        ".accordion-button, [data-accordion-button]"
    );

    accordionButtons.forEach(function (button) {
        button.setAttribute("aria-expanded", "false");

        let panelId = button.getAttribute("aria-controls");
        let panel = panelId ? document.getElementById(panelId) : null;

        if (!panel) {
            panel = button.nextElementSibling;
        }

        if (!panel) {
            return;
        }

        panel.hidden = true;

        button.addEventListener("click", function () {
            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute("aria-expanded", String(!isExpanded));
            panel.hidden = isExpanded;
        });
    });


    // ==========================================
    // 4. IMAGE GALLERY LIGHTBOX
    // ==========================================

    const galleryImages = document.querySelectorAll(
        ".gallery-image, [data-lightbox]"
    );

    if (galleryImages.length > 0) {
        const lightbox = document.createElement("div");

        lightbox.className = "lightbox";
        lightbox.hidden = true;
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "Image preview");

        lightbox.innerHTML = `
            <button
                type="button"
                class="lightbox-close"
                aria-label="Close image preview"
            >&times;</button>

            <button
                type="button"
                class="lightbox-previous"
                aria-label="Previous image"
            >&#10094;</button>

            <figure class="lightbox-figure">
                <img class="lightbox-image" src="" alt="">
                <figcaption class="lightbox-caption"></figcaption>
            </figure>

            <button
                type="button"
                class="lightbox-next"
                aria-label="Next image"
            >&#10095;</button>
        `;

        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector(".lightbox-image");
        const lightboxCaption = lightbox.querySelector(".lightbox-caption");
        const closeButton = lightbox.querySelector(".lightbox-close");
        const previousButton = lightbox.querySelector(".lightbox-previous");
        const nextButton = lightbox.querySelector(".lightbox-next");

        let currentImageIndex = 0;
        let previousFocus = null;

        function showGalleryImage(index) {
            currentImageIndex =
                (index + galleryImages.length) % galleryImages.length;

            const image = galleryImages[currentImageIndex];

            lightboxImage.src = image.currentSrc || image.src;
            lightboxImage.alt = image.alt || "Café gallery image";

            lightboxCaption.textContent =
                image.dataset.caption ||
                image.alt ||
                "";

            previousButton.hidden = galleryImages.length < 2;
            nextButton.hidden = galleryImages.length < 2;
        }

        function openLightbox(index) {
            previousFocus = document.activeElement;
            showGalleryImage(index);
            lightbox.hidden = false;
            document.body.classList.add("lightbox-open");
            closeButton.focus();
        }

        function closeLightbox() {
            lightbox.hidden = true;
            document.body.classList.remove("lightbox-open");

            if (previousFocus && typeof previousFocus.focus === "function") {
                previousFocus.focus();
            }
        }

        galleryImages.forEach(function (image, index) {
            image.style.cursor = "zoom-in";
            image.setAttribute("tabindex", "0");
            image.setAttribute("role", "button");

            if (!image.hasAttribute("aria-label")) {
                image.setAttribute(
                    "aria-label",
                    "Open image preview: " + (image.alt || "Gallery image")
                );
            }

            image.addEventListener("click", function () {
                openLightbox(index);
            });

            image.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openLightbox(index);
                }
            });
        });

        closeButton.addEventListener("click", closeLightbox);

        previousButton.addEventListener("click", function () {
            showGalleryImage(currentImageIndex - 1);
        });

        nextButton.addEventListener("click", function () {
            showGalleryImage(currentImageIndex + 1);
        });

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (lightbox.hidden) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            } else if (event.key === "ArrowLeft") {
                showGalleryImage(currentImageIndex - 1);
            } else if (event.key === "ArrowRight") {
                showGalleryImage(currentImageIndex + 1);
            }
        });
    }


    // ==========================================
    // 5. SMOOTH SCROLLING FOR INTERNAL LINKS
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });


    // ==========================================
    // 6. BACK-TO-TOP BUTTON
    // ==========================================

    let backToTopButton = document.getElementById("back-to-top");

    if (!backToTopButton) {
        backToTopButton = document.createElement("button");
        backToTopButton.id = "back-to-top";
        backToTopButton.type = "button";
        backToTopButton.className = "back-to-top";
        backToTopButton.textContent = "↑";
        backToTopButton.setAttribute("aria-label", "Back to top");
        backToTopButton.title = "Back to top";

        document.body.appendChild(backToTopButton);
    }

    backToTopButton.hidden = true;

    function updateBackToTopButton() {
        backToTopButton.hidden = window.scrollY < 300;
    }

    window.addEventListener("scroll", updateBackToTopButton, {
        passive: true
    });

    backToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth"
        });
    });

    updateBackToTopButton();


    // ==========================================
    // 7. AUTOMATIC CURRENT YEAR IN FOOTER
    // ==========================================

    document.querySelectorAll("footer").forEach(function (footer) {
        const yearText = footer.querySelector("[data-current-year]");

        if (yearText) {
            yearText.textContent = new Date().getFullYear();
        }
    });


    // ==========================================
    // 8. INTERACTIVE MAP LINK
    // ==========================================

    document.querySelectorAll("[data-map-search]").forEach(function (mapLink) {
        const location = mapLink.dataset.mapSearch;

        if (location && !mapLink.getAttribute("href")) {
            mapLink.href =
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(location);

            mapLink.target = "_blank";
            mapLink.rel = "noopener noreferrer";
        }
    });

});


