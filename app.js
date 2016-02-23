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


// setup app view
var AppView = Backbone.View.extend({
    el: $("#backbone-form"),
    fieldViews: {},
    initialize: function() {
        this.fieldViews['name'] = new FieldTextView({id: nameField.get('name'), model: nameField});
        this.fieldViews['email'] = new FieldTextView({id: emailField.get('name'), model: emailField});
        this.fieldViews['isPro'] = new FieldCheckboxView({id: isProField.get('name'), model: isProField});
        this.fieldViews['vat'] = new FieldTextView({id: vatField.get('name'), model: vatField});
        this.fieldViews['vat'].$el.hide();
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
        this.$('#fieldlist').append(this.fieldViews['name'].render().el);
        this.$('#fieldlist').append(this.fieldViews['email'].render().el);
        this.$('#fieldlist').append(this.fieldViews['isPro'].render().el);
        this.$('#fieldlist').append(this.fieldViews['vat'].render().el);
    },
});

var App = new AppView;

});
