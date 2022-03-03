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

document.addEventListener('DOMContentLoaded', () => {
    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialDate: new Date().toISOString().split('T')[0],
        fixedWeekCount: false,
        selectable: true,
        businessHours: true,
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
            openModal('addShiftModal')
            document.getElementById('addDatePicker').value = info.dateStr
        },
        eventClick: function (info) {
            if (info.event._def.ui.backgroundColor !== '#577590') {
                openModal('editShiftModal')
                document.getElementById('editDatePicker').value = info.event.start.toISOString().split('T')[0]
                document.getElementById('editDateValue').value = info.event.start.toISOString().split('T')[0]
                document.getElementById('editForm').action = `/shifts/${info.event.id}?_method=PUT`
                document.getElementById('deleteForm').action = `/shifts/delete/${info.event.id}?_method=DELETE`
            }
        },
        events: {
            url: '/data/allShifts',
        }
    });

    calendar.render();
});