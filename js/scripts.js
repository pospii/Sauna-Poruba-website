document.addEventListener("DOMContentLoaded", () => {
  // AOS is loaded only on the homepage.
  if (typeof window.AOS !== "undefined") {
    const getOffset = () => (window.innerWidth > 768 ? 300 : 50);
    const initAOS = () =>
      window.AOS.init({
        duration: 1000,
        once: true,
        offset: getOffset(),
        anchorPlacement: "top-bottom",
      });

    initAOS();
    window.addEventListener("resize", initAOS);
  }

  // Gallery slider.
  const galleryContainer = document.querySelector(".gallery-container");
  const prevButton = document.querySelector(".gallery-button.prev");
  const nextButton = document.querySelector(".gallery-button.next");

  if (galleryContainer && prevButton && nextButton) {
    const galleryImages = Array.from(
      document.querySelectorAll(".gallery-container img")
    );
    const imageCount = galleryImages.length;
    const visibleImages = 3;
    let currentIndex = 0;
    let interval = null;

    const updateGallery = () => {
      const offset = -(currentIndex * (100 / visibleImages));
      galleryContainer.style.transform = `translateX(${offset}%)`;
    };

    const startInterval = () => {
      interval = window.setInterval(() => {
        currentIndex = (currentIndex + 1) % imageCount;
        updateGallery();
      }, 5000);
    };

    const resetInterval = () => {
      if (interval) {
        window.clearInterval(interval);
      }
      startInterval();
    };

    if (imageCount > visibleImages) {
      for (let i = 0; i < visibleImages; i += 1) {
        galleryContainer.appendChild(galleryImages[i].cloneNode(true));
      }
    }

    if (imageCount > 0) {
      updateGallery();
      startInterval();
    }

    prevButton.addEventListener("click", () => {
      if (imageCount === 0) return;
      currentIndex = (currentIndex - 1 + imageCount) % imageCount;
      updateGallery();
      resetInterval();
    });

    nextButton.addEventListener("click", () => {
      if (imageCount === 0) return;
      currentIndex = (currentIndex + 1) % imageCount;
      updateGallery();
      resetInterval();
    });
  }

  // Rotating images in cafe section.
  const rotatingImages = document.querySelectorAll(".foto-kavarna img");
  if (rotatingImages.length > 0) {
    let currentImageIndex = 0;

    const showImage = (index) => {
      rotatingImages.forEach((img, i) => {
        img.style.opacity = i === index ? "1" : "0";
        img.style.transform = i === index ? "scale(1)" : "scale(1.1)";
      });
    };

    const rotateImages = () => {
      rotatingImages[currentImageIndex].style.opacity = "0";
      rotatingImages[currentImageIndex].style.transform = "scale(1.1)";
      window.setTimeout(() => {
        currentImageIndex = (currentImageIndex + 1) % rotatingImages.length;
        showImage(currentImageIndex);
      }, 500);
    };

    showImage(currentImageIndex);
    window.setInterval(rotateImages, 5000);
  }

  // Modal with keyboard support.
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.querySelector(".close");
  const thumbnails = document.querySelectorAll(".thumbnail");

  if (modal && modalImg && closeBtn && thumbnails.length > 0) {
    let lastFocusedElement = null;

    const getFocusableElements = () =>
      Array.from(
        modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));

    const closeModal = () => {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    };

    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const thumbImg = thumb.querySelector("img");
        const altText = thumbImg?.alt || thumb.getAttribute("aria-label") || "";
        lastFocusedElement = document.activeElement;
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        modalImg.src = thumb.dataset.full;
        modalImg.alt = altText;
        modalImg.title = altText;
        closeBtn.focus();
      });
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (modal.style.display !== "flex") return;

      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key === "Tab") {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  // Photo interaction for desktop hover only.
  const photoImages = document.querySelectorAll(".fotky img");
  const supportsHover = window.matchMedia("(hover: hover)").matches;
  if (photoImages.length > 0 && supportsHover) {
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
        photoImages.forEach((img) => {
          img.style.width = "33.33%";
        });
      });
    });
  }

  // Mobile menu.
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");
  if (menuToggle && navMenu) {
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
  }

  // Event filtering on homepage only.
  const eventList = document.getElementById("akce-list");
  const filterButtons = document.querySelectorAll(".nav-btn[data-filter]");

  if (eventList && filterButtons.length > 0) {
    const loadEvents = async (filter) => {
      try {
        const response = await fetch("akce.json");
        if (!response.ok) throw new Error("Chyba při načítání souboru.");
        const events = await response.json();
        filterEvents(filter, events);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Chyba při načítání akcí:", error);
      }
    };

    const setSelectedFilter = (selectedButton) => {
      filterButtons.forEach((btn) => {
        const isActive = btn === selectedButton;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setSelectedFilter(button);
        loadEvents(button.getAttribute("data-filter"));
      });

      button.addEventListener("keydown", (event) => {
        const currentIndex = Array.from(filterButtons).indexOf(button);
        if (currentIndex === -1) return;

        let targetIndex = null;
        if (event.key === "ArrowRight") {
          targetIndex = (currentIndex + 1) % filterButtons.length;
        } else if (event.key === "ArrowLeft") {
          targetIndex =
            (currentIndex - 1 + filterButtons.length) % filterButtons.length;
        } else if (event.key === "Home") {
          targetIndex = 0;
        } else if (event.key === "End") {
          targetIndex = filterButtons.length - 1;
        }

        if (targetIndex !== null) {
          event.preventDefault();
          filterButtons[targetIndex].focus();
        }
      });
    });

    const filterEvents = (filter, events) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneWeekFromNow = new Date(today);
      oneWeekFromNow.setDate(today.getDate() + 7);
      const oneMonthFromNow = new Date(today);
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
        }
        if (filter === "tyden") {
          return eventDate >= today && eventDate <= oneWeekFromNow;
        }
        if (filter === "mesic") {
          return eventDate >= today && eventDate <= oneMonthFromNow;
        }
        return false;
      });

      renderEvents(filteredEvents);
    };

    const formatDate = (dateString) => {
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
      }.${date.getFullYear()} • ${date.getHours()}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    };

    const renderEvents = (events) => {
      eventList.innerHTML = "";

      if (events.length === 0) {
        eventList.innerHTML =
          "<p style='text-align: center;'>V tomto období nejsou žádné plánované akce.</p>";
        return;
      }

      events.forEach((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${event.image}" alt="${event.title}" loading="lazy">
          <div class="akce-info">
            <div class="akce-date">${formatDate(event.date)}</div>
            <h4><strong>${event.title}</strong></h4>
            <p>${event.description}</p>
          </div>
        `;
        eventList.appendChild(li);
      });
    };

    loadEvents("tyden");
  }

  // Active nav highlight and smooth scroll.
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".navigace ul li a"));

  if (sections.length > 0 && navLinks.length > 0) {
    const highlightActiveLink = () => {
      const current = sections
        .slice()
        .reverse()
        .find((section) => window.scrollY + 100 >= section.offsetTop);

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const isActive = current && href === `#${current.id}`;
        link.classList.toggle("active", Boolean(isActive));
      });
    };

    window.addEventListener("scroll", highlightActiveLink);
    highlightActiveLink();

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const targetSection = document.getElementById(href.substring(1));
        if (!targetSection) return;

        event.preventDefault();
        window.scrollTo({
          top: targetSection.offsetTop - 77,
          behavior: "smooth",
        });
      });
    });
  }

  // Animated counter in hero.
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.ceil(target / 20);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 55);
  });

  // Cookie banner.
  const cookieBanner = document.getElementById("cookie-banner");
  if (cookieBanner) {
    if (!localStorage.getItem("cookieConsent")) {
      setTimeout(() => {
        cookieBanner.classList.add("visible");
        cookieBanner.setAttribute("aria-hidden", "false");
      }, 1800);

      document.getElementById("cookie-accept").addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        cookieBanner.classList.remove("visible");
      });

      document.getElementById("cookie-decline").addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "declined");
        cookieBanner.classList.remove("visible");
      });
    } else {
      cookieBanner.style.display = "none";
    }
  }

  // Back to top button.
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Highlight today in opening hours.
  const dayNames = ["Neděle:", "Pondělí:", "Úterý:", "Středa:", "Čtvrtek:", "Pátek:", "Sobota:"];
  const todayLabel = dayNames[new Date().getDay()];
  document.querySelectorAll("#oteviraci-doba li").forEach((li) => {
    const span = li.querySelector("span");
    if (span && span.textContent.trim() === todayLabel) {
      li.classList.add("today-highlight");
    }
  });

  // Open/closed badge in hero.
  const badge = document.getElementById("openNow");
  if (badge) {
    const now = new Date();
    const day = now.getDay(); // 0=ne, 1=po...
    const minutes = now.getHours() * 60 + now.getMinutes();
    let open = false;

    if (day === 1) {
      open = false;
    } else if (day >= 2 && day <= 5) {
      open = minutes >= 16 * 60 && minutes < 22 * 60;
    } else {
      open = minutes >= 14 * 60 && minutes < 22 * 60;
    }

    badge.textContent = open ? "Teď otevřeno" : "Teď zavřeno";
    badge.classList.add(open ? "is-open" : "is-closed");
  }
});
