import { useEffect } from "react";



export default csrf = useEffect(() => {
    const getCsrfToken = async () => {
        const response = await fetch('/api/csrf-token');
        const data = await response.json();
        // Store the token in your app's state or a global variable
        setCsrfToken(data.csrfToken);
    };

}, []);
