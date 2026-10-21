const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('serviceSearch');
const freelancerCards = [...document.querySelectorAll('.freelancer-card')];
const filterPills = [...document.querySelectorAll('.filter-pill')];
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function setFilter(category = 'All', query = '') {
  const normalized = query.trim().toLowerCase();
  let shown = 0;
  freelancerCards.forEach(card => {
    const matchesCategory = category === 'All' || card.dataset.category === category ||
      (category === 'Graphic Design' && card.dataset.keywords.includes('ui ux'));
    const haystack = `${card.dataset.category} ${card.dataset.keywords} ${card.innerText}`.toLowerCase();
    const matchesQuery = !normalized || haystack.includes(normalized);
    const visible = matchesCategory && matchesQuery;
    card.hidden = !visible;
    if (visible) shown++;
  });
  resultCount.textContent = `Showing ${shown} freelancer${shown === 1 ? '' : 's'}`;
  emptyState.hidden = shown !== 0;
  filterPills.forEach(pill => pill.classList.toggle('active', pill.dataset.filter === category));
  document.querySelectorAll('.category-card').forEach(card => card.classList.toggle('selected', card.dataset.category === category));
}

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const query = searchInput.value.trim();
  setFilter('All', query);
  document.getElementById('freelancers').scrollIntoView({ behavior: 'smooth' });
  if (query) showToast(`Showing freelancer matches for “${query}”`);
  else showToast('Showing all available freelancers');
});

document.querySelectorAll('[data-search]').forEach(button => button.addEventListener('click', () => {
  searchInput.value = button.dataset.search;
  setFilter('All', button.dataset.search);
  document.getElementById('freelancers').scrollIntoView({ behavior: 'smooth' });
}));

document.querySelectorAll('.category-card').forEach(card => card.addEventListener('click', () => {
  searchInput.value = '';
  setFilter(card.dataset.category);
  document.getElementById('freelancers').scrollIntoView({ behavior: 'smooth' });
  showToast(`Browsing ${card.dataset.category} talent`);
}));

filterPills.forEach(pill => pill.addEventListener('click', () => {
  searchInput.value = '';
  setFilter(pill.dataset.filter);
}));
document.getElementById('clearFilters').addEventListener('click', event => {
  event.preventDefault();
  searchInput.value = '';
  setFilter('All');
});

document.querySelectorAll('.save-button').forEach(button => {
  const toggleSaved = () => {
    const saved = button.classList.toggle('saved');
    button.textContent = saved ? '♥' : '♡';
    button.setAttribute('aria-pressed', String(saved));
    showToast(saved ? 'Freelancer saved to your shortlist' : 'Freelancer removed from your shortlist');
  };
  button.addEventListener('click', toggleSaved);
  button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSaved(); }
  });
});

document.querySelectorAll('[data-profile]').forEach(button => button.addEventListener('click', () => {
  showToast(`${button.dataset.profile}’s profile preview — connect a profile page to continue.`);
}));

document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => {
  const modal = document.getElementById(button.dataset.modal);
  if (modal) {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  }
}));
function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal-backdrop'))));
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(backdrop); });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelectorAll('.modal-backdrop:not([hidden])').forEach(closeModal);
});
document.querySelectorAll('[data-demo-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  closeModal(form.closest('.modal-backdrop'));
  form.reset();
  showToast('Demo only: connect a backend to enable account features.');
}));

document.getElementById('newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail');
  document.getElementById('newsletterMessage').textContent = `Thanks! ${email.value} has been added in this demo.`;
  email.value = '';
});
document.getElementById('year').textContent = new Date().getFullYear();
setFilter('All');