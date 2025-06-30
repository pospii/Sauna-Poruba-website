document.addEventListener("DOMContentLoaded", () => {
  // === ANIMACE AOS ===
  function getOffset() {
    return window.innerWidth > 768 ? 300 : 50;
  }

  AOS.init({
    duration: 1000,
    once: true,
    offset: getOffset(),
    anchorPlacement: "top-bottom",
  });

  window.addEventListener("resize", () => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: getOffset(),
      anchorPlacement: "top-bottom",
    });
  });

  // === GALERIE ===
  const galleryContainer = document.querySelector(".gallery-container");
  const galleryImages = document.querySelectorAll(".gallery-container img");
  const imageCount = galleryImages.length;
  const visibleImages = 3;
  let currentIndex = 0;
  let interval;

  const updateGallery = () => {
    const offset = -(currentIndex * (100 / visibleImages));
    galleryContainer.style.transform = `translateX(${offset}%)`;
  };

  const startInterval = () => {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % imageCount;
      updateGallery();
    }, 5000);
  };

  const resetInterval = () => {
    clearInterval(interval);
    startInterval();
  };

  for (let i = 0; i < visibleImages; i++) {
    galleryContainer.appendChild(galleryImages[i].cloneNode(true));
  }

  updateGallery();
  startInterval();

  document
    .querySelector(".gallery-button.prev")
    .addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + imageCount) % imageCount;
      updateGallery();
      resetInterval();
    });

  document
    .querySelector(".gallery-button.next")
    .addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % imageCount;
      updateGallery();
      resetInterval();
    });

  // === ROTUJÍCÍ OBRÁZKY ===
  const images = document.querySelectorAll(".foto-kavarna img");
  let currentImageIndex = 0;

  function showImage(index) {
    images.forEach((img, i) => {
      img.style.opacity = i === index ? "1" : "0";
      img.style.transform = i === index ? "scale(1)" : "scale(1.1)";
    });
  }

  function rotateImages() {
    images[currentImageIndex].style.opacity = "0";
    images[currentImageIndex].style.transform = "scale(1.1)";
    setTimeout(() => {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      showImage(currentImageIndex);
    }, 500);
  }

  showImage(currentImageIndex);
  setInterval(rotateImages, 5000);

  // === MODÁLNÍ OBRÁZEK ===
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.querySelector(".close");
  const thumbnails = document.querySelectorAll(".thumbnail");

  // Pro každý náhled (thumbnail) nastav klikací událost
  thumbnails.forEach((thumb) => {
    thumb.onclick = function () {
      modal.style.display = "flex";
      modalImg.src = thumb.dataset.full; // Načte obrázek z atributu data-full
      modalImg.alt = thumb.alt;
      modalImg.title = thumb.alt;
    };
  });

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  modal.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // === INTERAKCE S OBRÁZKY ===
  const photoImages = document.querySelectorAll(".fotky img");

  photoImages.forEach((image, index) => {
    image.addEventListener("mouseenter", () => {
      image.style.width = "70%";
      photoImages.forEach((otherImage, otherIndex) => {
        if (otherIndex !== index) {
          otherImage.style.width = "15%";
        }
      });
    });

    image.addEventListener("mouseleave", () => {
      photoImages.forEach((img) => (img.style.width = "33.33%"));
    });
  });

  // === NAVIGACE MENU ===
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    menuToggle.classList.toggle("open");
  });

  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
      menuToggle.classList.remove("open");
    });
  });

  // === FILTROVÁNÍ AKCÍ ===
  async function loadEvents(filter) {
    try {
      const response = await fetch("akce.json");
      if (!response.ok) throw new Error("Chyba při načítání souboru.");
      const events = await response.json();
      filterEvents(filter, events);
    } catch (error) {
      console.error("Chyba při načítání akcí:", error);
    }
  }

  const eventList = document.getElementById("akce-list");
  const buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      const filter = this.getAttribute("data-filter");
      loadEvents(filter);
    });
  });

  function filterEvents(filter, events) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);
    let oneMonthFromNow = new Date(today);
    oneMonthFromNow.setMonth(today.getMonth() + 1);

    const lastWeekOfMonth =
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() -
        today.getDate() <=
      7;
    if (filter === "mesic" && lastWeekOfMonth) {
      oneMonthFromNow.setMonth(today.getMonth() + 2);
    }

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      if (filter === "dnes") {
        return eventDate.toDateString() === today.toDateString();
      } else if (filter === "tyden") {
        return eventDate >= today && eventDate <= oneWeekFromNow;
      } else if (filter === "mesic") {
        return eventDate >= today && eventDate <= oneMonthFromNow;
      }
      return false;
    });

    renderEvents(filteredEvents);
  }

  function renderEvents(events) {
    eventList.innerHTML = "";
    if (events.length === 0) {
      eventList.innerHTML =
        "<p style='text-align: center;'>V tomto období nejsou žádné plánované akce.</p>";
    } else {
      events.forEach((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <img src="${event.image}" alt="${event.title}">
                    <div class="akce-info">
                        <h4>${formatDate(event.date)}</h4>
                        <p><strong>${event.title}</strong></p>
                        <p>${event.description}</p>
                    </div>
                `;
        eventList.appendChild(li);
      });
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const days = [
      "Neděle",
      "Pondělí",
      "Úterý",
      "Středa",
      "Čtvrtek",
      "Pátek",
      "Sobota",
    ];
    return `${days[date.getDay()]} ${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()} ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }

  loadEvents("tyden");

  // === ZVÝRAZNĚNÍ AKTIVNÍ POLOŽKY MENU + PLYNULÉ SKROLLOVÁNÍ ===
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navigace ul li a");

  const highlightActiveLink = () => {
    let index = sections.length;
    while (--index && window.scrollY + 100 < sections[index].offsetTop) {}

    navLinks.forEach((link) => link.classList.remove("active"));
    navLinks[index].classList.add("active");
  };

  window.addEventListener("scroll", highlightActiveLink);
  highlightActiveLink();

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 77,
          behavior: "smooth",
        });
      }
    });
  });
});
