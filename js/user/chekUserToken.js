async function checkUserToken() {
    // Obtén el token desde las cookies
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
    }, {});
    const token = cookies['token'];


    if (!token) {
        if (!location.href.includes('login') && !location.href.includes('register')) {
            location.replace("./user/login.html");
        }
    }

    if (token && (location.href.includes('login') || location.href.includes('register'))) {
        location.replace("/index.html");
    }
}

// Ejecuta la función
checkUserToken();
