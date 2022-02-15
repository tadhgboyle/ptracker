function openModal(key) {
  document.getElementById(key).style.display = "block";
  document.getElementById(key).children[0].scrollTop = 0;
  document.getElementById(key).children[0].classList.remove('opacity-0');
  document.getElementById(key).children[0].classList.add('opacity-100')
}

function modalClose(key) {
  document.getElementById(key).children[0].classList.remove('opacity-100');
  document.getElementById(key).children[0].classList.add('opacity-0');
  setTimeout(function () {
      document.getElementById(key).style.display = "none";
      document.body.removeAttribute('style');
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialDate: new Date().toISOString().split('T')[0],
    fixedWeekCount: false,
    editable: true,
    selectable: true,
    businessHours: true,
    dayMaxEvents: true,

    dateClick: function(info) {
      openModal('addShiftModal')
      document.getElementById('shiftDatePicker').value = info.dateStr
    },
    eventClick: function(info) {

    },
    events: {
      url: 'http://localhost:3000/shifts',
    }
  });

  calendar.render();
});





