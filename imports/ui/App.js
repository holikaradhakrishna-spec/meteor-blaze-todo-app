import './App.html';
import './Task.js';
import './Login.js';
import { TasksCollection } from '../api/TasksCollection.js';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import Sortable from 'sortablejs';

const state = new ReactiveDict();

Template.mainContainer.onCreated(function() {
  this.subscribe('tasks');
  state.set('hideCompleted', false);
});

Template.taskList.onRendered(function() {
  const list = this.find('.task-list');
  if (!list) return;
  Sortable.create(list, {
    animation: 150,
    handle: '.task-item',
    onEnd: function(evt) {
      const items = list.querySelectorAll('.task-item');
      items.forEach(function(item, index) {
        const taskId = item.dataset.id;
        if (taskId) {
          Meteor.callAsync('tasks.updateOrder', { taskId, newOrder: index });
        }
      });
    }
  });
});

Template.mainContainer.helpers({
  tasks() {
    if (state.get('hideCompleted')) {
      return TasksCollection.find({ isChecked: { $ne: true } }, { sort: { order: 1 } });
    }
    return TasksCollection.find({}, { sort: { order: 1 } });
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
    // prevent page reload
    event.preventDefault();

    const target = event.target;
    const text = target.text.value.trim();
    const category = target.category.value;

    if (text.length === 0) {
      return;
    }

    Meteor.callAsync('tasks.insert', { text, category });

    target.text.value = '';
    target.category.value = '';
  },
  'click .hide-completed'() {
    state.set('hideCompleted', !state.get('hideCompleted'));
  },
  'click .logout-btn'() {
    Meteor.logout();
  },
});
