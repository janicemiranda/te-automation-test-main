import request from "supertest";
import app from "../app/app";
import snippetGroupData from "../db/snippetGroup";

process.env.TEST_SUITE = "main";

//Provided test data
const groupID = snippetGroupData[0]["_id"]; //7988ca09-87dc-426e-9a9c-9524ce47fe13

//Mock Group ID
const mockGroupID = "4269fb36-c41f-11ec-9d64-0242ac120002";

//User id and user's auth token
const validUser_data = [
  "23dN9jRn2TRjqD5Zb",
  "eohuFKr_Y9DjWFyUUrZL3oDonMDMuboAKZqwgf13XLX",
];
const invalidUser_data = [
  "23dN9jRn2TRjqD5Zc",
  "xjf-TQ5aaPf_RVBVmfxYbPRZYBTVLuQzIwoGxUG0WX-",
];

//Array containing all Snippet Group members from snippetGroupData
var member_ids = [];
snippetGroupData[0].members.forEach((obj) => {
  member_ids.push(obj["userId"]);
});

/**
 * Given that the user is a member of the SnippetGroup (groupID)
 * Get request using Valid User's Auth Token - Should return Status Code: 200
 * Response should contain Snippet data belonging to the Snippet Group and their Properties
 */
describe("Given a user is a Member of the SnippetGroup", () => {
  if (member_ids.includes(validUser_data[0])) {
    it("Should return Snippet Group Data with a 200 Status Code", async (done) => {
      await request(app)
        .get(`/snippetGroup/${groupID}/snippets`)
        .set("Authorization", validUser_data[1])
        .then((response) => {
          expect(response.status).toBe(200);
          response.body.forEach((element) => {
            expect(element).toEqual({
              abbreviation: expect.any(String),
              contents: expect.any(String),
              groupId: groupID,
              abbreviationMode: expect.any(Number),
              labelString: "",
              snippetType: expect.any(Number),
              dateUpdated: expect.any(String),
              deleted: false,
            });
            done();
          });
        });
    });
  } else {
    console.log("User is not a member of the Snippet Group");
  }
});
/**
 * Given that the user is not a member of this SnippetGroup (groupID)
 * Get request using Invalid User's Auth Token - Should return Status Code: 401
 * Response should contain Unauthorized Error
 */
describe("Given a user is not a Member of the SnippetGroup", () => {
  if (!member_ids.includes(invalidUser_data[0])) {
    it("Should return status 401 Status Code", async (done) => {
      request(app)
        .get(`/snippetGroup/${groupID}/snippets`)
        .set("Authorization", invalidUser_data[1])
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toEqual({
            errorMessage: "invalidUserForGroup",
            status: 401,
            stackTrace: null,
          });
          done();
        });
    });
  } else {
    console.log("User is a member of the Snippet Group");
  }
});

/**
 * Given that the user is not a member of this mock SnippetGroup, but is a member of
 * the given SnippetGroup
 * Get request using the Valid User's Auth Token - Should return Status Code: 401
 * Response should contain Unauthorized Error
 */
describe("Given a user is a Member of one Snippet Group, but not a member of the Mock Snippet Group", () => {
  if (member_ids.includes(validUser_data[0])) {
    it("Should return status 401 Status Code", async (done) => {
      request(app)
        .get(`/snippetGroup/${mockGroupID}/snippets`)
        .set("Authorization", invalidUser_data[1])
        .then((response) => {
          expect(response.status).toBe(401);
          expect(response.body).toEqual({
            errorMessage: "invalidUserForGroup",
            status: 401,
          });
          done();
        });
    });
  } else {
    console.log("User is a member of the Snippet Group");
  }
});

/**
 * Given that the GET request contains a null Authorization header
 * It should return Status Code: 400
 * Response should contain Invalid Error
 */
describe("Given that the GET request contains a null Authorization header", () => {
  it("It should return Status Code: 400", (done) => {
    request(app)
      .get(`/snippetGroup/${groupID}/snippets`)
      .set("Authorization", null)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          errorMessage: "invalidToken",
          status: 400,
          stackTrace: null,
        });
        done();
      });
  });
});

/**
 * Given that the GET request contains a blank Authorization header
 * It should return Status Code: 401
 * Response should contain Unauthorized Error
 */
describe("Given that the GET request contains a blank Authorization header", () => {
  it("It should return Status Code: 401", (done) => {
    request(app)
      .get(`/snippetGroup/${groupID}/snippets`)
      .set("Authorization", " ")
      .then((response) => {
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
          errorMessage: "Unauthorized",
          status: 401,
          stackTrace: null,
        });
        done();
      });
  });
});
