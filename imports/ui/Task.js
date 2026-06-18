import './Task.html';
import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection.js';

Template.task.events({
  'click input[type=checkbox]'(event, instance) {
    Meteor.call('tasks.setIsChecked', {
      taskId: this._id,
      isChecked: !this.isChecked,
    });
  },
  'click .delete-btn'(event, instance) {
    Meteor.call('tasks.remove', { taskId: this._id });
  },
});
