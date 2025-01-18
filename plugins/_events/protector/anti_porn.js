let handler = (m) => m
handler.before = async function (m, {
   conn,
   body,
   isAdmin,
   isBotAdmin,
   groupSet,
   Scraper,
   Func
}) {
   try {
      if (!m.fromMe && m.isGroup && groupSet.antiporn && /image/.test(m.mtype) && !isAdmin && isBotAdmin) {
         let media = await Scraper.uploader(await m.download())
         let json = await Api.get('api/detect-porn', {
            image: media.data.url
         })
         if (!json.status) return console.error(json)
         if (json.data.isPorn) return conn.sendMessage(m.chat, {
            delete: {
               remoteJid: m.chat,
               fromMe: false,
               id: m.key.id,
               participant: m.sender
            }
         }).then(() => {
            conn.reply(m.chat, Func.texted('bold', `🚩 Detected @${m.sender.split('@')[0]} sending porn`), m)
            //conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
         })
      }
   } catch (e) {
      console.log(e)
   }
   return true
}
module.exports = handler