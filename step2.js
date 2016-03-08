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

var FieldRadioView = FieldView.extend({
    template: _.template($('#tpl-input-radio').html()),
    getInput: function () {
        return this.$el.children('input[type="radio"]')
    },
    updateValue: function () {
        var value = this.getInput().val();
        this.model.set('value', value);
        if (!this.model.isValid()) {
            console.log(this.model.get('name') + ' contains invalid value: ' + this.model.get('value'));
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


var ecoTypeField = new Field();
ecoTypeField.set('id', 'id_vehicle_type_eco');
ecoTypeField.set('name', 'vehicle_type');
ecoTypeField.set('type', 'radio');
ecoTypeField.set('value', 1);
ecoTypeField.set('validation', /[0-9]+/);

var vipTypeField = new Field();
vipTypeField.set('id', 'id_vehicle_type_vip');
vipTypeField.set('name', 'vehicle_type');
vipTypeField.set('type', 'radio');
vipTypeField.set('value', 2);
vipTypeField.set('validation', /[0-9]+/);

var submitButton = new Field();
submitButton.set('id', 'id_submit_button');
submitButton.set('name', 'submit_button');
submitButton.set('type', 'button');
submitButton.set('value', 'Submit');


// setup app view
var VehicleTypeView = Backbone.View.extend({
    el: $("#step2-vehicle-type"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['eco'] = new FieldRadioView({id: ecoTypeField.get('name'), model: ecoTypeField});
        this.fieldViews['vip'] = new FieldRadioView({id: vipTypeField.get('name'), model: vipTypeField});
        this.fieldViews['submitButton'] = new FieldButtonView({id: submitButton.get('name'), model: submitButton});
        // listen to events
        this.listenTo(ecoTypeField, 'change', function(){
            if (this.fieldViews['eco'].model.isValid() === true && this.fieldViews['vip'].model.isValid() === true) {
                this.fieldViews['submitButton'].enable();
            } else {
                this.fieldViews['submitButton'].disable();
            }
        });
        this.listenTo(vipTypeField, 'change', function(){
            if (this.fieldViews['eco'].model.isValid() === true && this.fieldViews['vip'].model.isValid() === true) {
                this.fieldViews['submitButton'].enable();
            } else {
                this.fieldViews['submitButton'].disable();
            }
        });
        this.render();
    },
    render: function() {
        this.$el.append(this.fieldViews['eco'].render().el);
        this.$el.append(this.fieldViews['vip'].render().el);
        this.$el.append(this.fieldViews['submitButton'].render().el);
        this.fieldViews['submitButton'].disable();
        return this;
    },
});


var VehicleType = new VehicleTypeView;

});
