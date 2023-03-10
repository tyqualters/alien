const MAX_MESSAGE_RENDER = 25;

function displayFromId(id) {
    window.document.querySelector('main').innerHTML =
        window.document.getElementById(id).innerHTML;
}

const jsonRequest = (url, data, method) => xHttpRequest(url, JSON.stringify(data), method, 'application/json');

function notnullish(value) {
    return value != '' && value != undefined && value != NaN && value != null;
}

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

async function leaveSession() {
    window.localStorage.setItem('jwt', '');
    displayFromId('landing');
}

async function login() {
    var userbox = window.document.querySelector('input[name="user"]'),
        passbox = window.document.querySelector('input[name="pass"]'),
        spanText = window.document.querySelector('span.resp');

        spanText.innerHTML = "";

        let respText = await jsonRequest('./api/auth/login', {username: userbox?.value, password: passbox?.value}, 'POST');

        let _json;
    
        if(respText == undefined || respText instanceof Error || (_json = JSON.parse(respText))?.status == 'err' || _json?.status != 'jwt') {
            userbox.value = "";
            passbox.value = "";
            spanText.innerHTML = _json.message;
            console.error(_json.message);
            return;
        }

    alert('Logged in!');

    userbox.value = "";
    passbox.value = "";

    localStorage.setItem('jwt', _json.message);
    displayFromId('chatroom');
}

async function send_message() {
    let messagebox = window.document.querySelector('input[name="message"]');

    let query = { "jwt": localStorage.getItem('jwt'), "msg": messagebox?.value };

    let respText = await xHttpRequest('./api/post', JSON.stringify(query), 'POST', 'application/json');

    let _json;
    
    if(respText == undefined || respText instanceof Error || (_json = JSON.parse(respText))?.status == 'err' || _json?.status != 'ok') {
        messagebox.value = '';
        console.error(_json.message);
        alert('Something went wrong and you got disconnected.');
        window.localStorage.setItem('jwt', '');
        displayFromId('landing');
        return;
    }

    messagebox.value = '';
}

async function create_user() {
    var userbox = window.document.querySelector('input[name="user"]'),
        passbox = window.document.querySelector('input[name="pass"]'),
        spanText = window.document.querySelector('span.resp');

        spanText.innerHTML = "";

        let respText = await jsonRequest('./api/auth/create', {username: userbox?.value, password: passbox?.value}, 'POST');

        let _json;
    
        if(respText == undefined || respText instanceof Error || (_json = JSON.parse(respText))?.status == 'err' || _json?.status != 'ok') {
            userbox.value = "";
            passbox.value = "";
            spanText.innerHTML = _json.message;
            console.error(_json.message);
            return;
        }

    alert('User created successfully. You can now log in!');

    userbox.value = "";
    passbox.value = "";
}

async function new_message(author, message, _id) {
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
    messageObj.setAttribute('data-id', _id);
    container.appendChild(messageObj);

    if(container.children.length > MAX_MESSAGE_RENDER) {
        while(container.children.length > MAX_MESSAGE_RENDER)
            container.removeChild(window.document.querySelectorAll('div.message')[0]);
    }

    container.scrollTo(0, container.scrollHeight);
}

async function update_messages() {
    if(notnullish(window.localStorage.getItem('jwt'))) {
        let respText = await jsonRequest('./api/update', {uid: window.localStorage.getItem('jwt')}, 'POST');

        let _json;
    
        if(respText == undefined || respText instanceof Error || (_json = JSON.parse(respText))?.status == 'err' || _json?.status != 'ok') {
            spanText.innerHTML = _json.message;
            console.error(_json.message);
            window.localStorage.setItem('jwt', '');
            alert('Failed to validate JWT. You have been logged out.');
            return;
        }
    
        if(_json?.messages instanceof Array) {
            document.querySelector('section.chatroom-messages').innerHTML = '';
            for(let message of _json.messages) {
                new_message(JSON.parse(message.user)?.uid, message.message, message.timestamp);
            }
        }
    }
}

window.setInterval(update_messages, 2000);

!function () {

    if(notnullish(window.localStorage.getItem('jwt'))) {
        // Display the default page
        displayFromId('chatroom');
    } else displayFromId('landing');

}();
