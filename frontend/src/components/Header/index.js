import React, {useState, useEffect} from "react";

import { Wrapper, Content } from "./Header.styles";

function Header() {

    const [message, setMessage] = useState();

    useEffect(() => {
        let mounted = true;
        fetch('http://127.0.0.1:9000')
            .then(data => data.json())
            .then(data => {
                if (mounted) {
                    setMessage(data.message);
                }
            })
        return () => mounted = false;
    }, [])

    return (
        <Wrapper>
            <Content>
                <h1>Ptracker {message}</h1>
            </Content>
        </Wrapper>
    )
}

export default Header
