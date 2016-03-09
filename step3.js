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
extraStopField.set('validation', /[\w]+/);
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

var addStopButton = new Field();
addStopButton.set('id', 'id_add_stop_button');
addStopButton.set('name', 'add_stop_button');
addStopButton.set('type', 'button');
addStopButton.set('value', 'Add Stop');

var removeStopButton = new Field();
removeStopButton.set('id', 'id_remove_stop_button');
removeStopButton.set('name', 'remove_stop_button');
removeStopButton.set('type', 'button');
removeStopButton.set('value', 'Remove Stop');

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
        console.log(this.getInput());
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

var FieldButtonAddStopView = FieldButtonView.extend({
    // override events
    events: {
        "click": "addStop",
    },
    addStop: function () {
        this.trigger('addStop');
    },
});

var FieldButtonRemoveStopView = FieldButtonView.extend({
    // override events
    events: {
        "click": "removeStop",
    },
    removeStop: function () {
        this.trigger('removeStop');
    },
});

var FieldStopAddressView = FieldTextView.extend({
    template: _.template($('#tpl-input-stop-address').html()),
});

var FieldStopLocationView = FieldSelectView.extend({
    template: _.template($('#tpl-input-stop-location').html()),
});

/*
 * App views
 */

var AddressView = Backbone.View.extend({
    el: $("#step3-points-address"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['addressFrom'] = new FieldTextView({id: addressFromField.get('name'), model: addressFromField, el: $("#points-address-from")});
        this.fieldViews['addressTo'] = new FieldTextView({id: addressToField.get('name'), model: addressToField, el: $("#points-address-to")});
        this.render();
    },
    render: function() {
        this.fieldViews['addressFrom'].render();
        this.fieldViews['addressTo'].render();
        return this;
    },
});

var OutboundView = Backbone.View.extend({
    el: $("#step3-points-inbound"),
    elExtraSeats: $("#step3-points-outbound-seats"),
    elExtraStops: $("#step3-points-outbound-stops-buttons"),
    elExtraStops: $("#step3-points-outbound-stops"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['time'] = new FieldTextView({id: timeField.get('name'), model: timeField, el: $("#points-time-outbound")});
        this.fieldViews['tripReference'] = new FieldTextView({id: tripReferenceField.get('name'), model: tripReferenceField, el: $("#points-trip-reference-outbound")});
        this.fieldViews['isRoundtrip'] = new FieldCheckboxView({id: isRoundtripField.get('name'), model: isRoundtripField, el: $("#points-is-roundtrip-outbound")});

        // childseats
        this.fieldViews['addSeatButton'] = new FieldButtonAddSeatView({id: addSeatButton.get('name'), model: addSeatButton, el: $("#points-add-seat-outbound")});
        this.fieldViews['removeSeatButton'] = new FieldButtonRemoveSeatView({id: removeSeatButton.get('name'), model: removeSeatButton, el: $("#points-remove-seat-outbound")});
        this.fieldViews['extraSeats'] = [];

        // stops
        this.fieldViews['addStopButton'] = new FieldButtonAddStopView({id: addStopButton.get('name'), model: addStopButton, el: $("#points-add-stop-outbound")});
        this.fieldViews['removeStopButton'] = new FieldButtonRemoveStopView({id: removeStopButton.get('name'), model: removeStopButton, el: $("#points-remove-stop-outbound")});
        this.fieldViews['extraStops'] = [];

        // events
        this.listenTo(this.fieldViews['addSeatButton'], 'addSeat', function(){
            this.addSeat();
        });
        this.listenTo(this.fieldViews['removeSeatButton'], 'removeSeat', function(){
            this.removeSeat();
        });
        this.listenTo(this.fieldViews['addStopButton'], 'addStop', function(){
            this.addStop();
        });
        this.listenTo(this.fieldViews['removeStopButton'], 'removeStop', function(){
            this.removeStop();
        });
        this.render();
    },
    render: function() {
        this.fieldViews['time'].render();
        this.fieldViews['tripReference'].render();
        this.fieldViews['isRoundtrip'].render();

        // childseats
        for (var s in this.fieldViews['extraSeats']) {
            this.elExtraSeats.append(this.fieldViews['extraSeats'][s].render().el);
        }
        this.fieldViews['addSeatButton'].render();
        this.fieldViews['removeSeatButton'].render();

        // stops
        for (var s in this.fieldViews['extraStops']) {
            this.elExtraStops.append(this.fieldViews['extraStops'][s]['address'].render().el);
            this.elExtraStops.append(this.fieldViews['extraStops'][s]['location'].render().el);
        }
        this.fieldViews['addStopButton'].render();
        this.fieldViews['removeStopButton'].render();

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
    addStop: function() {
        console.log('add Stop');
        if (this.fieldViews['extraStops'].length > 3)
            return this;
        this.fieldViews['extraStops'].push({
            'address': new FieldStopAddressView({id: extraStopField.get('name'), model: extraStopField}),
            'location': new FieldStopLocationView({id: extraStopLocationField.get('name'), model: extraStopLocationField}),
        });
        this.render();
    },
    removeStop: function() {
        console.log('remove stops');
        if (this.fieldViews['extraStops'].length < 2)
            return this;
        var stop = this.fieldViews['extraStops'].pop();
        stop['address'].remove();
        stop['location'].remove();
        this.render();
    },
});

var InboundView = Backbone.View.extend({
    el: $("#step3-points-inbound"),
    elExtraSeats: $("#step3-points-inbound-seats"),
    elExtraStops: $("#step3-points-inbound-stops-buttons"),
    elExtraStops: $("#step3-points-inbound-stops"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['time'] = new FieldTextView({id: timeReturnField.get('name'), model: timeField, el: $("#points-time-inbound")});
        this.fieldViews['tripReference'] = new FieldTextView({id: tripReferenceReturnField.get('name'), model: tripReferenceField, el: $("#points-trip-reference-inbound")});

        // childseats
        this.fieldViews['addSeatButton'] = new FieldButtonAddSeatView({id: addSeatButton.get('name'), model: addSeatButton, el: $("#points-add-seat-inbound")});
        this.fieldViews['removeSeatButton'] = new FieldButtonRemoveSeatView({id: removeSeatButton.get('name'), model: removeSeatButton, el: $("#points-remove-seat-inbound")});
        this.fieldViews['extraSeats'] = [];

        // stops
        this.fieldViews['addStopButton'] = new FieldButtonAddStopView({id: addStopButton.get('name'), model: addStopButton, el: $("#points-add-stop-inbound")});
        this.fieldViews['removeStopButton'] = new FieldButtonRemoveStopView({id: removeStopButton.get('name'), model: removeStopButton, el: $("#points-remove-stop-inbound")});
        this.fieldViews['extraStops'] = [];

        // events
        this.listenTo(this.fieldViews['addSeatButton'], 'addSeat', function(){
            this.addSeat();
        });
        this.listenTo(this.fieldViews['removeSeatButton'], 'removeSeat', function(){
            this.removeSeat();
        });
        this.listenTo(this.fieldViews['addStopButton'], 'addStop', function(){
            this.addStop();
        });
        this.listenTo(this.fieldViews['removeStopButton'], 'removeStop', function(){
            this.removeStop();
        });
        this.render();
    },
    render: function() {
        this.fieldViews['time'].render();
        this.fieldViews['tripReference'].render();

        // childseats
        for (var s in this.fieldViews['extraSeats']) {
            this.elExtraSeats.append(this.fieldViews['extraSeats'][s].render().el);
        }
        this.fieldViews['addSeatButton'].render();
        this.fieldViews['removeSeatButton'].render();

        // stops
        for (var s in this.fieldViews['extraStops']) {
            this.elExtraStops.append(this.fieldViews['extraStops'][s]['address'].render().el);
            this.elExtraStops.append(this.fieldViews['extraStops'][s]['location'].render().el);
        }
        this.fieldViews['addStopButton'].render();
        this.fieldViews['removeStopButton'].render();

        return this;
    },
    disable: function() {
        this.fieldViews['time'].disable();
        this.fieldViews['tripReference'].disable();

        this.fieldViews['addSeatButton'].disable();
        this.fieldViews['addSeatButton'].$el.hide();
        this.fieldViews['removeSeatButton'].disable();
        this.fieldViews['removeSeatButton'].$el.hide();
        this.fieldViews['addStopButton'].disable();
        this.fieldViews['addStopButton'].$el.hide();
        this.fieldViews['removeStopButton'].disable();
        this.fieldViews['removeStopButton'].$el.hide();

        for (var fieldView in this.fieldViews['extraSeats']) {
            this.fieldViews['extraSeats'][fieldView].disable();
        }
        for (var fieldView in this.fieldViews['extraStops']) {
            this.fieldViews['extraStops'][fieldView]['address'].disable();
            this.fieldViews['extraStops'][fieldView]['location'].disable();
        }
    },
    enable: function() {
        this.fieldViews['time'].enable();
        this.fieldViews['tripReference'].enable();

        this.fieldViews['addSeatButton'].enable();
        this.fieldViews['addSeatButton'].$el.show();
        this.fieldViews['removeSeatButton'].enable();
        this.fieldViews['removeSeatButton'].$el.show();
        this.fieldViews['addStopButton'].enable();
        this.fieldViews['addStopButton'].$el.show();
        this.fieldViews['removeStopButton'].enable();
        this.fieldViews['removeStopButton'].$el.show();

        for (var fieldView in this.fieldViews['extraSeats']) {
            this.fieldViews['extraSeats'][fieldView].enable();
            this.fieldViews['extraSeats'][fieldView].$el.show();
        }
        for (var fieldView in this.fieldViews['extraStops']) {
            this.fieldViews['extraStops'][fieldView]['address'].enable();
            this.fieldViews['extraStops'][fieldView]['address'].$el.show();
            this.fieldViews['extraStops'][fieldView]['location'].enable();
            this.fieldViews['extraStops'][fieldView]['location'].$el.show();
        }
    },
    addSeat: function() {
        if (this.fieldViews['extraSeats'].length > 3)
            return this;
        this.fieldViews['extraSeats'].push(new FieldSelectSeatView({id: extraSeatReturnField.get('name'), model: extraSeatReturnField, template: _.template($('#tpl-input-select-seats').html())}));
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
    addStop: function() {
        console.log('add Stop');
        if (this.fieldViews['extraStops'].length > 3)
            return this;
        this.fieldViews['extraStops'].push({
            'address': new FieldStopAddressView({id: extraStopReturnField.get('name'), model: extraStopReturnField}),
            'location': new FieldStopLocationView({id: extraStopLocationReturnField.get('name'), model: extraStopLocationReturnField}),
        });
        this.render();
    },
    removeStop: function() {
        console.log('remove stops');
        if (this.fieldViews['extraStops'].length < 2)
            return this;
        var stop = this.fieldViews['extraStops'].pop();
        stop['address'].remove();
        stop['location'].remove();
        this.render();
    },
});


var PointsView = Backbone.View.extend({
    el: $("#step3-points"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['address'] = new AddressView,
        this.fieldViews['outbound'] = new OutboundView,
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
