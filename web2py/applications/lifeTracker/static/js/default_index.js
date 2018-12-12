// dropdown menu for day
$(function() {
    var $select = $(".1-31");
    for (i = 1; i <= 31; i++) {
        var j = i;
        if (j.toString().length === 1) {
            j = "0" + j;
        }
        $select.append($('<option></option>').val(j).html(j))
    }
});

//dropdown menu for year
$(function() {
    var $select = $(".year");
    var x = new Date
    var year = x.getFullYear();
    for (i = year; i >= 1950; i--) {
        $select.append($('<option></option>').val(i).html(i))
    }
});

//dropdown for hour
$(function() {
    var $select = $(".0-23");
    for (i = 0; i <= 23; i++) {
        var j = i;
        if (j.toString().length === 1) {
            j = "0" + j;
        }
        $select.append($('<option></option>').val(j).html(j))
    }
});

//dropdown for minute/second
$(function() {
    var $select = $(".0-59");
    for (i = 0; i <= 59; i++) {
        var j = i;
        if (j.toString().length === 1) {
            j = "0" + j;
        }
        $select.append($('<option></option>').val(j).html(j))
    }
});

var app = function() {
    var self = {};
    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k = 0;
        return v.map(function(e) {
            e._idx = k++;
            e._entry = null;
            e._edit = false;
        });
    };

    self.show_form = function() {
        if (!self.vue.seen) {
            self.vue.seen = true;
            console.log("seen is", self.vue.seen);
        }
        if (self.vue.seen === true) {
            $("#show_myform").show();
            $(".add_tables").hide();
        }
    };

    self.update_entry_box = function(idx, entry, edit_status) {
      var table = self.vue.recorded_tables[idx];
      console.log(idx, entry, table._edit, edit_status, "asdfew");
      if(table._idx === idx && table._edit === edit_status){
        table._edit = false;
        console.log(table._entry, entry, table);
        // $("#input-box").hide();
        // $("#displayed-entry").show();
      }
      $.post(update_entry_url, {
        table: JSON.stringify(table),
      }, function(data){
        console.log(data, "passed back");
      });
    };

    self.edit_entry = function(idx, entry, edit_status){
      var table = self.vue.recorded_tables[idx];
      console.log(idx, entry, table._edit);
      if(table._idx === idx && table._edit === edit_status ){
        table._edit = true;
        console.log("identical id", table._edit, table);
        // $("#input-box").show();
        // $("#displayed-entry").hide();
      }
    };

    //updates the data entry based on the button clicked
    //Ex: Add 1 button will update the database entry by 1
    self.add_value = function(idx, digit) {
      var table = self.vue.recorded_tables[idx];
      console.log(table, table._entry, digit);
      //if selected button is 1, add 1
      if(digit === '1'){
        table._entry++;
        console.log(table._entry);
      }
      //if selected button is 5, add 5
      if(digit === '5'){
        table._entry = table._entry + 5;
        console.log(table._entry);
      }
      //if selected button is 10, add 10
      if(digit === '10'){
        table._entry = table._entry + 10;
        console.log(table._entry);
      }
      //if selected button is 20, add 20
      if(digit === '20'){
        table._entry = table._entry + 20;
        console.log(table._entry);
      };

      //stores in database
      $.post(update_entry_url, {
        table: JSON.stringify(table),
      }, function(data){
        console.log(data, "passed back");
      });
    };

    // adds table info to dynamic_dbs
    self.add_table = function() {
        // We disable the button, to prevent double submission.
        $.web2py.disableElement($("#add-table"));
        var table_title = self.vue.table_title; // Makes a copy
        var table_field = self.vue.table_field;
        var table_type = self.vue.table_type;

        $.post(add_table_url, {
                table_title: self.vue.table_title,
                table_field: self.vue.table_field,
                table_type: self.vue.table_type
            },
            function(data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-post"));
                // Clears the form.
                self.vue.table_title = "";
                self.vue.table_field = "";
                self.vue.table_type = "";
                var new_table = {
                    id: data.table_id,
                    table_title: table_title,
                    table_field: table_field,
                    table_type: table_type
                };
                self.vue.table_list.unshift(new_table);
                // We re-enumerate the array.
                self.process_dynamic_tables();
                //hide button
                $("#show_myform").hide();
                $(".add_tables").show();
                console.log("seen is", self.vue.seen);
                self.get_dynamic_tables();
            });
        console.log('js');
        // If you put code here, it is run BEFORE the call comes back.
        // hide();
    };
    //
    // self.get_thumbs = function(){
    //     var length = self.vue.post_list.length;
    //     posts = self.vue.post_list
    //     for(var i = 0; i < length; i++){
    //         var p = posts[i];
    //         console.log(p.id);
    //         console.log(p);
    //         $.post(get_thumbs_url, { post_id: p.id }, function (data) {
    //             p._total = data.total;
    //         });
    //     }
    // };

    // gets tables tht have not been created yet
    self.get_dynamic_tables = function() {
        $.getJSON(get_dynamic_table_list_url,
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.table_list = data.table_list;
                // Post-processing.
                self.process_dynamic_tables();
                self.create_tables();
            }
        );
    };

    // creates tables in db
    self.create_tables = function() {
        console.log(self.vue.table_list);
        var list = [];
        for (var i = 0; i < self.vue.table_list.length; i++) {
            if (self.vue.table_list[i].created == 'False') {
                list.push(self.vue.table_list[i]);
            }
        }
        $.post(create_table_url, {
            list: JSON.stringify(list),
        });
        self.get_dash_info();
    };


    self.process_dynamic_tables = function() {
        enumerate(self.vue.table_list);
        self.vue.table_list.map(function(e) {
            // Vue.set(e, '_total'); //keeps track of total likes vs dislikes
            // Vue.set(e, '_gray_thumb'); //keeps track of when thumbs are supposed to be gray
            // Vue.set(e, '_num_thumb_display'); //keeps track of thumbs while hoverings
        });
    };

    self.process_user_tables = function() {
        enumerate(self.vue.user_tables);
        self.vue.user_tables.map(function(e) {
            // Vue.set(e, '_total'); //keeps track of total likes vs dislikes
            Vue.set(e, '_entry'); // keeps track of each category's daily entry
            Vue.set(e, '_edit');
            // Vue.set(e, '_num_thumb_display'); //keeps track of thumbs while hoverings
        });
    };


    self.get_dash_info = function() {
        var all_tables = self.vue.table_list;
        var tables = [];
        for (var i = 0; i < all_tables.length; i++) {
            if (user_email === all_tables[i].table_author) {
                tables.push(all_tables[i]);
            }
        }
        self.vue.user_tables = tables;
        console.log(tables);
        $.post(get_dash_info_url, {
            tables: JSON.stringify(tables)
        }, function(data) {
            // data is a list consisting of all of today's entries
            self.vue.recorded_tables = data.entries;
            self.vue.not_recorded_tables = data.empty;
            console.log(data.entries, data.empty);

        });
    };

    // call this function from the html with string depending on the table
    // For example:
    // add_entry(not_recorded_tables._idx)
    self.add_entry = function(idx) {
        console.log(idx);
        var table = self.vue.not_recorded_tables[idx];
        console.log(table)
        $.post(add_entry_url, {
            table: JSON.stringify(table)
        }, function(data) {
            console.log(data);
            self.vue.recorded_tables.push(table);
            self.vue.not_recorded_tables.splice(idx, 1)
        })
    }

    self.pass_data = function (title, field, table_type) {
        var url;
        if (table_type === 'TEXT') {
            url = 'entries?title='+title+'&field='+field+'&table_type='+table_type;
        } else {
            url = 'graph?title='+title+'&field='+field+'&table_type='+table_type;
        }
        document.getElementById(title).href = url;
    }

    self.vue = new Vue({
        el: "#vuediv",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            table_title: "",
            table_field: "",
            table_type: "",
            table_list: [], // all tables
            user_tables: [], // all the tables that logged in user has created
            not_recorded_tables: [], // the entries that the user has not entered yet for the day
            recorded_tables: [], // all tables that have entries for the day
            seen: false, //toggle add table form
            editing: false,
            edit_id: "",
        },
        methods: {
            add_table: self.add_table,
            get_dynamic_tables: self.get_dynamic_tables,
            create_tables: self.create_tables,
            show_form: self.show_form,
            get_dash_info: self.get_dash_info,
            add_entry: self.add_entry,
            add_entry_time: self.add_entry_time,
            pass_data: self.pass_data,
            add_value: self.add_value,
            edit_entry: self.edit_entry,
            update_entry_box: self.update_entry_box,
        }

    });


    // Gets the tables with info.
    self.get_dynamic_tables();
    return self;

};
var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function() {
    APP = app();
});
