const config = require("../../../config.json");
const moment = require("moment");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "ship",
    aliases: ["compatibility"], // Diğer potansiyel komut adları
    execute: async (client, message, args) => {
        if (args.length !== 2 || !message.mentions.users.size) {
            return message.reply({ embeds: [new MessageEmbed().setDescription("<a:nlem:1250797681794879599> Lütfen iki kişiyi etiketleyin!")] })
                .catch(err => console.log(err))
                .then(e => setTimeout(() => e.delete(), 10000));
        }

        const person1 = message.mentions.users.first();
        const person2 = message.mentions.users.last();

        // Rastgele uyum oranı hesaplama (0-100 arası bir değer)
        const compatibilityScore = Math.floor(Math.random() * 101);

        // Rastgele bir aşk resmi URL'si
        const loveImages = [
            "https://media.discordapp.net/attachments/1250086039037542451/1254841360083849298/manita.jpg?ex=667af596&is=6679a416&hm=6bf23e50cdf6d6019134ce87d369420b1e727455527cf28f984fb3fbd2df41a4&=&format=webp&width=375&height=210",
            "https://media.discordapp.net/attachments/1250086039037542451/1254841360083849298/manita.jpg?ex=667af596&is=6679a416&hm=6bf23e50cdf6d6019134ce87d369420b1e727455527cf28f984fb3fbd2df41a4&=&format=webp&width=375&height=210",
            "https://media.discordapp.net/attachments/1250086039037542451/1254841360083849298/manita.jpg?ex=667af596&is=6679a416&hm=6bf23e50cdf6d6019134ce87d369420b1e727455527cf28f984fb3fbd2df41a4&=&format=webp&width=375&height=210"
        ];

        const randomImageIndex = Math.floor(Math.random() * loveImages.length);
        const randomLoveImage = loveImages[randomImageIndex];

        // Rastgele bir ileri tarih oluştur
        const futureDate = moment().add(Math.floor(Math.random() * 30) + 1, 'days'); // 1 ila 30 gün arasında bir tarih oluşturur

        const shipEmbed = new MessageEmbed()
            .setColor("#e4b400")
            .setTitle(`:heart: ${person1.username} ve ${person2.username} arasındaki uyum :heart:`)
            .setDescription(`**Uyum Puanı:** ${compatibilityScore}%`)
            .addField("📅 Nikah Tarihi", moment(futureDate).format("LLL"))
            .setImage(randomLoveImage); // Embed'e rastgele aşk resmini ekleyin

        // Rastgele bir Spotify aşk şarkıları linki
        const spotifyLoveSongURLs = [
            "https://open.spotify.com/intl-tr/track/0Rb3Zf4wemUX45NNoo5H0L?si=a2827d58ae8945a7", // Örnek şarkı linkleri, gerçek linkler eklemelisiniz
            "https://open.spotify.com/intl-tr/track/7104DHFH8m0Kmd8FqdPx1h?si=b3bbd3b8d7e54aee",
            "https://open.spotify.com/intl-tr/track/6aVwMy9fMy0x5tovD28CZ6?si=31c27bf1c04c4fdb"
        ];

        const randomIndex = Math.floor(Math.random() * spotifyLoveSongURLs.length);
        const randomLoveSongURL = spotifyLoveSongURLs[randomIndex];

        // Spotify butonunu oluştur ve rastgele şarkıya yönlendir
        const spotifyButton = new MessageButton()
            .setStyle("LINK")
            .setLabel("Sizin Şarkınız")
            .setURL(randomLoveSongURL);

        const heartButton = new MessageButton()
            .setStyle("SECONDARY")
            .setLabel("♥")
            .setCustomId("heartButton") // Bu customId'yi tanımlıyoruz
            .setDisabled(true); // Butonu tıklanamaz hale getiriyoruz.

        const retryButton = new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Tekrar Et")
            .setCustomId("retryButton");

        // Butonları içeren bir action row oluştur
        const actionRow = new MessageActionRow()
            .addComponents(spotifyButton, heartButton, retryButton);

        // Mesajı gönder ve butonları ekleyerek
        const sentMessage = await message.channel.send({ embeds: [shipEmbed], components: [actionRow] });

        // Uyum puanı 80 ve üstünde ise kullanıcıları tebrik et
        if (compatibilityScore >= 80) {
            message.channel.send(`${person1} ve ${person2} birbirinizi bulmuşsunuz :tada:`);
        } else if (compatibilityScore < 20) {
            message.channel.send(`${person1} ve ${person2} bence sizden olmaz :disappointed:`);
        }

        const filter = i => i.customId === 'retryButton' && i.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'retryButton') {
                await i.deferUpdate();
                module.exports.execute(client, message, args);
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                retryButton.setDisabled(true);
                sentMessage.edit({ components: [actionRow] });
            }
        });
    }
};
