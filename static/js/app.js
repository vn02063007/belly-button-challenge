// Define a url endpoint with a constant.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use a Promise function to fetch JSON data from APIs on the web with d3.json.
const dataPromise = d3.json(url);

// Create charts function.

function charts(sampleID) {
    // find the sample data from samples.json file url endpoint.
    dataPromise.then((data) => {
        var samplesArray = data.samples;
        var filterSpNo = samplesArray.filter(sampleobject =>
            sampleobject.id == sampleID);
        var result = filterSpNo[0];

        console.log(result);

        // Create variables to hold the otu_ids, otu_labels, and sample_values.
        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        //  Create the trace for bar 
        var trace1 = {
            x: values.slice(0, 10).reverse(), 
            y: ids.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse(),
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var bar_data = [trace1];

        var bar_layout = {
            title: "<b>Top 10 Bacteria Cultures Found</b>",
            margin: {t: 50, l: 160},
        };    

        //  Create trace for bubble
        var trace2 = {
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                colorscale: "Earth",
                size: values,
            },
        };

        var bubble_data = [trace2];

        var bubble_layout = {
            margin: {t: 0},
            xaxis: { title: "OTU ID"},
            hovermode: "closest",
            width: window.width,
        };

        // Plot graphs
        Plotly.newPlot("bar", bar_data, bar_layout);
        Plotly.newPlot("bubble", bubble_data, bubble_layout);

    });
};


// Build the Demographic info

function DemoInfo(sample) {
    dataPromise.then((data) => {
        var Metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultsarray = Metadata.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select(`#sample-metadata`);
        // Use `.html("") to clear any existing metadata 
        PANEL.html("");


        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you need to use d3 to append new tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h5").text(`${key}: ${value}`);
        });

    });
};


// Create gauge chart 

function gaugeChart(sample) {
    dataPromise.then((data) => {
        var Metadata = data.metadata; 
        var subjectArray = Metadata.filter(sampleObj =>
            sampleObj.id == sample);
        var result = subjectArray[0];

        var gauge_data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            type: "indicator",
            mode: "gauge+number",
            title: { text: "Belly Button Washing Frequency <br>Scrubs per Week" },
            gauge: {
                axis: { range: [null, 10], tickwidth: 2},
                steps: [
                    { range: [0, 2], color: "rgb(248, 243, 236)" },
                    { range: [2, 4], color: "rgb(239, 234, 220)" },
                    { range: [4, 6], color: "rgb(230, 225, 205)" },
                    { range: [6, 8], color: "rgb(218, 217, 190)" },
                    { range: [8, 10], color: "rgb(204, 209, 176)" },
                    { range: [5, 6], color: "rgb(189, 202, 164)" },
                    { range: [6, 7], color: "rgb(172, 195, 153)" },
                    { range: [7, 8], color: "rgb(153, 188, 144)" },
                    { range: [8, 9], color: "rgb(132, 181, 137)" },
                ]
            }
        }];
        
         // Create the layout for the gauge chart.
        var gauge_layout = {
            width: 450,
            height: 445,
            margin: { t: 0, r: 25, l: 25, b: 0 }
        };

        // Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
    });
};


function init() {
    
    dataPromise.then(function (data) {
        console.log("samples.json: ", data);
        // Grab a reference to the dropdown select element
        let DropDown = d3.select(`#selDataset`);

        data.names.forEach((name) => {
            DropDown.append(`option`).text(name).property(`value`, name);
        });
        // Use the first sample from the list to build the initial plots
        const firstSample = data.names[0];
        charts(firstSample);
        DemoInfo(firstSample);
        gaugeChart(firstSample);
    });
};

console.log("Data Promise: ", dataPromise);

// change results each time a new sample is selected to update demographics and charts.

function optionChanged(newSample) {
    charts(newSample);
    DemoInfo(newSample);
    gaugeChart(newSample);
}
// Initialise the dashboard
init();