

let selectedCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  // Check if category is passed via URL query param (e.g. /menu?cat=Chocolate)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const pill = document.querySelector(`.pill-btn[data-category="${catParam}"]`);
    if (pill) {
      selectMenuCategory(pill, catParam);
    }
  }
});

function handleMenuSearch() {
  applyMenuFilters();
}

function selectMenuCategory(btn, category) {
  selectedCategory = category;
  document.querySelectorAll('#categoryPillList .pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyMenuFilters();
}

function handleMenuSort() {
  const sortValue = document.getElementById('menuSortSelect')?.value || 'featured';
  const grid = document.getElementById('menuCakeGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.cake-card'));

  cards.sort((a, b) => {
    const priceA = parseFloat(a.getAttribute('data-price')) || 0;
    const priceB = parseFloat(b.getAttribute('data-price')) || 0;
    const ratingA = parseFloat(a.getAttribute('data-rating')) || 0;
    const ratingB = parseFloat(b.getAttribute('data-rating')) || 0;

    if (sortValue === 'price-low') {
      return priceA - priceB;
    } else if (sortValue === 'price-high') {
      return priceB - priceA;
    } else if (sortValue === 'rating') {
      return ratingB - ratingA;
    }
    return 0; // Default order
  });

  cards.forEach(card => grid.appendChild(card));
  applyMenuFilters();
}

function applyMenuFilters() {
  const searchInput = document.getElementById('menuSearchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const cards = document.querySelectorAll('#menuCakeGrid .cake-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const name = (card.getAttribute('data-name') || '').toLowerCase();
    const category = (card.getAttribute('data-category') || '').toLowerCase();
    const desc = (card.getAttribute('data-desc') || '').toLowerCase();
    const tags = (card.getAttribute('data-tags') || '').toLowerCase();

    const matchesSearch = !query || name.includes(query) || category.includes(query) || desc.includes(query) || tags.includes(query);
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory.toLowerCase();

    if (matchesSearch && matchesCategory) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const resultCountElem = document.getElementById('resultCount');
  if (resultCountElem) {
    resultCountElem.innerText = `Showing ${visibleCount} handcrafted cake${visibleCount === 1 ? '' : 's'}`;
  }
}
