document.addEventListener('DOMContentLoaded', function() {
  let startDate = new Date()
  
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialDate: startDate.toISOString().split('T')[0],
    editable: true,
    selectable: true,
    businessHours: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: [
      {
        title: 'Example Shift (D)',
        start: '2022-02-01'
      },
      {
        title: 'Example Shift (E)',
        start: '2022-02-04'
      },
      {
        title: 'Example Shift (N)',
        start: '2022-02-05'
      },
      {
        title: 'Example Shift (S)',
        start: '2022-02-06'
      },
      {
        title: 'Multiple Shifts',
        start: '2022-02-07',
        end: '2022-02-10'
      },
      {
        title: 'Shift with Time',
        start: '2022-02-12T10:30:00',
        end: '2022-02-12T12:30:00'
      },
    ]
  });

  calendar.render();
});





