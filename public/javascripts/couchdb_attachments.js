   var Attachment = Backbone.Model.extend({
        path: function(type) {
            return this.collection.url + "/" + type + "-" + this.get("id")
        }
    });
    
    Backbone.View.Attachment = Backbone.View.extend({
          initialize: function() {
              var that = this;
            this.$el.html("<div id=\"sortable\"></div>")
            var sortableEl = this.$('#sortable');
            sortableEl.sortable({update: function(a,b) {
                console.log("Updatefing");
                console.log(sortableEl.sortable("toArray"));
                that.collection.belongs_to.set("attachments_order", sortableEl.sortable("toArray"));
             }});
          }
    });
    
    var Attachments = Backbone.Collection.extend({
        model: Attachment
    });
    Backbone.Model.CouchDB = Backbone.Model.extend({
        initialize: function() {
            console.log("Initializing");
            this.attachments = new Attachments();
            this.attachments.url = this.url() + "/attachments"
            var model = this;
            var attachments = _.map(this.get("attachments_order"), function(unique) {
                
                var attachment = {
                    id: unique,
                    _rev: model.get("_rev"),
                }
                return attachment;
            }, this)
            
            this.attachments.reset(attachments);
            this.attachments.belongs_to = this;
            this.on('change', this.sortAttachments);
        },
        sortAttachments: function() {
            console.log(this.get("attachments_order"));
            var attachments = _.map(this.get("attachments_order"), function(unique) {
                   var attachment = this.attachments.get(unique);
                   
            console.log("sorting attachments");
                   console.log(attachment);
                   attachment.set("_rev", this.get("_rev"));
                   return attachment;
            },this);
            this.attachments.reset(attachments);
        },
        idAttribute: "_id"
    });