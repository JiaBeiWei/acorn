window.onload = function () {
    if (!document.cookie)
        window.location = '/login.html';
    else {
        document.getElementById("in1").style.display = "none";
        document.getElementById("in2").style.display = "none";
        document.getElementById("out").style.display = "block";
        getPosts();
    }

    function addEvent(id) {
        document.getElementById(id).addEventListener("click", function(event){
            event.preventDefault();
            deletePost(id);
        });
    }

    function addNew(text, id) {
        var start_div = document.getElementById('new'); 
        var newElement = document.createElement('div');
        const username = getCookie('user');
        newElement.innerHTML = "<div class=\"field-wrap\"> <h3>"
                                + username + " (you) said just now</h3><p>" + text + "</p>"
                                + "<button type=\"button\" class=\"" 
                                + "button button-block delete\" id=\"" 
                                + id + "\">Delete</button><hr></div>"
        start_div.insertBefore(newElement, start_div.childNodes[0]); 
        addEvent(id);
    }

    function addHistory(post) {
        var start_div = document.getElementById('history'); 
        var newElement = document.createElement('div');
        const username = post.username;
        const text = post.content;
        const id = post.postID;
        const time = post.createdAt;
        newElement.innerHTML = "<div class=\"field-wrap\"> <h3>"
                                + username + " said at " + time 
                                + "</h3><p>" + text + "</p>"
                                + "<button type=\"button\" class=\"" 
                                + "button button-block delete\" id=\"" 
                                + id + "\">Delete</button><hr></div>";
        start_div.insertBefore(newElement, start_div.childNodes[0]); 
        addEvent(id);
    }

    async function getPosts() {
        fetch('/user/posts', {
            method : "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow'
        })
        .then(response => response.json())
        .catch(error => {
            console.log('Error:', error);
        })
        .then(data => {
            data.forEach((post) => {
                addHistory(post);
            });
        })
        .catch(error => console.log(error));
    }

    async function postIt(post) {
        fetch('/user/posts', {
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            credentials: 'same-origin',
            body: JSON.stringify(post)
        })
        .then(response => {
            if (response.status >= 400)
                window.location = 'login.html';
            return response.json()
        })
        .catch(error => {
            console.log('Error:', error);
        })
        .then(data => {
            addNew(document.getElementById("content").value, data.postID);
        });
    }

    async function deletePost(postid) {
        fetch('/user/posts/'+postid, {
            method : "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok)
                window.location = 'post.html';
            else
                alert("Sorry you are not authorized to delete this post. ")
        })
        .catch(error => console.log(error.message));
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

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    var post = document.getElementById("post");

    post.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = getCookie('user');
        if (!username)
            window.location = '/login.html';
        // user loged in
        postIt({content: document.getElementById("content").value});
    });

    var view = document.getElementById("view");

    view.addEventListener("click", function(event) {
        event.preventDefault();
        window.location = '/post.html';
    }, false);
};
