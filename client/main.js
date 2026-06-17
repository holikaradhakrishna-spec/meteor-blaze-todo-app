// client/main.js
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import '../imports/ui/App.js';

Meteor.startup(() => {
  Blaze.render(Template.mainContainer, document.getElementById('app'));
});
