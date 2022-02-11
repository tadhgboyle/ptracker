
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        contentHeight: 'auto',
        // googleCalendarApiKey: ,
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'resourceTimelineMonth',
        header: {
            left: 'today prev,next',
            center: 'title',
            right: 'resourceTimelineMonth'
        },
        aspectRatio: 1.5,
        resourceAreaWidth:'35%',
        resourceAreaColumns: [
            {
                headerContent: 'Student Name',
                field: 'name',
            },
            {
                group: true,
                headerContent: 'Site',
                field: 'site',
                width: '90px'
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
                headerContent: 'Total Shifts',
                field: 'totalshifts',
                width: '95px'
            }
        ],
        resources: {
            url: 'http://localhost:3000/data/resources'
        },
        events: {
            url: 'http://localhost:3000/data/events'
        }
    });

    calendar.render();
});

