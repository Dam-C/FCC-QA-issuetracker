const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
    project_id: { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: '' },
    status_text: { type: String, default: '' },
    created_on: Date, 
    updated_on: Date,
    open: { type: Boolean, default: true },
})
const projectSchema = new Schema({
    project_name: { type: String, required: true },
})

const Issue = mongoose.model('Issue', issueSchema)
const Project = mongoose.model('Project', projectSchema)

exports.Issue = Issue;
exports.Project = Project;