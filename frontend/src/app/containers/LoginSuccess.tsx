import React, {useEffect} from 'react';

function LoginSuccess() {
    useEffect(() => {
        setTimeout(() => {
            window.close();
        }, 1000);
    }, []);

    return (
        <div>
            <h1>Login Success</h1>
            <p>Welcome</p>
        </div>
    );
}

export default LoginSuccess;
