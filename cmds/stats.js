const Discord = require('discord.js');
try{
    module.exports = {
        stat: function (message, arg2, profile){
            arg2 = arg2.toString().replace(/</, "");
            arg2 = arg2.toString().replace(/!/, "");
            arg2 = arg2.toString().replace(/&/, "");
            arg2 = arg2.toString().replace(/@/, "");
            arg2 = arg2.toString().replace(/>/, "");
            otherid = arg2;
            const args = message.content.split(' ').slice(1); 
            const amount = args.join(' '); 
            if (!amount) 
                otherid = message.author.id;

            if(otherid == botID){
                const stat = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Статистика Wraith')
                .addFields(
                    {name: 'Уровень: ', value: '♾️'},
                    {name: 'Опыт: ', value: '♾️'},
                    {name: 'Монеты: ', value:  '♾️'},
                )                                                   
                message.reply(stat);
            }                                                               
            else if(!profile[`${otherid}`] && otherid != botID){
                message.channel.send('К сожалению, статистика этого пользователя отсутствует!')
            }
            else if(profile[`${otherid}`]){
                const stat = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Статистика ' + profile[`${otherid}`]['name'])
                .addFields(
                    {name: 'Уровень: ', value: profile[`${otherid}`]['lvl']},
                    {name: 'Опыт: ', value: profile[`${otherid}`]['xp']},
                    {name: 'Монеты: ', value:  profile[`${otherid}`]['coins']},
                    {name: 'Предупреждения: ', value: profile[`${otherid}`]['warns']}
                )
                .setThumbnail(profile[`${otherid}`]['avatar'])
                message.reply(stat);
                
            }
        },
        
    }
}
catch{
    console.log(error);
}