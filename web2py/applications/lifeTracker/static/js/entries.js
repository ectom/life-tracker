var self = {};
Vue.config.silent = false; // show all warnings

// var enumerate = function(v) {
//     var k = 0;
//     return v.map(function(e) {
//         e._idx = k++;
//         e._editing = false;
//     });
// };

self.process_data = function() {
    // enumerate(self.graph.chartData);
    self.graph.chartData.map(function(e) {
        Vue.set(e, '_editing', false); //keeps track of total likes vs dislikes
    //     // Vue.set(e, '_gray_thumb'); //keeps track of when thumbs are supposed to be gray
    //     // Vue.set(e, '_num_thumb_display'); //keeps track of thumbs while hoverings
    });
};

self.get_all_data = function (table_name, field, table_type) {
    self.graph.field = field;
    $.post(get_all_data_url,{
        table: table_name,
        field: field,
        type: table_type
    }, function (data) {
        console.log(data.list);
        var list = [];
        for(var i = 0; i < data.list.length; i++){
            var row = {}
            row['hour'] = data.list[i][0].substring(0,10); // date
            row['time'] = data.list[i][0].substring(11,19); // time
            row['entry'] = data.list[i][1]; // entry
            row['id'] = data.list[i][2]; // db entry id
            row['_editing'] = false;
            var time = row['time'];
            time = time.split(':');
            var hours = Number(time[0]), minutes = Number(time[1]), seconds = Number(time[2]), standard_time;
            if (hours > 12) {
                hours = hours - 12;
                standard_time = '' + hours + ':' + minutes + ':' + seconds + 'PM'
            } else if (hours === 12){
                standard_time = '' + hours + ':' + minutes + ':' + seconds + 'PM'
            } else if (hours === 00) {
                standard_time = '12:' + minutes + ':' + seconds + 'AM'
            }
            else {
                standard_time = '' + hours + ':' + minutes + ':' + seconds + 'AM'
            }
            row['time'] = standard_time;
            row['idx'] = i;
            list.push(row);
            self.graph.title = data.title;
        }
        if(self.graph.title === '') {
            self.graph.title = table_name
        }
        self.graph.chartData = list;
        console.log(self.graph.chartData);
    })
    self.process_data();
}

// update entries
self.update_entry = function (idx) {
    entry = self.graph.chartData[idx];
    $.post(edit_entry_url, {
        entry: JSON.stringify(entry),
        title: self.graph.title,
        field: self.graph.field
    }, function (data) {
        self.graph.chartData[idx]._editing = false;
    });
}

self.edit_entry = function (idx) {
    self.graph.chartData[idx]._editing = true;
}

self.cancel_entry = function (idx) {
    self.graph.chartData[idx]._editing = false;
}

self.graph = new Vue({
    el: "#graph",
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
      chartData: [],
      title: '',
      field: '',
    },
    methods: {
        get_all_data: self.get_all_data,
        edit_entry: self.edit_entry,
        update_entry: self.update_entry,
        process_data: self.process_data,
        cancel_entry: self.cancel_entry,
    }
})

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var title = getUrlVars()["title"];
var field = getUrlVars()["field"];
var table_type = getUrlVars()["table_type"];

self.get_all_data(title, field, table_type);
