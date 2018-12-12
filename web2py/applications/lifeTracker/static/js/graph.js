var self = {};
Vue.config.silent = false; // show all warnings

self.get_all_data = function(table_name, field, table_type) {
    self.graph.field = field;
    $.post(get_all_data_url, {
        table: table_name,
        field: field,
        type: table_type
    }, function(data) {
        var all = data.list;
        console.log(data.list);
        if (table_type === 'BOOLEAN') {
            for (var i = 0; i < all.length; i++) {
                if (all[i][1] === 'true') {
                    all[i][1] = 1;
                } else {
                    all[i][1] = 0;
                }
            }
        }
        for (var i = 0; i < all.length; i++) {
            all[i][0] = all[i][0].substring(0, 10);
            self.graph.title = data.title;
        }
        if (self.graph.title === '') {
            self.graph.title = table_name
        }
        self.graph.chartData = all;
    });
};

// tab menu for chart
self.chart = function(e, chart) {
    self.graph.select = true;
    var content, chart_type;
    content = document.getElementsByClassName("content");
    for (var i = 0; i < content.length; i++) {
        content[i].style.display = "none";
    }
    chart_type = document.getElementsByClassName("chartlink");
    for (var i = 0; i < chart_type.length; i++) {
        chart_type[i].className = chart_type[i].className.replace(" active", "");
    }
    document.getElementById(chart).style.display = "block";
}

self.graph = new Vue({
    el: "#graph",
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
        chartData: [],
        title: '',
        field: '',
        select: false,
    },
    methods: {
        get_all_data: self.get_all_data,
        chart: self.chart
    }
})

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var title = getUrlVars()["title"];
var field = getUrlVars()["field"];
var table_type = getUrlVars()["table_type"];

self.get_all_data(title, field, table_type);
