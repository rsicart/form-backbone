$(function() {

var Field = Backbone.Model.extend({
    defaults: function(){
        return {
            'id': '',
            'name': '',
            'type': '',
            'value': '',
            'validation': '',
            'options': '',
        }
    },
    isValid: function () {
        return this.get('validation').test(this.get('value'));
    },
});

// Base View class
var FieldView = Backbone.View.extend({
    tagName: 'div',
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        "change": "updateValue",
    },
    getInput: function () {
        console.error('Not implemented!');
    },
    updateValue: function () {
        console.error('Not implemented!');
    },
    enable: function () {
        this.getInput().prop("disabled", false);
    },
    disable: function () {
        this.getInput().prop("disabled", true);
    },
});

var FieldSelectView = FieldView.extend({
    template: _.template($('#tpl-input-select').html()),
    getInput: function () {
        return this.$el.children('select')
    },
    updateValue: function () {
        var value = this.getInput().val();
        this.model.set('value', value);
        if (!this.model.isValid()) {
            console.log(this.model.get('name') + ' contains invalid value: ' + this.model.get('value'));
            this.$el.addClass('error');
        } else {
            this.$el.removeClass('error');
        }
        return this.model.isValid();
    },
});

var FieldButtonView = FieldView.extend({
    template: _.template($('#tpl-input-button').html()),
    getInput: function () {
        return this.$el.children('input[type="button"]')
    },
});

// setup form field instances
var cities = [
    {'id': 1, 'name': 'Paris',},
    {'id': 2, 'name': 'Marseille',},
];
var durations = [
    {'id': 60, 'name': '1 hour',},
    {'id': 120, 'name': '2 hours',},
];

var fromLocationField = new Field();
fromLocationField.set('id', 'id_from_location');
fromLocationField.set('name', 'from_location');
fromLocationField.set('type', 'select');
fromLocationField.set('validation', /[0-9]+/);
fromLocationField.set('options', cities);

var toLocationField = new Field();
toLocationField.set('id', 'id_to_location');
toLocationField.set('name', 'to_location');
toLocationField.set('type', 'select');
toLocationField.set('validation', /[0-9]+/);
toLocationField.set('options', cities);

var pointsButton = new Field();
pointsButton.set('id', 'id_points_button');
pointsButton.set('name', 'points_button');
pointsButton.set('type', 'button');
pointsButton.set('value', 'Submit');

var fromLocationExclusiveField = new Field();
fromLocationExclusiveField.set('id', 'id_from_location');
fromLocationExclusiveField.set('name', 'from_location');
fromLocationExclusiveField.set('type', 'select');
fromLocationExclusiveField.set('validation', /[0-9]+/);
fromLocationExclusiveField.set('options', cities);

var durationField = new Field();
durationField.set('id', 'id_duration');
durationField.set('name', 'duration');
durationField.set('type', 'select');
durationField.set('validation', /[0-9]+/);
durationField.set('options', durations);

var exclusiveButton = new Field();
exclusiveButton.set('id', 'id_exclusive_button');
exclusiveButton.set('name', 'exclusive_button');
exclusiveButton.set('type', 'button');
exclusiveButton.set('value', 'Submit');

// setup app view
var PointsView = Backbone.View.extend({
    el: $("#step1-points"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['fromLocation'] = new FieldSelectView({id: fromLocationField.get('name'), model: fromLocationField});
        this.fieldViews['toLocation'] = new FieldSelectView({id: toLocationField.get('name'), model: toLocationField});
        this.fieldViews['pointsButton'] = new FieldButtonView({id: pointsButton.get('name'), model: pointsButton});
        // listen to events
        this.listenTo(fromLocationField, 'change', function(){
            if (this.fieldViews['fromLocation'].model.isValid() === true && this.fieldViews['toLocation'].model.isValid() === true) {
                this.fieldViews['pointsButton'].enable();
            } else {
                this.fieldViews['pointsButton'].disable();
            }
        });
        this.listenTo(toLocationField, 'change', function(){
            if (this.fieldViews['fromLocation'].model.isValid() === true && this.fieldViews['toLocation'].model.isValid() === true) {
                this.fieldViews['pointsButton'].enable();
            } else {
                this.fieldViews['pointsButton'].disable();
            }
        });
        this.render();
    },
    render: function() {
        this.$el.append(this.fieldViews['fromLocation'].render().el);
        this.$el.append(this.fieldViews['toLocation'].render().el);
        this.$el.append(this.fieldViews['pointsButton'].render().el);
        this.fieldViews['pointsButton'].disable();
        return this;
    },
});

var ExclusiveView = Backbone.View.extend({
    el: $("#step1-exclusive"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['fromLocationExclusive'] = new FieldSelectView({id: fromLocationExclusiveField.get('name'), model: fromLocationExclusiveField});
        this.fieldViews['duration'] = new FieldSelectView({id: durationField.get('name'), model: durationField});
        this.fieldViews['exclusiveButton'] = new FieldButtonView({id: exclusiveButton.get('name'), model: exclusiveButton});
        // listen to events
        this.listenTo(fromLocationExclusiveField, 'change', function(){
            if (this.fieldViews['fromLocationExclusive'].model.isValid() === true && this.fieldViews['duration'].model.isValid() === true) {
                this.fieldViews['exclusiveButton'].enable();
            } else {
                this.fieldViews['exclusiveButton'].disable();
            }
        });
        this.listenTo(durationField, 'change', function(){
            if (this.fieldViews['fromLocationExclusive'].model.isValid() === true && this.fieldViews['duration'].model.isValid() === true) {
                this.fieldViews['exclusiveButton'].enable();
            } else {
                this.fieldViews['exclusiveButton'].disable();
            }
        });
        this.render();
    },
    render: function() {
        this.$el.append(this.fieldViews['fromLocationExclusive'].render().el);
        this.$el.append(this.fieldViews['duration'].render().el);
        this.$el.append(this.fieldViews['exclusiveButton'].render().el);
        this.fieldViews['exclusiveButton'].disable();
        return this;
    },
});


var Points = new PointsView;
var Exclusive = new ExclusiveView;

});
