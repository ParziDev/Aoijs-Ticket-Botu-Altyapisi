const parzi = require("aoi.js")
var fs = require('fs')
const bot = new parzi.Bot({
    token: process.env.token,//.env dosyasında token yazan variablenin değerine tokeninizi yazın
    prefix:"$getServerVar[prefix]"//ayarlamalı prefix 
})
bot.onJoined()
bot.onLeave()
bot.onMessage()
var reader = fs.readdirSync("./komutlar/").filter(file => file.endsWith(".js"))
for(const file of reader) {    
    const command = require(`./komutlar/${file}`)
    bot.command({
        name: command.name,
        code: command.code,
        aliases: command.aliases
    })
}

//Variables
bot.variables({
  prefix:".",
  ticket:"0",
  ticketk:"",
  ticketk2:"",
  tmesaj1:"-etiket-",
  tmesaj2:"**-etiket- birazdan bir yetkili gelip senle ilgilenecek.**",
}) 

//Status
bot.status({
text:"Tokyo Code",
type:"PLAYING",
status:"dnd",
time: 12
})

bot.status({
text:"Rick Code",
type:"PLAYING",
status:"dnd",
time: 12
})

//Commands
bot.command({
  name:"$alwaysExecute",
  code:`
  $useChannel[$get[ticket]]
  $clear[1]
  $wait[1s]
  $setServerVar[ticket;$sum[$getServerVar[ticket];1]]
  $reactionCollector[$get[kapat];everyone;24d;❌;eminmisin;yes]
$pinMessage[$get[ticket];$get[kapat]]
$let[kapat;$channelSendMessage[$get[ticket];$replaceText[$getServerVar[tmesaj1];-etiket-;<@$authorID>;-1]{description:
**$replaceText[$getServerVar[tmesaj2];-etiket-;<@$authorID>;-1]**

**Ticket'ı açarken şu mesajı girdin:** $message

**Ticket'ı kapatmak için aşşağıdaki ❌ tepkisine basınız ya da \`.ticket-kapat\` kodunu giriniz.**}{color:ffdbfe};yes]]
$modifyChannelPerms[$get[ticket];-viewchannel;$guildID]
$let[ticket;$newTicket[$username・$sum[$getServerVar[ticket];1];.{delete:1s};$getServerVar[ticketk2];yes;<:zt_red:852916499584122920> **!!HATA!!**]]

  $wait[1s]
    $deletecommand
     
$onlyForChannels[$getServerVar[ticketk];]
`
})

bot.awaitedCommand({
  name: "eminmisin",
  code: `
$reactionCollector[$get[id];$authorID;24d;☑️,❌;evet,hayır;yes]
$let[id;$channelSendMessage[$channelID;{description:
 **Eğer Kapatmak İstiyorsanız ☑️ Tepkisine Basınız.**
 
 **Eğer Kapatmak İstemiyorsanız ❌ Tepkisine Basınız.**}{color:ffdbfe}
 ;yes]]


 `})
bot.awaitedCommand({
  name: "evet",
  code: `
$channelSendMessage[$channelID;**Sayın Yetkililer Ticket Kullanıcıya Kapatılmıştır Lütfen \`.ticket sil\` komudunu kullanın.**]
$wait[1s]
$modifyChannelPerms[$channelID;-viewchannel;-sendmessages;$authorID]
 $wait[3s]
 $channelSendMessage[$channelID;☑️ Ticket 3 saniye içerisinde kapanıcak!;no]
 `
})

bot.awaitedCommand({
  name: "hayır",
  code: `
 $channelSendMessage[$channelID;☑️ İşlem iptal edildi.;no]
 `
}) 

bot.command({
  name:"ticket",
  code:`
$if[$message[1]==sil]
 $closeTicket[❌ Hata! Ticket'ı Kapatamadım!]
 $wait[3s]
 $channelSendMessage[$channelID;☑️ Ticket 3 saniye içerisinde silinicek!;no]
  $else
  $description[❌ \`.ticket sil\`]
  $color[ffdbfe]
  $endif
  $onlyIf[$hasPerms[$authorID;admin]!=false;❌ Lütfen \`zt.ticket-kapat\` komutunu kullanınız.]
  $onlyIf[$isTicket[$channelID]!=false;❌ Burası ticket kanalı değil.]
`
})

bot.command({
  name:"ticket-kapat",
  code:`
$reactionCollector[$get[id];$authorID;24d;☑️,❌;evet1,hayır1;yes]
$let[id;$channelSendMessage[$channelID;{description:
 **Eğer Kapatmak İstiyorsanız ☑️ Tepkisine Basınız.**
 
 **Eğer Kapatmak İstemiyorsanız ❌ Tepkisine Basınız.**}{color:ffdbfe}
 ;yes]]
 `
})

bot.awaitedCommand({
  name: "evet1",
  code: `
$channelSendMessage[$channelID;**Sayın Yetkililer Ticket Kullanıcıya Kapatılmıştır Lütfen \`.ticket sil\` komudunu kullanın.**]
$wait[1s]
$modifyChannelPerms[$channelID;-viewchannel;-sendmessages;$authorID]
 $wait[3s]
 $channelSendMessage[$channelID;☑️ Ticket 3 saniye içerisinde kapanacak!;no]
 `
})

bot.awaitedCommand({
  name: "hayır1",
  code: `
 $channelSendMessage[$channelID;☑️ İşlem iptal edildi.;no]
 `
}) 

bot.command({
  name:"ticket-kanal",
  code:`
   $if[$message[1]==ayarla]
$setServerVar[ticketk;$mentionedChannels[1]]
$description[☑️ Ticket kanalı <#$mentionedChannels[1]> olarak ayarlandı.]
$color[ffdbfe]
$onlyIf[$mentionedChannels[1]!=;❌ Bir kanal etiketlemelisin]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌ Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$if[$message[1]==sıfırla]
$setServerVar[ticketk;]
$description[☑️ Ticket kanalı sıfırlandı.]
$color[ffdbfe]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌ Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$onlyIf[$message[1]!=;❌ \`.ticket-kanal ayarla | .ticket-kanal sıfırla\`]
     $suppressErrors
`
})

bot.command({
  name:"ticket-kategori",
  code:`
  $if[$message[1]==ayarla]
$setServerVar[ticketk2;$message[2]]
$description[☑️ Ticket kategorisi ayarlandı.]
$color[ffdbfe]
$onlyIf[$message[2]!=;❌ Bir kategori idsi girmelisin]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌ Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$if[$message[1]==sıfırla]
$setServerVar[ticketk2;]
$description[☑️ Ticket kanalı sıfırlandı.]
$color[ffdbfe]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌> Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$onlyIf[$message[1]!=;❌ \`.ticket-kategori ayarla | .ticket-kategori sıfırla\`]
     $suppressErrors
`
}) 

bot.command({
  name:"ticket-sistemi",
  code:`
  $author[Ticket Sistemi;$authorAvatar]
  $addField[Kelimeler;\`-etiket-\` > <@$authorID>;yes]
  $addField[Embed Mesaj;\`.ticket-embed-mesaj ayarla | .ticket-embed-mesaj sıfırla\`;yes]
  $addField[Mesaj;\`.ticket-mesaj ayarla | .ticket-mesaj sıfırla\`;yes]
  $addField[Ticket Ayarları;\`.ticket-kapat | .ticket sil\`;yes]
  $addField[Ticket Kategori;\`.ticket-kategori ayarla | .ticket-kategori sıfırla\`;yes]
  $addField[Ticket Kanal;\`.ticket-kanal ayarla | .ticket-kanal sıfırla\`;yes]
   $color[ffdbfe]
        $thumbnail[$serverIcon]
  `
})

bot.command({
  name:"ticket-mesaj",
  code:`
   $if[$message[1]==ayarla]
$setServerVar[tmesaj1;$messageSlice[1]]
$description[☑️ Ticket  mesajı \`$messageSlice[1]\` olarak ayarladım.]
$color[ffdbfe]
$onlyIf[$messageSlice[1]!=;❌ Bir mesaj girmelisin.]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌ Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$if[$message[1]==sıfırla]
$resetServerVar[tmesaj1]
$description[☑️ Ticket  mesajı sıfırlandı.]
$color[ffdbfe]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌ Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$onlyIf[$message[1]!=;❌ \`.ticket-mesaj ayarla | .ticket-mesaj sıfırla\`]
     $suppressErrors
`
})

bot.command({
  name:"ticket-embed-mesaj",
  code:`
   $if[$message[1]==ayarla]
$setServerVar[tmesaj2;$messageSlice[1]]
$description[☑️ Ticket embed mesajı \`$messageSlice[1]\` olarak ayarladım.]
$color[ffdbfe]
$onlyIf[$messageSlice[1]!=;❌ Bir mesaj girmelisin.]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌ Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$if[$message[1]==sıfırla]
$resetServerVar[tmesaj2]
$description[☑️ Ticket embed mesajı sıfırlandı.]
$color[ffdbfe]
$onlyIf[$hasPerms[$authorID;admin]!=false;❌ Üzgünüm Bu Komut İçin \`Yönetici\` yetkin olması lazım.]
$endif
$onlyIf[$message[1]!=;❌ \`.ticket-embed-mesaj ayarla | .ticket-embed-mesaj sıfırla\`]
     $suppressErrors
`
}) 
