import './Login.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.login.events({
  'submit form'(event) {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    Meteor.loginWithPassword(username, password, function (err) {
      if (err) {
        alert(err.reason);
      }
    });
  },
});
