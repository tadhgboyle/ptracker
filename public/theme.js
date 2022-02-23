const darkToggle = document.getElementById('darkMode')

//Check default localStorage settings
window.addEventListener('load', () => {
    const darkToggle = document.getElementById('darkMode')
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        //check dark Toggle if localStorage had dark mode enabled in the last page
        darkToggle.checked = true;
    } else {
        document.documentElement.classList.remove('dark');
        darkToggle.checked = false;
    }
  });

 window.addEventListener("load", ()=>{
    document.getElementById('darkMode').addEventListener('click', () => {
        //if localStorage contains a colour theme
        if (localStorage.getItem('color-theme')){
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
            else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        //Otherwise, if localStorage doesn't contain a colour theme
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });
})


