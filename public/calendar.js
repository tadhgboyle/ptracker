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

function deleteModal() {
    modalClose('editShiftModal');
    openModal('deleteShiftModal')
}

function populateEditModal(info){
    document.getElementById('editDatePicker').value = info.event.start.toISOString().split('T')[0]
    document.getElementById('editDateValue').value = info.event.start.toISOString().split('T')[0]
    let shift = info.event.title.charAt(0).toUpperCase()
    switch(shift) {
        case "N":
          shift = "Night"
          break;
        case "E":
          shift = "Evening"
          break;
        default:
          shift = "Day"
      }
    document.getElementById('site'+info.event.extendedProps.site.id).selected = true
    document.getElementById('editRadioDefault'+shift).checked = true
    document.getElementById('edit-preceptorField').value = info.event.extendedProps.preceptor
    document.getElementById('editForm').action = `/shifts/${info.event.id}?_method=PUT`
    document.getElementById('deleteForm').action = `/shifts/delete/${info.event.id}?_method=DELETE`
}


document.addEventListener('DOMContentLoaded', () => {
    
    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialDate: new Date().toISOString().split('T')[0],
        fixedWeekCount: false,
        selectable: true,
        businessHours: true,
        height: '100%',
        dayMaxEvents: true,
        nowIndicator: true,
        customButtons: {
            printButton: {
                text: 'Print',
                click: function() {
                    window.print();
                }
            }
        },
        headerToolbar: {
            left: 'title',
            right: 'printButton today prev,next',
        },
        dateClick: function (info) {
            if(!containsEvent(info.dateStr)){
                openModal('addShiftModal')
                document.getElementById('addDatePicker').value = info.dateStr             
            }
        },
        eventClick: function (info) {
            if (info.event._def.ui.backgroundColor !== '#577590') {
                openModal('editShiftModal')
                populateEditModal(info)
            }
        },
        events: {
            url: '/data/allShifts',
        }
        
    });

    calendar.render();

    function containsEvent(dateStr){
        for(const event of calendar.getEvents()){
            
            if(event.startStr === dateStr && event.extendedProps.userId !== "holiday")
                return true
        }
        return false
    }
});
