Backbone.Model.Attachment = Backbone.Model.extend({
    url: function() {
        var dataURL = this.get("dataURL");
        return dataURL ? dataURL : Backbone.Model.prototype.url.apply(this)
    }
})

Backbone.Collection.Attachments = Backbone.Collection.extend({
    model: Backbone.Model.Attachment,
    url: function() {
        return this.parent.url() + "/attachments"
    }
})

Backbone.Model.CouchDB = Backbone.Model.extend({
    constructor: function(attributes, options) {
        this._attachments = new Backbone.Collection.Attachments;
        this._attachments.parent = this;
        Backbone.Model.apply(this, arguments)
        this.attachments_order = this.attachments_order || [];
        this.attachments_loading_counter = 0;
        this.on("file-saved", this.savedFile, this)
    },
    savedFile: function() {
        this.attachments_loading_counter--
        if (this.attachments_loading_counter === 0 && this.waitingForSave) {
            this.sync.apply(this, this.waitingForSave);
        }
    },
    // CouchDB models have a revision (_rev) property as well 
    // as an _id to identify them. Backbone's standard url() function
    // just returns the id as part of the url. Eg. /products/1
    // We concatenate the _rev onto the URL of  models which are not
    // new by using with two dashes (--)
    url: function() {
        var url = Backbone.Model.prototype.url.apply(this, arguments)
        return this.isNew() ? url : (url + "--" + this.get("_rev"));
    },
    // We overwrite the parse function as when attachments come down the 
    // wire we need to parse them out into a separate Backbone collection
    // and make each attachment a Backbone model
    parse: function(resp) {
        var resp = _.clone(resp)
        var parsed_attachments = _.map(resp._attachments, function(value, key, list) {
            return {
                id: key,
                content_type: list[key].content_type
            }
        }, this)
        this._attachments.reset(parsed_attachments)
        this.attachments_order = resp.attachments_order
        return resp;
    },
    // Add a group of empty attachments based on their types
    addAttachmentGroup: function() {
        if (this._attachments.length === 0) {
            var new_id = 1
        }
        else {
            var max = this._attachments.max(function(attachment) {
                var split = attachment.id.split("-");
                return split[1];
            })
            var new_id = parseInt(max.id.split("-")[1]) + 1;
        }
        this.attachment_types.forEach(function(type) {
            this._attachments.add({
                id: type + "-" + new_id
            })
        }, this)
        this.attachments_order.push(new_id)
        this._attachments.trigger("add-group", new_id)
    },

    // We override the toJSON function as this is what Backbone.sync uses to 
    // save our model to the server.
    toJSON: function() {
        var json = _.clone(this.attributes);
        json._attachments = {};
        json.attachments_order = this.attachments_order;
        this._attachments.each(function(attachment) {
            if (attachment.get("base64")) {
                json._attachments[attachment.id] = {
                    content_type: attachment.get("content_type"),
                    data: attachment.get("base64")
                }
            }
            else {
                json._attachments[attachment.id] = {
                    stub: true
                }
            }
        })
        return json;
    },
    sync: function() {
        if (this.attachments_loading_counter > 0) {
            this.waitingForSave = arguments;
        }
        else {
            this.waitingForSave = null;
            var xhr = Backbone.sync.apply(this, arguments);
        }
        return xhr;
    },
    idAttribute: "_id"
});

/////////////////////////////////////////////////////////////////////////////////
// VIEWS
/////////////////////////////////////////////////////////////////////////////////

Backbone.View.Attachment = Backbone.View.extend({
    constructor: function() {
        var that = this;
        Backbone.View.apply(this, arguments)
        this.el.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        // Listen for a file to be dropped on the element and then get the file, set the 
        // binary data of the attachment and trigger an event on the parent model to 
        // say the file has loaded into the browser successfully
        this.el.addEventListener('drop', function(e) {
            e.preventDefault();
            var file = e.dataTransfer.files[0];

            var fReader = new FileReader();
            fReader.onload = function(event) {
                var data = event.target.result.split(",")[1];
                that.model.set({
                    base64: data,
                    dataURL: event.target.result,
                    content_type: file.type
                });
                that.model.collection.parent.trigger("file-saved")
            }
            that.model.collection.parent.attachments_loading_counter++;
            fReader.readAsDataURL(file)
        });
    }
})

Backbone.View.Attachments = Backbone.View.extend({
    initialize: function() {
        this.model.on("sync", this.render, this)
        this.model._attachments.on("add-group", this.addAttachmentGroup, this)
    },
    // addAttachment is called with an instance of the new attachment model
    // whenever the addAttachment() method from the parent view class is called. 
    addAttachmentGroup: function(id) {
        this.$el.append(this._renderGroup(id))
    },
    render: function() {
        var that = this;
        this.$el.empty();
        this.model.attachments_order.forEach(function(key) {
            this.$el.append(this._renderGroup(key));
        }, this)
        this.$el.sortable({
            update: function(event, ui) {
                that.model.attachments_order = $(this).sortable("toArray");
            }
        })
        return this;
    },
    _renderGroup: function(id) {
        var these_attachments_el = $('<' + this.options.groupEl + '></' + this.options.groupEl + '>', {
            id: id
        });
        this.model.attachment_types.forEach(function(type) {
            var attachment_id = type + "-" + id;
            var attachment = this.model._attachments.get(attachment_id);

            var subview = new this.options.view({
                attributes: {
                    id: attachment_id
                },
                model: attachment
            }).render()
            these_attachments_el.append(subview.el);
        }, this)
        return these_attachments_el
    }
})

Backbone.View.CouchDB = Backbone.View.extend({
    addAttachment: function() {
        this.model.addAttachmentGroup();
    },
    // Extend this view in your application and then call buildAttachments(view) 
    // from within the extended view's render() method, passing it an Backbone view
    // extended from Backbone.View.Attachment to render each individual attachment
    buildAttachments: function(options) {
        options = options || {}
        options.model = this.model
        options.view = this.options.attachmentView
        var attachments_collection_view = new Backbone.View.Attachments(options)
        var attachments_view_element = attachments_collection_view.render().el
        return attachments_view_element
    }
})
