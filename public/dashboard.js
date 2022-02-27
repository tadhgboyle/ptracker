document.addEventListener('DOMContentLoaded', function () {
    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        refetchResourcesOnNavigate: true,
        contentHeight: 'auto',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'resourceTimelineMonth',
        aspectRatio: 1.5,
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
            url: '/data/dashboardStudentSites'
        },
        events: {
            url: '/data/dashboardShifts'
        },
    });

    calendar.render();
});

