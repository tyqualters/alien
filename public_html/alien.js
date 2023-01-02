function displayFromId(id) {
    window.document.querySelector('main').innerHTML = 
        window.document.getElementById(id).innerHTML;
}

!function() {
    function xHttpRequest(url, timeout_duration_sec) {
        timeout_duration_sec = Number(timeout_duration_sec);

        let timeout_duration_ms = timeout_duration_sec != NaN ? Math.round(timeout_duration_sec * 1_000) : 10_000;

        return new Promise((res, rej) => {
            var xmlHttp = new XMLHttpRequest();
            
            const xmlHttpTimeout = setTimeout(() => {
                if(xmlHttp?.status != 200 && xmlHttp?.readyState != xmlHttp?.DONE) {
                    xmlHttp?.abort();
                    rej(`xmlHttp timed out (${timeout_duration_ms / 1_000}s)`);
                }
                else console.log('xmlHttp abort superseded');
            }, timeout_duration_sec);

            xmlHttp.onreadystatechange = () => {
                if(xmlHttp?.status == 200 && xmlHttp.readyState == xmlHttp?.DONE) {
                    console.log('xmlHttp acquired resource');
                    clearTimeout(xmlHttpTimeout);
                    res(xmlHttp.responseText, xmlHttp.responseType);
                }
            };

            xmlHttp.open('GET', url);
            xmlHttp.send();
        });
    }

    // Display the default page
    displayFromId('landing');

}();
