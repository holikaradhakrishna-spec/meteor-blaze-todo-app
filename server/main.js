// server/main.js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/api/TasksCollection.js';

const insertTask = async (taskText) => {
  await TasksCollection.insertAsync({ text: taskText, createdAt: new Date() });
};

Meteor.startup(async () => {
  if (await TasksCollection.find().countAsync() === 0) {
    await insertTask('Buy groceries');
    await insertTask('Walk the dog');
    await insertTask('Code review');
  }

  if (await Meteor.users.find().countAsync() === 0) {
    await Accounts.createUserAsync({
      username: 'meteorite',
      password: 'password',
    });
  }
});
