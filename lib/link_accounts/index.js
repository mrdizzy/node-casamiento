var migrator = require('couchdb-migrator'),
    db = migrator.db,
    _ = require('underscore');

var new_email = "happyhele@hotmail.com"

// Scenario:
//  - An incoming eBay order is received
//  - The email address of the order matches a customer in the database
//  - The EIAS token of the order is already assigned to a different customer in the database
//  - We need to:

function consolidateCustomers(EIAS, email, callback) {
    db.view('customers/by_id_and_email', {
        key: [EIAS, email]
    }, function(err, res) {
        if (err || res.length > 0) {
            callback(err, res);
        }
        else {
            find_customer_by_email(EIAS, email, callback);
        }
    });
}

function find_customer_by_email(EIAS, email, callback) {
    db.get(EIAS, function(error, originalCustomer) {
        if (error) {
            createCustomer(EIAS, email, callback);
        }
        else {
            db.view("customers/by_email", {
                key: email
            }, function(err, customersByEmail) {
                if(customersByEmail.length > 0) {
                    consolidation(originalCustomer, customersByEmail, callback)
                }
                else {
                        addEmailToExistingCustomer();
                    }
            })
        }
    })
}


function consolidation(originalCustomer, customersByEmail, callback) {
    console.log("Consolidation, linking accounts");   
}
function createCustomer(originalCustomer, callback) {
    console.log("Creating new customer");
}

function addEmailToExistingCustomer() {
 console.log("Adding email to existing customer");   
}
consolidateCustomers("EIASTOKENFORY", "rebelcoo7@hotmail.com", function(e, r) {
    console.log("error", e, r)

});


/*twoCustomers("EIASTOKENFORGARY", "rebelcoo7@hotmail.com", function(e, original, r) {
    if(r) {
            var doc = r.toArray()[0],
              consolidateEmails = _.union(original.emails, doc.emails)
            db.merge(original._id,{ emails: consolidateEmails},function(a, b) {
                db.remove(doc._id, doc._rev, function(c,d) {
                    console.log(c,d);
                    })
            
            
        })
    console.log(e,r);
    }
});*/