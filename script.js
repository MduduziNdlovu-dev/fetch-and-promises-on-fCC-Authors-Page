const authorContainer = document.querySelector('author-container');
const loadMoreBtn = document.getElementById('load-more-btn');

let startingIndex = 0;
let endingIndex = 8;
let authorDataArr = [];

fetch('https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json')
    .then((res) => res.json())
    .then((data) => {
        authorDataArr = data;  
        displayAuthors(authorDataArr.slice(startingIndex, endingIndex)); 
    })
    .catch((err) => {
        authorContainer.innerHTML = '<p class="error-msg">There was an error loading the authors</p>';
    });

const displayAuthors = (authors) => {
    authors.forEach(({author, image , url, bio},index) => {
        authorContainer.innerHTML +=`
            <div class="user-card" id="${index}">
                <h2 class="author-name">${author}</h2>
                <img src="${image}" alt="${author} avatar" class="user-img"/>

                <div class="purple-divider"></div>
                <p class="bio">${bio.length > 50 ? bio.slice(0, 50) + '...' : bio}</p>
                <a href="${url}" target="_blank" class="author-link">${author}'s author page</a>
            </div>
        `;
    })
}
const fetchMoreAuthors = () => {
    startingIndex += 8;
    endingIndex += 8;
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));

    if(authorDataArr.length <= endingIndex) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.cursor = 'not-allowed';
        loadMoreBtn.textContent = 'No more authors to load';
    }
};
loadMoreBtn.addEventListener('click', fetchMoreAuthors);