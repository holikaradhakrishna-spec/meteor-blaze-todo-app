// imports/ui/App.js
import './App.html';
import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection.js';

Template.mainContainer.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
});
