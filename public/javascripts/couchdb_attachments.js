   var Attachment = Backbone.Model.extend({
        path: function(type) {
            return this.collection.url + "/" + type + "-" + this.get("id")
        }
    });
    var Attachments = Backbone.Collection.extend({
        model: Attachment
    });
    Backbone.Model.CouchDB = Backbone.Model.extend({
        initialize: function() {
            this.attachments = new Attachments();
            this.attachments.url = this.url() + "/attachments"
            this.sortAttachments();
            this.attachments.belongs_to = this;
            this.on('change:attachments_order', this.sortAttachments);
        },
        sortAttachments: function() {
            var model = this;
            var attachments = _.map(this.get("attachments_order"), function(unique) {
                var attachment = {
                    id: unique,
                    _rev: model.get("_rev"),
                }
                return attachment;
            }, this)
            this.attachments.reset(attachments);
        },
        idAttribute: "_id"
    });