// Discord
const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, StringSelectMenuBuilder, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");
// İNTENTS
const client = new Client({ intents: Object.values(GatewayIntentBits), shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const config = require("./config.json");
//Database\\
const db = require("croxydb")

//Slash Commands Register\\

global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    if(props.type == 2 || props.type == 3) {
        client.commands.push({
                name: props.name.toLowerCase(),
                type: props.type
        })
        
        } else {
        client.commands.push({
                name: props.name.toLowerCase(),
                description: props.description,
                options: props.options,
                dm_permission: false,
                type: props.type || 1
            });
        }

    console.log(`[Command] ${props.name} komutu yüklendi.`)

});

readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(TOKEN)

process.on("unhandledRejection", (reason, p) => {
    console.log(" [Error] :: Unhandled Rejection/Catch");
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(" [Error] :: Uncaught Exception/Catch");
    console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(" [Error] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
});

//Oyun içi destek\\

client.on("interactionCreate", async interaction => {
  try {
      if (interaction.values == 'ic') {
          const now = new Date();
          const timeString = now.toLocaleTimeString();
          const günler = now.toLocaleDateString();

          const channel = await interaction.guild.channels.create({
              name: `ticket-${interaction.user.username}`,
              type: Discord.ChannelType.GuildText,
              parent: config.TİCKETKATEGORİ,
              topic: `Hey ${interaction.user.username} Başarılı şekilde Oyun İçi Destek konusu ile destek talebi oluşturdun`,
              permissionOverwrites: [
                  {
                      id: interaction.guild.id,
                      deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: interaction.user.id,
                      allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: config.TİCKETYETKİLİ,
                      allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                  },
              ],
          });

          db.set(`ticketChannelUser_${interaction.guild.id}${channel.id}`, { user: interaction.user.id })
          db.set(`ticketUser_${interaction.user.id}${interaction.guild.id}`, { whOpen: interaction.user.id, date: Date.now() })

          const ticketolusturdun = new EmbedBuilder()
              .setAuthor({ name: `BK ʀᴏʟᴇᴘʟᴀʏ - ᴅᴇsᴛᴇᴋ sɪsᴛᴇᴍɪ`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`» **ᴅᴇsᴛᴇᴋ ᴀᴄᴀɴ:** <@${interaction.user.id}>\n» **ᴅᴇsᴛᴇᴋ ᴋᴀɴᴀʟı:** ${channel}\n » **ᴛᴀʀɪʜ: ${günler} ${timeString}**`);
          await interaction.reply({ embeds: [ticketolusturdun], ephemeral: true });

          const destekynto = new ActionRowBuilder()
              .addComponents(
                  new StringSelectMenuBuilder()
                      .setCustomId(`destekyönet`)
                      .setPlaceholder('ᴅᴇsᴛᴇᴋ ᴛᴀʟᴇʙɪ̇ɴᴇ ᴜʏɢᴜʟᴀᴍᴀᴋ ɪ̇sᴛᴇᴅɪ̇ɢ̆ɪ̇ɴɪ̇ᴢ ɪ̇şʟᴇᴍɪ̇ sᴇᴄ̧ɪ̇ɴ̧')
                      .setMinValues(1)
                      .setMaxValues(1)
                      .addOptions([
                          {
                              label: "Ticketi Kapat",
                              description: "Ticketi Kaydeder Ve Kapatır",
                              emoji: "<:malcucuksube:1230255963391524874>",
                              value: "ickapa"
                          },
                          {
                              label: "Ticket Yedeği",
                              description: "Ticket Yedegi Almanızı Saglar!",
                              emoji: "<:malcocuksube:1199153936020537494>",
                              value: "destekydk"
                          },
                          {
                            label: "Seçimi Sıfırla",
                description: "Yapmış olduğun seçimi Sıfırlarsın",
                emoji: "<:secımıxıfılra:1215442558910726215>",
                value: "secimiptal"
                          }
                      ]));

          let icticket = new EmbedBuilder()
              .setThumbnail(`${interaction.user.displayAvatarURL()}`)
              .setTitle("<a:teknik:1236710498876129350> **Oyun içi Sorunlar & Rol Hataları hakkında bir destek talebi oluşturuldu!**")
              .setDescription("Lütfen aşağıda sorununuz hakkında detaylı bilgi verin, yetkililerimiz en kısa zamanda sorunu çözecektir.")
              .setTimestamp();

              await channel.send({ content: `<@${interaction.user.id}> - <@&${config.TİCKETYETKİLİ}>`, embeds: [icticket], components: [destekynto] });
      }
  } catch (error) {
      console.error('Error occurred:', error);
  }
});

//diğer kategori
client.on("interactionCreate", async interaction => {
  try {
      if (interaction.values == 'digerkategori') {
          const now = new Date();
          const timeString = now.toLocaleTimeString();
          const günler = now.toLocaleDateString();

          const channel = await interaction.guild.channels.create({
              name: `ticket-${interaction.user.username}`,
              type: Discord.ChannelType.GuildText,
              parent: config.TİCKETKATEGORİ,
              topic: `Hey ${interaction.user.username} Başarılı şekilde Diğer Kategori Destek konusu ile destek talebi oluşturdun`,
              permissionOverwrites: [
                  {
                      id: interaction.guild.id,
                      deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: interaction.user.id,
                      allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: config.TİCKETYETKİLİ,
                      allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                  },
              ],
          });

          db.set(`ticketChannelUser_${interaction.guild.id}${channel.id}`, { user: interaction.user.id })
          db.set(`ticketUser_${interaction.user.id}${interaction.guild.id}`, { whOpen: interaction.user.id, date: Date.now() })

          const ticketolusturdun = new EmbedBuilder()
              .setAuthor({ name: `STRP ʀᴏʟᴇᴘʟᴀʏ - ᴅᴇsᴛᴇᴋ sɪsᴛᴇᴍɪ`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`» **ᴅᴇsᴛᴇᴋ ᴀᴄᴀɴ:** <@${interaction.user.id}>\n» **ᴅᴇsᴛᴇᴋ ᴋᴀɴᴀʟı:** ${channel}\n » **ᴛᴀʀɪʜ: ${günler} ${timeString}**`);
          await interaction.reply({ embeds: [ticketolusturdun], ephemeral: true });

          const destekynto = new ActionRowBuilder()
              .addComponents(
                  new StringSelectMenuBuilder()
                      .setCustomId(`destekyönet`)
                      .setPlaceholder('ᴅᴇsᴛᴇᴋ ᴛᴀʟᴇʙɪ̇ɴᴇ ᴜʏɢᴜʟᴀᴍᴀᴋ ɪ̇sᴛᴇᴅɪ̇ɢ̆ɪ̇ɴɪ̇ᴢ ɪ̇şʟᴇᴍɪ̇ sᴇᴄ̧ɪ̇ɴ̧')
                      .setMinValues(1)
                      .setMaxValues(1)
                      .addOptions([
                          {
                            label: "Ticketi Kapat",
                            description: "Ticketi Kaydeder Ve Kapatır",
                            emoji: "<:malcucuksube:1230255963391524874>",
                            value: "ickapa"
                          },
                          {
                            label: "Ticket Yedeği",
                              description: "Ticket Yedegi Almanızı Saglar!",
                              emoji: "<:malcocuksube:1199153936020537494>",
                              value: "destekydk"
                          },
                          {
                            label: "Seçimi Sıfırla",
                            description: "Yapmış olduğun seçimi Sıfırlarsın",
                            emoji: "<:secımıxıfılra:1215442558910726215>",
                            value: "secimiptal"
                          }
                      ]));

          let icticket = new EmbedBuilder()
              .setThumbnail(`${interaction.user.displayAvatarURL()}`)
              .setTitle("<a:bot1:1236710493318676510> **Diğer kategoriler sebebiyle destek talebi oluşturdu**")
              .setDescription("Lütfen aşağıda sorununuz hakkında detaylı bilgi verin, yetkililerimiz en kısa zamanda sorunu çözecektir.")
              .setTimestamp();

              await channel.send({ content: `<@${interaction.user.id}> - <@&${config.TİCKETYETKİLİ}>`, embeds: [icticket], components: [destekynto] });
            }
  } catch (error) {
      console.error('Error occurred:', error);
  }
});

//Oyun dışı destek\\

client.on("interactionCreate", async interaction => {      
    if (interaction.values == 'occ') {

        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const günler = now.toLocaleDateString();

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: Discord.ChannelType.GuildText,
            parent: config.TİCKETKATEGORİ,
            topic: `Hey ${interaction.user.username} Başarılı şekilde Oyun Dısı Destek konusu ile destek talebi oluşturdun`,
            permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
                 {
                  id: interaction.user.id,
                  allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
                {
                 id: config.TİCKETYETKİLİ,
                 allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
              ],
          });

        db.set(`ticketChannelUser_${interaction.guild.id}${channel.id}`, { user: interaction.user.id })
        db.set(`ticketUser_${interaction.user.id}${interaction.guild.id}`, { whOpen: interaction.user.id, date: Date.now() })

        const ticketolusturdun = new EmbedBuilder()
                  .setAuthor({name: `BK ʀᴏʟᴇᴘʟᴀʏ - ᴅᴇsᴛᴇᴋ sɪsᴛᴇᴍɪ`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                  .setDescription(`» **ᴅᴇsᴛᴇᴋ ᴀᴄᴀɴ:** <@${interaction.user.id}>\n » **ᴅᴇsᴛᴇᴋ ᴋᴀɴᴀʟı:** ${channel}\n » **ᴛᴀʀɪʜ: ${günler} ${timeString}**`)
                  await interaction.reply({embeds: [ticketolusturdun], ephemeral: true})

    const destekynto = new ActionRowBuilder()

      .addComponents(
          new StringSelectMenuBuilder()
              .setCustomId(`destekyönet`)
              .setPlaceholder('ᴅᴇsᴛᴇᴋ ᴛᴀʟᴇʙɪ̇ɴᴇ ᴜʏɢᴜʟᴀᴍᴀᴋ ɪ̇sᴛᴇᴅɪ̇ɢ̆ɪ̇ɴɪ̇ᴢ ɪ̇şʟᴇᴍɪ̇ sᴇᴄ̧ɪ̇ɴ̧')
              .setMinValues(1)
              .setMaxValues(1)
              .addOptions([
                {
                    label: "Ticketi Kapat",
                    description: "Ticketi Kaydeder Ve Kapatır",
                    emoji: "<:malcucuksube:1230255963391524874>",
                    value: "ickapa"
                },
              {
                label: "Ticket Yedeği",
                              description: "Ticket Yedegi Almanızı Saglar!",
                              emoji: "<:malcocuksube:1199153936020537494>",
                              value: "destekydk"
            },
            {
                label: "Seçimi Sıfırla",
                description: "Yapmış olduğun seçimi Sıfırlarsın",
                emoji: "<:secımıxıfılra:1215442558910726215>",
                value: "secimiptal"
            }
              ]));


        icticket = new EmbedBuilder()
    .setThumbnail(`${interaction.user.displayAvatarURL()}`)
    .setTitle("<a:gamer1:1236710497357660302> **Destek, Bug & Teknik Sorunları hakkında yeni bir destek talebi oluşturdu!**")
    .setDescription("Lütfen aşağıda sorununuz hakkında detaylı bilgi verin, yetkililerimiz en kısa zamanda sorunu çözecektir.")
    .setFooter({text: "Developed by Canxrd."})
    .setTimestamp()

    await channel.send({ content: `<@${interaction.user.id}> - <@&${config.TİCKETYETKİLİ}>`, embeds: [icticket], components: [destekynto] });
  }})

//Genel sorun bildirimi vb.\\

client.on("interactionCreate", async interaction => {      
    if (interaction.values == 'genel') {

        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const günler = now.toLocaleDateString();

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: Discord.ChannelType.GuildText,
            parent: config.TİCKETKATEGORİ,
            topic: `Hey ${interaction.user.username} Başarılı şekilde Genel Sorunlar konusu ile destek talebi oluşturdun`,
            permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
                 {
                  id: interaction.user.id,
                  allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
                {
                 id: config.TİCKETYETKİLİ,
                 allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
              ],
          });

        db.set(`ticketChannelUser_${interaction.guild.id}${channel.id}`, { user: interaction.user.id })
        db.set(`ticketUser_${interaction.user.id}${interaction.guild.id}`, { whOpen: interaction.user.id, date: Date.now() })

        const ticketolusturdun = new EmbedBuilder()
                  .setAuthor({name: `BK ʀᴏʟᴇᴘʟᴀʏ - ᴅᴇsᴛᴇᴋ sɪsᴛᴇᴍɪ`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                  .setDescription(` » **ᴅᴇsᴛᴇᴋ ᴀᴄᴀɴ:** <@${interaction.user.id}>\n » **ᴅᴇsᴛᴇᴋ ᴋᴀɴᴀʟı:** ${channel}\n » **ᴛᴀʀɪʜ: ${günler} ${timeString}**`)
                  await interaction.reply({embeds: [ticketolusturdun], ephemeral: true})

    const destekynto = new ActionRowBuilder()

      .addComponents(
          new StringSelectMenuBuilder()
              .setCustomId(`destekyönet`)
              .setPlaceholder('ᴅᴇsᴛᴇᴋ ᴛᴀʟᴇʙɪ̇ɴᴇ ᴜʏɢᴜʟᴀᴍᴀᴋ ɪ̇sᴛᴇᴅɪ̇ɢ̆ɪ̇ɴɪ̇ᴢ ɪ̇şʟᴇᴍɪ̇ sᴇᴄ̧ɪ̇ɴ̧')
              .setMinValues(1)
              .setMaxValues(1)
              .addOptions([
                {
                    label: "Ticketi Kapat",
                    description: "Ticketi Kaydeder Ve Kapatır",
                    emoji: "<:malcucuksube:1230255963391524874>",
                    value: "ickapa"
                },
              {
                label: "Ticket Yedeği",
                              description: "Ticket Yedegi Almanızı Saglar!",
                              emoji: "<:malcocuksube:1199153936020537494>",
                              value: "destekydk"
            },
            {
                label: "Seçimi Sıfırla",
                description: "Yapmış olduğun seçimi Sıfırlarsın",
                emoji: "<:secımıxıfılra:1215442558910726215>",
                value: "secimiptal"
            }
              ]));


icticket = new EmbedBuilder()
.setThumbnail(`${interaction.user.displayAvatarURL()}`)
.setTitle("**Destek, Bug & Teknik Sorunları hakkında yeni bir destek talebi oluşturdu!**")
.setDescription("Lütfen aşağıda sorununuz hakkında detaylı bilgi verin, yetkililerimiz en kısa zamanda sorunu çözecektir.")
.setFooter({text: "Developed by Canxrd."})
.setTimestamp()

await channel.send({ content: `<@${interaction.user.id}> - <@&${config.TİCKETYETKİLİ}>`, embeds: [icticket], components: [destekynto] });
}})

client.on("interactionCreate", async interaction => {

    if (interaction.values == 'secimiptal') {
        woolexasecim = new EmbedBuilder()
        .setAuthor({name: `Seçim iptal edildi`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`Hey yapmış olduğun seçimi Sıfırladın`)
        .setTimestamp()
        await interaction.reply({embeds: [woolexasecim], ephemeral: true})
    }
    
    if (interaction.values == 'destekydk') {

    const chnl = db.fetch(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
    const x = chnl.user;

    const adam = await interaction.guild.members.cache.find(user => user.id === x);
    const usr = db.fetch(`ticketUser_${x}${interaction.guild.id}`);

            let mesaj = interaction.channel.messages.cache.map(x => `${x.author.tag} : ${x.content}`).join("\n")
            await interaction.reply({files: [{attachment: Buffer.from(mesaj) , name: `${usr.whOpen}-destek-talebi.txt`}], ephemeral: true})
    }

})

client.on("interactionCreate", async interaction => {

if (interaction.values == 'ickapa') {

    const chnl = db.fetch(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
    const x = chnl.user;

    const adam = await interaction.guild.members.cache.find(user => user.id === x);
    const usr = db.fetch(`ticketUser_${x}${interaction.guild.id}`);

    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const günler = now.toLocaleDateString();

    const logmesaj = new EmbedBuilder()
    .setAuthor({ name: `${adam.user.username}`, iconURL: adam.user.displayAvatarURL({ dynamic: true }) })
    .setTitle("**Bir Destek Talebi Kapatıldı!**")
    .setDescription(`🎫 **»** **Desteği kapatan yetkili**: <@${interaction.user.id}>\n\n💎 **»** **Desteği oluşturan kişi**: <@${usr.whOpen}>\n\n💢 **»** **Desteğin oluşturulma sebebi ↓**\n> ᴏʏᴜɴ ɪ̇ᴄ̧ɪ ᴅᴇsᴛᴇᴋ\n\n**Desteğin Oluşturulma Tarihi:** <t:${parseInt(usr.date / 1000)}:R> `)
    .setFooter({text: `Desteğin kapatılma saati » ${günler} ${timeString} `})
    .setThumbnail(`${adam.displayAvatarURL()}`)

    const destekkapatıldı = new EmbedBuilder()
    .setColor("DarkRed")
    .setTitle("Destek talebi kapatılıyor")
    .setDescription(`Destek talebi silinecektir\nSilen Yetkili: <@${interaction.user.id}>`)
    .setTimestamp()
                                                  
  await interaction.reply({embeds: [destekkapatıldı], })
  let mesaj = interaction.channel.messages.cache.map(x => `${x.author.tag} : ${x.content}`).join("\n")
  await client.channels.cache.get(config.TİCKETLOG).send({embeds: [logmesaj]})
  await client.channels.cache.get(config.TİCKETLOG).send({files: [{attachment: Buffer.from(mesaj) , name: `${usr.whOpen}-destek-talebi.txt`}]})
  

  setTimeout(() => {
    interaction.channel.delete();

  });

  db.delete(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
  db.delete(`ticketUser_${x}${interaction.guild.id}`);
}
})

client.on("interactionCreate", async interaction => {

    if (interaction.values == 'occkapa') {
    
        const chnl = db.fetch(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
        const x = chnl.user;
    
        const adam = await interaction.guild.members.cache.find(user => user.id === x);
        const usr = db.fetch(`ticketUser_${x}${interaction.guild.id}`);
    
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const günler = now.toLocaleDateString();
    
        const logmesaj = new EmbedBuilder()
        .setAuthor({ name: `${adam.user.username}`, iconURL: adam.user.displayAvatarURL({ dynamic: true }) })
        .setTitle("**Bir Destek Talebi Kapatıldı!**")
        .setDescription(`🎫 **»** **Desteği kapatan yetkili**: <@${interaction.user.id}>\n\n💎 **»** **Desteği oluşturan kişi**: <@${usr.whOpen}>\n\n💢 **»** **Desteğin oluşturulma sebebi ↓**\n> ᴏʏᴜɴ ᴅışı ᴅᴇsᴛᴇᴋ\n\n**Desteğin Oluşturulma Tarihi:** <t:${parseInt(usr.date / 1000)}:R> `)
        .setFooter({text: `Desteğin kapatılma saati » ${günler} ${timeString} `})
        .setThumbnail(`${adam.displayAvatarURL()}`)
    
      let mesaj = interaction.channel.messages.cache.map(x => `${x.author.tag} : ${x.content}`).join("\n")
      await client.channels.cache.get(config.TİCKETLOG).send({embeds: [logmesaj]})
      await client.channels.cache.get(config.TİCKETLOG).send({files: [{attachment: Buffer.from(mesaj) , name: `${usr.whOpen}-destek-talebi.txt`}]})
    
      setTimeout(() => {
        interaction.channel.delete();
    
      });
    
      db.delete(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
      db.delete(`ticketUser_${x}${interaction.guild.id}`);
    }
})

client.on("interactionCreate", async interaction => {

    if (interaction.values == 'genelkapa') {
    
        const chnl = db.fetch(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
        const x = chnl.user;
    
        const adam = await interaction.guild.members.cache.find(user => user.id === x);
        const usr = db.fetch(`ticketUser_${x}${interaction.guild.id}`);
    
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const günler = now.toLocaleDateString();
    
        const logmesaj = new EmbedBuilder()
        .setAuthor({ name: `${adam.user.username}`, iconURL: adam.user.displayAvatarURL({ dynamic: true }) })
        .setTitle("**Bir Destek Talebi Kapatıldı!**")
        .setDescription(`🎫 **»** **Desteği kapatan yetkili**: <@${interaction.user.id}>\n\n💎 **»** **Desteği oluşturan kişi**: <@${usr.whOpen}>\n\n💢 **»** **Desteğin oluşturulma sebebi ↓**\n> ɢᴇɴᴇʟ sᴏʀᴜɴ ʙɪʟᴅɪʀɪᴍɪ\n\n**Desteğin Oluşturulma Tarihi:** <t:${parseInt(usr.date / 1000)}:R> `)
        .setFooter({text: `Desteğin kapatılma saati » ${günler} ${timeString} `})
        .setThumbnail(`${adam.displayAvatarURL()}`)
    

      let mesaj = interaction.channel.messages.cache.map(x => `${x.author.tag} : ${x.content}`).join("\n")
      await client.channels.cache.get(config.TİCKETLOG).send({embeds: [logmesaj]})
      await client.channels.cache.get(config.TİCKETLOG).send({files: [{attachment: Buffer.from(mesaj) , name: `${usr.whOpen}-destek-talebi.txt`}]})
      
      setTimeout(() => {
        interaction.channel.delete();
    
      });
    
      db.delete(`ticketChannelUser_${interaction.guild.id}${interaction.channel.id}`);
      db.delete(`ticketUser_${x}${interaction.guild.id}`);
    }
})
client.on("interactionCreate", async interaction => {      
    if (interaction.values == 'Ekip') {

        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const günler = now.toLocaleDateString();

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: Discord.ChannelType.GuildText,
            parent: config.TİCKETKATEGORİ,
            topic: `Hey ${interaction.user.username} Başarılı şekilde Ekip Başvuru konusu ile destek talebi oluşturdun`,
            permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
                 {
                  id: interaction.user.id,
                  allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
                {
                 id: config.TİCKETYETKİLİ,
                 allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
                },
              ],
          });

        db.set(`ticketChannelUser_${interaction.guild.id}${channel.id}`, { user: interaction.user.id })
        db.set(`ticketUser_${interaction.user.id}${interaction.guild.id}`, { whOpen: interaction.user.id, date: Date.now() })

        const ticketolusturdun = new EmbedBuilder()
                  .setAuthor({name: `BK ʀᴏʟᴇᴘʟᴀʏ - ᴅᴇsᴛᴇᴋ sɪsᴛᴇᴍɪ`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                  .setDescription(`» **ᴅᴇsᴛᴇᴋ ᴀᴄᴀɴ:** <@${interaction.user.id}>\n » **ᴅᴇsᴛᴇᴋ ᴋᴀɴᴀʟı:** ${channel}\n » **ᴛᴀʀɪʜ: ${günler} ${timeString}**`)
                  await interaction.reply({embeds: [ticketolusturdun], ephemeral: true})

    const destekynto = new ActionRowBuilder()

      .addComponents(
          new StringSelectMenuBuilder()
              .setCustomId(`destekyönet`)
              .setPlaceholder('ᴅᴇsᴛᴇᴋ ᴛᴀʟᴇʙɪ̇ɴᴇ ᴜʏɢᴜʟᴀᴍᴀᴋ ɪ̇sᴛᴇᴅɪ̇ɢ̆ɪ̇ɴɪ̇ᴢ ɪ̇şʟᴇᴍɪ̇ sᴇᴄ̧ɪ̇ɴ̧')
              .setMinValues(1)
              .setMaxValues(1)
              .addOptions([
                {
                    label: "Ticketi Kapat",
                    description: "Ticketi Kaydeder Ve Kapatır",
                    emoji: "<:malcucuksube:1230255963391524874>",
                    value: "ickapa"
                },
              {
                label: "Ticket Yedeği",
                description: "Ticket Yedegi Almanızı Saglar!",
                emoji: "<:malcocuksube:1199153936020537494>",
                value: "destekydk"
            },
            {
                label: "Seçimi Sıfırla",
                description: "Yapmış olduğun seçimi Sıfırlarsın",
                emoji: "<:secımıxıfılra:1215442558910726215>",
                value: "secimiptal"
            }
              ]));


        icticket = new EmbedBuilder()
    .setThumbnail(`${interaction.user.displayAvatarURL()}`)
    .setTitle("<a:ekip21:1236710496065814648> **Ekip Alım hakkına bilgi almak için bir destek talebi oluşturdu!**")
    .setDescription("Lütfen aşağıda Ekibiniz hakkında detaylı bilgi verin, yetkililerimiz en kısa zamanda İlgilenecekir çözecektir..")
    .setFooter({text: "Developed by Canxrd."})
    .setTimestamp()

    await channel.send({ content: `<@${interaction.user.id}> - <@&${config.TİCKETYETKİLİ}>`, embeds: [icticket], components: [destekynto] });
  }})



