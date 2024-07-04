require('dotenv').config();
const { expect } = require('chai');
const { RedditHttpClient } = require('./client');

describe("Reddit API Request Test", () => {
  let client;

  before(async () => {
    client = new RedditHttpClient();
    await client.startSession();
  });

  it("Should be able to get a list of subreddits", async () => {
    const res = await client.get('/subreddits/popular');

    // Log the response data to understand its structure
    console.log(JSON.stringify(res.data, null, 2));

    // Basic assertions using Chai
    expect(res.status).to.equal(200);
    expect(res.data).to.have.property('data');
    expect(res.data.data).to.have.property('children').that.is.an('array');

    // Detailed assertions on the first subreddit
    if (res.data.data.children.length > 0) {
      const firstSubreddit = res.data.data.children[0].data;
      console.log(firstSubreddit);  // Log the full details of the first subreddit
      expect(firstSubreddit).to.have.property('display_name').that.is.a('string');
      expect(firstSubreddit).to.have.property('title').that.is.a('string');
      expect(firstSubreddit).to.have.property('subscribers').that.is.a('number');
    }
  });
});
