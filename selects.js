// data
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
});

var fromView = new SelectView({id: locationFrom.get('id'), model: locationFrom, el: $('#location-from-view')});
var toView = new SelectView({id: locationTo.get('id'), model: locationTo, el: $('#location-to-view')});
var buttonView = new ButtonView({id: nextButton.get('id'), model: nextButton});


// wrapper view
var LocationsView = Backbone.View.extend({
    el: $('#locations-view'),
    initialize: function() {
        this.listenTo(locationFrom, 'change', function() {
            console.log('model locationFrom has changed');
            if (locationFrom.isStation())
                locationTo.set('options', cities);
            else
                locationTo.set('options', stations);
            toView.render();
        });
        this.render();
    },
    render: function() {
        fromView.render();
        toView.render();
        this.$el.append(buttonView.render().el); 
        return this;
    },
});

var app = new LocationsView();
