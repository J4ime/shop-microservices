/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 44.23076923076923, "KoPercent": 55.76923076923077};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4326923076923077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Validate Token"], "isController": false}, {"data": [0.0, 500, 1500, "POST Refresh Token"], "isController": false}, {"data": [0.0, 500, 1500, "POST Register Bad Email (400)"], "isController": false}, {"data": [0.0, 500, 1500, "GET Profile"], "isController": false}, {"data": [0.9, 500, 1500, "GET All Categories"], "isController": false}, {"data": [0.0, 500, 1500, "POST Create Product No Auth (401)"], "isController": false}, {"data": [1.0, 500, 1500, "GET Category by ID"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Products"], "isController": false}, {"data": [0.0, 500, 1500, "GET Products by Category"], "isController": false}, {"data": [0.0, 500, 1500, "GET Non-existent Product (404)"], "isController": false}, {"data": [0.0, 500, 1500, "POST Login Invalid (401)"], "isController": false}, {"data": [0.0, 500, 1500, "GET All Orders"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 29, 55.76923076923077, 130.32692307692312, 0, 706, 102.0, 301.5, 377.8499999999998, 706.0, 6.27564566739078, 9.401800665278785, 0.806612810765146], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Validate Token", 3, 0, 0.0, 44.333333333333336, 22, 80, 31.0, 80.0, 80.0, 80.0, 11.11111111111111, 2.083333333333333, 1.66015625], "isController": false}, {"data": ["POST Refresh Token", 3, 3, 100.0, 229.66666666666666, 185, 303, 201.0, 303.0, 303.0, 303.0, 7.874015748031496, 1.999261811023622, 1.6686146653543308], "isController": false}, {"data": ["POST Register Bad Email (400)", 2, 2, 100.0, 249.0, 100, 398, 249.0, 398.0, 398.0, 398.0, 5.025125628140704, 3.655975188442211, 1.3642430904522613], "isController": false}, {"data": ["GET Profile", 3, 3, 100.0, 80.0, 32, 112, 96.0, 112.0, 112.0, 112.0, 24.193548387096772, 3.4730972782258065, 3.4730972782258065], "isController": false}, {"data": ["GET All Categories", 5, 0, 0.0, 238.8, 56, 706, 85.0, 706.0, 706.0, 706.0, 2.9744199881023197, 5.4230880056513975, 0.36599308447352763], "isController": false}, {"data": ["POST Create Product No Auth (401)", 2, 2, 100.0, 92.0, 76, 108, 92.0, 108.0, 108.0, 108.0, 5.361930294906166, 0.7697302278820375, 1.3561913538873995], "isController": false}, {"data": ["GET Category by ID", 5, 0, 0.0, 192.8, 30, 305, 288.0, 305.0, 305.0, 305.0, 6.510416666666667, 2.5177001953125, 1.0363260904947917], "isController": false}, {"data": ["GET All Products", 10, 0, 0.0, 145.90000000000003, 63, 223, 145.5, 221.5, 223.0, 223.0, 3.4258307639602603, 17.025442146282973, 0.41484669407331276], "isController": false}, {"data": ["GET Products by Category", 10, 10, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.502626970227671, 4.14910792469352, 0.0], "isController": false}, {"data": ["GET Non-existent Product (404)", 2, 2, 100.0, 238.5, 110, 367, 238.5, 367.0, 367.0, 367.0, 3.316749585406302, 0.9717039800995025, 0.5214811359867331], "isController": false}, {"data": ["POST Login Invalid (401)", 2, 2, 100.0, 106.5, 93, 120, 106.5, 120.0, 120.0, 120.0, 5.58659217877095, 1.4239263268156426, 1.3148131983240223], "isController": false}, {"data": ["GET All Orders", 5, 5, 100.0, 145.2, 70, 281, 121.0, 281.0, 281.0, 281.0, 2.6136957658128592, 0.37520827888133823, 0.37265584161003656], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 2, 6.896551724137931, 3.8461538461538463], "isController": false}, {"data": ["401/Unauthorized", 15, 51.724137931034484, 28.846153846153847], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 47: http://localhost:5000/api/products?categoryId=${CATEGORY_ID}", 10, 34.48275862068966, 19.23076923076923], "isController": false}, {"data": ["404/Not Found", 2, 6.896551724137931, 3.8461538461538463], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 52, 29, "401/Unauthorized", 15, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 47: http://localhost:5000/api/products?categoryId=${CATEGORY_ID}", 10, "400/Bad Request", 2, "404/Not Found", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["POST Refresh Token", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Register Bad Email (400)", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Profile", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Create Product No Auth (401)", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Products by Category", 10, 10, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in query at index 47: http://localhost:5000/api/products?categoryId=${CATEGORY_ID}", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Non-existent Product (404)", 2, 2, "404/Not Found", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Login Invalid (401)", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET All Orders", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
