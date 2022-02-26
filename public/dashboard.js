document.addEventListener('DOMContentLoaded', function () {
    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        contentHeight: 'auto',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'resourceTimelineMonth',
        aspectRatio: 1.5,
        nowIndicator: true,
        customButtons: {
            exportButton: {
              text: 'Export to PDF',
              click: function() {
                alert('Export PDF clicked!');
              }
            }
          },
        headerToolbar: {
            left: 'title',
            right: 'exportButton today prev,next',
        },
        slotLabelFormat:[{day: 'numeric'},{weekday: 'short'}],
        resourceAreaWidth: '35%',
        resourceAreaColumns: [
            {
                headerContent: 'Student Name',
                field: 'name',
            },
            {
                group: true,
                headerContent: 'Site',
                field: 'site',
                width: '60px'
            },
            {
                headerContent: 'Day',
                field: 'dayshifts',
                width: '60px'
            },
            {
                headerContent: 'Night',
                field: 'nightshifts',
                width: '60px'

            },
            {
                headerContent: 'Evening',
                field: 'eveningshifts',
                width: '70px'

            },
            {
                headerContent: 'Total Shifts',
                field: 'totalshifts',
                width: '95px'
            }
        ],
        resources: {
            url: '/data/dashboardStudentSites'
        },
        events: {
            url: '/data/dashboardShifts'
        },
    });

    calendar.render();
});

