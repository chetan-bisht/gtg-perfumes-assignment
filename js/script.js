document.addEventListener("DOMContentLoaded", () => {

    // --- 1. MOBILE MENU LOGIC ---
    const hamburgerBtn = document.getElementById("hamburger-btn");
    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        // Navigation toggle logic will go here
    });


    // --- 2. GALLERY LOGIC ---
    const mainImg = document.getElementById("main-gallery-img");
    const thumbnails = document.querySelectorAll(".thumb");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const dotsContainer = document.getElementById("gallery-dots");

    // Store image sources (matching the thumbnails data-index)
    const images = Array.from(thumbnails).map(thumb => thumb.src);
    let currentIndex = 0;

    // Create dots
    images.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if(index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => updateGallery(index));
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll(".dot");

    function updateGallery(index) {
        currentIndex = index;
        // Fade effect
        mainImg.style.opacity = 0.5;
        setTimeout(() => {
            mainImg.src = images[currentIndex];
            mainImg.style.opacity = 1;
        }, 150);

        // Update active classes
        thumbnails.forEach(t => t.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        thumbnails[currentIndex].classList.add("active");
        dots[currentIndex].classList.add("active");
    }

    // Event Listeners for Gallery
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener("click", () => updateGallery(index));
    });

    prevBtn.addEventListener("click", () => {
        let newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        updateGallery(newIndex);
    });

    nextBtn.addEventListener("click", () => {
        let newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        updateGallery(newIndex);
    });


    // --- 3. SUBSCRIPTION FORM & ACCORDION LOGIC ---
    const form = document.getElementById("add-to-cart-form");
    const singleWrapper = document.getElementById("single-sub-wrapper");
    const doubleWrapper = document.getElementById("double-sub-wrapper");
    const allFragranceCards = document.querySelectorAll(".fragrance-card");
    const cartLink = document.getElementById("dynamic-cart-link");

    // Handle Accordion toggling
    form.addEventListener("change", (e) => {
        if (e.target.name === "purchase_type") {
            if (e.target.value === "single") {
                singleWrapper.classList.replace("collapsed", "expanded");
                doubleWrapper.classList.replace("expanded", "collapsed");
            } else {
                doubleWrapper.classList.replace("collapsed", "expanded");
                singleWrapper.classList.replace("expanded", "collapsed");
            }
        }

        // Update green border on selected fragrance cards
        if (e.target.type === "radio" && e.target.name.includes("fragrance")) {
            // Find the parent grid to only clear active classes within that specific group
            const parentGrid = e.target.closest(".fragrance-grid");
            parentGrid.querySelectorAll(".fragrance-card").forEach(card => card.classList.remove("active"));
            e.target.closest(".fragrance-card").classList.add("active");
            
            // Sync the main product image with the selected fragrance variant
            const fragValue = e.target.value;
            if (fragValue === "original") updateGallery(0);
            else if (fragValue === "lily") updateGallery(1);
            else if (fragValue === "rose") updateGallery(2);
        }

        updateDynamicCartLink();
    });

    // --- 2.5 STATIC THUMBNAILS LOGIC ---
    // If the user clicks any of the 8 decorative thumbnails, preview it in the main frame
    const staticThumbnails = document.querySelectorAll(".static-thumb");
    staticThumbnails.forEach(thumb => {
        thumb.addEventListener("click", () => {
            mainImg.style.opacity = 0.5;
            setTimeout(() => {
                mainImg.src = thumb.src;
                mainImg.style.opacity = 1;
            }, 150);
            // Visually deselect regular gallery dots to prevent confusion
            document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
            document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
        });
    });

    // --- 4. DYNAMIC ADD TO CART LINK LOGIC ---
    function updateDynamicCartLink() {
        const purchaseType = document.querySelector('input[name="purchase_type"]:checked').value;
        let finalLink = `https://dummy-checkout.com/cart?type=${purchaseType}`;

        if (purchaseType === "single") {
            const fragSingle = document.querySelector('input[name="fragrance_single"]:checked').value;
            finalLink += `&fragrance=${fragSingle}`;
        } else if (purchaseType === "double") {
            const fragDouble1 = document.querySelector('input[name="fragrance_double_1"]:checked').value;
            const fragDouble2 = document.querySelector('input[name="fragrance_double_2"]:checked').value;
            finalLink += `&fragrance1=${fragDouble1}&fragrance2=${fragDouble2}`;
        }

        cartLink.href = finalLink;
        console.log("Cart Link Updated:", finalLink); // Check your console to see it working!
    }

    // Initialize link on load
    updateDynamicCartLink();

    // --- 5. ACCORDION LOGIC ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const body = item.querySelector(".accordion-body");
            const icon = item.querySelector(".toggle-icon");

            // Check if currently active
            const isActive = item.classList.contains("active");

            // Close all items first (optional: if you want only 1 open at a time)
            document.querySelectorAll(".accordion-item").forEach(otherItem => {
                otherItem.classList.remove("active");
                otherItem.querySelector(".accordion-body").style.display = "none";
                otherItem.querySelector(".toggle-icon").src = "assets/plus.svg";
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add("active");
                body.style.display = "block";
                icon.src = "assets/minus.svg";
            }
        });
    });

    // --- 6. STATS COUNTER ANIMATION (Intersection Observer) ---
    const counters = document.querySelectorAll(".counter");
    const statsSection = document.getElementById("stats-section");
    let hasCounted = false; // Prevent re-running the animation if user scrolls up and down

    const runCounters = () => {
        counters.forEach(counter => {
            counter.innerText = '0';

            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;
                const increment = target / 50; // Adjust '50' for animation speed

                if (c < target) {
                    counter.innerText = `${Math.ceil(c + increment)}`;
                    setTimeout(updateCounter, 30); // 30ms per frame
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    };

    // Trigger animation when stats section is visible on screen
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            runCounters();
            hasCounted = true; // Mark as done so it doesn't loop
        }
    }, { threshold: 0.5 }); // Starts when 50% of the section is visible

    if(statsSection) {
        observer.observe(statsSection);
    }
});