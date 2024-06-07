'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Issue = require('./models').Issue;
const Project = require('./models').Project;

mongoose.connect(process.env.MONGO_URI)

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let finalRes;
      let projectName = req.params.project;
      let getProject = await Project.findOne({project_name: projectName})
      // inform user if not
      if(!getProject) { 
        finalRes = {error: 'project not found'};
      } else {
        // else get issues associated to project
        let getIssues = await Issue.find({
          project_id: getProject._id,
          ...req.query});
        // inform user if no issue is associated to project
        if (!getIssues) {
          finalRes = { error: 'no issues found'}
        } else {
          // send associated issues to user
          finalRes = getIssues;
        }
      }
      res.send(finalRes)
    })
    

    .post(async (req, res) => {
      let finalRes;
      let project_name = req.params.project;
      let project_id;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      // check if required fields are provided
      if (!issue_title || !issue_text || !created_by) {
        finalRes = { error: 'required field(s) missing' } 
      } else {
        // check if project exists
        // if (!project_name) {project_name = 'Random project'}
        
        let pExists = await Project.findOne({project_name: project_name})
        // if not
        if(!pExists) {
          // create project 
          let newProject = new Project({
            project_name: project_name
          });
          // try to insert it
          let addProject = await newProject.save();
          // set message to indicate it could not be done if not
          if (!addProject){ 
            finalRes = { error: 'could not create Project' } 
          } else {
            // get project id from new project
            project_id = addProject._id;
          }
        } else {
          // get project id from existing project
          project_id = pExists._id;
        }
        
        try{
          let newIssue = new Issue({
            project_id: project_id,
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            assigned_to: assigned_to,
            status_text: status_text,
            created_on: Date.now(),
            updated_on: Date.now(),
            open: true
          })
          // resume process of creating issue
          //try to insert issue to DB
          let iDoc = await newIssue.save()
          // set final res to result of created issue
     
          finalRes = {
            assigned_to: iDoc.assigned_to || '',
            status_text: iDoc.status_text || '',
            open: iDoc.open,
            _id: iDoc._id,
            issue_title:iDoc.issue_title,
            issue_text:iDoc.issue_text,
            created_by: iDoc.created_by,
            created_on:iDoc.created_on,
            updated_on:iDoc.updated_on,
          }          
        } catch (error) {
          //set error msg if cannot create issue
          finalRes = { error: 'could not create Issue' } 
        }
      }
      //display issue informations
      res.send(finalRes)      
    })
    
    .put(async (req, res) => {
      let finalRes;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      // initiate an update obj
      
      if(!_id) {
        finalRes = {error: 'missing _id'}
      } else if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open){
        finalRes = {error: 'no update field(s) sent', '_id': _id }
      } else {
        let updateIssue = {updated_on: Date.now()} ;
        // fill it with existing parameters from user
        if (issue_title) { updateIssue['issue_title'] = issue_title }
        if (issue_text) { updateIssue['issue_text'] = issue_text }
        if (created_by) { updateIssue['created_by'] = created_by }
        if (assigned_to) { updateIssue['assigned_to'] = assigned_to }
        if (status_text) { updateIssue['status_text'] = status_text }
        if (open) { updateIssue['open'] = false }
        // try to insert new datas
        try{
          let doc = await Issue.findOneAndUpdate(
            { _id: _id },
            updateIssue,
            { new: true }
          )
          // inform user of successfull update
          finalRes = {result: 'successfully updated', _id: doc._id}
        } catch (error) {
          // inform user if not possible
          finalRes = { error: 'could not update', '_id': _id }
        }
      }
      res.send(finalRes)
    })
    
    .delete(async (req, res) => {
      let finalRes;
      let project = req.params.project
      let _id = req.body._id;
      // send error message if no id is provided
      if (!_id){
        finalRes = { error: 'missing _id'  };
      } else {
        // check if issue exists
        try {
          let delIssue = await Issue.deleteOne({_id: _id}); 
          if (delIssue.deletedCount == 0) {
            finalRes = { error: 'could not delete', '_id': _id };
          } else {
            finalRes = { result: 'successfully deleted', '_id': _id};
          }
        } catch (error) {
          finalRes = { error: 'could not delete', '_id': _id };
        }
      }
      res.send(finalRes) 
    });
};