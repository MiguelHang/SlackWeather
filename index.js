import './keys';
const slackBot = require('slackBots');
const axios = require('axios');

const bot = new slackBot({
    token: APP_TOKEN,
    name: 'weatherBot'
});

const APIWeather = WEATHER_API;

bot.on('start', () => {
    const params = {
        icon_emoji: ':mostly_sunny:'
    }

    bot.postMessageToChannel(
        'general',
        'I´m ready!',
        params
    );
});

bot.on('error', err => console.log('fail'));

bot.on('message', data => {
    if(data.type !== 'message' || !data.text.includes( bot.self.id)){
        return
    }

   handleMessage(data.text);
});


function handleMessage(message) {

    axios.get('http://api.openweathermap.org/data/2.5/weather?q=' + message.replace('<@'+bot.self.id+'>', '') + '&APPID=' + APIWeather)

    .then((response)=>{
        const resp = response;
        
        const params = {
            icon_emoji: ''
        }
        bot.postMessageToChannel(
            'general',
            resp.data.name +", "+ resp.data.sys.country + ": " +resp.data.weather[0].description,
            params
        );
        
    })
    .catch((err) => {
        // console.log(err.response.data);
        bot.postMessageToChannel(
            'general',
            err.response.data.message,
            params
        );
    })
        
}