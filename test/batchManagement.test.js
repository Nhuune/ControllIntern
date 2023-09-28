const chai = require('chai');
const chaiHttp = require('chai-http')
const server = require('../server');
chai.use(chaiHttp);
chai.should();

describe("BATCH MANAGEMENT", () => {
    const jwt = process.env.JWT
    const id = "batchManagement_id"
    describe("GET ALL BATCH MANAGEMENT", () => {
        // Test get all data BATCH MANAGEMENT
        it("should return all data", (done) => {
            chai.request(server)
                .get('/batch-management')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
        // Test error get data BATCH MANAGEMENT
        it('should return error if jwt is not provided', (done) => {
            chai.request(server)
                .get('/batch-management')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done();
                });
        });
    })
    describe("GET DETAIL BATCH MANAGEMENT", () => {
        // Test get detail BATCH MANAGEMENT
        it("should return detail data", (done) => {
            chai.request(server)
                .get(`/batch-management/${id}`)
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
                .get('/batch-management/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    describe("DELETE  BATCH MANAGEMENT", () => {
        //Test delete BATCH MANAGEMENT successfully
        it("should return delete data successfully", (done) => {
            const id = "batchManagement_id"
            chai.request(server)
                .delete(`/batch-management/${id}`)
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
        // Test invalid id
        it("should return when data deletion is not successful", (done) => {
            chai.request(server)
                .delete('/batch-management/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    describe('UPDATE BATCH MANAGEMENT', () => {
        // Successful update batch management test
        it('should return update successfully', (done) => {
            const data = {
                status: "On-Going",
            }
            chai.request(server)
                .patch(`/batch-management/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        // check invalid status of batch
        it('should return an error when status invalid', (done) => {
            const data = {
                status: "Going",
            }
            chai.request(server)
                .patch(`/batch-management/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test unable to batch closing 
        it('should return an error on unable to batch closing', (done) => {
            const data = {
                status: "Closed",
            }
            const id = "batchManagement_id"
            chai.request(server)
                .patch(`/batch-management/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test invalid ID
        it('should return error return an error if the ID is invalid', (done) => {
            const id = '123458762';
            const data = {
                endDate: "2023-08-08",
                status: "Open",
            }
            chai.request(server)
                .patch(`/batch-management/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });
    describe('CREATE BATCH MANAGEMENT', () => {
        // Test create batch management successfully 
        it('should return create successfully', (done) => {
            const data = {
                batch: 107,
                startDate: "2023-07-07",
                endDate: "2023-08-08",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        // Test invalid start date
        it('should return an error when the start date is invalid', (done) => {
            const data = {
                batch: 108,
                startDate: "2023-04-07",
                endDate: "2023-08-08",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test invalid end date
        it('should return an error when the end date is invalid', (done) => {
            const data = {
                batch: 108,
                startDate: "2023-08-08",
                endDate: "2023-04-07",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test the start date of this smaller test is now
        it('should return an invalid start date error if the start date of this smaller test is now', (done) => {
            const data = {
                batch: 108,
                startDate: "2023-05-07",
                endDate: "2023-04-25",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test the value of the date exceeds the limit
        it('should return an error when the gap between the start date and end date is greater than 365 days', (done) => {
            const data = {
                batch: 108,
                startDate: "2023-05-07",
                endDate: "2026-04-25",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test batch value already exists
        it('should return a duplicate error when the batch value already exists', (done) => {
            const data = {
                batch: 3,
                startDate: "2023-05-07",
                endDate: "2023-07-25",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test start date already exists
        it('should return error that start date already exists', (done) => {
            const data = {
                batch: 1009,
                startDate: "2023-04-25",
                endDate: "2023-05-25",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test end date already exists
        it('should return  error that end date already exists ', (done) => {
            const data = {
                batch: 1009,
                startDate: "2023-05-29",
                endDate: "2023-06-28",
                skill: [
                    {
                        name: "Front-End"
                    },
                    {
                        name: "Back-end"
                    },
                    {
                        name: "Embedded"
                    },
                ]
            }
            chai.request(server)
                .post(`/batch-management/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
})