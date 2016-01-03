
var Table = require('cli-table')

class TableRenderer {
	constructor () {
		this.header = {
      style: {compact: true, head: ['green']}
    }
	}

	renderVertical (body) {
		let table = new Table(this.header)
		for (let item of body) {
	    table.push(item)
	  }
    console.log(table.toString())
	}

	render (head, body) {
		this.header.head = head
		
		let table = new Table(this.header)
		for (let item of body) {
	    table.push(item)
	  }
    console.log(table.toString())
	}
}

module.exports = new TableRenderer()