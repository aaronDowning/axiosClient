const axios = require('axios');
const { expect } = require('chai');

describe("Get API Request Test", () => {
    it("Should be able to get user list", async () => {
        const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
        console.log(res.data);
        firstPost = res.data[0];
        expect(res.status).to.equal(200);
        expect(firstPost).to.have.property('userId');
    });
});
