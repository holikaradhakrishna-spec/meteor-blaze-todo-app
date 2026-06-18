import { Meteor } from 'meteor/meteor';
import { TasksCollection } from './TasksCollection.js';

Meteor.methods({
  async 'tasks.insert'({ text }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await TasksCollection.insertAsync({
      text,
      isChecked: false,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

  async 'tasks.remove'({ taskId }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const task = await TasksCollection.findOneAsync(taskId);
    if (!task || task.userId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.setIsChecked'({ taskId, isChecked }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const task = await TasksCollection.findOneAsync(taskId);
    if (!task || task.userId !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    await TasksCollection.updateAsync(taskId, {
      $set: { isChecked },
    });
  },
});
