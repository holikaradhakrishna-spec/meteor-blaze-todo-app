import './App.html';
import './Task.js';
import './Login.js';
import { TasksCollection } from '../api/TasksCollection.js';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';

const state = new ReactiveDict();

Template.mainContainer.onCreated(function() {
  this.subscribe('tasks');
  state.set('hideCompleted', false);
});

Template.mainContainer.helpers({
  tasks() {
    if (state.get('hideCompleted')) {
      return TasksCollection.find({ isChecked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
  hideCompleted() {
    return state.get('hideCompleted');
  },
  pendingTasksCount() {
    return TasksCollection.find({ isChecked: { $ne: true } }).count();
  },
  isLoading() {
    return !Template.instance().subscriptionsReady();
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

    // Insert a task via Meteor Method
    Meteor.callAsync('tasks.insert', { text });

    // Clear form
    target.text.value = '';
  },
  'click .hide-completed'() {
    state.set('hideCompleted', !state.get('hideCompleted'));
  },
  'click .logout-btn'() {
    Meteor.logout();
  },
});
