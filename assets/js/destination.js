
document.addEventListener("DOMContentLoaded", () => {

    const titleElement = document.getElementById("destination-title");
    const gridElement = document.getElementById("masonry-grid");
    const loadingElement = document.getElementById("loading-message");
    const errorElement = document.getElementById("error-message");

    // Kiểm tra các phần tử HTML
    if (!titleElement || !gridElement || !loadingElement || !errorElement) {
        console.error("Không tìm thấy các phần tử HTML cần thiết.");
        return;
    }

    // Khởi tạo trang chi tiết địa điểm
    function initDestinationPage() {
        const params = new URLSearchParams(window.location.search);
        const placeKey = params.get("place");

        if (!placeKey) {
            showError("Không tìm thấy tên địa điểm trên URL.");
            return;
        }

        fetchData(placeKey);
    }

    // Lấy dữ liệu từ file JSON
    async function fetchData(placeKey) {
        try {
            const response = await fetch("assets/data/data.json");

            if (!response.ok) {
                throw new Error("Không tìm thấy file data.json.");
            }

            const allData = await response.json();
            const destination = allData[placeKey.toLowerCase()];

            if (!destination || !destination.images) {
                throw new Error("Không tìm thấy dữ liệu địa điểm: " + placeKey);
            }

            updatePage(destination);

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            showError(error.message);
        }
    }

    // Cập nhật nội dung trang
    function updatePage(destination) {

        document.title = `Tripzo - ${destination.title}`;
        titleElement.textContent = destination.title;

        gridElement.innerHTML = "";

        if (!destination.images.length) {
            showError("Địa điểm này chưa có hình ảnh.");
            return;
        }

        let loadedCount = 0;

        destination.images.forEach((imageUrl, index) => {

            const wrapper = document.createElement("div");
            wrapper.className = "image-wrapper skeleton-loading";
            wrapper.style.setProperty("--i", index);

            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = `Image ${index + 1} of ${destination.title}`;
            img.loading = "lazy";

            img.onload = () => {
                wrapper.classList.remove("skeleton-loading");
                img.classList.add("animate-in");
                checkLoading();
            };

            img.onerror = () => {
                wrapper.classList.remove("skeleton-loading");
                wrapper.classList.add("image-error");

                console.warn("Không tải được ảnh:", imageUrl);
                wrapper.remove();

                checkLoading();
            };

            wrapper.appendChild(img);
            gridElement.appendChild(wrapper);
        });

        function checkLoading() {
            loadedCount++;

            if (loadedCount === destination.images.length) {
                loadingElement.style.display = "none";

                if (gridElement.children.length === 0) {
                    showError("Không thể tải hình ảnh của địa điểm này.");
                }
            }
        }
    }

    // Hiển thị thông báo lỗi
    function showError(message) {
        loadingElement.style.display = "none";
        titleElement.style.display = "none";
        gridElement.innerHTML = "";

        errorElement.textContent = message;
        errorElement.style.display = "block";

        document.title = "Tripzo - Error";
    }

    initDestinationPage();

});
