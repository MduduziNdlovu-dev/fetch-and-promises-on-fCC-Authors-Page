document.addEventListener("DOMContentLoaded", () => {
    const authorContainer = document.getElementById("author-container");
    const loadMoreBtn = document.getElementById("load-more-btn");
    const searchInput = document.getElementById("search-input");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
  
    let startingIndex = 0;
    const batchSize = 8;
    let authorDataArr = [];
    let filteredDataArr = [];
  
    const CACHE_KEY = "authorsData";
    const CACHE_TIMESTAMP_KEY = "authorsDataTimestamp";
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
  
    // Fetch and cache authors data
    const fetchAuthors = async () => {
      // Check cache
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp) < CACHE_DURATION) {
        authorDataArr = JSON.parse(cachedData);
        filteredDataArr = [...authorDataArr];
        renderAuthors();
        return;
      }
  
      try {
        const response = await fetch("https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json");
        if (!response.ok) throw new Error("Failed to fetch authors.");
        authorDataArr = await response.json();
  
        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(authorDataArr));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now());
        filteredDataArr = [...authorDataArr];
        renderAuthors();
      } catch (error) {
        authorContainer.innerHTML = `<p class="error-msg">⚠️ Error loading authors. Please try again.</p>`;
      }
    };
  
    // Create author card element
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
  
    // Render authors with optional reset 
    const renderAuthors = (reset = false) => {
      if (reset) {
        authorContainer.innerHTML = "";
        startingIndex = 0;
      }
  
      const nextAuthors = filteredDataArr.slice(startingIndex, startingIndex + batchSize);
      nextAuthors.forEach(author => authorContainer.appendChild(createAuthorCard(author)));
      startingIndex += batchSize;
  
      // Hide load more button if no more authors or if search filter is active
      if (startingIndex >= filteredDataArr.length || searchInput.value.trim() !== "") {
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "block";
      }
    };
  
    // Filter authors based on search query
    const filterAuthors = () => {
      const query = searchInput.value.trim().toLowerCase();
      filteredDataArr = query
        ? authorDataArr.filter(author => author.author.toLowerCase().includes(query))
        : [...authorDataArr];
  
      renderAuthors(true); 
    };
  
    // Toggle dark mode
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
    });
  
    // Event Listeners
    loadMoreBtn.addEventListener("click", () => renderAuthors());
    searchInput.addEventListener("input", filterAuthors);
  
    // Initial fetch
    fetchAuthors();
  });
  