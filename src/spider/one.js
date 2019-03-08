const axios = require('axios')
const cheerio = require('cheerio')

// 每日一句
const url = `http://wufazhuce.com/`

async function spider() {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  const target = $('#carousel-one .fp-one-cita a').eq(0)
  return target.text()
}

module.exports = spider
