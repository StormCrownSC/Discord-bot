const Discord = require('discord.js');
global.Discord = Discord;
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require('fs');
global.fs = fs;
//const search = require('tubesearch');
const ffmpeg = require('ffmpeg');
const ytdl = require('ytdl-core');
global.ytdl = ytdl;
const search = require('yt-search');
global.search = search;
global.bot = bot;
let config = require('./config.json');
const { startsWith } = require('ffmpeg-static');
let token = config.token;
let prefix = config.prefix;
global.prefix = prefix;
let ownerID = config.ownerID;
global.ownerID = ownerID;
let botID = config.botID;
global.botID = botID;




try{

  fs.readdir('./cmds/',(err,files)=>{
    if(err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0 ) console.log("Нет команд для загрузки!");
  
    if(jsfiles.length > 10 && jsfiles.length < 20){
      console.log(`Загружено ${jsfiles.length} команд`);
    }
    else{
      if(jsfiles.length % 10 == 1)
        console.log(`Загружено ${jsfiles.length} команда`); 
      if(jsfiles.length % 10 == 2 || jsfiles.length % 10 == 3 || jsfiles.length % 10 == 4)
        console.log(`Загружено ${jsfiles.length} команды`);
      if(jsfiles.length % 10 == 0 || jsfiles.length % 10 == 5 || jsfiles.length % 10 == 6 || jsfiles.length % 10 == 7 || jsfiles.length % 10 == 8 || jsfiles.length % 10 == 9 )
        console.log(`Загружено ${jsfiles.length} команд`);
    }
  
    jsfiles.forEach((f, i) =>{
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1 }.${f} загружен!`);
    });
  })
  var contact = require('./cmds/contact');  
  var stats = require('./cmds/stats');  
  var warns = require('./cmds/warns');  
  var musik = require('./cmds/musik');  


  ///////////////////////////////////////////////////////////// Запуск бота ////////////////////////////////////////////////////////////////
  
  bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}!`);
    bot.user.setStatus('Online')
    bot.user.setActivity("музыку", {
      type: "LISTENING",
    });
    bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
    console.log(link);            //Это ссылка приглашение!
    })
  });
  /*
  var alpha  = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  global.alpha = alpha;
  
  var num  = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  global.num = num;
  */

  //////////////////////////////////////////////////////////// Главная часть /////////////////////////////////////////////////////////////////////////


  bot.on(`message`, (message, guild) => { 
    if (message.author.bot) return;
    if(message.channel.type == "dm") return;

    let servName = message.name; 
    let servId = message.guild.id;
    global.servId = servId;


    let profile = require('./servers/' + servId + '/profile.json');
    let musik_list = require('./servers/' + servId + '/musikList.json');
    global.musik_list = musik_list;
    let musik_search = require('./servers/' + servId + '/searchMusik.json');
    global.musik_search = musik_search;
    let server = require('./servers.json');
    global.server = server;
    
    let user = message.author.username;
    let userid = message.author.id;

    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    
    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot,message,args);

    let arg1 = message.content.split(' ').slice(0,1);
    let arg2 = message.content.split(' ').slice(1,2);
    let arg3 = message.content.split(' ').slice(2,3);
    let arg4 = message.content.split(' ').slice(3,4);
    let arg5 = message.content.split(' ').slice(4,5);


    contact.lvl_stat(profile, servId, userid, message);
    contact.server_news(servId, servName, server, message, guild);
    let playNow = server[servId]['playNow'];
    global.playNow = playNow;
    let repeatlist = server[servId]['repeatlist'];
    let repeatsong = server[servId]['repeatsong'];
    global.repeatlist = repeatlist;
    global.repeatsong = repeatsong;

    const msg = message.content.toLowerCase();
    switch (true) {
//////////////////////////////////////////////////////// ОБЩЕЕ /////////////////////////////////////////////////////////////////////////
      case !msg.startsWith(prefix): 
        return;
      case msg.startsWith(`${prefix}аватар`):
        message.channel.send(message.author.displayAvatarURL())
      break;
      case msg.startsWith(`${prefix}помощь`):
      case msg.startsWith(`${prefix}help`):
        contact.help(message);
      break;
      case msg.startsWith(`${prefix}монетка`):
        contact.money(message);
      break;
      case msg.startsWith(`${prefix}удалить`):
        contact.delite(message);
      break;
      case msg.startsWith(`${prefix}напиши`):
        contact.say(message);
      break;
      case msg.startsWith(`${prefix}статистика`):
        stats.stat(message, arg2, profile);    
      break;
/////////////////////////////////////////////////////////// БАНЫ ////////////////////////////////////////////////////////////////////
      case msg.startsWith(`${prefix}предупреждение`):
        warns.warning(message, profile, arg2);
      break;
      case msg.startsWith(`${prefix}снять предупреждение с`):
        warns.unwarning(message, profile, arg4);
      break;
      case msg.startsWith(`${prefix}выгнать`):
        warns.kick(message, profile, arg2, userid);
      break;
      case msg.startsWith(`${prefix}забанить`):
        warns.ban(message, profile, arg2, userid)
      break;
      case msg.startsWith(`${prefix}мут`):
        warns.mute(message, profile, arg2);
      break;
      case msg.startsWith(`${prefix}снять мут с`):
        warns.unmute(message, profile, arg4, userid);
      break;
/////////////////////////////////////////////////////////////// МУЗЫКА ////////////////////////////////////////////////////////////////
      case msg.startsWith(`${prefix}зайди`):
      case msg.startsWith(`${prefix}join`):
        musik.join(message);
      break;
      case msg.startsWith(`${prefix}выйди`):
      case msg.startsWith(`${prefix}leave`):
        musik.leave(message);
      break;
      case msg.startsWith(`${prefix}найди`):
      case msg.startsWith(`${prefix}search`):
        musik.search(message, servId);
      break;
      case msg.startsWith(`${prefix}1`):
      case msg.startsWith(`${prefix}2`):
      case msg.startsWith(`${prefix}3`):
      case msg.startsWith(`${prefix}4`):
      case msg.startsWith(`${prefix}5`):
        musik.take_musik(message, servId);
      break;
      case msg.startsWith(`${prefix}пуск`):
      case msg.startsWith(`${prefix}play`):
        musik.play(message, servId);
      break;
      case msg.startsWith(`${prefix}пропустить`):
      case msg.startsWith(`${prefix}skip`):
        musik.skip_musik(message, servId);
      break;
      case msg.startsWith(`${prefix}очистить список`):
      case msg.startsWith(`${prefix}clear`):
        musik.clear(message, servId);
      break;
      case msg.startsWith(`${prefix}повтор списка`):
      case msg.startsWith(`${prefix}list repeat`):
        musik.list_repeat(message);
      break;
      case msg.startsWith(`${prefix}отключить повтор списка`):
      case msg.startsWith(`${prefix}disable list repeat`):
        musik.disable_list_repeat(message);
      break;
      case msg.startsWith(`${prefix}повтор песни`):
      case msg.startsWith(`${prefix}repeat`):
        musik.repeat(message);
      break;
      case msg.startsWith(`${prefix}отключить повтор песни`):
      case msg.startsWith(`${prefix}disable repeat`):
        musik.disable_repeat(message);
      break;
      case msg.startsWith(`${prefix}пауза`):
      case msg.startsWith(`${prefix}pause`):
        musik.pause(message);
      break;
      case msg.startsWith(`${prefix}продолжить`):
      case msg.startsWith(`${prefix}resume`):
        musik.resume(message);
      break;
      case msg.startsWith(`${prefix}список песен`):
      case msg.startsWith(`${prefix}musiklist`):
        musik.list_of_songs(message, servId);
      break;
      default:
        message.channel.send('К сожалению такой программы не существует! Воспользуйся функцией "help/помощь", чтобы узнать актуальные команды!')
      break;
    }
    fs.writeFile('./servers/' + servId + '/profile.json', JSON.stringify(profile), (err)=>{
      if(err) console.log(err);
    })

  })

  ////////////////////////////////////////////////////// Новый участник //////////////////////////////////////////////////////////////////
  bot.on('guildMemberAdd', (member, guild) => {
    let servId = member.guild.id;
    let profile = require('./servers/' + servId + '/profile.json');
    newid = member.id;
    //member.guild.channels.cache.get('749958867940540456').send('Встречайте пользователя <@' + newid + '>!'); 
    if(!profile[newid]){
        profile[newid] = {
          name: member.name,
          id: newid,
          coins: 0, 
          warns: 0,
          ban: 0,
          xp: 0,
          lvl: 0,
          avatar: member.user.displayAvatarURL()
        }
    }
    else if(profile[newid]['ban'] === 1){
        let role = member.guild.roles.cache.find(r => r.name === "Banned");
        member.roles.add(role)
        member.guild.channels.cache.get('734051804656042026').send('Пользователь <@' + newid + '> покинул сервер получив мут, ему выдан мут заново!'); 
    }     
    fs.writeFile('./servers/' + servId + '/profile.json', JSON.stringify(profile), (err)=>{
      if(err) console.log(err);
    })
})


//////////////////////////////////////////////////////// Новый сервер //////////////////////////////////////////////////////////////////////////

bot.on("guildCreate", (message, guild) => {
  let servId = message.id;
  let servName = message.name;
  let server = require('./servers.json');
  let data = {};
  fs.mkdir('./servers/' + servId, function() {
      fs.open('./servers/'+ servId + '/profile.json', 'w', function (err) {   
      })
      fs.open('./servers/'+ servId + '/musikList.json', 'w', function (err) {          
      })
      fs.open('./servers/' + servId + '/searchMusik.json', 'w', function (err) {   
      })
  })
  fs.writeFile('./servers/'+ servId + '/profile.json', JSON.stringify(data), (err)=>{
      if(err) console.log(err);
  });
  fs.writeFile('./servers/'+ servId + '/musikList.json', JSON.stringify(data), (err)=>{
      if(err) console.log(err);
  });
  fs.writeFile('./servers/' + servId + '/searchMusik.json', JSON.stringify(data), (err)=>{
    if(err) console.log(err);
});
  contact.server_news(servId, servName, server, message, guild);
  
})




}
catch{
  console.log('er');
}

bot.login(token);
