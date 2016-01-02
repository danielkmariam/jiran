class Api {
  constructor (JiraClient) {
    if (!JiraClient) {
      throw new Error('JiraClient is not set')
    }
    this.client = JiraClient
  }

  getUser (callback) {
    this.client.get('/myself', callback)
  }

  getIssue (key, id, callback) {
    let idOrKey = key || id
    this.client.get('/issue/' + idOrKey, callback)
  }

  getIssueWorklogs (key, id, callback) {
    let idOrKey = key || id
    this.client.get('/issue/' + idOrKey + '/worklog', callback)
  }
}

module.exports = (JiraClient) => (new Api(JiraClient))
