window.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.querySelector("#loginForm");
    if(loginForm){
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            loginUser(e.target.correo.value, e.target.password.value);
        });
    }

    const registerForm = document.querySelector("#registerForm");
    if(registerForm){
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            registerUser(e.target.nombre.value, e.target.correo.value, e.target.password.value);
        }); 
    }
    
});

async function loginUser(correo, password){
    const data =JSON.stringify({ correo, password });
    
    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        }); 

        const responseData = await res.json();
        const token = responseData.token;

        if(token){
            const now = new Date();
            now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
            const expires = now.toUTCString();
            document.cookie = await `token=${token}; expires=${expires}; path=/`;
            location.replace("../index.html");
        }else{
            alert("Token invalido intenta de nuevo.");
            location.reload();
        }
        
    } catch (error) {
        alert("Error al iniciar sesión: " + error);
    }
}

async function registerUser(nombre, correo, password){
    const data = JSON.stringify({ nombre, correo, password });

    if(data){
        try {
            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data,
            });

            if(res.status == 200){
                alert("Usuario registrado correctamente");
                location.href = "./login.html";
            }
        } catch (error) {
            alert("Error al registrarse: " + error);
        }
    }else{
        alert("Informacion ingresada no valida.");
    }
    
}