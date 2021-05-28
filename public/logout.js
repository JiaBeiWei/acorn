window.onload = function () {
    document.getElementById("in1").style.display = "none";
    document.getElementById("in2").style.display = "none";
    document.getElementById("out").style.display = "block";


    document.getElementById("username").innerHTML = getCookie('user')+", ";

    async function logout(){
        fetch('/user/logout', {
            method : "GET",
            redirect: 'follow'
        })
        .then(response => {
            window.location = '/index.html';
        })
        .catch(err => {
            console.log(err)
        });
    }

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

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

    function deleteCookie(name) {
        setCookie(name, "", {
            'max-age': -1
        })
    }

var form = document.getElementById("form");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    deleteCookie('user');
    logout();
});

}
