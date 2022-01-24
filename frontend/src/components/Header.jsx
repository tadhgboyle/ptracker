import React, {useState, useEffect} from "react";

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
        <h1>Ptracker {message}</h1>
    )
}

export default Header
