
var Table = require('cli-table')

class TableRenderer {
  constructor () {
    this.header = {
      style: {compact: true, head: ['green']}
    }
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
}

module.exports = new TableRenderer()
