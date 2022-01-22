/*
We can create css variables in this script
that we can use in future css scripts
and enables css across the application
*/

import { createGlobalStyle }  from 'styled-components';

export const GlobalStyle = createGlobalStyle`

//we can create those variables using :root
:root {
    --darkGrey: #1c1c1c;
    --white: #fff;
}

* {
    margin: 0;
    padding: 0;
}

body {
    margin: 0;
    padding: 0;

    h1 {
        color: var(--white);
        font-size: 2rem;
    }
}

`;