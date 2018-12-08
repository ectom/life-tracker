

var self = {};
Vue.config.silent = false; // show all warnings

self.get_all_data = function (table_name, field) {
    $.post(get_all_data_url,{
        table: table_name,
        field: field
    }, function (data) {
        console.log(data.list);
        for(var i = 0; i < data.list.length; i++){
            data.list[i][0] = data.list[i][0].substring(0,10);
        }
        self.graph.chartData = data.list
    });
}

self.graph = new Vue({
    el: "#graph",
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
      chartData: []
    },
    methods: {
        get_all_data: self.get_all_data,
    }
})

self.get_all_data('Chest', 'pushups')
