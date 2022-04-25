
# Write Up: te-automation-test




## Setup and Execution
It is assumed this test will be executed in a UNIX-like environment.
            
1. Unzip project folder
2. Open the terminal
3. Install Node 14.19.1
```
nvm install 14.19.1
```
4. Open the project file path to the terminal
5. Install npm packages
```
npm install
```
5. Execute the Jest tests with the start command
	```
    npm test
    ```
## Bugs / Issues
While starting this project, the first thing I noticed was that the GET request using an invalid user, actually resulted in a 200 Status Code, revealing Snippet Data to a non-member (instead of a 401). I decided to leave the failing test as a result to show what a test run can catch. ## Thought Process
### Setting up the project
Before writing any code, I tested the requests on postman using the test data, this way I can have an idea of how to validate the responses in my tests.
At the start of creating the tests blocks, I felt it was necessary to organize the given test data at the beginning of the file.
I did so by setting up my variables.
- @groupID: Snippet Group ID `7988ca09-87dc-426e-9a9c-9524ce47fe13`
- @mockGroupID (created by UUID generator) `4269fb36-c41f-11ec-9d64-0242ac120002`
- @validUser_data `[23dN9jRn2TRjqD5Zb, eohuFKr_Y9DjWFyUUrZL3oDonMDMuboAKZqwgf13XLX]`
- @invalidUser_data `[23dN9jRn2TRjqD5Zc, xjf-TQ5aaPf_RVBVmfxYbPRZYBTVLuQzIwoGxUG0WX-]`
- @member_ids : Array containing all members of the Snippet Group from the *snippetGroupData.ts* file

I included the Snippet Group Id first, as it is the basis of the test endpoint.
I followed by creating an array for each test user (@validUser_data, @invalidUser_data) containing their User Id and their respective authentication token. The reason behind creating this variable was to use it as data validation in the jest tests. I want to ensure the given data are valid and that the users given are / are not members of the Snippet Group.



### Test Creation
As this project specifies creating Acceptance tests, I wanted my tests to follow this structure. I have created four tests for the given endpoint. 
Each test begins with a describe block to specify the Given test case. 

For the first three tests, I included a member validation in the form of an if/else block.
The validation checks the test user ID if it is in the @member_ids array. Once validated, the test will begin. If not validated a console log with a message will appear indicating why. 
My tests include:
1.      GET request to Snippet Group with the valid test user
    For the first test, I would consider the best case scenario. I called a GET request to the given groupID using the valid auth token. This test expects a 200 Status Code and validates that all Snippet properties are shown.

2.      GET request to Snippet Group with the invalid test user
    This test would be considered the worst-case scenario as a user, but valid in the sense that no access must be granted to non-members. This test follows the same process as the first test, however, uses the invalid test user data. This test expects a 401 Status Code as validates the error response.

3.      GET request to a mock Snippet Group, using valid test user data (id and auth token)
    I decided to include this test as a way to test out a mild case scenario, which is why I used the valid user. This test uses the valid test user auth, however, it will make a call to a mock Snippet Group. This test expects a 401 Status Code as validates the error response.

4.      GET request to the Snippet Group with a null Authorization header
    Authentication is essential to test which is why I included it to test the error response. This test calls the given Snippet Group endpoint, however, the Auth header is left null, and checks for the InvalidToken error.

5.      GET request to the Snippet Group with a blank Authorization header
    This is a supplementary test for validating Authentication, that I wanted to include as well. This test calls the given Snippet Group endpoint, however, the Auth header is left empty, and checks for the Unauthorized error.


### Improvements 
There are some things I would have liked to have tried for this project. I saw the use of snapshots in Jest for API testing, and this intrigued me to find a way to implement it.
Also, I feel the tests could be structured better in a way as adding test helper functions for data validation. The functions allow for better readability and code reuse. 
I think more tests could come from this example. I would have also liked to try other requests such as POST a new snippet in a snippet group.

