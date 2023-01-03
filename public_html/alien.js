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
    let jwt = await jsonRequest('./api/auth/login', {username: window.document.querySelector('input[name="user"]')?.value, password: window.document.querySelector('input[name="pass"]')?.value}, 'POST');
    
    if(jwt instanceof Error) {
        window.document.querySelector('span.resp').innerHTML = jwt.message;
        console.error(jtw.message);
        return;
    }

    console.log(jwt);
}


async function create_user() {
    let jwt = await jsonRequest('./api/auth/create', {username: window.document.querySelector('input[name="user"]')?.value, password: window.document.querySelector('input[name="pass"]')?.value}, 'POST');
    
    if(jwt instanceof Error) {
        window.document.querySelector('span.resp').innerHTML = jwt.message;
        console.error(jtw.message);
        return;
    }

    console.log(jwt);
}

async function send_message() {
    var textbox = window.document.querySelector('input[name="message"]');
    const message = textbox.value;
    
    new_message('V01D_R34L1TY', message);

    textbox.value = '';
}

async function new_message(author, message) {
    const escape = (raw) => {
        return raw.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

    let container = window.document.querySelector('section.chatroom-messages');

    let messageObj = document.createElement('div');
    messageObj.classList = 'message';

    let authorObj = document.createElement('p');
    authorObj.classList = 'author';
    authorObj.innerText = escape(author);

    let contentObj = document.createElement('p');
    contentObj.classList = 'content';
    contentObj.innerText = escape(message);

    messageObj.appendChild(authorObj);
    messageObj.appendChild(contentObj);
    container.appendChild(messageObj);

    if(container.children.length > 25) {
        while(container.children.length > 25)
            container.removeChild(window.document.querySelectorAll('div.message')[0]);
    }

    container.scrollTo(0, container.scrollHeight);
}

!function () {

    // Todo: check for JWT, display chat instead

    // Display the default page
    displayFromId('chatroom');

}();
