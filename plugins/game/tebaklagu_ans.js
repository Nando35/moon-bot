const similarity = require('similarity')
const threshold = 0.72
module.exports = {
   async before(m, {
      conn,
      users,
      body,
      Func
   }) {
      let id = m.chat
      conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
      if (m.quoted && /tegu untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
         if (!(id in conn.tebaklagu) && /tegu untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
         if (m.quoted.id == conn.tebaklagu[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            let json = JSON.parse(JSON.stringify(conn.tebaklagu[id][1]))
            if (body.toLowerCase() == json.data.judul.toLowerCase().trim()) {
               await m.reply(`*Benar, +${Func.formatNumber(conn.tebaklagu[id][2])} Exp*`).then(() => {
                  users.exp += conn.tebaklagu[id][2]
                  clearTimeout(conn.tebaklagu[id][3])
                  delete conn.tebaklagu[id]
               })
            } else if (similarity(body.toLowerCase(), json.data.judul.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
            else m.reply(`*Salah!*`)
         }
      }
      return !0
   }
}