window.jsPDF = window.jspdf.jsPDF;



document.addEventListener('DOMContentLoaded', function () {

    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        refetchResourcesOnNavigate: true,
        contentHeight: 'auto',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'resourceTimelineMonth',
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
        resourceLabelDidMount: (info) => {
            info.el.addEventListener("click", () => { 
                toggleHighlight(info)
             });
         },
         selectable: true,
    });

    const toggleHighlight = (info) =>{
        info.el.classList.toggle('highlighted')
        let sibling = info.el.nextSibling
        while(sibling){
            sibling.classList.toggle('highlighted')
            sibling = sibling.nextSibling
        }
    }
    calendar.render();
});

