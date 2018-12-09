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
            self.graph.title = data.title;
        }
        self.graph.chartData = data.list;
    });
};

// tab menu for chart
self.chart = function (evt, chart) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
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
      // lineChart: false,
      // columnChart: false
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

self.get_all_data(title, field)
