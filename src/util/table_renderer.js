const Table = require('cli-table')
const colors = require('colors')

class TableRenderer {
  constructor () {
    this.header = {
      style: {compact: true, head: ['green']}
    }
  }
  renderTitle (title) {
    console.log(colors.green(title))
  }

  renderVertical (body) {
    renderTable(this.header, body)
  }

  render (head, body) {
    this.header.head = head
    renderTable(this.header, body)
  }

  renderCell (text) {
    let singleCell = new Table({
      style: {compact: true, 'padding-left': 2, 'padding-right': 2}
    })

    singleCell.push(text)

    console.log(singleCell.toString())
  }
}

module.exports = new TableRenderer()

const renderTable = (header, body) => {
  let table = new Table(header)
  for (let item of body) {
    table.push(item)
  }
  console.log(table.toString())
}
