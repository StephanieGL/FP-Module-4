document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element References ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const animeGrid = document.getElementById('anime-grid');
    const sectionTitle = document.getElementById('section-title');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const modal = document.getElementById('cart-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    let cartItems = 0;
    const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

    // --- Function to display loading state ---
    function showLoading() {
        animeGrid.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-10">
                <i class="fas fa-spinner fa-spin text-white text-4xl"></i>
            </div>
        `;
    }

    // --- Function to create an anime card element ---
    function createAnimeCard(anime) {
        const card = document.createElement('div');
        card.className = 'anime-card bg-gray-800 rounded-lg overflow-hidden shadow-lg card-hover-effect flex flex-col';

        const imageUrl = anime.images?.jpg?.large_image_url || 'https://placehold.co/400x600/1e293b/ffffff?text=No+Image';
        let synopsis = anime.synopsis || 'No synopsis available.';
        if (synopsis.length > 120) {
            synopsis = synopsis.substring(0, 120) + '...';
        }
        const price = (Math.random() * (29.99 - 5.99) + 5.99).toFixed(2);

        // Se actualizó la línea de la descripción <p> a continuación.
        // Se cambió 'text-sm' por 'text-xs' para achicar la letra.
        // Se añadió 'mt-2' para crear más espacio debajo del título.
        card.innerHTML = `
            <img src="${imageUrl}" alt="${anime.title}" class="w-full h-72 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/400x600/1e293b/ffffff?text=Image+Error';">
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-bold mb-2 h-16">${anime.title}</h3>
                <p class="text-gray-400 text-xs mt-2 mb-4 h-20 overflow-hidden">${synopsis}</p>
                <div class="flex justify-between items-center mt-auto">
                    <span class="text-2xl font-bold text-indigo-400">$${price}</span>
                    <button class="add-to-cart-btn ml-4 bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 flex items-center justify-center rounded-full transition duration-300" data-id="${anime.mal_id}">
                        <i class="fa-solid fa-cart-plus text-lg"></i>
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    // --- Function to display anime cards in the grid ---
    function displayAnime(animeList, query = "") {
        animeGrid.innerHTML = ''; // Clear previous results or loading spinner

        if (!animeList || animeList.length === 0) {
            sectionTitle.textContent = `No Results for "${query}"`;
            animeGrid.innerHTML = `
                <div class="col-span-full text-center text-gray-400 py-10">
                    <p class="text-2xl mb-2">( T_T )</p>
                    <p>Please try another search!</p>
                </div>
            `;
            return;
        }

        animeList.forEach(anime => {
            const card = createAnimeCard(anime);
            animeGrid.appendChild(card);
        });
    }

    // --- Function to fetch data from a given API endpoint ---
    async function fetchAnimeData(endpoint, query = "") {
        showLoading();
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            displayAnime(result.data, query);
        } catch (error) {
            console.error("Error fetching anime data:", error);
            animeGrid.innerHTML = `
                <div class="col-span-full text-center text-red-400 py-10">
                    <p>Sorry, something went wrong while fetching data. Please try again later.</p>
                </div>
            `;
        }
    }

    // --- Event Listeners for Search ---
    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            sectionTitle.textContent = `Search Results for "${query}"`;
            fetchAnimeData(`${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(query)}&sfw`, query);
        } else {
            // If search is cleared, show top anime again
            sectionTitle.textContent = "Top Anime";
            fetchAnimeData(`${JIKAN_API_BASE_URL}/top/anime`);
        }
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });

    // --- Add to Cart Functionality ---
    animeGrid.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            cartItems++;
            cartCount.textContent = cartItems;
            cartCount.classList.add('animate-ping');
            setTimeout(() => cartCount.classList.remove('animate-ping'), 500);
            showModal();
        }
    });

    // --- Modal Functions ---
    function showModal() {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-95');
        }, 10);
    }

    function hideModal() {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    closeModalButton.addEventListener('click', hideModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });

    // --- Mobile Menu Toggle ---
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Initial Load ---
    // Fetch top anime when the page first loads
    fetchAnimeData(`${JIKAN_API_BASE_URL}/top/anime`);
});
