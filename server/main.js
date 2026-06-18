import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '../imports/api/TasksCollection.js';
import '../imports/api/tasksMethods.js';
import '../imports/api/tasksPublications.js';

const insertTask = async (taskText, userId, order) => {
  await TasksCollection.insertAsync({
    text: taskText,
    createdAt: new Date(),
    userId,
    order,
  });
};

Meteor.startup(async () => {
  // create default user if not exists
  let user = await Meteor.users.findOneAsync({ username: 'meteorite' });
  if (!user) {
    const userId = await Accounts.createUserAsync({
      username: 'meteorite',
      password: 'password',
    });
    user = { _id: userId };
  }

  // seed initial tasks
  if (await TasksCollection.find().countAsync() === 0) {
    await insertTask('Buy groceries', user._id, 0);
    await insertTask('Walk the dog', user._id, 1);
    await insertTask('Code review', user._id, 2);
  }

  // make sure all tasks belong to meteorite user
  await TasksCollection.updateAsync(
    {},
    { $set: { userId: user._id } },
    { multi: true }
  );

  // migrate tasks missing order field
  const tasksWithoutOrder = await TasksCollection.find({ order: { $exists: false } }, { sort: { createdAt: 1 } }).fetchAsync();
  const userOrderCounters = {};
  for (const task of tasksWithoutOrder) {
    const userId = task.userId;
    if (!(userId in userOrderCounters)) {
      const highestTask = await TasksCollection.findOneAsync(
        { userId },
        { sort: { order: -1 } }
      );
      userOrderCounters[userId] = highestTask && typeof highestTask.order === 'number' ? highestTask.order + 1 : 0;
    }
    await TasksCollection.updateAsync(task._id, { $set: { order: userOrderCounters[userId] } });
    userOrderCounters[userId]++;
  }

  const allTasks = await TasksCollection.find().fetchAsync();
  console.log("=== DB TASKS IN STARTUP ===", allTasks);
});
