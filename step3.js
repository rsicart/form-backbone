$(function() {

// base model
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

// setup model instances
var seats = [
    {'id': 1, 'name': '1',},
    {'id': 2, 'name': '2',},
    {'id': 3, 'name': '3',},
    {'id': 4, 'name': '4',},
];
var stops = [
    {'id': 60, 'name': '1 hour',},
    {'id': 120, 'name': '2 hours',},
];

var cities = [
    {'id': 1, 'name': 'Paris',},
    {'id': 2, 'name': 'Marseille',},
];

var addressFromField = new Field();
addressFromField.set('id', 'id_address_from');
addressFromField.set('name', 'address_from');
addressFromField.set('type', 'text');
addressFromField.set('validation', /[\w]+/);

var addressToField = new Field();
addressToField.set('id', 'id_address_to');
addressToField.set('name', 'address_to');
addressToField.set('type', 'text');
addressToField.set('validation', /[\w]+/);

var isRoundtripField = new Field();
isRoundtripField.set('id', 'id_is_roundtrip');
isRoundtripField.set('name', 'is_roundtrip');
isRoundtripField.set('type', 'checkbox');
isRoundtripField.set('validation', /(true|false)/i);

var timeField = new Field();
timeField.set('id', 'id_time');
timeField.set('name', 'id_time');
timeField.set('type', 'checkbox');
timeField.set('validation', /[\w]+/);

var tripReferenceField = new Field();
tripReferenceField.set('id', 'id_trip_reference');
tripReferenceField.set('name', 'id_trip_reference');
tripReferenceField.set('type', 'checkbox');
tripReferenceField.set('validation', /[\w]+/);

var extraSeatField = new Field();
extraSeatField.set('id', 'id_extra_seat');
extraSeatField.set('name', 'extra_seat[]');
extraSeatField.set('type', 'select');
extraSeatField.set('validation', /[0-9]+/);
extraSeatField.set('options', seats);

var extraStopField = new Field();
extraStopField.set('id', 'id_extra_stop');
extraStopField.set('name', 'extra_stop[]');
extraStopField.set('type', 'select');
extraStopField.set('validation', /[0-9]+/);
extraStopField.set('options', stops);

var extraStopLocationField = new Field();
extraStopLocationField.set('id', 'id_extra_stop_location');
extraStopLocationField.set('name', 'extra_stop_location[]');
extraStopLocationField.set('type', 'select');
extraStopLocationField.set('validation', /[0-9]+/);
extraStopLocationField.set('options', cities);

var timeReturnField = new Field();
timeReturnField.set('id', 'id_time_return');
timeReturnField.set('name', 'id_time_return');
timeReturnField.set('type', 'checkbox');
timeReturnField.set('validation', /[\w]+/);

var tripReferenceReturnField = new Field();
tripReferenceReturnField.set('id', 'id_trip_reference_return');
tripReferenceReturnField.set('name', 'id_trip_reference_return');
tripReferenceReturnField.set('type', 'checkbox');
tripReferenceReturnField.set('validation', /[\w]+/);

var extraSeatReturnField = new Field();
extraSeatReturnField.set('id', 'id_extra_seat_return');
extraSeatReturnField.set('name', 'extra_seat_return[]');
extraSeatReturnField.set('type', 'select');
extraSeatReturnField.set('validation', /[0-9]+/);
extraSeatReturnField.set('options', seats);

var extraStopReturnField = new Field();
extraStopReturnField.set('id', 'id_extra_stop_return');
extraStopReturnField.set('name', 'extra_stop_return[]');
extraStopReturnField.set('type', 'select');
extraStopReturnField.set('validation', /[0-9]+/);
extraStopReturnField.set('options', stops);

var extraStopLocationReturnField = new Field();
extraStopLocationReturnField.set('id', 'id_extra_stop_location_return');
extraStopLocationReturnField.set('name', 'extra_stop_location_return[]');
extraStopLocationReturnField.set('type', 'select');
extraStopLocationReturnField.set('validation', /[0-9]+/);
extraStopLocationReturnField.set('options', cities);

var pointsButton = new Field();
pointsButton.set('id', 'id_points_button');
pointsButton.set('name', 'points_button');
pointsButton.set('type', 'button');
pointsButton.set('value', 'Submit');

var addSeatButton = new Field();
addSeatButton.set('id', 'id_add_seat_button');
addSeatButton.set('name', 'add_seat_button');
addSeatButton.set('type', 'button');
addSeatButton.set('value', 'Add Seat');

var removeSeatButton = new Field();
removeSeatButton.set('id', 'id_remove_seat_button');
removeSeatButton.set('name', 'remove_seat_button');
removeSeatButton.set('type', 'button');
removeSeatButton.set('value', 'Remove Seat');

// base View
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

// extended base Views
var FieldTextView = FieldView.extend({
    template: _.template($('#tpl-input-text').html()),
    getInput: function () {
        return this.$el.find('input[type="text"]')
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

var FieldCheckboxView = FieldView.extend({
    template: _.template($('#tpl-input-checkbox').html()),
    getInput: function () {
        return this.$el.find('input[type="checkbox"]')
    },
    updateValue: function () {
        var value = this.getInput().is(':checked');
        this.model.set('value', value);
        if (!this.model.isValid()) {
            console.log(this.model.get('name') + ' contains invalid value: ' + this.model.get('value'));
        }
        return this.model.isValid();
    },
});

var FieldSelectView = FieldView.extend({
    template: _.template($('#tpl-input-select').html()),
    getInput: function () {
        return this.$el.find('select')
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
        return this.$el.find('input[type="button"]')
    },
    // override events
    events: {
        "click": "goToNext",
    },
    goToNext: function () {
        console.log("Go to Next");
	this.trigger('next');
    },
});

var FieldButtonSubmitView = FieldButtonView.extend({
    // override events
    events: {
        "click": "submit",
    },
    submit: function () {
        this.$el.closest('form').submit();
    },
});

var FieldButtonAddSeatView = FieldButtonView.extend({
    // override events
    events: {
        "click": "addSeat",
    },
    addSeat: function () {
        this.trigger('addSeat');
    },
});

var FieldButtonRemoveSeatView = FieldButtonView.extend({
    // override events
    events: {
        "click": "removeSeat",
    },
    removeSeat: function () {
        this.trigger('removeSeat');
    },
});

var FieldSelectSeatView = FieldSelectView.extend({
    template: _.template($('#tpl-input-select-seats').html()),
});


/*
 * App views
 */

// Row
var AddressView = Backbone.View.extend({
    el: $("#step3-points-address"),
    fieldViews: {},
    initialize: function() {
         // Each field view is a Column
        this.fieldViews['addressFrom'] = new FieldTextView({id: addressFromField.get('name'), model: addressFromField, el: $("#points-address-from")});
        this.fieldViews['addressTo'] = new FieldTextView({id: addressToField.get('name'), model: addressToField, el: $("#points-address-to")});
        this.render();
    },
    render: function() {
        this.fieldViews['addressFrom'].render();
        this.fieldViews['addressTo'].render();
        return this;
        /*
        this.$el.append(this.fieldViews['addressFrom'].render().el);
        this.$el.append(this.fieldViews['addressTo'].render().el);
        return this;
        */
    },
});

var OutboundView = Backbone.View.extend({
    el: $("#step3-points-outbound"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['time'] = new FieldTextView({id: timeField.get('name'), model: timeField, el: $("#points-time")});
        this.fieldViews['tripReference'] = new FieldTextView({id: tripReferenceField.get('name'), model: tripReferenceField, el: $("#points-trip-reference")});
        this.fieldViews['isRoundtrip'] = new FieldCheckboxView({id: isRoundtripField.get('name'), model: isRoundtripField, el: $("#points-is-roundtrip")});
        this.render();
    },
    render: function() {
        this.fieldViews['time'].render();
        this.fieldViews['tripReference'].render();
        this.fieldViews['isRoundtrip'].render();
        return this;
    },
});

var OutboundExtraSeatsView = Backbone.View.extend({
    el: $("#step3-points-outbound-seats"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['addSeatButton'] = new FieldButtonAddSeatView({id: addSeatButton.get('name'), model: addSeatButton, el: $("#points-add-seat-outbound")});
        this.fieldViews['removeSeatButton'] = new FieldButtonRemoveSeatView({id: removeSeatButton.get('name'), model: removeSeatButton, el: $("#points-remove-seat-outbound")});
        this.fieldViews['extraSeats'] = [];
        this.listenTo(this.fieldViews['addSeatButton'], 'addSeat', function(){
            this.addSeat();
        });
        this.listenTo(this.fieldViews['removeSeatButton'], 'removeSeat', function(){
            this.removeSeat();
        });
        this.render();
    },
    render: function() {
        this.$el.find('input').remove();
        this.$el.find('select').remove();
        for (var s in this.fieldViews['extraSeats']) {
            this.$el.append(this.fieldViews['extraSeats'][s].render().el);
        }
        this.fieldViews['addSeatButton'].render();
        this.fieldViews['removeSeatButton'].render();
        return this;
    },
    addSeat: function() {
        if (this.fieldViews['extraSeats'].length > 3)
            return this;
        this.fieldViews['extraSeats'].push(new FieldSelectSeatView({id: extraSeatField.get('name'), model: extraSeatField, template: _.template($('#tpl-input-select-seats').html())}));
        this.render();
    },
    removeSeat: function() {
        if (this.fieldViews['extraSeats'].length < 2)
            return this;
        console.log('remove seat');
        var view = this.fieldViews['extraSeats'].pop();
        view.remove();
        this.render();
    },
});

var OutboundExtraStopsView = Backbone.View.extend({
    el: $("#step3-points-outbound-stops"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['extraStop'] = new FieldTextView({id: extraStopField.get('name'), model: extraStopField, el: $("#points-extra-stop")});
        this.fieldViews['extraStopLocation'] = new FieldSelectView({id: extraStopLocationField.get('name'), model: extraStopLocationField, el: $("#points-extra-stop-location")});
        this.render();
    },
    render: function() {
        this.fieldViews['extraStop'].render();
        this.fieldViews['extraStopLocation'].render();
        return this;
    },
});

var InboundView = Backbone.View.extend({
    el: $("#step3-points-inbound"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['timeReturn'] = new FieldTextView({id: timeReturnField.get('name'), model: timeReturnField, el: $("#points-time-return")});
        this.fieldViews['tripReferenceReturn'] = new FieldTextView({id: tripReferenceReturnField.get('name'), model: tripReferenceReturnField, el: $("#points-trip-reference-return")});
        this.fieldViews['extraSeatReturn'] = new FieldSelectView({id: extraSeatReturnField.get('name'), model: extraSeatReturnField, el: $("#points-extra-seat-return")});
        this.fieldViews['extraStopReturn'] = new FieldTextView({id: extraStopReturnField.get('name'), model: extraStopReturnField, el: $("#points-extra-stop-return")});
        this.fieldViews['extraStopLocationReturn'] = new FieldSelectView({id: extraStopLocationReturnField.get('name'), model: extraStopLocationReturnField, el: $("#points-extra-stop-location-return")});
        this.render();
    },
    render: function() {
        this.fieldViews['timeReturn'].render();
        this.fieldViews['tripReferenceReturn'].render();
        this.fieldViews['extraSeatReturn'].render();
        this.fieldViews['extraStopReturn'].render();
        this.fieldViews['extraStopLocationReturn'].render();
        return this;
    },
    disable: function() {
        for (var fieldView in this.fieldViews) {
            this.fieldViews[fieldView].disable();
        }
    },
    enable: function() {
        for (var fieldView in this.fieldViews) {
            this.fieldViews[fieldView].enable();
        }
    },
});

var PointsView = Backbone.View.extend({
    el: $("#step3-points"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['address'] = new AddressView,
        this.fieldViews['outbound'] = new OutboundView,
        this.fieldViews['extraSeats'] = new OutboundExtraSeatsView,
        this.fieldViews['extraStops'] = new OutboundExtraStopsView,
        this.fieldViews['inbound'] = new InboundView,

        this.fieldViews['pointsButton'] = new FieldButtonSubmitView({id: pointsButton.get('name'), model: pointsButton});
        // listen to events
        this.listenTo(isRoundtripField, 'change', function(){
            console.log('roundtrip');
            if (this.fieldViews['outbound'].fieldViews['isRoundtrip'].model.get('value') === false) {
                this.fieldViews['inbound'].disable();
                this.fieldViews['inbound'].$el.hide();
            } else {
                this.fieldViews['inbound'].enable();
                this.fieldViews['inbound'].$el.show();
            }
        });
        this.render();
    },
    render: function() {
        this.fieldViews['address'].render();
        this.fieldViews['outbound'].render();
        this.fieldViews['extraSeats'].render();
        this.fieldViews['extraStops'].render();
        this.fieldViews['inbound'].render();
        this.$el.append(this.fieldViews['pointsButton'].render().el);
        // initially disabled
        this.fieldViews['inbound'].disable();
        this.fieldViews['inbound'].$el.hide();
        this.fieldViews['pointsButton'].disable();
        return this;
    },
});

/*
var ExclusiveView = Backbone.View.extend({
    el: $("#step3-exclusive"),
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

var Exclusive = new ExclusiveView;
*/

var Points = new PointsView;

});
