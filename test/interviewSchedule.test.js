const chai = require('chai');
const chaiHttp = require('chai-http')
const server = require('../server');
chai.use(chaiHttp);
chai.should();
require("dotenv").config();
describe("INTERVIEW SCHEDULE", () => {
    const jwt = process.env.JWT
    const id = 'schedule._id'
    describe("GET ALL INTERVIEW SCHEDULE", () => {
        // Test get all data INTERVIEW SCHEDULE
        it("should return all data", (done) => {
            chai.request(server)
                .get('/interview-schedule')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
        // Test error get data INTERVIEW SCHEDULE
        it('should return error if jwt is not provided', (done) => {
            chai.request(server)
                .get('/interview-schedule')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done();
                });
        });
    })
    // Get detail data INTERVIEW SCHEDULE list
    describe("GET DETAIL INTERVIEW SCHEDULE", () => {
        // Test get detail INTERVIEW SCHEDULE
        it("should return detail data", (done) => {
            chai.request(server)
                .get(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
        // Test invalid id
        it("should return error when get detail data fail", (done) => {
            chai.request(server)
                .get('/interview-schedule/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    //delete by id data INTERVIEW SCHEDULE list
    describe("DELETE INTERVIEW SCHEDULE", () => {
        //Test delete INTERVIEW SCHEDULE successfully
        it("should return delete data successfully", (done) => {
            const id = "schedule._id"
            chai.request(server)
                .delete(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
        // Test invalid id
        it("should return when data deletion is not successful", (done) => {
            chai.request(server)
                .delete('/interview-schedule/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    describe("BOOKING INTERVIEW", () => {
        //TEST BOOKING SUCCESS
        it("should return object if booking success", (done) => {
            const data = {
                timeSlot: [
                    "8h00 2023-12-06"
                ],
                batch: 2,
                interviewName: "Test Tướng",
                interviewManager: "VIP PRO 123",
                emailManager: "vippro123@gmail.com",
                candidateData: "id_candidate",
                bookingTime: "Dec 6, 2022, 3:00:14 PM",
            }
            chai.request(server)
                .post(`/interview-schedule/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        })
        //TEST BOOKING FAIL
        it("should return fail when booking fail", (done) => {
            const data = {
                timeSlot: [
                    "8h00 2023-12-06"
                ],
                batch: 36,
                interviewName: "Trần Thị Thu Uyên Ương",
                interviewManager: "VIP PRO 123",
                emailManager: "vippro123@gmail.com",
                candidateData: "id_candidate",
                bookingTime: "Dec 6, 2022, 3:00:14 PM",
            }
            chai.request(server)
                .post(`/interview-schedule/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })
    // TEST UPDATE INTERVIEW SCHEDULE
    describe("UPDATE INTERVIEW SCHEDULE", () => {
        //TEST UPDATE SUCCESSFULLY
        it("should return update successfully", (done) => {
            const id = "IRN._id"
            const data = {
                status: "not show up"
            }
            chai.request(server)
                .patch(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        })
        // TEST UPDATE FAIL WHEN COULD NOT FIND USER ON INTERVIEW-SCHEDULE VIEW
        it("should return error if could not find user on interview-schedule", (done) => {
            const id = "schedule._id"
            const data = {
                interviewName: "Trần Thị Ương Bướng",
                interviewManager: "VIP PRO 123",
                emailManager: "nhnhu@gmail.com.vn"
            }
            chai.request(server)
                .patch(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
        // TEST UPDATE FAIL WHEN COULD NOT FIND USER ON CANDIDATE-LIST VIEW
        it("should return error could not find user on candidate-list", (done) => {
            const id = "schedule._id"
            const data = {
                interviewName: "Trần Thị Ương Bướng",
                interviewManager: "VIP PRO 123",
                emailManager: "vippro123@gmail.com",
                status: "failed",
                commentSchedule: "abc",
            }
            chai.request(server)
                .patch(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
        // TEST UPDATE FAIL WHEN STATUS INVALID 
        it("should return error  when  status invalid", (done) => {
            const id = "schedule._id"
            const data = {
                interviewName: "Trần Thị Ương Bướng",
                interviewManager: "VIP PRO 123",
                emailManager: "vippro123@gmail.com",
                status: "failedD",
                commentSchedule: "abc",
            }
            chai.request(server)
                .patch(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
        // TEST UPDATE FAIL WHEN 'commentSchedule' empty
        it("should return error when comment with empty", (done) => {
            const id = "schedule._id"
            const data = {
                interviewName: "Trần Thị Ương Bướng",
                interviewManager: "VIP PRO 123",
                emailManager: "vippro123@gmail.com",
                status: "passed",
                commentSchedule: "",
            }
            chai.request(server)
                .patch(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property("message").eql("Require comment")
                    done();
                });
        })
        // TEST UPDATE FAIL WHEN No change was mad
        it("should return error when No change was mad", (done) => {
            const id = "schedule._id"
            const data = {
                status: "not show up",
            }
            chai.request(server)
                .patch(`/interview-schedule/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })
    // CONFIRM INTERVIEW SCHEDULE
    describe('TEST CONFIRM INTERVIEW SCHEDULE', () => {
        it("should return confirm successfully", (done) => {
            const id = "schedule._id"
            const data = {
                timeSlot: "8h00 2023-12-06",
            }
            chai.request(server)
                .patch(`/interview-schedule/confirm/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        })
        it("should return error confirm fail when input data is empty", (done) => {
            const id = "schedule._id"
            const data = {

            }
            chai.request(server)
                .patch(`/interview-schedule/confirm/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
    })
})