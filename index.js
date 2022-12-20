const config = require("./config.json")
const Tail = require('tail').Tail;
const webhookR = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// don't watch that
var access_log = config.accesslog;
var webhook = config.webhook;

const accesslogtunnel = new Tail(access_log);


console.log("Access.log path: "+access_log)
console.log("Webhook URL: "+webhook)
console.log("\n\n\n\n\n")
console.log("Let's start the 'HARD' script.\n\n")


accesslogtunnel.on('line', (line) => {
    console.log(line)
    
    
    var params = {
        username: "Access.log",
        embeds: [
            {
                "description": line
                                    .replace("GET", "\n**GET**")
                                    .replace("POST", "\n**POST**")
                                    .replace("PATCH", "\n**PATCH**")
                                    .replace("DELETE", "\n**DELETE**")
                                    .replace("PUT", "\n**PUT**")
                                    .replace("[", "\n**[")
                                    .replace("]", "]**")
                                    .replace('"', "")
                                    .replace("HEAD", "\n**HEAD**")
                                    .replace("OPTIONS", "\n**OPTIONS**"),
                "color": 15258703

            }
        ]
    }

    webhookR(webhook, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(params)
    })

});


accesslogtunnel.on('close', () => {
    console.log(Logs.error('Error.'));
});

accesslogtunnel.on('error', () => {
    console.log(Logs.error('File not found (access.log)'));
});

accesslogtunnel.watch();














