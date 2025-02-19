document.addEventListener("DOMContentLoaded", () => {
    const authorContainer = document.getElementById("author-container");
    const loadMoreBtn = document.getElementById("load-more-btn");

    let startingIndex = 0;
    const batchSize = 8;
    let authorDataArr = [];

    const fetchAuthors = async () => {
        try {
            const response = await fetch("https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json");
            if (!response.ok) throw new Error("Failed to fetch authors.");
            authorDataArr = await response.json();
            renderAuthors();
        } catch (error) {
            authorContainer.innerHTML = `<p class="error-msg">⚠️ Error loading authors. Please try again.</p>`;
        }
    };

    const createAuthorCard = ({ author, image, url, bio }) => {
        const card = document.createElement("div");
        card.classList.add("user-card");

        card.innerHTML = `
            <h2 class="author-name">${author}</h2>
            <img src="${image}" alt="${author}'s avatar" class="user-img" loading="lazy">
            <div class="purple-divider"></div>
            <p class="bio">${bio.length > 100 ? bio.slice(0, 100) + "..." : bio}</p>
            <a href="${url}" target="_blank" class="author-link">🔗 View Profile</a>
        `;

        return card;
    };

    const renderAuthors = () => {
        const nextAuthors = authorDataArr.slice(startingIndex, startingIndex + batchSize);
        nextAuthors.forEach(author => authorContainer.appendChild(createAuthorCard(author)));
        startingIndex += batchSize;

        if (startingIndex >= authorDataArr.length) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = "🎉 No more authors!";
        }
    };

    loadMoreBtn.addEventListener("click", renderAuthors);
    fetchAuthors();
});
