// imports/ui/Task.js
import './Task.html';
import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection.js';

Template.task.events({
  'click input[type=checkbox]'() {
    // Toggle the checked state
    TasksCollection.updateAsync(this._id, {
      $set: { isChecked: !this.isChecked },
    });
  },
  'click .delete-btn'() {
    TasksCollection.removeAsync(this._id);
  },
});
