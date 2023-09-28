const chai = require('chai');
const chaiHttp = require('chai-http')
const server = require('../server');
chai.use(chaiHttp);
chai.should();
describe("INTERN RESOURCE NEED", () => {
    const jwt = process.env.JWT
    const id = "IRN._id"
    describe("GET ALL INTERN RESOURCE NEED", () => {
        // Test get all data INTERN RESOURCE NEED
        it("should return all data", (done) => {
            chai.request(server)
                .get('/intern-resource-need')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
        // Test error get data INTERN RESOURCE NEED
        it('should return error if jwt is not provided', (done) => {
            chai.request(server)
                .get('/intern-resource-need')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done();
                });
        });
    })
    describe("GET DETAIL INTERN RESOURCE NEED", () => {
        // Test get detail INTERN RESOURCE NEED
        it("should return detail data", (done) => {
            chai.request(server)
                .get(`/intern-resource-need/${id}`)
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })
        // Test invalid id
        it("should return error when get detail data fail", (done) => {
            chai.request(server)
                .get('/intern-resource-need/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    describe("DELETE  INTERN RESOURCE NEED", () => {
        //Test delete INTERN RESOURCE NEED successfully  
        it("should return delete data successfully", (done) => {
            const id = "IRN._id"
            chai.request(server)
                .delete(`/intern-resource-need/${id}`)
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
        // Test invalid id
        it("should return when data deletion is not successful", (done) => {
            chai.request(server)
                .delete('/intern-resource-need/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    describe("CREATE REQUEST INTERN RESOURCE NEED", () => {
        //Test create INTERN RESOURCE NEED successfully  
        it("should return create successfully", (done) => {
            const data = {
                batch: "7",
                requester: "ngoc",
                team: "team",
                location: "Ho Chi Minh",
                remark: "None",
                DC: "22",
                skills: "Front-End Developer",
                directMentor: "directMentor",
                internResourceNeed: 2,
                internshipProjectName: "internshipProjectName",
                jobTitle: "Team leader",
                projectDescription: "Building Dashboard and Infra using Angular",
                projectLeader: "projectLeader",
                whatSkills: "ReactJS",
                email: "vippro123@gmail.com"
            }
            chai.request(server)
                .post(`/intern-resource-need/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        })
        // Test data already exists
        it("should return an error if data already exists", (done) => {
            const data = {
                batch: "1",
                requester: "nhu",
                team: "team",
                location: "Ho Chi Minh",
                remark: "None",
                DC: "22",
                skills: "Front-End Developer",
                directMentor: "directMentor",
                internResourceNeed: 2,
                internshipProjectName: "internshipProjectName",
                jobTitle: "Team leader",
                projectDescription: "Building Dashboard and Infra using Angular",
                projectLeader: "projectLeader",
                whatSkills: "ReactJS",
                email: "vippro123@gmail.com"
            }
            chai.request(server)
                .post(`/intern-resource-need/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
        //Test invalid Email
        it('should return an error if the email is invalid', (done) => {
            const data = {
                batch: "12",
                requester: "c",
                team: "team",
                location: "Ho Chi Minh",
                remark: "None",
                DC: "22",
                skills: "Front-End Developer",
                directMentor: "directMentor",
                internResourceNeed: 2,
                internshipProjectName: "internshipProjectName",
                jobTitle: "Team leader",
                projectDescription: "Building Dashboard and Infra using Angular",
                projectLeader: "projectLeader",
                whatSkills: "ReactJS",
                email: "invalid_email"
            }
            chai.request(server)
                .post(`/intern-resource-need`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        //Test invalid field requester
        it('should return an error if the requester is invalid', (done) => {
            const data = {
                batch: "10",
                requester: "  ",
                team: "team",
                location: "Ho Chi Minh",
                remark: "None",
                DC: "22",
                skills: "Front-End Developer",
                directMentor: "directMentor",
                internResourceNeed: 2,
                internshipProjectName: "internshipProjectName",
                jobTitle: "Team leader",
                projectDescription: "Building Dashboard and Infra using Angular",
                projectLeader: "projectLeader",
                whatSkills: "ReactJS",
                email: "ctal@gmail.com.vn"
            }
            chai.request(server)
                .post(`/intern-resource-need`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        //Test invalid field whatSkill
        it('should return an error if the whatSkill is invalid', (done) => {
            const data = {
                batch: "10",
                requester: "q",
                team: "team",
                location: "Ho Chi Minh",
                remark: "None",
                DC: "22",
                skills: "Front-End Developer",
                directMentor: "directMentor",
                internResourceNeed: 2,
                internshipProjectName: "internshipProjectName",
                jobTitle: "Team leader",
                projectDescription: "Building Dashboard and Infra using Angular",
                projectLeader: "projectLeader",
                whatSkills: " ",
                email: "nlk@gmail.com.vn"
            }
            chai.request(server)
                .post(`/intern-resource-need`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    })
    describe('UPDATE INTERN RESOURCE NEED', () => {
        // Test update intern resource need successfully
        const id = "IRN._id"
        it('should return update successfully', (done) => {
            const data = {
                requester: "C",
                skills: "Front-End Developer",
                internResourceNeed: 10,
                whatSkills: "Alo",
                email: "nlk@gmail.com.vn"
            }
            chai.request(server)
                .patch(`/intern-resource-need/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        //Test invalid Email
        it('should return an error if the email is invalid', (done) => {
            const data = {
                requester: "q",
                skills: "Front-End Developer",
                internResourceNeed: 10,
                whatSkills: "alo",
                email: "nlk"
            }
            chai.request(server)
                .patch(`/intern-resource-need/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        //Test invalid field requester
        it('should return an error if the requester is invalid', (done) => {
            const data = {
                requester: "     ",
                skills: "Front-End Developer",
                internResourceNeed: 10,
                whatSkills: "alo",
                email: "nlk@gmail.com.vn"
            }
            chai.request(server)
                .patch(`/intern-resource-need/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        //Test invalid field whatSkill
        it('should return an error if the whatSkill is invalid', (done) => {
            const data = {
                requester: "nhu",
                internResourceNeed: 2,
                whatSkills: "  ",
                email: "vippro123@gmail.com"
            }
            chai.request(server)
                .patch(`/intern-resource-need/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
})