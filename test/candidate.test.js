const chai = require('chai');
const chaiHttp = require('chai-http')
const server = require('../server');
chai.use(chaiHttp);
chai.should();
describe("CANDIDATE LIST", () => {
    const jwt = process.env.JWT
    const id = "candidate._id"
    // Get all data candidate list
    describe("GET ALL CANDIDATE LIST", () => {
        // Test get all data candidate
        it("should return all data", (done) => {
            chai.request(server)
                .get('/candidate-list')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        })
        // Test error get data candidate
        it('should return error if jwt is not provided', (done) => {
            chai.request(server)
                .get('/candidate-list')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Token invalid');
                    done();
                });
        });
    })
    // Get detail data candidate list
    describe("GET DETAIL CANDIDATE", () => {
        // Test get detail candidate
        it("should return detail data", (done) => {
            chai.request(server)
                .get(`/candidate-list/`)
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
                .get('/candidate-list/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    //delete by id data candidate list
    describe("DELETE CANDIDATE", () => {
        //Test delete CANDIDATE successfully
        it("should return delete data successfully", (done) => {
            chai.request(server)
                .delete(`/candidate-list/${id}`)
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                })
        })
        // Test invalid id
        it("should return when data deletion is not successful", (done) => {
            chai.request(server)
                .delete('/candidate-list/16541321654')
                .set("jwt", `${jwt}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                })
        })
    })
    describe('UPDATE CANDIDATE', () => {
        // Successful update candidate test
        it('should return update successfully', (done) => {
            const id = "candidate._id";
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc@gmail.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .patch(`/candidate-list/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
        //Test invalid Email
        it('should return an error if the email is invalid', (done) => {
            const id = "candidate._id";
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .patch(`/candidate-list/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        //Test invalid phone
        it('should return an error if the phone is invalid', (done) => {
            const id = "candidate._id";
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "684321650",
                email: "nmaquoc@gmai.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .patch(`/candidate-list/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test invalid date
        it('should return an error if the date is invalid', (done) => {
            const id = "candidate._id";
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-17-17",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc@gmail.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .patch(`/candidate-list/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test invalid ID
        it('should return an error if the ID is invalid', (done) => {
            const id = '123458762';
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc@gmail.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .patch(`/candidate-list/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });
    // TEST CREATE CANDIDATE
    describe("CREATE CANDIDATE", () => {
        // Test create candidate successfully 
        it("should return create successfully", (done) => {
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu báo thủ",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc@gmail.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .post(`/candidate-list/`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        })
        // Test University information already exists
        it("should return an error whe the University already exists", (done) => {
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu báo Ngà",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc@gmail.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
                abbreviations: 'TDTU'
            }
            chai.request(server)
                .post(`/candidate-list/`)
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
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .post(`/candidate-list`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        //Test invalid phone
        it('should return an error if the phone is invalid', (done) => {
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-07-07",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "684321650",
                email: "nmaquoc@gmai.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .post(`/candidate-list`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        // Test invalid date
        it('should return an error if the date is invalid', (done) => {
            const data = {
                numberOfInterviews: 0,
                status: "Finding project",
                booking: [],
                approveStatus: "Not Approve",
                firstPriority: "Full Stack",
                secondPriority: "Java",
                workLocation: "Ho Chi Minh City",
                typeOfInternship: "Part-time",
                year: "4th",
                everJoinedCompany: "No",
                universityCompulsoryRequirement: "No",
                batch: "101",
                fullName: "Trần ngọc diệp Châu",
                dateOfBirth: "2023-17-17",
                address: "Tan Binh Thanh, Cho Gao, Hau Giang",
                phone: "6843216500",
                email: "nmaquoc@gmail.com",
                studentId: "123",
                startDate: "2023-03-23",
                university: "Quy Nhơn university",
                faculty: "a",
                numberShotCovid: "2",
                GPA: "6",
                graduationYear: "3",
                applicantSignature: "Truong",
                signatureDate: "2023-07-07",
                source: "Direct apply",
            }
            chai.request(server)
                .post(`/candidate-list`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    })
    //TEST EDIT STATUS SUCCESS
    describe("EDIT STATUS CANDIDATE", () => {
        // test update successful candidate
        it('should return update status successfully', (done) => {
            const id = "candidate._id";
            const data = {
                status: "Failed 1st interview"
            }
            chai.request(server)
                .patch(`/candidate-list/editStatus/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });
        // Test Invalid STATUS
        it('should return error when status invalid', (done) => {
            const id = "candidate._id";
            const data = {
                status: "Invalid Status"
            }
            chai.request(server)
                .patch(`/candidate-list/editStatus/${id}`)
                .set("jwt", `${jwt}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    })
})
