// imports/ui/App.js
import './App.html';
import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection.js';

Template.mainContainer.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
});

Template.mainContainer.events({
  'submit .task-form'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value.trim();

    if (text.length === 0) {
      return;
    }

    // Insert a task into the collection
    TasksCollection.insertAsync({
      text,
      createdAt: new Date(), // current time
      isChecked: false,
    });

    // Clear form
    target.text.value = '';
  },
});
