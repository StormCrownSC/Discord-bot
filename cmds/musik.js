var dispatcher;

module.exports = {
    join: function (message) {
        if (message.member.voice.channel) {									
            const connection = message.member.voice.channel.join();	
        } 																		
        else {																
            message.reply('зайди в голосовой чат!');						
        }	
    },
    leave: function (message) {
        if (message.member.voice.channel) {									
            const connection = message.member.voice.channel.leave();	
        } 																		
        else {																
            message.reply('Я и так не в голосовом чате!');						
        }
    },
    search: function (message, servId) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        let songName = args.join(" ");
        global.songName = songName;
        
        findSong(songName, message, servId);
    },
    take_musik: function (message, servId){								
        let arggs = message.content.split(' ').slice(0, 1);
        arggs = arggs.toString().replace(/!/, "");
        num = arggs;
        giveSong(num, songName, servId, message);
    },
    play: function (message, servId){
        if (message.member.voice.channel) {									
            play(message, servId)
        } 																		
        else {																
            message.reply('зайди в голосовой чат!');						
        }
    },
    skip_musik: function (message, servId){
        skip(message, servId);
        play(message, servId);
    },
    clear: function (message, servId){
        let q = server[servId]['que'];
        if (q == 1){
            message.channel.send('Очередь пуста!');
            return;
        }
        data = {};
        server[servId]['que'] = 1;
        fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
        if(err) console.log(err);
        });
        fs.writeFile('./servers/'+ servId + '/musikList.json', JSON.stringify(data), (err)=>{
            if(err) console.log(err);
        });
    },
    list_repeat: function (message){
        server[servId]['repeatlist'] = 1;
        message.channel.send('Включён повтор списка');
        fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
            if(err) console.log(err);
        });
    },
    disable_list_repeat: function (message){
        server[servId]['repeatlist'] = 0;				
        message.channel.send('Отключён повтор списка');
        fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
            if(err) console.log(err);
        });
    },
    repeat: function (message){
        server[servId]['repeatsong'] = 1;	
        message.channel.send('Включён повтор песни');
        fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
            if(err) console.log(err);
        });
    },
    disable_repeat: function (message){
        server[servId]['repeatsong'] = 0;	
        fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
            if(err) console.log(err);
        });
        message.channel.send('Отключён повтор песни');
    },
    pause: function (message){
        if (message.member.voice.channel) {									
            dispatcher.pause();
            message.reply("Поставила на паузу!")
        } 																		
        else {																
            message.reply('зайди в голосовой чат!');						
        }	
    },
    resume: function (message){
        if (message.member.voice.channel) {									
            dispatcher.resume();
            message.reply("Включаю проигрывание песни!")
        } 																		
        else {																
            message.reply('зайди в голосовой чат!');						
        }	
    },
    list_of_songs: function (message, servId){
            let q = server[servId]['que'];
            if (q == 0){
                message.channel.send('Очередь пуста!');
                return;
            }
            
            var musikList = ' ';
            for(let i = 1; i <= q; ++i){
                let index = i;
                musikList = musikList + '\n' + index + ` - ${musik_list[i]['title']}`
            }
            message.channel.send(musikList); 
    },

}

			
/////////////////////////////////////////////////////// ЛОКАЛЬНЫЕ ФУНКЦИИ /////////////////////////////////////////////////////////////


function findSong(songName, message, servId) {
    search(songName).then(function(results) {
        if (!results['videos'][0]) {
            message.channel.send('Я такое не нашла.')
            return
        }
        for(let i = 1; i <= 5; ++i){
            musik_search[i] = {
                url: results['videos'][i - 1].url,
                
                title: results['videos'][i - 1].title,
                timestamp: results['videos'][i - 1].timestamp,
                image: results['videos'][i - 1].image,
            }
        }
        fs.writeFile('./servers/' + servId + '/searchMusik.json', JSON.stringify(musik_search), (err)=>{
            if(err) console.log(err);
        });
        const help = `
1 - ${results['videos'][0].title} 
2 - ${results['videos'][1].title}
3 - ${results['videos'][2].title}
4 - ${results['videos'][3].title}
5 - ${results['videos'][4].title}
            `
            message.channel.send('Я нашла! Напишите цифру, чтобы я выбрала трек! Если нужного варианта нет, повтори поиск!'+ help, {
            parse_mode: 'Markdown'
            })
        })
        
}

function giveSong(num, songName, servId, message){
    let q = server[servId]['que'];
    ++q;
    musik_list[q] = {
        url: musik_search[num].url,
        title: musik_search[num].title,
        timestamp: musik_search[num].timestamp,
        image: musik_search[num].image,
    }
    
    const song = new Discord.MessageEmbed()
    .setColor('#d10909')
    .addFields(
        {name: 'Название: ', value: `${musik_search[q].title}`},
        {name: 'Длительность: ', value: `${musik_search[num].timestamp}`},
        {name: 'Позиция в очереди: ', value:  `${q}`}
    )
    .setThumbnail(`${musik_search[num].image}`)
    
    message.channel.send('Ставлю в очередь!', song);
    server[servId]['que'] = q;
    
    fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
        if(err) console.log(err);
    });
    fs.writeFile('./servers/' + servId + '/musikList.json', JSON.stringify(musik_list), (err)=>{
        if(err) console.log(err);
    });

    
}


async function play(message, servId) {
    let q = server[servId]['que'];
    if (q == 0){
        message.channel.send('Очередь пуста!');
        return;
    }
    if ((playNow > q) && repeatlist != 1) {
        message.channel.send('Очередь воспроизведения закончилась!');
        return;
    }
    const streamOptions = { seek: 0, volume: 1.0 }; 
    var voiceChannel = message.member.voice.channel;
    voiceChannel.join().then(connection => { 
        if ((playNow > q) && repeatlist != 1) {
            return;
        }	
        if(playNow > q && repeatlist == 1){
            playNow = 0;
        }
        const stream = ytdl(musik_list[playNow]['url']); 
        dispatcher = connection.play(stream, streamOptions);
        const song = new Discord.MessageEmbed()
        .setColor('#ccd813')
        .addFields(
            {name: 'Название: ', value: `${musik_list[playNow].title}`},
            {name: 'Длительность: ', value: `${musik_list[playNow].timestamp}`}
        )
        .setThumbnail(`${musik_list[playNow].image}`)
    
        message.channel.send('Сейчас играет!',song);
        dispatcher.on('finish', finish => { 
            playNow++;
            if(playNow > q && repeatlist == 1){
                playNow = 0;
            }
            if(repeatsong == 1){
                playNow--;
            }
            play(message);
        });
         
    }).catch(err => console.log(err)); 
    fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
        if(err) console.log(err);
    });
    
}

function skip(message, servId) {
    let q = server[servId]['que'];
    playNow++;
    if ((playNow >= q) && repeatlist != 1) {
        return;
    }	
    if(playNow >= q && repeatlist == 1){
        playNow = 0;
    }
    fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
        if(err) console.log(err);
    });						
}

/*
        
        else if (message.content.toLowerCase().startsWith(`${prefix}исключить`) || message.content.toLowerCase().startsWith(`${prefix}exclude`)) {						
            if (message.member.voice.channel) {	
                var argsSong = message.content.split(' ').slice(1);
                songNum	= Number(argsSong)
                songNum--;
                if(!queue[songNum]){
                    message.channel.send('В очереди нет трека под номером ' + argsSong + '!')
                    return;
                    
                }
                
                queue.splice(songNum, 1)
                message.channel.send('Исключён ' + argsSong + ' трек в очереди!')
                if(songNum == playNow){
                    skip(message)
                }
            } 																		
            else {																
                message.reply('зайди в голосовой чат!');						
            }																	
        }
        
        
        
*/
