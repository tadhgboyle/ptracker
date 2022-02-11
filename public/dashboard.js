
const getShifts = (user) => {
    const shiftEvents = []
    const date = user.shifts[0].date('T')[0]
    // return user.shifts
}

const displayUsers = (user) => {
    return;
    // const allUsersInSection = [];
    // if (user.role === 'STUDENT') {
    //     allUsersInSection.push({id: user.googleId, name: user.name, site: user.})
    // }
}

const getUser = (callback) => {
    const http = new XMLHttpRequest();
    const url = 'http://localhost:3000/user'
    http.open("GET", url);
    http.send();

    http.onreadystatechange = (e) => {
        const currentUser = JSON.parse(http.responseText);
        callback(currentUser)
    }
}

const convertShiftType = (type) => {
    if (type === 'NIGHT') {
        return 'N'
    }
    else if (type === 'EVENING') {
        return 'E'
    }
    else if (type === 'DAY') {
        return 'D'
    }
    else if (type === 'SICK') {
        return 'S'
    }
}

const shiftColor = (shift) => {
    if (shift === 'NIGHT') {
        return '#744468'
    }
    else if (shift === 'EVENING') {
        return '#016BB7'
    }
    else if (shift === 'DAY') {
        return '#ECA446'
    }
    else if (shift === 'SICK') {
        return '#D05353'
    }
}

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
        resources: getUser(displayUsers),
            // [
        //     { id: '1', name: 'Emanuel Meadows', site: 'RCH' , dayshifts: 2, nightshifts: 1, totalshifts: 3},
        //     { id: '2', name: 'Braelyn Knapp', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '3', name: 'Boston Peck', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '4', name: 'Vanessa Thomas', site: 'SMH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '5', name: 'Camryn Mack', site: 'SMH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '6', name: 'Zaniyah Vincent', site: 'SMH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '7', name: 'Marc Beard', site: 'RH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '8', name: 'Annie Khan', site: 'RH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '9', name: 'Iliana Bradford', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        //     { id: '10', name: 'Marianna Jefferson', site: 'RCH', dayshifts: 2, nightshifts: 1, totalshifts: 3 },
        // ],
        // events: getUser(getShifts)
        //   [
        //   {
        //     title: 'D',
        //     start: '2022-02-04',
        //     resourceId: '1',
        //     color: '#ECA446',
        //   },
        //   {
        //       title: 'E',
        //       start: '2022-02-05',
        //       resourceId: '2',
        //       color: '#016BB7'
        //   },
        //   {
        //     title: 'E',
        //     start: '2022-02-15',
        //     resourceId: '2',
        //     color: '#016BB7'
        //   },
        //   {
        //     title: 'E',
        //     start: '2022-02-06',
        //     resourceId: '3',
        //     color: '#016BB7'
        //   },
        //   {
        //       title: 'D',
        //       start: '2022-02-14',
        //       resourceId: '4',
        //       color: '#ECA446',
        //   },
        //   {
        //     title: 'E',
        //     start: '2022-02-04',
        //     resourceId: '4',
        //     color: '#016BB7'
        //   },
        //   {
        //     title: 'N',
        //     start: '2022-02-04',
        //     resourceId: '5',
        //     color: '#744468'
        //   },
        //   {
        //     title: 'S',
        //     start: '2022-02-14',
        //     resourceId: '6',
        //     color: '#D05353'
        //   },
        //   {
        //     title: 'Holiday or Event',
        //     resourceId: '1',
        //     start: '2022-02-07',
        //     end: '2022-02-10',
        //     color: '#577590'
        //   },
        // ]
    });

    calendar.render();
});

