try{
  module.exports = {
    help: function (message) {
      const help = `
          \nМузыка:
            _!Зайди/join - бот присоединяется к голосовому каналу_
            _!Выйди/leave - бот отключается от голосового канала_
            _!Найди/search (название) - ищет указанную песню_
            _!Пуск/play - включает проигрывание мызуки_
            _!Пропустить/skip - переходит к следующему треку_
            _!Повтор песни/repeat - повтор играющей песни_
            _!Повтор списка/list repeat - повтор всех песен, которые находятся в очереди_
            _!Отключить повтор песни/disable list repeat - отключает повтор песени_
            _!Отключить повтор списка/disable repeat - отключает повтор списка песен_
            _!Очистить список/clean - удаляет из очереди все найденные песни_
            _!Список песен/musiklist - выводит список песен в очереди_
          \nВыдача ограничений:
            _!Выгнать - выгоняет пользователя с сервера_
            _!Забанить - банит пользователя на сервере и выгоняет его_
            _!Предупреждение - выдаёт предупреждение пользователю(после получения трёх предупреждений пользователь будет выгнан)_
            _!Снять предупреждение - снимает предупреждение с пользователя_
            _!Мут - Лишает пользователя права отправлять сообщения и присоединяться к голосовому чату_
            _!Снять мут с(упомянуть пользователя) - возвращает пользователю все права_
          \nПрочее:
            _!help/помощь - список команд_
            _!Статистика(можно упомянуть пользователя) - статистика пользователя, зависит от колличества сообщений_
            _!Mонетка - подбрасывает монетку_
            _!Удалить(колличество(не более 50)) - удаляет определённое колличество сообщений_
            _!Аватар - отправляет аватар автора_
          `

        message.channel.send('Список команд:'+ help, {
        parse_mode: 'Markdown'
        })
        // _ВРЕМЕННО НЕ РАБОТАЕТ - !Пауза/pause - останавливает проигрывание песни_
        // _ВРЕМЕННО НЕ РАБОТАЕТ - !Продолжить/resume - продолжает проигрывание песни после паузы_
        // _ВРЕМЕННО НЕ РАБОТАЕТ - !Исключить/exclude (номер песни в очереди) - удаляет из списка определённую песню_
    },
    money: function (message) {
      var random = Math.floor(Math.random() * 22);
      if (random == 2 || random == 3 || random == 4 || random == 5 || random == 6 || random == 7 || random == 8 || random == 9 || random == 10 || random == 11) 
        message.channel.send(':full_moon: Орёл!')
      else if (random == 12 || random == 13 || random == 14 || random == 15 || random == 16 || random == 17 || random == 18 || random == 19 || random == 20 || random == 21) 
        message.channel.send(':new_moon: Решка!')
      else if (random == 1)  
        message.channel.send(':last_quarter_moon: Монета упала ребром!')
    },
    delite: function (message) {
      const arggs = message.content.split(' ').slice(1); 
        const amount = Number(arggs.join(' '));
         
        if (!amount) 
          return message.channel.send('Вы не указали сколько сообщений нужно удалить!'); 

        if (isNaN(amount))  
          return message.channel.send('Это не число!'); 

        if (amount >= 100) 
          return message.channel.send('Вы не можете удалить 100 сообщений за раз'); 

        if (amount < 1) 
          return message.channel.send('Вы должны ввести число больше чем 1'); 

        async function delete_messages() { 

          await message.channel.messages.fetch({ limit: Number(amount)}).then(messages => {

            message.channel.bulkDelete(messages)
            if(amount > 10 && amount < 20){
              message.channel.send(`Удалено ${amount} сообщений!`)
            }
            else{
            if(amount % 10 == 1)
              message.channel.send(`Удалено ${amount} сообщение!`); 
            if(amount % 10 == 2 || amount % 10 == 3 || amount % 10 == 4)
              message.channel.send(`Удалено ${amount} сообщения!`)
            if(amount % 10 == 0 || amount % 10 == 5 || amount % 10 == 6 || amount % 10 == 7 || amount % 10 == 8 || amount % 10 == 9 )
              message.channel.send(`Удалено ${amount} сообщений!`)
            }
          })
        };
        delete_messages(); 
    },
    say: function (message) {
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      let text = args.join(" ");
      message.delete().catch(err => console.log(err));
      message.channel.send(text);
    },
    lvl_stat: function (profile, servId, userid, message){  
      bot.send = function(message){
        message.channel.send(message);
      }
    
      if(!profile[userid]){
          profile[userid] = {
            name: message.author.username,
            id: message.author.id,
            coins: 0, 
            warns: 0,
            ban: 0,
            xp: 0,
            lvl: 0,
            avatar: message.author.displayAvatarURL()
          };
      }
      let u = profile[userid];
      u.coins++;
      u.xp++;
      if(u.xp>= (u.lvl*5)){
          u.xp = 0;
          u.lvl++;
      }
    
    
      fs.writeFile('./servers/' + servId + '/profile.json', JSON.stringify(profile), (err)=>{
        if(err) console.log(err);
      });
    },
    server_news: function (servId, servName, server, message, guild) {
      if(server[servId]) return;
      if(!server[servId]){
          server[servId] = {
              name: servName,
              id: servId,
              mainInf: 0,
              news: 0,
              que: 0,
              playNow: 1,
              repeatlist: 0,
              repeatsong: 0,
          };
      };
      
      let s = server[servId];
      if(s.mainInf== 0){
      s.mainInf++;
      const news = `
    \nПривет!\nЗдесь я кратко опишу свои функции!
    _1 - Я реагирую на команды, если вы в начале сообщения используете префикс "!" Пример: !помощь_
    _2 - Чтобы увидеть список моих команд, напишите: !помощь (или !help)_
    _3 - Это сообщение больше не появится, не волнуйтесь :D_
    \nВот и всё, остальное будет написано в списке команд! Удачи!
      `
  
      /*message.channel.send(news, {
        parse_mode: 'Markdown'
      });
      guild.channels.find(`name`,`welcome`).send(news, {
        parse_mode: 'Markdown'
      })*/
      }
      fs.writeFile('./servers.json', JSON.stringify(server), (err)=>{
        if(err) console.log(err);
      })
    
    }
  };

}
catch{
  console.log(error);
}

