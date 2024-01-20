// Imports the server.js file to be tested.
const server = require("../src/server");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven 
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

//RUN THIS TO TEST: docker-compose run web npm run testandrun

describe('Server!', () => { //Functions that allows you to put together your test cases
  // Sample test case given to test / endpoint.
  //It alows you to do one test at a time
  it("Positive case if the server is running", (done) => { //FROM LAB 9
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        console.log(res.body)
        done(); //Used for chai to end test. Mocha waits for this to continue
      });
  });

  it("Positive case if the contents of what was seached ", (done) => {
    chai
    .request(server)
    .get("/searches")
    .end((err, res) => {
      expect(res).to.have.status(200); //Expecting the status of 200 (which measn its working)
      console.log(res.body)
      done();
})
});

});