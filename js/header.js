document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section"); // Výběr všech sekcí
  const navLinks = document.querySelectorAll(".navigace ul li a"); // Výběr odkazů v navigaci

  // Funkce pro zvýraznění aktivní položky
  const highlightActiveLink = () => {
      let index = sections.length; // Nastavíme index na poslední sekci

      while (--index && window.scrollY + 100 < sections[index].offsetTop) {}

      navLinks.forEach((link) => link.classList.remove("active")); // Odstranění aktivní třídy
      navLinks[index].classList.add("active"); // Přidání aktivní třídy
  };

  // Spuštění funkce při scrollování
  window.addEventListener("scroll", highlightActiveLink);

  // Spuštění při načtení stránky
  highlightActiveLink();

  // **Plynulé skrolování po kliknutí na odkaz**
  navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
          event.preventDefault(); // Zabrání defaultnímu chování odkazu

          const targetId = link.getAttribute("href").substring(1); // Získání ID cílové sekce
          const targetSection = document.getElementById(targetId); // Najití sekce podle ID

          if (targetSection) {
              window.scrollTo({
                  top: targetSection.offsetTop - 77, // Posun kvůli pevné navigaci (upravit dle potřeby)
                  behavior: "smooth" // Plynulé skrolování
              });
          }
      });
  });
});

  