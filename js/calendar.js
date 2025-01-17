document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Zobrazení měsíčního kalendáře
        locale: 'cs', // Čeština
        events: [
            {
                title: 'Saunový večer',
                start: '2025-01-20',
                end: '2025-01-20'
            },
            {
                title: 'Relaxační hudba',
                start: '2025-01-25',
                end: '2025-01-25'
            }
        ],
    });

    calendar.render();
});