import './Task.html';
import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection.js';

Template.task.events({
  'click input[type=checkbox]'(event, instance) {
    Meteor.callAsync('tasks.setIsChecked', {
      taskId: this._id,
      isChecked: !this.isChecked,
    });
  },
  'click .delete-btn'(event, instance) {
    Meteor.callAsync('tasks.remove', { taskId: this._id });
  },
});

Template.task.helpers({
  categoryClass() {
    const map = { Work: 'category-work', Personal: 'category-personal', Urgent: 'category-urgent' };
    return map[this.category] || '';
  }
});
