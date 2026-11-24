
/*
=====================================================
TRIPZO - JAVASCRIPT
1. Mobile Navigation
2. Filter Buttons Drag
3. Filter & Search Places
4. View More Places
5. Show More Popular Destinations
6. FAQ Accordion
=====================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. MOBILE NAVIGATION
    ========================================= */

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu-mobile");
    const closeMenuIcon = document.querySelector(".close-menu-icon");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.add("active");
        });
    }

    if (closeMenuIcon && navMenu) {
        closeMenuIcon.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    }

    if (navMenu) {
        const navLinks = navMenu.querySelectorAll(".nav-link");

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
            });
        });
    }


    /* =========================================
       2. FILTER BUTTONS DRAG
    ========================================= */

    const slider = document.querySelector(".filter-buttons-wrapper");

    if (slider) {

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener("mousedown", (e) => {

            isDown = true;
            slider.classList.add("active-drag");

            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;

        });

        slider.addEventListener("mouseleave", () => {

            isDown = false;
            slider.classList.remove("active-drag");

        });

        slider.addEventListener("mouseup", () => {

            isDown = false;
            slider.classList.remove("active-drag");

        });

        slider.addEventListener("mousemove", (e) => {

            if (!isDown) return;

            e.preventDefault();

            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;

            slider.scrollLeft = scrollLeft - walk;

        });

    }


    /* =========================================
       3. FILTER & SEARCH PLACES
    ========================================= */

    const filterButtonsContainer = document.querySelector(".filter-buttons");
    const placeCards = document.querySelectorAll(".place-grid .place-card");
    const placeSearchInput = document.querySelector(".places-search input");
    const noResultsMessage = document.getElementById("no-result-message");

    const placeGrid = document.querySelector(".place-grid");
    const viewMoreBtn = document.querySelector(".place-view-more .btn");

    // Biến kiểm tra người dùng có đang mở rộng danh sách không
    let placesExpanded = false;


    if (
        filterButtonsContainer &&
        placeCards.length > 0 &&
        placeSearchInput &&
        placeGrid
    ) {

        function filterAndSearchPlaces() {

            const activeFilterBtn = filterButtonsContainer.querySelector(".filter-btn.active");

            const filterValue = activeFilterBtn
                ? activeFilterBtn.dataset.filter.toLowerCase()
                : "all";

            const searchTerm = placeSearchInput.value.trim().toLowerCase();

            // Kiểm tra người dùng có đang lọc hoặc tìm kiếm không
            const isFiltering = filterValue !== "all" || searchTerm !== "";

            let visibleCardCount = 0;

            placeCards.forEach((card) => {

                const cardCategory = (card.dataset.category || "").toLowerCase();

                const cardText = card.textContent.toLowerCase();

                const filterMatch =
                    filterValue === "all" ||
                    filterValue === cardCategory;

                const searchMatch =
                    searchTerm === "" ||
                    cardText.includes(searchTerm);

                if (filterMatch && searchMatch) {

                    card.classList.remove("place-card-hidden");
                    card.classList.add("animate-in");

                    visibleCardCount++;

                } else {

                    card.classList.add("place-card-hidden");
                    card.classList.remove("animate-in");

                }

            });

            // Khi lọc hoặc tìm kiếm thì hiển thị toàn bộ kết quả phù hợp
            if (isFiltering) {

                placeGrid.classList.remove("collapsed");

                if (viewMoreBtn) {
                    viewMoreBtn.style.display = "none";
                }

            } else {

                // Khi trở về All thì áp dụng trạng thái thu gọn/mở rộng
                if (placesExpanded) {
                    placeGrid.classList.remove("collapsed");
                } else {
                    placeGrid.classList.add("collapsed");
                }

                if (viewMoreBtn) {
                    viewMoreBtn.style.display = "";
                    viewMoreBtn.textContent = placesExpanded
                        ? "View Less"
                        : "View More";
                }

            }

            // Hiển thị thông báo nếu không tìm thấy địa điểm
            if (noResultsMessage) {
                noResultsMessage.style.display =
                    visibleCardCount === 0 ? "block" : "none";
            }

        }


        /* =========================================
           3.1 CLICK FILTER BUTTONS
        ========================================= */

        const filterButtons = filterButtonsContainer.querySelectorAll(".filter-btn");

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                filterButtons.forEach(btn => {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                filterAndSearchPlaces();

            });

        });


        /* =========================================
           3.2 SEARCH PLACES
        ========================================= */

        placeSearchInput.addEventListener("input", () => {

            filterAndSearchPlaces();

        });


        /* =========================================
           3.3 INITIAL FILTER
        ========================================= */

        filterAndSearchPlaces();

    }


    /* =========================================
       4. VIEW MORE PLACES
    ========================================= */

    if (placeGrid && viewMoreBtn) {

        viewMoreBtn.addEventListener("click", (e) => {

            e.preventDefault();

            placesExpanded = !placesExpanded;

            if (placesExpanded) {

                placeGrid.classList.remove("collapsed");
                viewMoreBtn.textContent = "View Less";

            } else {

                placeGrid.classList.add("collapsed");
                viewMoreBtn.textContent = "View More";

            }

        });

    }


    /* =========================================
       5. SHOW MORE POPULAR DESTINATIONS
    ========================================= */

    const popularGrid = document.querySelector(".popular-grid");
    const showMoreBtn = document.getElementById("show-more");

    if (popularGrid && showMoreBtn) {

        showMoreBtn.addEventListener("click", (e) => {

            e.preventDefault();

            const isCollapsed = popularGrid.classList.contains("collapsed");

            if (isCollapsed) {

                popularGrid.classList.remove("collapsed");
                showMoreBtn.textContent = "Show Less";

            } else {

                popularGrid.classList.add("collapsed");
                showMoreBtn.textContent = "Show More";

            }

        });

    }


    /* =========================================
       6. FAQ ACCORDION
    ========================================= */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {

        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {

            const isActive = item.classList.contains("active");

            // Đóng tất cả câu hỏi
            faqItems.forEach((faq) => {

                faq.classList.remove("active");

                const faqAnswer = faq.querySelector(".faq-answer");

                if (faqAnswer) {
                    faqAnswer.style.maxHeight = null;
                }

            });

            // Mở câu hỏi được chọn
            if (!isActive) {

                item.classList.add("active");

                answer.style.maxHeight = answer.scrollHeight + "px";

            }

        });

    });
    /* =========================================
   7. DYNAMIC PAGE LINK HANDLER
   Chuyển đến trang chi tiết địa điểm
========================================= */
function handleCardClick(event ){
    event.preventDefault();
    const card=event.currentTarget;
    const titleElement=card.querySelector("h3");
    if(titleElement){
        const placeName=titleElement.textContent.trim();
        const placeKey=placeName.toLowerCase();
        window.location.href =`destination.html?place=${placeKey}`;
        }
    }
    const allCards=document.querySelectorAll("popular-card, .place-card");
    if(allCards.length>0){
        allCards.forEach((card)=>{
            card.addEventListener("click",handleCardClick);
        });
    }

/* =========================================
   8. BOOKING SEARCH
========================================= */

const bookingForm = document.querySelector(".booking");

if (bookingForm) {

    bookingForm.addEventListener("submit", (e) => {

        e.preventDefault();

        // Lấy dữ liệu từ form
        const locationValue = document
            .getElementById("location").value.trim().toLowerCase();

        const checkIn = document.getElementById("check-in").value;
        const checkOut = document.getElementById("check-out").value;
        const traveler = document.getElementById("traveler").value;

        // Kiểm tra ngày
        if (checkIn && checkOut && checkOut < checkIn) {
            alert("Return date must be after departure date!");
            return;
        }

        // Kiểm tra số lượng người
        if (Number(traveler) < 1) {
            alert("Please enter at least 1 traveler!");
            return;
        }

        // Lấy danh sách địa điểm
        const placeCards = document.querySelectorAll(
            ".place-grid .place-card"
        );

        let resultCount = 0;

        // Tìm địa điểm phù hợp
        placeCards.forEach(card => {

            const cardText = card.textContent.toLowerCase();

            if (cardText.includes(locationValue)) {

                card.style.display = "";

                resultCount++;

            } else {

                card.style.display = "none";

            }

        });

        // Hiển thị kết quả
        const noResults = document.getElementById("no-result-message");

        if (noResults) {
            noResults.style.display =
                resultCount === 0 ? "block" : "none";
        }

        // Cuộn đến danh sách địa điểm
        const placeSection = document.querySelector(".place-grid");

        if (placeSection) {
            placeSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        // Thông báo nếu không tìm thấy
        if (resultCount === 0) {
            alert("No destinations found!");
        }

    });
}
});
