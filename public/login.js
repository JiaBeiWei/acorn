window.onload = function () {
    document.getElementById("in1").style.display = "block";
    document.getElementById("in2").style.display = "block";
    document.getElementById("out").style.display = "none";

    function setCookie(name, value, options = {}) {
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }
        document.cookie = updatedCookie;
    }

    async function login (user){
        fetch('/login', {
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.status === 200){
                window.location = '/post.html';
            }
            if (response.status >= 400)
                window.location = '/login.html';
            return response.json();
        })
        .catch(err => {
            console.log(err)
        })
        .then(data => {
            setCookie('user', data.message, {secure: true, 'max-age': 3600});
        });
    }

    var form = document.getElementById("form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        let user = login({
            "email": document.getElementById("email").value, 
            "password": document.getElementById("password").value
        })
    });

}
