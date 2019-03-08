const axios = require('axios')
const moment = require('moment')
const HourSchedule = require('./utils/HourSchedule')
const one = require('./spider/one.js')
const weather = require('./spider/weather')

// 定时发送每日英语
async function getEnglish() {
  const time = moment().format('YYYY-MM-DD')
  const url = `http://api.luzhongkuan.cn/api/english/${time}`
  const { data } = await axios(url)
  if (data.success) return data.data
  return Promise.reject(data)
}

// 定时发送天气预报
async function tellWwather(...peopleList) {
  const text = await weather()
  for (let i = 0; i < peopleList.length; i++) {
    const people = peopleList[i]
    if (people) {
      people.say(text)
    }
  }
}

// 定时发送每日一句
async function sayOne(...peopleList) {
  const text = await one()
  for (let i = 0; i < peopleList.length; i++) {
    const people = peopleList[i]
    if (people) {
      people.say(text)
    }
  }
}

async function sendEnglish(manger) {
  const { content, note } = await getEnglish()
  const msg = `${content} \n ${note}`
  manger.say(msg)
}

// 开始定时任务
module.exports = ({ manger, wife }) => {
  const scheduleList = {
    7: [() => sendEnglish(manger), () => tellWwather(wife, manger)],
    20: [() => sayOne(wife, manger)]
  }
  const schedule = new HourSchedule(scheduleList)
  schedule.start()
  return schedule
}
