const header = document.querySelector('header');
const headerHeight = 77; // Výška lišty v px
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
  
    if (currentScroll > headerHeight) {
      // Pokud uživatel scrolluje dolů, přidá třídu `fixed`
      header.classList.add('fixed');
    } else {
      // Pokud je uživatel nahoře, odeber fixní pozici
      header.classList.remove('fixed');
    }
  });