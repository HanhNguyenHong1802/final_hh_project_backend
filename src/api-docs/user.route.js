const userDocs = () => {
  /**
   *
   * @apiDefine userProfileRequestResponse
   * @apiHeader {string} Authorization Bearer Token
   *
   * @apiSuccess {number} statusCode Statuscode of response
   * @apiSuccess {string} message Message of response
   * @apiSuccess {string} _id Id of user
   * @apiSuccess {string} firstName Firstname of user
   * @apiSuccess {string} lastName  Lastname of user
   * @apiSuccess {string} userId Userid of  user
   * @apiSuccess {string} gender Gender of user
   * @apiSuccess {string} mobileNo Mobile number of user
   * @apiSuccess {string} createdAt Created time  of user
   * @apiSuccess {string} updatedAt Updated time of user
   * @apiSuccess {string} __v Version Key
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *   {
   *   "statusCode": 200,
   *   "message": "OK",
   *   "data": {
   *       "_id": "6125e724dee17b9456004366",
   *       "firstName": "Ashish",
   *       "lastName": "Soni",
   *       "userId": "ashish_s",
   *       "gender": "male",
   *       "mobileNo": "2132763536",
   *       "createdAt": "2021-08-25T06:45:56.363Z",
   *       "updatedAt": "2021-08-25T06:45:56.363Z",
   *       "__v": 0
   *     }
   *   }
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 401 Invalid token
   *  {
   *   "statusCode": 401,
   *   "message": "Invalid token",
   *   "data": {}
   *  }
   *
   */
  /**
   *
   * @apiDefine loginRequestResponse
   * @apiParam {String} userId Username of the user
   * @apiParam {String} password Password of the user
   * @apiParamExample {json} Input
   *  {
   *      "userId": "ashish",
   *      "password": "ashish@1234"
   *   }
   * @apiSuccess {number} statusCode Statuscode of response
   * @apiSuccess {string} message Message of response
   * @apiSuccess {string} _id Id of User
   * @apiSuccess {string} role Role of User
   * @apiSuccess {string} userId UserId of User
   * @apiSuccess {string} partnerId Partner Id to which user belongs to
   * @apiSuccess {string} designation Designation of User
   * @apiSuccess {string} empid Employee Id of the User
   * @apiSuccess {string} token Token for Login
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   *    {
   *    "statusCode": 200,
   *   "message": "OK",
   *   "data": {
   *       "user": {
   *           "_id": "5ea6c7daadaa38823a670c88",
   *           "role": "user",
   *           "userId": "ashish",
   *           "partnerId": "5e9408a6cb1b6d0013134140",
   *           "designation": "SP",
   *           "empid": "2098"
   *       },
   *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWE2YzdkYWFkYWEzODgyM2E2NzBjODgiLCJyb2xlIjoidXNlciIsInVzZXJJZCI6InZpY2tyYW50IiwicGFydG5lcklkIjoiNWU5NDA4YTZjYjFiNmQwMDEzMTM0MTQwIiwiZGVzaWduYXRpb24iOiJTUCIsImVtcGlkIjoiMjA5OCIsImlhdCI6MTU5NDgxNjAzMiwiZXhwIjoxNTk0ODE3ODMyfQ.3VgSvi1whJRpULy7LuNZ6636vMmMTGKzNnnVcHRGHek"
   *   }
   *   }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 401 Invalid Password
   *      {
   *          "statusCode": 401,
   *          "message": "Invalid password"
   *      }
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 404 Invalid Password
   *      {
   *          "statusCode": 404,
   *          "message": "User not Found"
   *      }
   */
  /**
   *
   * @apiDefine logoutRequestResponse
   * @apiHeader {string} Authorization Bearer Token
   *
   * @apiSuccess (200) {number} statusCode StatusCode of response
   * @apiSuccess (200) {string} message  Message of Response
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 User logout successful
   *
   *  {
   *    "statusCode": 200,
   *    "message": "User logout successful"
   *  }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 401 Invalid token
   *  {
   *   "statusCode": 401,
   *   "message": "Invalid token",
   *   "data": {}
   *  }
   *
   */
  /**
   *
   * @apiDefine signUpRequestResponse
   * @apiHeader {string} Authorization Bearer Token
   *
   * @apiParam  {String} firstName Firsname of user
   * @apiParam  {String} lastName  Lastname of user
   * @apiParam  {String} userId  UserId of user
   * @apiParam  {Stgrin} password Password of user
   * @apiParam  {String} gender gender of user
   * @apiParam  {number} mobileno  Mobile number of user
   *
   * @apiSuccess (200) {Number} statusCode StatusCode of Response
   * @apiSuccess (200) {String} message Message of Response
   * @apiSuccess (200) {String} _id  Id of user
   * @apiSuccess (200) {String} firstName Firstname of user
   * @apiSuccess (200) {String} userId UserId of user
   * @apiSuccess (200) {String} gender Gender of user
   * @apiSuccess (200) {number} mobileNo Mobile number of user
   * @apiSuccess (200) {String} createdAt Created time of user
   * @apiSuccess (200) {String} updatedAt Updated time  of user
   * @apiSuccess (200) {String} __v Version key
   * @apiParamExample  {json} Request-Example:
   * {
   *    "firstName": "Ashish",
   *    "lastName": "Soni",
   *    "userId": "ashish_s",
   *    "password": "ashish@928",
   *    "gender": "male",
   *    "mobileNo": "2132763536"
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 Ok
   * {
   *    "statusCode": 200,
   *    "message": "Ok",
   *   "data": {
   *      "_id": "6125e724dee17b9456004366",
   *      "firstName": "Ashish",
   *      "lastName": "Soni",
   *      "userId": "ashish_s",
   *      "gender": "male",
   *      "mobileNo": "2132763536",
   *      "createdAt": "2021-08-25T06:45:56.363Z",
   *      "updatedAt": "2021-08-25T06:45:56.363Z",
   *      "__v": 0
   *     }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 401 Invalid token
   *  {
   *   "statusCode": 401,
   *   "message": "Invalid token",
   *   "data": {}
   *  }
   *
   */
}

export { userDocs }
