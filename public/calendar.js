
// Functions for open/closing modals
// Pass DOM element id as argument
function openModal(key) {
  document.getElementById(key).showModal(); 
  document.getElementById(key).children[0].scrollTop = 0; 
  document.getElementById(key).children[0].classList.remove('opacity-0'); 
  document.getElementById(key).children[0].classList.add('opacity-100')
}

function modalClose(key) {
  document.getElementById(key).children[0].classList.remove('opacity-100');
  document.getElementById(key).children[0].classList.add('opacity-0');
  setTimeout(function () {
      document.getElementById(key).close();
      document.body.removeAttribute('style');
  }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
  let startDate = new Date()
  
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialDate: startDate.toISOString().split('T')[0],
    fixedWeekCount: false,
    editable: true,
    selectable: true,
    businessHours: true,
    dayMaxEvents: true, // allow "more" button when too many shifts
    
    
    // Callback for when you click a date
    dateClick: function(info) {
      openModal('addShiftModal')
      document.getElementById('shiftDatePicker').value = info.dateStr
    },

    // Callback for when you click an event
    eventClick: function(info) {

    },
    // Static shifts
    events: [
      {
        title: 'Example Shift (D)',
        start: '2022-02-04',
        color: '#ECA446',
        extendedProps: {}
       
      },
      {
        title: 'Example Shift (E)',
        start: '2022-02-05',
        color: '#016BB7'
      },
      {
        title: 'Example Shift (E)',
        start: '2022-02-06',
        color: '#016BB7'
      },
      {
        title: 'Example Shift (E)',
        start: '2022-02-04',
        color: '#016BB7'
      },
      {
        title: 'Example Shift (N)',
        start: '2022-02-04',
        color: '#744468'
      },
      {
        title: 'Sick Student (S)',
        start: '2022-02-14',
        color: '#D05353'
      },
      {
        title: 'Holiday or Event',
        start: '2022-02-07',
        end: '2022-02-10',
        color: '#577590'
      },
    ]
  });

  calendar.render();
});





