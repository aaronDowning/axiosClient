require('dotenv').config();
const axios = require('axios');
const { expect } = require('chai');
const util = require('util');

clientId = process.env.CLIENT_ID,
clientSecret = process.env.CLIENT_SECRET

class RedditHttpClient {
  constructor() {
    this.token = null;

    const client = axios.create({
      baseURL: 'https://oauth.reddit.com',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'axios-reddit-client'
      },
    });

    client.interceptors.request.use(request => {
      console.info(`${request.method.toUpperCase()} ${request.url} as ${request.headers['Content-Type']}`);
      if (['post', 'put', 'patch'].includes(request.method)) {
        const body = util.inspect(request.data, {
          compact: false,
          showHidden: false,
          depth: null,
          colors: true
        })
        .split('\n')
        .map(l => `  ${l}`)
        .join('\n');
        console.info(body);
      }
      return request;
    });

    client.interceptors.response.use(response => {
      console.info(`\n  ${response.status} ${response.statusText}\n`);
      return response;
    }, e => {
      if (e.response) {
        console.info(`\n  ${e.response.status} ${e.response.statusText}\n`);
        const errors = util.inspect(e.response.data, {
          compact: true,
          showHidden: false,
          depth: null,
          colors: true
        })
        .split('\n')
        .map(l => `  ${l}`)
        .join('\n');
        console.info(errors);
        console.info('\n');
      }
      throw e;
    });

    this.client = client;
  }

  async startSession() {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    try {
      const response = await axios.post('https://www.reddit.com/api/v1/access_token', params.toString(), {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      expect(response.status).to.equal(200);
      this.token = response.data.access_token;
      this.client.defaults.headers['Authorization'] = `Bearer ${this.token}`;
    } catch (e) {
      console.error(`Failed to obtain access token: ${e.message}`);
      if (e.response) {
        console.error(e.response.data);
      }
      throw e;
    }
  }

  async get(url, config = {}) {
    return await this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return await this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return await this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return await this.client.delete(url, config);
  }

  async patch(url, data = {}, config = {}) {
    return await this.client.patch(url, data, config);
  }

  async request(config) {
    return await this.client.request(config);
  }
}

module.exports = {
  RedditHttpClient
};
