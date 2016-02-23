$(function() {

var Field = Backbone.Model.extend({
    defaults: function(){
        return {
            'id': '',
            'name': '',
            'type': '',
            'value': '',
            'validation': '',
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

var FieldTextView = FieldView.extend({
    template: _.template($('#tpl-input-text').html()),
    getInput: function () {
        return this.$el.children('input[type="text"]')
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
        return this.$el.children('input[type="checkbox"]')
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

var FieldButtonNextView = FieldView.extend({
    template: _.template($('#tpl-input-button').html()),
    getInput: function () {
        return this.$el.children('input[type="button"]')
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

var FieldButtonPreviousView = FieldView.extend({
    template: _.template($('#tpl-input-button').html()),
    getInput: function () {
        return this.$el.children('input[type="button"]')
    },
    // override events
    events: {
        "click": "goToPrevious",
    },
    goToPrevious: function () {
        console.log("Go to Previous");
	this.trigger('previous');
    },
});

// setup form field instances
var nameField = new Field();
nameField.set('id', 'id_name');
nameField.set('name', 'name');
nameField.set('type', 'text');
nameField.set('validation', /[\w]+/);

var emailField = new Field();
emailField.set('id', 'id_email');
emailField.set('name', 'email');
emailField.set('type', 'text');
emailField.set('validation', /[\w.-_+]+@[\w.-_+]+\.[a-z]{2,5}/i);

var isProField = new Field();
isProField.set('id', 'id_is_pro');
isProField.set('name', 'is_pro');
isProField.set('type', 'checkbox');
isProField.set('validation', /(true|false)/i);

var vatField = new Field();
vatField.set('id', 'id_vat');
vatField.set('name', 'vat');
vatField.set('type', 'text');
vatField.set('validation', /[\w]+/);

var nextButtonStep1 = new Field();
nextButtonStep1.set('id', 'id_next_step1');
nextButtonStep1.set('name', 'next_step1');
nextButtonStep1.set('type', 'button');
nextButtonStep1.set('value', 'Next');

var addressField = new Field();
addressField.set('id', 'id_address');
addressField.set('name', 'address');
addressField.set('type', 'text');
addressField.set('validation', /[\w]+/);

var previousButtonStep2 = new Field();
previousButtonStep2.set('id', 'id_previous_step2');
previousButtonStep2.set('name', 'previous_step2');
previousButtonStep2.set('type', 'button');
previousButtonStep2.set('value', 'Previous');


// setup app view
var Step1View = Backbone.View.extend({
    el: $("#step1"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['name'] = new FieldTextView({id: nameField.get('name'), model: nameField});
        this.fieldViews['email'] = new FieldTextView({id: emailField.get('name'), model: emailField});
        this.fieldViews['isPro'] = new FieldCheckboxView({id: isProField.get('name'), model: isProField});
        this.fieldViews['vat'] = new FieldTextView({id: vatField.get('name'), model: vatField});
        this.fieldViews['vat'].$el.hide();
        this.fieldViews['next'] = new FieldButtonNextView({id: nextButtonStep1.get('name'), model: nextButtonStep1});
        // listen to events
        this.listenTo(isProField, 'change', function(){
            if (this.fieldViews['isPro'].model.get('value') === false) {
                this.fieldViews['vat'].disable();
                this.fieldViews['vat'].$el.hide();
            } else {
                this.fieldViews['vat'].enable();
                this.fieldViews['vat'].$el.show();
            }
        });
        this.render();
    },
    render: function() {
        this.$el.append(this.fieldViews['name'].render().el);
        this.$el.append(this.fieldViews['email'].render().el);
        this.$el.append(this.fieldViews['isPro'].render().el);
        this.$el.append(this.fieldViews['vat'].render().el);
        this.$el.append(this.fieldViews['next'].render().el);
        return this;
    },
});

var Step2View = Backbone.View.extend({
    el: $("#step2"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['address'] = new FieldTextView({id: addressField.get('name'), model: addressField});
        this.fieldViews['previous'] = new FieldButtonPreviousView({id: previousButtonStep2.get('name'), model: previousButtonStep2});
        this.render();
    },
    render: function() {
        this.$el.append(this.fieldViews['address'].render().el);
        this.$el.append(this.fieldViews['previous'].render().el);
        return this;
    },
});

var AppView = Backbone.View.extend({
    el: $("#backbone-form"),
    views: {},
    initialize: function() {
        this.views['step1'] = new Step1View;
        this.views['step2'] = new Step2View;
        this.views['step2'].$el.hide();
        // listen to events
        this.listenTo(this.views['step1']['fieldViews']['next'], 'next', function(){
            this.views['step1'].$el.hide();
            this.views['step2'].$el.show();
        });
        this.listenTo(this.views['step2']['fieldViews']['previous'], 'previous', function(){
            this.views['step2'].$el.hide();
            this.views['step1'].$el.show();
        });
        this.render();
    },
    render: function() {
        this.views['step1'].$el.append(this.views['step1'].render().el);
        this.views['step2'].$el.append(this.views['step2'].render().el);
    },
});

var App = new AppView;

});
