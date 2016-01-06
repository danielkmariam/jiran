
class Cli {

  constructor (JiraApi, TableRenderer, Logger) {
    this.api = JiraApi
    this.tableRenderer = TableRenderer
    this.logger = Logger
  }

  renderUser () {
    return this.api
      .getUser()
      .then((user) => {
        this.tableRenderer.renderTitle('Current user detail')
        this.tableRenderer.renderVertical([
          {'Key': user.key},
          {'Name': user.name},
          {'Email Address': user.email}
        ])
      })
      .catch((error) => {
        this.logger.error(error.toString())
      })
  }
}

module.exports = (JiraApi, TableRenderer, Logger) => (new Cli(JiraApi, TableRenderer, Logger))
