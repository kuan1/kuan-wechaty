const qrcodeTerminal = require('qrcode-terminal')
const { Wechaty, Contact, Message, log } = require('wechaty')
const startSchedule = require('./schedule')

const bot = new Wechaty()

let schedule

// 二维码登录
bot.on('scan', (qrcode, status) => {
  if (status === 0) {
    qrcodeTerminal.generate(qrcode, { small: true }) // show qrcode on console
  }
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode)
  ].join('')
  console.log(qrcodeImageUrl)
})
// 登录
bot.on('login', user => {
  console.log(`${user} 登录成功`)
  main()
})
// 登出
bot.on('logout', user => {
  console.log(`${user} 退出登录`)
  process.exit()
  if (schedule) schedule.stop()
})

// 自动同意好友
bot.on('friendship', async friendship => {
  console.log(`添加好友事件：${friendship.type()}`)

  switch (friendship.type()) {
    case 2:
      await friendship.accept()
      console.log(`自动添加好友`)
      break
    case 2:
      friendship.contact().say(`你好。`)
      break
  }
})

// 接受到信息
bot.on('message', async msg => {
  if (msg.self()) return
  if (
    [Message.Type.Video, Message.Type.Audio, Message.Type.Image].includes(
      msg.type()
    )
  ) {
    const file = await msg.toFileBox()
    const name = file.name
    console.log('Save file to: ' + name)
    return file.toFile(`history/${name}`)
  }
  console.log(`
    ${msg.from().name()} : ${msg.text()}    -(${msg.to().name()})
  `)
  if (!['宽', '卢忠宽'].includes) {
    await msg.say(msg.text() || '我现在只能识别文字')
  }
})

// 登录成功之后的事情
async function main() {
  const contactList = await bot.Contact.findAll()

  let manger
  let wife

  // 好友列表
  for (let i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    if (contact.type() === Contact.Type.Personal) {
      if (['卢忠宽', '宽'].includes(contact.name())) {
        manger = contact
      } else if (contact.name() === '淘气') {
        wife = contact
      }

      log.info(`好友： ${i}: ${contact.name()} : ${contact.id}`)
    }
  }

  if (manger) {
    console.log(`找到管理员：${manger.name()}`)
    await manger.say('管理员你好！\n我是微信机器人，刚刚登录成功。')
    schedule = startSchedule({ manger, wife })
  }
}

bot
  .start()
  .then(() => console.log('微信机器人启动成功'))
  .catch(console.error)
