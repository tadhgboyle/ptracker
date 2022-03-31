window.jsPDF = window.jspdf.jsPDF;



document.addEventListener('DOMContentLoaded', function () {

    const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        refetchResourcesOnNavigate: true,
        contentHeight: 'auto',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'resourceTimelineMonth',
        nowIndicator: true,
        slotMinWidth: 30,
        customButtons: {
            printButton: {
              text: 'Print',
              click: function() {
                window.print();
                document.margin='none';
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
                width: '190px'
            },
            {
                group: true,
                headerContent: 'Site',
                field: 'site',
                width: '65px'
            },
            {
                headerContent: 'Day',
                field: 'dayshifts',
                width: '54px'
            },
            {
                headerContent: 'Night',
                field: 'nightshifts',
                width: '54px'

            },
            {
                headerContent: 'Evening',
                field: 'eveningshifts',
                width: '65px'

            },
            {
                headerContent: 'Total',
                field: 'totalshifts',
                width: '48px'
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

