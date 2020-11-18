try{
    module.exports = {

        warning: function (message, profile, arg2) { 
            if(!arg2) 
                return (message.reply("вы не указали пользователя!"));

            if(!message.member.hasPermission("KICK_MEMBERS")) 
                return message.channel.send("У вас нет прав, чтобы выдавать предупреждения");
            else{
                arg2 = arg2.toString().replace(/</, "");
                arg2 = arg2.toString().replace(/!/, "");
                arg2 = arg2.toString().replace(/&/, "");
                arg2 = arg2.toString().replace(/@/, "");
                arg2 = arg2.toString().replace(/>/, "");
                otherid = arg2;
                if(!profile[otherid])
                    message.channel.send('Пользователя нет в списке! Видимо он ни разу не писал сообщения в чат(');
                else{
                    let u = profile[otherid];
                    member = message.mentions.members.first();
                    if(member.hasPermission("ADMINISTRATOR")) 
                        return message.channel.send("Нельзя выдавать предупреждения админам!");

                    u.warns++;
                    message.channel.send('Предупреждение выдано пользователю <@' + otherid + '>!\nКоличество предупреждений: ' + u.warns);

                    if(u.warns >= 3) {
                        member.ban().catch(err => console.log(err));
                        member.kick().catch(err => constole.log(err));
                        message.channel.send('Пользователь <@' + otherid +  '> выгнан после получения трёх предупреждений!')
                    }
                }
            }
        },

        unwarning: function (message, profile, arg4){ 
            if(!arg4) 
                return (message.reply("вы не указали пользователя!"));

            if(!message.member.hasPermission("KICK_MEMBERS")) 
                return message.channel.send("У вас нет прав, чтобы снимать предупреждения");
            else{
                arg4 = arg4.toString().replace(/</, "");
                arg4 = arg4.toString().replace(/!/, "");
                arg4 = arg4.toString().replace(/&/, "");
                arg4 = arg4.toString().replace(/@/, "");
                arg4 = arg4.toString().replace(/>/, "");
                otherid = arg4;
                if(!profile[otherid])
                    message.channel.send('Пользователя нет в списке! Видимо он ни разу не писал сообщения в чат(');
                else{
                    let u = profile[otherid];
                    member = message.mentions.members.first();
                    if(member.hasPermission("ADMINISTRATOR")) 
                        return message.channel.send("Нельзя снимать предупреждения с админов!");

                    if(u.warns > 0){
                        u.warns--;
                        message.channel.send('Предупреждение было снято с пользователя <@' + otherid + '>!\nКоличество предупреждений: ' + u.warns);
                    }
                    else
                        message.channel.send('У пользователя <@' + otherid + '> нет предупреждений!')
                }   
            }
        },
        kick: function (message, profile, arg2, userid){ 
            if(!arg2) 
                return (message.reply("вы не указали пользователя!"));

            if(!message.member.hasPermission("KICK_MEMBERS")) 
                return message.channel.send("У вас нет прав выгонять пользователей");
            else{
                arg2 = arg2.toString().replace(/</, "");
                arg2 = arg2.toString().replace(/!/, "");
                arg2 = arg2.toString().replace(/&/, "");
                arg2 = arg2.toString().replace(/@/, "");
                arg2 = arg2.toString().replace(/>/, "");
                otherid = arg2;
                if(!profile[otherid])
                    message.channel.send('Пользователя нет в списке! Видимо он ни разу не писал сообщения в чат(');
                else{
                    member = message.mentions.members.first();
                    if(member.hasPermission("ADMINISTRATOR")) 
                        return message.channel.send("Нельзя выгонять админов!");

                    member.kick().catch(err => constole.log(err));
                    message.channel.send('Пользователь <@' + otherid +  '> был выгнан с сервера по решению админа <@' + userid + '>!')
                }
            }
        },
        ban: function (message, profile, arg2, userid){  
            if(!arg2) 
                return (message.reply("вы не указали пользователя!"));

            if(!message.member.hasPermission("BAN_MEMBERS")) 
                return message.channel.send("У вас нет прав банить пользователей");
            else{
                arg2 = arg2.toString().replace(/</, "");
                arg2 = arg2.toString().replace(/!/, "");
                arg2 = arg2.toString().replace(/&/, "");
                arg2 = arg2.toString().replace(/@/, "");
                arg2 = arg2.toString().replace(/>/, "");
                otherid = arg2;
                if(!profile[otherid])
                    message.channel.send('Пользователя нет в списке! Видимо он ни разу не писал сообщения в чат(');
                else{
                    member = message.mentions.members.first();   
                    if(member.hasPermission("ADMINISTRATOR")) 
                        return message.channel.send("Нельзя банить админов!");

                    member.ban().catch(err => console.log(err));
                    message.channel.send('Пользователь <@' + otherid +  '> забанен на сервере по решению админа <@' + userid + '>!')
                }
            }
        },
        mute: function (message, profile, arg2){ 
            if(!arg2) 
                return (message.reply("вы не указали пользователя!"));
            if(!message.member.hasPermission("MANAGE_ROLES")) 
                return message.channel.send("У вас нет прав, чтобы выдавать мут");
            else{
                let arg2 = message.content.split(' ').slice(1, 2);
                arg2 = arg2.toString().replace(/</, "");
                arg2 = arg2.toString().replace(/!/, "");
                arg2 = arg2.toString().replace(/&/, "");
                arg2 = arg2.toString().replace(/@/, "");
                arg2 = arg2.toString().replace(/>/, "");
                otherid = arg2;
                if(!profile[otherid])
                    message.channel.send('Пользователя нет в списке! Видимо он ни разу не писал сообщения в чат(');
                else{
                    member = message.mentions.members.first();
                    if(member.hasPermission("ADMINISTRATOR")) 
                        return message.channel.send("Нельзя мутить админов!");
                    let role = message.guild.roles.cache.find(r => r.name === "Banned");
                    member.roles.add(role)
                
                }
            }
        },
        unmute: function (message, profile, arg4, userid){           
            if(!arg4) 
                return (message.reply("вы не указали пользователя!"));
            if(!message.member.hasPermission("MANAGE_ROLES")) 
                return message.channel.send("У вас нет прав, чтобы снимать мут");
            else{
                arg4 = arg4.toString().replace(/</, "");
                arg4 = arg4.toString().replace(/!/, "");
                arg4 = arg4.toString().replace(/&/, "");
                arg4 = arg4.toString().replace(/@/, "");
                arg4 = arg4.toString().replace(/>/, "");
                otherid = arg4;
                if(!profile[otherid])
                    message.channel.send('Пользователя нет в списке! Видимо он ни разу не писал сообщения в чат(');
                else{
                let u = profile[otherid];
                member = message.mentions.members.first();
                if(member.hasPermission("ADMINISTRATOR")) 
                    return message.channel.send("Нельзя снимать мут с админов!");
                let role = message.guild.roles.cache.find(r => r.name === "Banned");
                member.roles.remove(role).catch(console.error); 
                u.ban = 0;
                message.channel.send('С пользователя <@' + otherid +  '> был снят мут, по - решению админа <@' + userid + '>');
                }
            }
        },   
    }
    

}
catch{
    message.channel.send("Произошла ошибка, попробуйте снова!")
}
