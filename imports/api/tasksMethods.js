import { Meteor } from 'meteor/meteor';
import { TasksCollection } from './TasksCollection.js';

Meteor.methods({
  async 'tasks.insert'({ text, category }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const highestTask = await TasksCollection.findOneAsync(
      { userId: this.userId },
      { sort: { order: -1 } }
    );
    const order = highestTask && typeof highestTask.order === 'number' ? highestTask.order + 1 : 0;

    await TasksCollection.insertAsync({
      text,
      category,
      order,
      isChecked: false,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

  async 'tasks.remove'({ taskId }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {
      const task = await TasksCollection.findOneAsync(taskId);
      if (!task || task.userId !== this.userId) {
        throw new Meteor.Error('not-authorized');
      }
    }

    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.setIsChecked'({ taskId, isChecked }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {
      const task = await TasksCollection.findOneAsync(taskId);
      if (!task || task.userId !== this.userId) {
        throw new Meteor.Error('not-authorized');
      }
    }

    await TasksCollection.updateAsync(taskId, {
      $set: { isChecked },
    });
  },

  async 'tasks.updateOrder'({ taskId, newOrder }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Meteor.isServer) {
      const task = await TasksCollection.findOneAsync(taskId);
      if (!task || task.userId !== this.userId) {
        throw new Meteor.Error('not-authorized');
      }
    }

    await TasksCollection.updateAsync(taskId, {
      $set: { order: newOrder },
    });
  },
});
