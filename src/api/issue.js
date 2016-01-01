class Issue {
  constructor (JiraClient) {
    if (!JiraClient) {
      throw new Error('JiraClient is not set')
    }

    this.client = JiraClient
  }

  getIssue (key, id, callback) {
    let issueIdOrKey = key || id
    let options = {
      followAllRedirects: true,
      uri: this.client.buildUrl('/issue/' + issueIdOrKey),
      method: 'GET'
    }

    this.client.makeRequest(options, callback)
  }

  getWorklogs (key, id, callback) {
    let issueIdOrKey = key || id
    let options = {
      followAllRedirects: true,
      uri: this.client.buildUrl('/issue/' + issueIdOrKey + '/worklog'),
      method: 'GET'
    }

    this.client.makeRequest(options, callback)
  }
}

module.exports = (client) => (new Issue(client))
