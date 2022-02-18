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

const URL = 'http://localhost:3000';
// const URL = 'http://463a-2604-3d08-527f-e4a0-1c36-2d5-6952-d1fb.ngrok.io';

document.addEventListener('DOMContentLoaded', () => {
    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialDate: new Date().toISOString().split('T')[0],
    fixedWeekCount: false,
    // editable: true,
    selectable: true,
    businessHours: true,
    dayMaxEvents: true,

    dateClick: function(info) {
      openModal('addShiftModal')
      document.getElementById('addDatePicker').value = info.dateStr
    },
    eventClick: function(info) {
      date = info.event.start.toISOString().split('T')[0]
      openModal('editShiftModal')
      document.getElementById('editDatePicker').value = date
      document.getElementById('editForm').action = `/shifts/${info.event.id}?_method=PUT`
    },
    events: {
      url: URL + '/shifts',
    }
  });

  calendar.render();
});
