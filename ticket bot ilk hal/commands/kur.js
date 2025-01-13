const { EmbedBuilder, PermissionsBitField, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js");
const discord = require("discord.js")

module.exports = {
    name: "ticket-kur",
    description: "Ticket Kurulumu yapar",
    type: 1,


    run: async (client, interaction) => {



        const woolexaticketembed = new EmbedBuilder()
        .setColor("White")
        .setAuthor({name: `${interaction.guild.name}`, iconURL: `https://cdn.discordapp.com/attachments/1318635721078210623/1318983149946015866/Vestra_V_-_Logo_Design.png?ex=67644e48&is=6762fcc8&hm=3ea976485f5847d5d82fe1e1d8b2d96ce574cb0277a50f8efddee9f2a61c0592&`})
        .setDescription("・ ᴅᴇsᴛᴇᴋ sɪsᴛᴇᴍɪ:  \n   <:blurplelinkk:1236708168936067072>      ・ ꜱᴜɴᴜᴄᴜ ʙɪʟɢɪꜱɪ: <@everone>")
        .setThumbnail("https://cdn.discordapp.com/attachments/1138888904313946173/1236024371601084487/545st.png?ex=6639cca6&is=66387b26&hm=3f0094126525579d4e09722dafb7db30d8a98c6fb4f0831ac3e6afd758b03a27&")
        .setFooter({text: "Developed by MoshyFİX.", iconURL: 'https://cdn.discordapp.com/attachments/1138888904313946173/1236024371601084487/545st.png?ex=6639cca6&is=66387b26&hm=3f0094126525579d4e09722dafb7db30d8a98c6fb4f0831ac3e6afd758b03a27&'})
        .setTimestamp()
        .setImage("https://cdn.discordapp.com/attachments/1318635721078210623/1318983149946015866/Vestra_V_-_Logo_Design.png?ex=67644e48&is=6762fcc8&hm=3ea976485f5847d5d82fe1e1d8b2d96ce574cb0277a50f8efddee9f2a61c0592&")

        const ticketselect = new ActionRowBuilder()

          .addComponents(
              new StringSelectMenuBuilder()
                  .setCustomId(`kategorisec`)
                  .setPlaceholder('🇩​🇪​🇸​🇹​🇪​🇰​ 🇦​🇱​🇲​🇦​🇰​ 🇮​̇🇸​🇹​🇪​🇩​🇮​̇🇬​̆🇮​̇🇳​ 🇰​🇴​🇳​🇺​🇾​🇺​ 🇸​🇪​🇨​̧')
                  .setMinValues(1)
                  .setMaxValues(1)
                  .addOptions([
                      {
                          label: "Oyun İçi Destek & Rol Hataları",
                          description: "Oyun İçi Destek & Rol Hataları",
                          emoji: "<:teknik:1226604664758468659>",
                          value: "ic"
                      },
                      { // yeni kategori oluşturim mi DM BAK ATTIM KATEGORI
                        label: "Destek, Bug & Teknik Sorunlar",
                        description: "Destek, Bug & Teknik Sorunlar bildirmek",
                        emoji: "<:gamer1:1227742008785764373>",
                        value: "occ"
                    },
                    {
                        label: "Ekip Başvuru",
                        description: "Ekip Açmak İstiyorsanız Buradan Açın",
                        emoji: "<a:ekip21:1002528497211818024>",
                        value: "Ekip"
                    },
                    {
                        label: "Diğer Kategoriler",
                        description: "Sebebiniz eğer kategorilerde yoksa, buradan açın",
                        emoji: "<a:bot1:1227759067041235034>",
                        value: "digerkategori"
                    },
                    {
                        label: "Seçenek Sıfırla",
                        description: "Seçenekleri sıfırlamanıza yarar",
                        emoji: "<:cancel2:1227119330928492614>",
                        value: "secimiptal" 
                    }
                  ]));

         interaction.reply({ content: '||@everyone|| & ||@here||', embeds: [woolexaticketembed], components: [ticketselect] });

 }
}