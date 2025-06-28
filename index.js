document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element References ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const animeGrid = document.getElementById('anime-grid');
    const animeCards = animeGrid.querySelectorAll('.anime-card');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const modal = document.getElementById('cart-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    let cartItems = 0;

    // --- Search Functionality ---
    function filterAnime() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        animeCards.forEach(card => {
            const titleElement = card.querySelector('h3');
            let isVisible = false;
            
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    isVisible = true;
                }
            }
            // Toggle the 'hidden' class based on whether the card should be visible.
            card.classList.toggle('hidden', !isVisible);
        });
    }

    // --- Event Listeners for Search ---
    if (searchButton) {
        searchButton.addEventListener('click', filterAnime);
    }

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterAnime();
        }
    });
    
    // Live search as the user types
    searchInput.addEventListener('input', filterAnime);

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
});
