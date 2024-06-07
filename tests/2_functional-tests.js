const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deadIssue1;
let deadIssue2;

suite('Functional Tests', function() {
    suite('POST requests', () => {
        test('Create an issue with every field: POST request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .post('/api/issues/test')
            .set('content-type', 'application/json')
            .send({
                issue_title: 'test1',
                issue_text: 'Text',
                created_by: 'Creator',
                assigned_to: 'worker',
                status_text: 'ToDo',
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                deadIssue1 = res.body;
                assert.equal(res.body.issue_title, "test1");
                assert.equal(res.body.issue_text, "Text");
                assert.equal(res.body.created_by, "Creator");
                assert.equal(res.body.assigned_to, "worker");
                assert.equal(res.body.status_text, "ToDo");
                done();
            });
        }).timeout(10000);
        test('Create an issue with only required fields: POST request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .post('/api/issues/test')
            .set('content-type', 'application/json')
            .send({
                issue_title: 'AFAIRE',
                issue_text: 'LETEXTE',
                created_by: 'DIEU',
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                deadIssue2 = res.body;
                assert.equal(res.body.issue_title, "AFAIRE");
                assert.equal(res.body.issue_text, "LETEXTE");
                assert.equal(res.body.created_by, "DIEU");
                done();
            });
        }).timeout(10000);
        test('Create an issue with missing required fields: POST request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .post('/api/issues/test')
            .set({
                issue_title: 'AFAIRE',
                issue_text: 'LETEXTE',
                created_by: 'DIEU',
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
                    });
            }).timeout(10000);
        });
    });
//============================================================
    suite('GET requests', () => {
        test('View issues on a project: GET request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .get('/api/issues/test')
            .end((req, res) => {
                assert.equal(res.status, 200);
                done();
            });
        }).timeout(10000);
        test('View issues on a project with one filter: GET request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .get('/api/issues/test')
            .query({ _id: deadIssue1._id })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body[0].issue_title, deadIssue1.issue_title);
                assert.equal(res.body[0].issue_text, deadIssue1.issue_text);
                done();
            });
        }).timeout(10000);
        test('View issues on a project with multiple filters: GET request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .get('/api/issues/test')
            .query({
                issue_title: deadIssue1.issue_title,
                open: true,
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body[0].issue_title, deadIssue1.issue_title);
                assert.equal(res.body[0].issue_text, deadIssue1.issue_text);
                done();
            });
        }).timeout(10000);
    })
//============================================================
    suite('PUT requests', () => {
        test('Update one field on an issue: PUT request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .put('/api/issues/test')
            .send({
                _id: deadIssue1._id,
                issue_title: "NEWTITLE"
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, deadIssue1._id);
                done();
            });
        }).timeout(10000);
        test('Update one field on an issue: PUT request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .put('/api/issues/test')
            .send({
                _id: deadIssue1._id,
                issue_title: "NEWTITLE"
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, deadIssue1._id);
                done();
            });
        }).timeout(10000);
        test('Update multiple fields on an issue: PUT request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .put('/api/issues/test')
            .send({
                _id: deadIssue1._id,
                issue_title: "NEWTITLE",
                issue_text: "NEWTEXT",
                assigned_to: "NEWWORKER",
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, deadIssue1._id);
                done();
            });
        }).timeout(10000);
        test('Update an issue with missing _id: PUT request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .put('/api/issues/test')
            .send({
                issue_title: "NEWTITLE",
                issue_text: "NEWTEXT",
                assigned_to: "NEWWORKER",
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        }).timeout(10000);
        test('Update an issue with no fields to update: PUT request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .put('/api/issues/test')
            .send({ _id: deadIssue1._id })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, deadIssue1._id);
                done();
            });
        }).timeout(10000);
        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .put('/api/issues/test')
            .send({
                _id: 'badid',
                issue_title: "NEWTITLE",
                issue_text: "NEWTEXT",
                assigned_to: "NEWWORKER",
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, 'badid');
                done();
            });
        }).timeout(10000);
    })
    //============================================================
    suite('DELETE requests', () => {
        test('Delete an issue: DELETE request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .delete('/api/issues/test')
            .send({_id: deadIssue2._id })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, deadIssue2._id);
                done();
            });
        }).timeout(10000);
        
        
        test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .delete('/api/issues/test')
            .send({ _id: "5871dda29faedc3491ff93bt" })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body._id, "5871dda29faedc3491ff93bt");
                done();
            });
        }).timeout(10000);
        test('Delete an issue with missing _id: DELETE request to /api/issues/{project}',(done) => {
            chai
            .request(server)
            .delete('/api/issues/test')
            .send({})
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        }).timeout(10000);
})
