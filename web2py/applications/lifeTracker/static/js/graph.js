var self = {};
Vue.config.silent = false; // show all warnings

self.get_all_data = function (table_name, field, table_type) {
    self.graph.field = field;
    $.post(get_all_data_url,{
        table: table_name,
        field: field,
        type: table_type
    }, function (data) {
        var all = data.list;
        console.log(data.list);
        if(table_type === 'BOOLEAN') {
            for(var i = 0; i < all.length; i++){
                if(all[i][1] === 'true') {
                    all[i][1] = 1;
                } else {
                    all[i][1] = 0;
                }
            }
        }
        for(var i = 0; i < all.length; i++){
            all[i][0] = all[i][0].substring(0,10);
            self.graph.title = data.title;
        }
        self.graph.chartData = all;
    });
};

// tab menu for chart
self.chart = function (evt, chart) {
  var tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(chart).style.display = "block";
  evt.currentTarget.className += " active";
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
        chart: self.chart
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
