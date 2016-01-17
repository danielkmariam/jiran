
var Table = require('cli-table')
var colors = require('colors')

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
    this.renderTable(body)
  }

  render (head, body) {
    this.header.head = head
    this.renderTable(body)
  }

  renderTable (body) {
    let table = new Table(this.header)
    for (let item of body) {
      table.push(item)
    }
    console.log(table.toString())
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
