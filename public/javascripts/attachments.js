Backbone.Model.Attachment = Backbone.Model.extend({
    url: function() {
        if (this.get("dataURL")) {
            return this.get("dataURL")
        } else {
            return Backbone.Model.prototype.url.apply(this)
        }
    }})

Backbone.Collection.Attachments = Backbone.Collection.extend({
    model: Backbone.Model.Attachment,
    url: function() {
        return this.parent.url()+ "/attachments"
    }
})

Backbone.Model.CouchDB = Backbone.Model.extend({
    constructor: function(attributes, options) {
        this._attachments = new Backbone.Collection.Attachments;
        this._attachments.parent = this;
        Backbone.Model.apply(this, arguments)
        this.attachments_order = this.attachments_order || [];
    },    
    // Splits the url so that it is the id and the revision,
    // concatenated but delimited by two dashes --
    url: function() {
       var url = Backbone.Model.prototype.url.apply(this, arguments)
       return this.isNew ? url : (url + "--" + this.get("_rev"));
    },
    // We overwrite the parse function as when attachments come down the 
    // wire we need to parse them out into a separate Backbone collection
    // and make each attachment a Backbone model
    parse: function(resp) {
        var resp = _.clone(resp)
        var parsed_attachments = _.map(resp._attachments, function(value, key, list) {
            return {
                id: key,
                content_type: list[key].content_type,
                length: list[key].length,
            }
        }, this)
        this._attachments.reset(parsed_attachments)
        this.attachments_order = resp.attachments_order
        return resp;
    },

    addAttachmentGroup: function() {
        var max = this._attachments.max(function(attachment) {
            var split = attachment.id.split("-");
            return split[1];
        })
        if (max) {
        var new_id = parseInt(max.id.split("-")[1]) + 1;
        }
        else {
            var new_id = 1
        }
        this.attachment_types.forEach(function(type) {
            this._attachments.add({
                id: type + "-" + new_id
            })
        }, this)
        this.attachments_order.push(new_id)
        this._attachments.trigger("add-group", new_id)
    },
    sync: function() {
        var xhr, args = arguments;

        // Because the FileReader API is asynchronous we have to use a callback
        // style to call Backbone.sync when the files have been read
        this.saveForCouchDB(function(attrs) {
            args[2].attrs = attrs; // args[2] is the options object from arguments
            xhr = Backbone.sync.apply(this, args);
        })
        return xhr;
    },
    // We override the toJSON function as this is what Backbone.sync uses to 
    // save our model to the server.
    saveForCouchDB: function(callback) {
        var json = _.clone(this.attributes);
        if (this._attachments.length > 0) {
            json._attachments = {};
            json.attachments_order = this.attachments_order;
            // If no files have been added to the model then we return straight away
            if (this._attachments.length === 0) {
                callback(json)
                return;
            }
            // We need to use a counter as loading of the files is asynchronous
            // and we do not want to return until they are all loaded
            var counter = 0;

            this._attachments.each(function(attachment) {
               var attach = attachment;
                if (attachment.get("binary")) {
                    var fReader = new FileReader();
                    var that = this;
                    fReader.onload = function(event) {
                        counter++;
                        var data = event.target.result.split(",")[1];
                        json._attachments[attach.id] = {
                            content_type: attach.get("content_type"),
                            data: data
                        }
                if (counter == that._attachments.length) {
                    callback(json);
                }
                    }
                    fReader.readAsDataURL(attachment.get("binary"))
                }
                else {
                    counter++;
                    json._attachments[attachment.id] = {
                        stub: true
                    }
                }
                if (counter == this._attachments.length) {
                    callback(json);
                }
            }, this)
        }
        else {
            callback(json)
        }
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
        // binary data of the attachment and save it
        this.el.addEventListener('drop', function(e) {
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            that.model.set({
                binary: file,
                content_type: file.type
            });
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
        this.$el.bind("update", function(event, ui) {
            that.model.attachments_order = $(this).sortable("toArray");
        })
        return this;
    },
    _renderGroup: function(id) {
        var these_attachments_el = $('<'+this.options.groupEl + '></'+this.options.groupEl +'>', {
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
    // Extend this view and then call buildAttachments(view) from within the 
    // extended view's render() method, passing it an extended Backbone view
    // to render each individual attachment. 
    buildAttachments: function(options) {
        options = options || {}
        options.model = this.model
        options.view = this.options.attachmentView
        var attachments_collection_view = new Backbone.View.Attachments(options)
        var attachments_view_element = attachments_collection_view.render().el
        return attachments_view_element
    }
})
