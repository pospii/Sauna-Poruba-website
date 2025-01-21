document.addEventListener("DOMContentLoaded", () => {
    const eventList = document.getElementById("akce-list");
    const navButtons = document.querySelectorAll(".nav-btn");
  
    const apiBaseUrl = "http://localhost:3000/api/events";
  
    // Funkce na formátování data
    function formatDatum(datumString, timeString) {
      const datum = new Date(`${datumString}T${timeString}`);
      const denVTydnu = new Intl.DateTimeFormat('cs-CZ', { weekday: 'long' }).format(datum);
      const den = datum.getDate();
      const mesic = datum.getMonth() + 1;
      const rok = datum.getFullYear();
      const hodiny = datum.getHours().toString().padStart(2, '0');
      const minuty = datum.getMinutes().toString().padStart(2, '0');
  
      return `${denVTydnu} ${den}.${mesic}.${rok} ${hodiny}:${minuty}`;
    }
  
    // Funkce pro načtení událostí z API
    async function loadEvents(filter) {
      const today = new Date();
      let startDate, endDate;
  
      // Nastavení časového filtru
      if (filter === "dnes") {
        startDate = endDate = today.toISOString().split("T")[0];
      } else if (filter === "tyden") {
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        const endOfWeek = new Date(today.setDate(today.getDate() + 6 - today.getDay()));
        startDate = startOfWeek.toISOString().split("T")[0];
        endDate = endOfWeek.toISOString().split("T")[0];
      } else if (filter === "mesic") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        startDate = startOfMonth.toISOString().split("T")[0];
        endDate = endOfMonth.toISOString().split("T")[0];
      }
  
      // Načtení událostí z API
      const response = await fetch(`${apiBaseUrl}?startDate=${startDate}&endDate=${endDate}`);
      const events = await response.json();
  
      // Vykreslení událostí
      renderEvents(events);
    }
  
    // Funkce pro vykreslení událostí
    function renderEvents(events) {
      eventList.innerHTML = "";
      if (events.length === 0) {
        eventList.innerHTML = "<li>Žádné události v tomto období.</li>";
        return;
      }
      events.forEach((event) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <img src="${event.img}" alt="${event.title}" />
          <div class="akce-info">
            <h4>${formatDatum(event.date, event.time)}</h4>
            <p><strong>${event.title}</strong></p>
            <p>${event.description}</p>
          </div>
        `;
        eventList.appendChild(listItem);
      });
    }
  
    // Event listener pro změnu filtru
    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        navButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        loadEvents(btn.dataset.filter);
      });
    });
  
    // Výchozí načtení: Tento týden
    loadEvents("tyden");
  });
  
  