/**
 * Data
 */
var cities = [
    {'value':'1', 'label':'Paris',},
    {'value':'2', 'label':'Barcelone',},
];

var stations = [
    {'value':'3', 'label':'Paris CDG',},
    {'value':'4', 'label':'Paris Orly',},
];

var locations = cities.concat(stations);

var mapIdStation = {
    1: false,
    2: false,
    3: true,
    4: true,
}

var durations = [
    {'value':'60', 'label':'1 hour',},
    {'value':'120', 'label':'2 hours',},
    {'value':'180', 'label':'3 hours',},
];

var vehicles = [
    {'value':'1', 'label':'Eco',},
    {'value':'2', 'label':'Business',},
    {'value':'3', 'label':'VIP',},
];


/**
 * Base Models
 */

// base model
var Field = Backbone.Model.extend({
    defaults: function() {
        return {
            'id': '',
            'name': '',
            'type': '',
            'validation': '',
            'value': '',
            'options': '',
        };
    },
    isValid: function() {
        return this.get('validation').test(this.get('value'));
    },
});

var LocationField = Field.extend({
    isStation: function() {
        return mapIdStation[this.get('value')];
    }
});


/**
 * Base Views
 */

// base view
var FieldView = Backbone.View.extend({
    tagName: 'div',
    render: function() {
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

// fields extending base view
var SelectView = FieldView.extend({
    template: _.template($('#tpl-select').html()),
    getInput: function() {
        return this.$el.find('select');
    },
    updateValue: function() {
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

var ButtonView = FieldView.extend({
    template: _.template($('#tpl-button').html()),
    getInput: function () {
        return this.$el.children('input[type="button"]')
    },
    // override events
    events: {
        "click": "goNext",
    },
    goNext: function () {
        this.trigger('goNext');
    },
});

var ButtonNextView = ButtonView.extend({
    // override events
    events: {
        "click": "goNext",
    },
    goNext: function () {
        this.trigger('goNext');
    },
});

var ButtonBackView = ButtonView.extend({
    // override events
    events: {
        "click": "goBack",
    },
    goBack: function () {
        this.trigger('goBack');
    },
});

var RadioView = FieldView.extend({
    template: _.template($('#tpl-radio').html()),
    getInput: function() {
        return this.$el.find('input[type="radio"]:checked');
    },
    updateValue: function() {
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

/**
 * Step 1
 */

// models
// point 2 point
var locationFrom = new LocationField();
locationFrom.set('id', 'id_location_from');
locationFrom.set('name', 'location_from');
locationFrom.set('type', 'select');
locationFrom.set('validation', /[0-9]+/);
locationFrom.set('options', locations);

var locationTo = new Field();
locationTo.set('id', 'id_location_to');
locationTo.set('name', 'location_to');
locationTo.set('type', 'select');
locationTo.set('validation', /[0-9]+/);
locationTo.set('options', locations);

var nextButton = new Field();
nextButton.set('id', 'id_next_button');
nextButton.set('name', 'next_button');
nextButton.set('type', 'button');
nextButton.set('value', 'Next');

// exclusive driver
var locationExclusive = new LocationField();
locationExclusive.set('id', 'id_location_exclusive');
locationExclusive.set('name', 'location_from');
locationExclusive.set('type', 'select');
locationExclusive.set('validation', /[0-9]+/);
locationExclusive.set('options', locations);

var durationExclusive = new Field();
durationExclusive.set('id', 'id_duration_exclusive');
durationExclusive.set('name', 'duration');
durationExclusive.set('type', 'select');
durationExclusive.set('validation', /[0-9]+/);
durationExclusive.set('options', durations);

var nextExclusiveButton = new Field();
nextExclusiveButton.set('id', 'id_next_button_exclusive');
nextExclusiveButton.set('name', 'next_button');
nextExclusiveButton.set('type', 'button');
nextExclusiveButton.set('value', 'Next');


// views
// point 2 point
var fromView = new SelectView({id: locationFrom.get('id'), model: locationFrom, el: $('#location-from-view')});
var toView = new SelectView({id: locationTo.get('id'), model: locationTo, el: $('#location-to-view')});
var buttonView = new ButtonNextView({id: nextButton.get('id'), model: nextButton});

// exclusive driver
var locationView = new SelectView({id: locationExclusive.get('id'), model: locationExclusive, el: $('#exclusive-location-view')});
var durationView = new SelectView({id: durationExclusive.get('id'), model: durationExclusive, el: $('#exclusive-duration-view')});
var nextExclusiveButtonView = new ButtonNextView({id: nextExclusiveButton.get('id'), model: nextExclusiveButton});


// wrapper view
var LocationsView = Backbone.View.extend({
    el: $('#locations-view'),
    initialize: function() {
        this.listenTo(locationFrom, 'change', function() {
            // set options for destination depending on origin location
            if (locationFrom.isStation())
                locationTo.set('options', cities);
            else
                locationTo.set('options', stations);
            toView.render();

            // enable button?
            if (locationFrom.isValid() && locationTo.isValid())
                buttonView.enable();
            else
                buttonView.disable();
        });
        this.listenTo(locationTo, 'change', function() {
            // enable button?
            if (locationFrom.isValid() && locationTo.isValid())
                buttonView.enable();
            else
                buttonView.disable();
        });
        this.listenTo(buttonView, 'goNext', function() {
            if (locationFrom.isValid() && locationTo.isValid()) {
                $('#step1').hide(); 
                $('#step2').show(); 
            }
        });
        this.render();
    },
    render: function() {
        fromView.render();
        toView.render();
        this.$el.append(buttonView.render().el); 
        buttonView.disable();
        return this;
    },
});

var LocationDurationView = Backbone.View.extend({
    el: $('#exclusive-location-duration-view'),
    initialize: function() {
        this.listenTo(locationExclusive, 'change', function() {
            // enable button?
            if (locationExclusive.isValid() && durationExclusive.isValid())
                nextExclusiveButtonView.enable();
            else
                nextExclusiveButtonView.disable();
        });
        this.listenTo(durationExclusive, 'change', function() {
            // enable button?
            if (locationExclusive.isValid() && durationExclusive.isValid())
                nextExclusiveButtonView.enable();
            else
                nextExclusiveButtonView.disable();
        });
        this.listenTo(nextExclusiveButtonView, 'goNext', function() {
            if (locationExclusive.isValid() && durationExclusive.isValid()) {
                $('#step1').hide(); 
                $('#step2').show(); 
            }
        });
        this.render();
    },
    render: function() {
        locationView.render();
        durationView.render();
        this.$el.append(nextExclusiveButtonView.render().el); 
        nextExclusiveButtonView.disable();
        return this;
    },
});

var Point2point = new LocationsView();
var Exclusive = new LocationDurationView();



/**
 * Step 2
 */

var vehicle = new Field();
vehicle.set('id', 'id_vehicle');
vehicle.set('name', 'vehicle');
vehicle.set('type', 'radio');
vehicle.set('validation', /[0-9]+/);
vehicle.set('options', vehicles);

var step2BackButton = new Field();
step2BackButton.set('id', 'id_step2_back_button');
step2BackButton.set('name', 'step2_back_button');
step2BackButton.set('type', 'button');
step2BackButton.set('value', 'Back');

var step2NextButton = new Field();
step2NextButton.set('id', 'id_step2_next_button');
step2NextButton.set('name', 'step2_next_button');
step2NextButton.set('type', 'button');
step2NextButton.set('value', 'Next');

// views
// point 2 point
var vehicleView = new RadioView({id: vehicle.get('id'), model: vehicle, el: $('#vehicle-view')});
var step2BackButtonView = new ButtonBackView({id: step2BackButton.get('id'), model: step2BackButton});
var step2NextButtonView = new ButtonNextView({id: step2NextButton.get('id'), model: step2NextButton});


// wrapper view
var VehiclesView = Backbone.View.extend({
    el: $('#vehicles-view'),
    initialize: function() {
        this.listenTo(vehicle, 'change', function() {
            // enable button?
            if (vehicle.isValid())
                step2NextButtonView.enable();
            else
                step2NextButtonView.disable();
        });
        this.listenTo(step2BackButtonView, 'goBack', function() {
            console.log();
            $('#step2').hide(); 
            $('#step1').show(); 
        });
        this.listenTo(step2NextButtonView, 'goNext', function() {
            if (vehicle.isValid()) {
                $('#step2').hide(); 
            }
        });
        this.render();
    },
    render: function() {
        vehicleView.render();
        this.$el.append(step2BackButtonView.render().el); 
        this.$el.append(step2NextButtonView.render().el); 
        step2NextButtonView.disable();
        $('#step2').hide(); 
        return this;
    },
});

var Vehicle = new VehiclesView();

/**
 * Step 3
 */


