const URL = 'http://localhost:3000';
// const URL = 'http://463a-2604-3d08-527f-e4a0-1c36-2d5-6952-d1fb.ngrok.io';

document.addEventListener('DOMContentLoaded', function() {
    const calendar = new FullCalendar.Calendar( document.getElementById('calendar'), {
        contentHeight: 'auto',
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
                headerContent: 'Evening',
                field: 'eveningshifts',
                width: '60px'

            },
            {
                headerContent: 'Total Shifts',
                field: 'totalshifts',
                width: '95px'
            }
        ],
        resources: {
            url: URL + '/data/resources'
        },
        events: {
            url: URL + '/data/events'
        },
    });

    calendar.render();
});

