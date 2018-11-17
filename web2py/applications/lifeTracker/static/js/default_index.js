// This is the js for the default/index.html view.
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
        var k=0;
        return v.map(function(e) {
            e._idx = k++;
        });
    };

    // adds table info to dynamic_dbs
    self.add_table = function () {
        // We disable the button, to prevent double submission.
        $.web2py.disableElement($("#add-table"));
        var table_title = self.vue.table_title; // Makes a copy
        var table_field = self.vue.table_field;
        var table_type = self.vue.table_type;
        $.post(add_table_url,
            {
                table_title: self.vue.table_title,
                table_field: self.vue.table_field,
                table_type: self.vue.table_type
            },
            function (data) {
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
                self.process_posts();
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
    self.get_tables = function() {
        $.getJSON(get_table_list_url,
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                self.vue.table_list = data.table_list;
                // Post-processing.
                self.process_posts();
                console.log("I got my list");
                self.create_tables();
            }
        );
        console.log("I fired the get");
    };

    // creates tables in db
    self.create_tables = function() {
        console.log(self.vue.table_list);
        var list = [];
        for(var table in self.vue.table_list){
            if(table.created === false){
                list.append(table);
            }
        }
        $.get(create_table,{
            list: list
        }, function(data){
            console.log(data);
        })
    }


    self.process_posts = function() {
        // This function is used to post-process posts, after the list has been modified
        // or after we have gotten new posts.
        // We add the _idx attribute to the posts.
        enumerate(self.vue.table_list);
        // We initialize the smile status to match the like.

        self.vue.table_list.map(function (e) {
            // I need to use Vue.set here, because I am adding a new watched attribute
            // to an object.  See https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
            // The code below is commented out, as we don't have smiles any more.
            // Replace it with the appropriate code for thumbs.
            // // Did I like it?
            // // If I do e._smile = e.like, then Vue won't see the changes to e._smile .
            // Vue.set(e, '_smile', e.like);
            Vue.set(e, '_editing', false)
            Vue.set(e, '_total'); //keeps track of total likes vs dislikes
            Vue.set(e, '_gray_thumb'); //keeps track of when thumbs are supposed to be gray
            Vue.set(e, '_num_thumb_display'); //keeps track of thumbs while hoverings
        });
    };
    //
    // self.total = function(p){
    //     $.post(get_thumbs_url, { post_id: p.id }, function (data) {
    //         p._total = data.total;
    //     })
    // };
    //
    // self.thumbs_up_over = function(post_idx, thumbs_up_idx) {
    //     var p = self.vue.post_list[post_idx];
    //     console.log(p, thumbs_up_idx);
    //     console.log(p.thumb);
    //     if(p.thumb === 'd'){
    //         p._gray_thumb = 'u';
    //     }
    //     else if(p.thumb === 'u'){
    //         p._num_thumb_display = 'u';
    //         p._gray_thumb = 'd';
    //     }
    //     else{
    //         p._gray_thumb = 'u';
    //     }
    // };
    //
    // self.thumbs_down_over = function(post_idx, thumbs_down_idx) {
    //     var p = self.vue.post_list[post_idx];
    //     console.log(p, thumbs_down_idx);
    //     console.log(p.thumb);
    //     if(p.thumb === 'u'){
    //         p._gray_thumb = 'd';
    //     }
    //     else if(p.thumb === 'd'){
    //         p._num_thumb_display = 'd';
    //         p._gray_thumb = 'u';
    //     }
    //     else{
    //         p._gray_thumb = 'd';
    //     }
    // };
    //
    // self.thumbs_up_out = function(post_idx, thumbs_up_idx) {
    //     var p = self.vue.post_list[post_idx];
    //     console.log(p, thumbs_up_idx);
    //     self.vue.thumbs_up_state = false;
    //     p._num_thumb_display = p.thumb;
    //     p._gray_thumb = 'null';
    // };
    //
    // self.thumbs_down_out = function(post_idx, thumbs_downdown_idx) {
    //     var p = self.vue.post_list[post_idx];
    //     self.vue.thumbs_down_state = false;
    //     p._num_thumb_display = p.thumb;
    //     p._gray_thumb = null;
    // };
    //
    // self.show = function(){
    //     if(self.vue.isHidden){
    //         self.vue.isHidden = false;
    //     }
    //     if (is_logged_in && !self.vue.isHidden) {
    //         $(".add_posts").show();
    //         $(".add_post_button").hide();
    //     }
    // };
    //
    // function hide(){
    //     if(!self.vue.isHidden){
    //         self.vue.isHidden = true;
    //     }
    //     if (is_logged_in && self.vue.isHidden) {
    //         $(".add_posts").hide();
    //         $(".add_post_button").show();
    //     }
    // };
    // // thumb keeps track of the gray thumb
    // // vote confirms which thumb has been clicked
    // self.set_thumb = function(post_idx, thumb, vote) {
    //     // The user has set this as the number of stars for the post.
    //     var p = self.vue.post_list[post_idx];
    //     if(thumb === 'u' && p._num_thumb_display === 'd' && vote === 'down'){
    //         p.thumb = null;
    //         console.log('when black thumbs down clicked');
    //     }
    //     else if(thumb === 'd' && p._num_thumb_display === 'u' && vote === 'up'){
    //         p.thumb = null;
    //         console.log('when black thumbs up clicked');
    //     }
    //     else{
    //         p.thumb = thumb;
    //     }
    //     // Sends the rating to the server.
    //     $.post(set_thumb_url, {
    //         post_id: p.id,
    //         thumb: p.thumb
    //     }, function(){
    //         self.total(p);
    //     });
    // };
    //
    // self.edit = function(post_id){
    //     var p = self.vue.post_list[post_id];
    //     p._editing = true;
    //     console.log('edit', p._editing);
    // }
    //
    // self.edited = function(post_id){
    //     var p = self.vue.post_list[post_id];
    //     p._editing = false;
    //     console.log('edited', p.post_content);
    //     $.post(edit_post_url,
    //         // Data we are sending.
    //         {
    //             id: post_id,
    //             post_content: p.post_content
    //         },
    //         // What do we do when the post succeeds?
    //         function (data) {
    //             console.log(data);
    //
    //             // Shows updated post
    //             // self.vue.post_list[post_id].post_content = data.post_content;
    //             // We re-enumerate the array.
    //             self.process_posts();
    //         });
    // }
    //
    // // Complete as needed.
    // self.vue = new Vue({
    //     el: "#vuediv",
    //     delimiters: ['${', '}'],
    //     unsafeDelimiters: ['!{', '}'],
    //     data: {
    //         form_title: "",
    //         form_content: "",
    //         post_list: [],
    //         thumbs_list: [],
    //         isHidden: true,
    //         // _editing: false
    //     },
    //     methods: {
    //         add_post: self.add_post,
    //         show: self.show,
    //         edit: self.edit,
    //         edited: self.edited,
    //         thumbs_up_over: self.thumbs_up_over,
    //         thumbs_down_over: self.thumbs_down_over,
    //         thumbs_up_out: self.thumbs_up_out,
    //         thumbs_down_out: self.thumbs_down_out,
    //         set_thumb: self.set_thumb,
    //     }
    //
    // });
    self.vue = new Vue({
        el: "#vuediv",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            table_title: "",
            table_field: "",
            table_type: "",
            table_list: [],
            thumbs_list: [],
            isHidden: true,
            // _editing: false
        },
        methods: {
            add_table: self.add_table,
            get_tables: self.get_tables,
            create_tables: self.create_tables
        }

    });


    // Gets the tables with info.
    self.get_tables();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
