

  document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        height: 'auto',
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
        resources: [
            { id: '1', name: 'Emanuel Meadows', site: 'RCH' , dayshifts: 2, nightshifts: 1, totalshifts: 3},
            { id: '2', name: 'Braelyn Knapp', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '3', name: 'Boston Peck', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '4', name: 'Vanessa Thomas', site: 'SMH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '5', name: 'Camryn Mack', site: 'SMH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '6', name: 'Zaniyah Vincent', site: 'SMH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '7', name: 'Marc Beard', site: 'RH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '8', name: 'Annie Khan', site: 'RH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '9', name: 'Iliana Bradford', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
            { id: '10', name: 'Marianna Jefferson', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        ],    events: [
            {
              title: 'D',
              start: '2022-02-04',
              resourceId: '1',
              color: '#ECA446',
            },
            {
                title: 'E',
                start: '2022-02-05',
                resourceId: '2',
                color: '#016BB7'
            },
            {
              title: 'E',
              start: '2022-02-15',
              resourceId: '2',
              color: '#016BB7'
            },
            {
              title: 'E',
              start: '2022-02-06',
              resourceId: '3',
              color: '#016BB7'
            },
            {
                title: 'D',
                start: '2022-02-14',
                resourceId: '4',
                color: '#ECA446',
            },
            {
              title: 'E',
              start: '2022-02-04',
              resourceId: '4',
              color: '#016BB7'
            },
            {
              title: 'N',
              start: '2022-02-04',
              resourceId: '5',
              color: '#744468'
            },
            {
              title: 'S',
              start: '2022-02-14',
              resourceId: '6',
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

