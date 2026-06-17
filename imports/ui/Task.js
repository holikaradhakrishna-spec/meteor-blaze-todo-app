import './Task.html';
import { TasksCollection } from '../api/TasksCollection.js';

Template.task.events({
  'click input[type=checkbox]': async function(event, instance) {
    await TasksCollection.updateAsync(this._id, {
      $set: { isChecked: !this.isChecked },
    });
  },
  'click .delete-btn': async function(event, instance) {
    await TasksCollection.removeAsync(this._id);
  },
});
