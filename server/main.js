// server/main.js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/api/TasksCollection.js';
import '../imports/api/tasksMethods.js';

const insertTask = async (taskText, userId) => {
  await TasksCollection.insertAsync({
    text: taskText,
    createdAt: new Date(),
    userId,
  });
};

Meteor.startup(async () => {
  // 1. Ensure meteorite user is seeded first
  let user = await Meteor.users.findOneAsync({ username: 'meteorite' });
  if (!user) {
    const userId = await Accounts.createUserAsync({
      username: 'meteorite',
      password: 'password',
    });
    user = { _id: userId };
  }

  // 2. Seed default tasks owned by meteorite user
  if (await TasksCollection.find().countAsync() === 0) {
    await insertTask('Buy groceries', user._id);
    await insertTask('Walk the dog', user._id);
    await insertTask('Code review', user._id);
  }

  // 3. Assign all tasks in the database to the meteorite user to ensure matching ownership
  await TasksCollection.updateAsync(
    {},
    { $set: { userId: user._id } },
    { multi: true }
  );

  const allTasks = await TasksCollection.find().fetchAsync();
  console.log("=== DB TASKS IN STARTUP ===", allTasks);
});
