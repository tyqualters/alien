function displayFromId(id) {
    window.document.querySelector('main').innerHTML =
        window.document.getElementById(id).innerHTML;
}

const jsonRequest = (url, data, method) => xHttpRequest(url, JSON.stringify(data), method, 'application/json');

function xHttpRequest(url, data, method, contentType) {

    const REQUEST_TIMEOUT = 30_000;

    if(method != 'GET' && method != 'POST') method = 'GET';

    return new Promise((res, rej) => {
        var xmlHttp = new XMLHttpRequest();

        const xmlHttpTimeout = setTimeout(() => {
            if (xmlHttp?.status != 200 && xmlHttp?.readyState != xmlHttp?.DONE) {
                xmlHttp?.abort();
                rej(new Error(`xmlHttp timed out`));
            }
            else console.log('xmlHttp abort superseded');
        }, REQUEST_TIMEOUT);

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp?.status == 200 && xmlHttp.readyState == xmlHttp?.DONE) {
                console.log('xmlHttp acquired resource');
                clearTimeout(xmlHttpTimeout);
                res(xmlHttp.responseText, xmlHttp.responseType);
            }
        };

        xmlHttp.open(method, url);

        if(contentType == undefined) contentType = 'text/plain';
        xmlHttp.setRequestHeader("Content-Type", `${contentType};charset=UTF-8`);

        xmlHttp.send(data);
    });
}

async function login() {
    let jwt = await jsonRequest('./api/auth/login', {username: document.querySelector('input[name="user"]')?.value, password: document.querySelector('input[name="pass"]')?.value}, 'POST');
    
    if(jwt instanceof Error) {
        document.querySelector('span.resp').innerHTML = jwt.message;
        console.error(jtw.message);
        return;
    }

    console.log(jwt);
}


async function create_user() {
    let jwt = await jsonRequest('./api/auth/create', {username: document.querySelector('input[name="user"]')?.value, password: document.querySelector('input[name="pass"]')?.value}, 'POST');
    
    if(jwt instanceof Error) {
        document.querySelector('span.resp').innerHTML = jwt.message;
        console.error(jtw.message);
        return;
    }

    console.log(jwt);
}

!function () {

    // Todo: check for JWT, display chat instead

    // Display the default page
    displayFromId('landing');

}();
