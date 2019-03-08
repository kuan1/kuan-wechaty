/**
 * 每天固定整点触发任务定时器
 * @params scheduleList {Object} -> {0: [fn, fn], 2: [fn, fn]}
 * @class HourSchedule
 */
module.exports = class HourSchedule {
  constructor(scheduleList = {}) {
    this.scheduleList = scheduleList // 所有整点任务
    this.timer = null
  }

  /**
   * 添加任务
   * @param {*} task Function
   * @param {*} h 小时
   */
  add(task, h) {
    if (h >= 0 && h <= 23 && typeof task === 'function') {
      const list = scheduleList[h] || []
      scheduleList[h] = list.filter(item => item !== task).push(list)
    } else {
      console.error('输入格式错误')
    }
  }

  /**
   * 删除任务
   * @param {*} task
   * @memberof HourSchedule
   */
  remove(task) {
    for (i in this.scheduleList) {
      const list = scheduleList[i]
      if (list) {
        scheduleList[i] = list.filter(item => item !== task)
      }
    }
  }

  /**
   * 距离下几个小时还有多长时间
   * @returns
   * @memberof HourSchedule
   */
  leaveHour(num = 1) {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const d = now.getDate()
    const h = now.getHours()

    return (
      new Date(y, m, d, h, 0, 0).getTime() +
      num * 60 * 60 * 1000 -
      now.getTime()
    )
  }

  /**
   * 开始定时任务
   * @memberof HourSchedule
   */
  start() {
    this.stop()
    const leave = this.leaveHour()
    this.timer = setTimeout(
      () => {
        const h = new Date().getHours()
        const list = this.scheduleList[h] || []
        list.forEach(fn => fn())
        this.start()
      },
      leave > 1000 ? leave : 1000
    )
  }

  /**
   * 停止定时任务
   * @memberof HourSchedule
   */
  stop() {
    if (this.timer) clearTimeout(this.timer)
  }
}
