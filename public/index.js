window.onload = function () {
	if (!document.cookie){
        document.getElementById('in1').style.display = "block";
        document.getElementById('in2').style.display = "block";
        document.getElementById('out').style.display = "none";
    } else {
        document.getElementById('in1').style.display = "none";
        document.getElementById('in2').style.display = "none";
        document.getElementById('out').style.display = "block";
    }

    fetch("https://api.nasa.gov/planetary/apod?api_key=km6wgMeRkw5CZ6PxjmSm2ArtvD69lbsBNYeA4gOY", { method: "GET" })
    	.then(res => res.json())
    	.then(data => {
    		document.getElementById("image").setAttribute("src", data.url);
    		document.getElementById("explanation").innerHTML = data.date
            + "</p><p>" + data.explanation;
    	})
};
