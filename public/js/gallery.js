/* =========================================================
   CAKERMAKER - INFINITE SCROLL GALLERY & DYNAMIC IMAGE SEARCH
   ========================================================= */

let currentPage = 1;
let currentLimit = 8;
let currentCategory = 'all';
let currentSearch = '';
let isLoading = false;
let hasMoreCakes = true;
let searchTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('gallerySearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = e.target.value.trim();
        resetAndFetchGallery();
      }, 300);
    });
  }

  // Initial load
  fetchGalleryCakes();

  // Infinite Scroll Listener
  window.addEventListener('scroll', handleInfiniteScroll);
});

function filterGalleryCategory(btn, category) {
  document.querySelectorAll('#galleryFilterTags .pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCategory = category;
  resetAndFetchGallery();
}

function resetAndFetchGallery() {
  currentPage = 1;
  hasMoreCakes = true;
  const grid = document.getElementById('galleryGrid');
  if (grid) grid.innerHTML = '';

  const endMsg = document.getElementById('galleryEndMessage');
  if (endMsg) endMsg.style.display = 'none';

  fetchGalleryCakes();
}

async function fetchGalleryCakes() {
  if (isLoading || !hasMoreCakes) return;

  isLoading = true;
  const loader = document.getElementById('galleryLoader');
  const endMsg = document.getElementById('galleryEndMessage');
  if (loader) loader.style.display = 'flex';

  try {
    const url = `/api/gallery/cakes?page=${currentPage}&limit=${currentLimit}&q=${encodeURIComponent(currentSearch)}&category=${encodeURIComponent(currentCategory)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.success && data.cakes) {
      renderGalleryCards(data.cakes);
      hasMoreCakes = data.hasMore;
      currentPage++;

      if (!hasMoreCakes) {
        if (loader) loader.style.display = 'none';
        if (endMsg) endMsg.style.display = 'block';
      }
    } else {
      hasMoreCakes = false;
    }
  } catch (err) {
    console.error('Gallery fetch error:', err);
  } finally {
    isLoading = false;
    if (loader && !hasMoreCakes) loader.style.display = 'none';
  }
}

function renderGalleryCards(cakes) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  if (cakes.length === 0 && currentPage === 1) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px;">
        <p style="font-size: 1.2rem; color: var(--text-muted);">No cake photos found matching "${currentSearch}"!</p>
      </div>
    `;
    return;
  }

  cakes.forEach(cake => {
    const card = document.createElement('div');
    card.className = 'gallery-card cake-card';
    card.setAttribute('data-id', cake._id);
    card.setAttribute('data-name', cake.name);
    card.setAttribute('data-category', cake.category);
    card.setAttribute('data-price', cake.discountPrice || cake.price);
    card.setAttribute('data-image', cake.image);
    card.setAttribute('data-desc', cake.description);
    card.setAttribute('data-rating', cake.rating);
    card.setAttribute('data-amazon', cake.amazonUrl || `https://www.amazon.in/s?k=${encodeURIComponent(cake.name)}`);

    card.innerHTML = `
      <div class="gallery-img-container" onclick="openCakeModalFromData(this.closest('.cake-card'))">
        <img src="${cake.image}" alt="${cake.name}" loading="lazy" />
        <span class="gallery-card-badge">${cake.category}</span>
        <button type="button" class="gallery-view-btn">🔍 View & Customize</button>
      </div>
      <div class="gallery-card-info">
        <span class="gallery-card-category">${cake.category}</span>
        <h3 class="gallery-card-title">${cake.name}</h3>
        <p class="cake-desc-snippet" style="font-size: 0.82rem; margin-bottom: 12px;">${cake.description}</p>
        <div class="gallery-price-row">
          <span class="gallery-price">₹${cake.discountPrice || cake.price}</span>
          <div class="gallery-action-group">
            <button type="button" class="btn-gal-cart" onclick="quickAddToCart('${cake._id}', '${cake.name.replace(/'/g, "\\'")}', ${cake.discountPrice || cake.price}, '${cake.image}')">
              <span>🛒</span> Add
            </button>
            <a href="${cake.amazonUrl || `https://www.amazon.in/s?k=${encodeURIComponent(cake.name)}`}" target="_blank" rel="noopener noreferrer" class="btn-gal-amazon" title="Buy on Amazon">
              <span>🛍️</span> Amazon
            </a>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function handleInfiniteScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
    if (!isLoading && hasMoreCakes) {
      fetchGalleryCakes();
    }
  }
}