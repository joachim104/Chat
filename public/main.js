let script = document.createElement('script');
script.src = '/scripts/jQuery.js';
script.type = 'text/javascript';

script.onreadystatechange = handler;
script.onload = handler;

var head = document.getElementsByTagName('head')[0];
// Fire the loading
head.appendChild(script);

function handler() {
    $("#header").load("./components/header.html");
    $("#footer").load("./components/footer.html");


    $("#username").val("admin");
    $("#password").val("admin");
}

