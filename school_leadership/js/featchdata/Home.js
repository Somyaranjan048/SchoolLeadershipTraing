document.addEventListener("DOMContentLoaded", function () {
  //console.log('mnk')
  const token = getCookie("authToken");
  if (!token) {
    window.location.href = "index.html"; // Redirect to login page
    return;
  }

  // Fetch profile data
  fetchProfileData();
  overallscore();
  // Fetch Report card data
  reportCard();
  LearningCycleAnalysis();

  $("#report-card").click(function () {
    reportCard();
    overallscore();
    LearningCycleAnalysis();
  });
  $("#overall-score").click(function () {
    overallscore();
  });
  $("#cycleOne").click(function () {
    fetchCycleOneData();
  });
  $("#cycleTwo").click(function () {
    fetchCycleTwoData();
  });
  $("#learning-cycle-analysis").click(function () {
    LearningCycleAnalysis();
  });

  $("#competencywisetab").click(function () {
    CometencyWiseDataFetch();
  });
  $("#main-dashboard").click(function () {
    // Main dashboard functionality (if any)
  });

  // Logout functionality with SweetAlert2
  const logoutButton = $("#logout-data");
  logoutButton.on("click", function () {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCookie("authToken");
        window.location.href = "index.html";
      }
    });
  });
});

let cycleTwoChart = null;
let cycleOneChart = null;
let learningCycleChartOne = null;
let learningCycleChartTwo = null;
let reportCardCycleOne = null;
let reportCardCycleTwo = null;
let reportCardChart = null;

//show loader
function showLoader() {
  $("#overlay").show(); // Show the overlay
  $("#loaderContainer").show(); // Show the loader
  document.body.classList.add("loading");
}

//hide loader
function hideLoader() {
  $("#overlay").hide(); // Hide the overlay
  $("#loaderContainer").hide(); // Hide the loader
  document.body.classList.add("loading");
  clearTimeout(hideLoaderTimeout); // Clear any existing timeout to prevent unintended behavior
}
// Function to get a cookie by name
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
//remove token from coookies
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
// Function to fetch profile data
function fetchProfileData() {
  $("#loaderContainer").show();
  // const token = Cookies.get("token"); // Retrieve token from cookies
  const token = getCookie("authToken");
  if (!token) {
    alert("Token not found in cookies. Please log in again.");
    window.location.href = "index.html"; // Redirect to login page
    return;
  }

  const profileUrl = `http://localhost:8080/school/profile`;

  $.ajax({
    url: profileUrl,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      showLoader();
      hideLoaderTimeout = setTimeout(hideLoader, 900000);
    },
    success: function (item) {
      // Update profile data
      $(".nameOfSchoolHead").text(item.profile.nameOfTheSchoolHead);
      $(".nameOfSchool").text(item.profile.schoolName);
      $(".udiseCode").text(item.profile.school_udise);
      $(".contactNumber").text(item.profile.contactNumber);
      $(".nameOfTheComplex").text(item.profile.nameOfTheComplex);
      $(".complexUDISECode").text(item.profile.complexUdiseCode);
      $(".district").text(item.profile.district);
      $(".mandal").text(item.profile.mandal);
      $(".designation").text(item.profile.desgination);
      $(".trainingBatch").text(item.profile.batch);
      $(".designation").text(item.profile.totalyearsOfdesignation);
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", status, error);

      // Handle token expiration
      if (xhr.status === 401) {
        //alert("Token is expired. Please log in again.");
        window.location.href = "index.html";  // Redirect to login page
      } else if (xhr.status === 500) {
        alert("An internal problem occurred. Please try again later.");
        window.location.href = "index.html";
      } else {
        alert("Error fetching data. Please try again later.");
      }

      hideLoader();
    },
  });
}

//funcation for create multi chart
function createPieCharts(competencyLabels, endLineData, stateLabels, stateEndLineData) {
  const ctx = document.getElementById('reportCardChart').getContext('2d');
  const colors = ["#FF6384", "#36A2EB", "#FF9F40", "#FFCD56", "#4BC0C0", "#800000", "#9A6324", "#f032e6", "#aaffc3", "#e6194B", "#ffe119", "#808000"];

  // Handle null or empty data arrays
  competencyLabels = competencyLabels || [];
  endLineData = endLineData || [];
  stateEndLineData = stateEndLineData || [];

  // Prepare the data for Chart.js
  const data = {
    labels: competencyLabels.length ? competencyLabels : ["No Data Found"],
    datasets: [
      {
        label: 'State Endline Data',
        data: stateEndLineData.length ? stateEndLineData : [0],
        backgroundColor: colors.slice(0, stateEndLineData.length),
        hoverOffset: 4
      },
      {
        label: 'Endline Data',
        data: endLineData.length ? endLineData : [0],
        backgroundColor: colors.slice(0, endLineData.length),
        hoverOffset: 4
      }
    ]
  };

  // Configuration for the chart
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      cutout: '50%',
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          color: '#fff', // Text color for labels
          font: {
            weight: 'bold'
          },
          formatter: (value, context) => {
            return value > 0 ? value : ''; // Only display the value if it's greater than 0
          }
        }
      }
    },
    plugins: [ChartDataLabels] // Add the ChartDataLabels plugin
  };

  // Destroy the previous chart instance if it exists
  if (reportCardChart && reportCardChart.destroy) {
    reportCardChart.destroy();
  }

  // Create a new Chart instance
  reportCardChart = new Chart(ctx, config);

  // Create custom legend
  const legendContainer = document.getElementById('legend');
  legendContainer.innerHTML = ''; // Clear previous legend items if any
  competencyLabels.forEach((label, index) => {
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend-item');

    const legendColor = document.createElement('div');
    legendColor.classList.add('legend-color');
    legendColor.style.backgroundColor = colors[index % colors.length]; // Ensure color index is valid

    const legendText = document.createElement('span');
    legendText.innerText = label || "No Data Found"; // Default text for missing labels

    legendItem.appendChild(legendColor);
    legendItem.appendChild(legendText);
    legendContainer.appendChild(legendItem);
  });
}


// Fetch and display report card data
function reportCard() {
  const token = getCookie("authToken");
  let reportChart = null;
  let stateAvgPieCharts = null;

  if (!token) {
    alert("Token not found in cookies. Please log in again.");
    window.location.href = "index.html";
    return;
  }

  const scoreUrl = `http://localhost:8080/school/reportcard`;

  $.ajax({
    url: scoreUrl,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      showLoader();
      //hideLoaderTimeout = setTimeout(hideLoader, 900000);
    },
    success: function (data) {
      $("#tab").css("display", "block");
      $(".heading-title").css("min-height", "146px");
      // Clear existing content
      $("#competencyWise").html("");
      $("#reportCard").html("");

      // Initialize arrays
      let competencyLabels = [];
      let endLineData = [];
      let stateLabels = [];
      let stateEndLineData = [];

      data.reportCard.forEach((item) => {
        const tableData = item.tableData || {};
        const stateAverage = item.stateAverage || {};

        // Handle null or undefined values and prevent NaN
        const name = tableData.name || "N/A";
        const baseScore = !isNaN(parseInt(tableData.baseScore)) ? parseInt(tableData.baseScore) : "N/A";
        const midScore = !isNaN(parseInt(tableData.midScore)) ? parseInt(tableData.midScore) : "N/A";
        const endScore = !isNaN(parseInt(tableData.endScore)) ? parseInt(tableData.endScore) : "N/A";
        const baseAvg = !isNaN(parseInt(stateAverage.baseAvg)) ? parseInt(stateAverage.baseAvg) : "N/A";
        const midAvg = !isNaN(parseInt(stateAverage.midAvg)) ? parseInt(stateAverage.midAvg) : "N/A";
        const endAvg = !isNaN(parseInt(stateAverage.endAvg)) ? parseInt(stateAverage.endAvg) : "N/A";

        // Push values to arrays for charts only if data is valid
        if (endScore !== "N/A") {
          competencyLabels.push(name);
          endLineData.push(endScore);
        }
        if (endAvg !== "N/A") {
          stateLabels.push(name);
          stateEndLineData.push(endAvg);
        }

        // Calculate improvement percentage
        const improvement = (endScore !== "N/A" && baseScore !== "N/A")
          ? endScore - baseScore
          : "N/A";
        const improvementPercentage = improvement !== "N/A"
          ? improvement.toFixed(2)
          : "N/A";

        // Compare scores with averages and add icons
        const baseComparison = baseScore !== "N/A" && baseScore > baseAvg
          ? '<i class="fa-solid fa-sort-up up-icon"></i>'
          : '<i class="fa-solid fa-sort-down down-icon"></i>';

        const midComparison = midScore !== "N/A" && midScore > midAvg
          ? '<i class="fa-solid fa-sort-up" style="color: #25a433;"></i>'
          : '<i class="fa-solid fa-sort-down" style="color: #fa1100;"></i>';

        const endComparison = endScore !== "No Data Found" && endScore > endAvg
          ? '<i class="fa-solid fa-sort-up" style="color: #25a433;"></i>'
          : '<i class="fa-solid fa-sort-down" style="color: #fa1100;"></i>';

        const improvementComparison = improvement !== "No Data Found" && improvement > 1
          ? '<i class="fa-solid fa-sort-up up-icon"></i>'
          : '<i class="fa-solid fa-sort-down down-icon"></i>';

        const rowDesignReportCard = `<tr>
              <th scope="row">${name}</th>
              <td>${baseScore} ${baseComparison}</td>
              <td>${baseAvg}</td>
              <td>${midScore} ${midComparison}</td>
              <td>${midAvg}</td>
              <td>${endScore} ${endComparison}</td>
              <td>${endAvg}</td>
              <td>${improvementPercentage} ${improvementComparison}</td>
            </tr>`;

        $("#reportCard").append(rowDesignReportCard);
      });

      // Handle chart destruction and creation
      if (reportChart && typeof reportChart.destroy === 'function') {
        reportChart.destroy();
      }
      if (stateAvgPieCharts && typeof stateAvgPieCharts.destroy === 'function') {
        stateAvgPieCharts.destroy();
      }

      // Draw new charts
      reportChart = createPieCharts(
        competencyLabels.length ? competencyLabels : ["N/A"],
        endLineData.length ? endLineData : [0],
        stateLabels.length ? stateLabels : ["N/A"],
        stateEndLineData.length ? stateEndLineData : [0]
      );

      hideLoader();
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", status, error);

      // Handle token expiration
      if (xhr.status === 401) {
        //alert("Token is expired. Please log in again.");
        window.location.href = "index.html";  // Redirect to login page
      } else if (xhr.status === 500) {
        alert("An internal problem occurred. Please try again later.");
        window.location.href = "index.html";
      } else {
        alert("Error fetching data. Please try again later.");
      }

      hideLoader();
    },
  });
}



//funcation for create self endline score 3D pie chart
// function createPieCharts(labels, endLineData) {
//   // Create chart instance
//   var chart = am4core.create("endLineChart", am4charts.PieChart3D);

//   // Add data
//   chart.data = labels.map((label, index) => ({
//     category: label,
//     value: endLineData[index],
//   }));

//   // Add and configure Series
//   var pieSeries = chart.series.push(new am4charts.PieSeries3D());
//   pieSeries.dataFields.value = "value";
//   pieSeries.dataFields.category = "category";
//   pieSeries.ticks.template.disabled = true;
//   pieSeries.alignLabels = false;
//   pieSeries.labels.template.text = "{value.formatNumber('#.0')}";
//   pieSeries.legendSettings.valueText = "{ }";
//   pieSeries.labels.template.radius = am4core.percent(-40);
//   pieSeries.labels.template.fill = am4core.color("white");

//   pieSeries.labels.template.adapter.add("radius", function (radius, target) {
//     if (target.dataItem && target.dataItem.values.value.formatNumber) {
//       return 0;
//     }
//     return radius;
//   });

//   pieSeries.labels.template.adapter.add("fill", function (color, target) {
//     if (target.dataItem && target.dataItem.values.value.formatNumber) {
//       return am4core.color("#000");
//     }
//     return color;
//   });

//   // // Customize tooltip
//   // pieSeries.slices.template.tooltipText =
//   //   "{category}: {value.formatNumber('#.0')}"; // Show only category and value
//   // chart.legend = new am4charts.Legend();
//   // chart.legend.position = "right";

//   return chart;
// }

// Function to create a 3D pie chart for state averages
// function createStateAvgPieChart(stateLabels, stateEndLineData) {
//   // Create chart instance
//   var chart = am4core.create("stateAvgChart", am4charts.PieChart3D);

//   // Add data
//   chart.data = stateLabels.map((label, index) => ({
//     category: label,
//     value: stateEndLineData[index],
//   }));

//   // Add and configure Series
//   var pieSeries = chart.series.push(new am4charts.PieSeries3D());
//   pieSeries.dataFields.value = "value";
//   pieSeries.dataFields.category = "category";
//   pieSeries.ticks.template.disabled = true;
//   pieSeries.alignLabels = false;
//   pieSeries.labels.template.text = "{value.formatNumber('#.0')}";
//   pieSeries.legendSettings.valueText = "{ }";
//   pieSeries.labels.template.radius = am4core.percent(-40);
//   pieSeries.labels.template.fill = am4core.color("white");

//   pieSeries.labels.template.adapter.add("radius", function (radius, target) {
//     if (target.dataItem && target.dataItem.values.value.formatNumber) {
//       return 0;
//     }
//     return radius;
//   });

//   pieSeries.labels.template.adapter.add("fill", function (color, target) {
//     if (target.dataItem && target.dataItem.values.value.formatNumber) {
//       return am4core.color("#000");
//     }
//     return color;
//   });

//   // Customize tooltip
//   pieSeries.slices.template.tooltipText =
//     "{category}: {value.formatNumber('#.0')}"; // Show only category and value

//   // Add legend
//   chart.legend = new am4charts.Legend();
//   chart.legend.position = "right";

//   return chart;
// }

//Gread levels for score
function gradeIndicator(val) {
  var grade = "";
  if (val >= 76) {
    grade = "Expert";
  } else if (val >= 51 && val <= 75) {
    grade = "Proficient";
  } else if (val >= 26 && val <= 50) {
    grade = "Advanced Beginner";
  } else if (val >= 0 && val <= 25) {
    grade = "Novice";
  }

  return grade;
}

//Overall Scorecard
function overallscore() {
  const token = getCookie("authToken");
  if (!token) {
    alert("Token not found in cookies. Please log in again.");
    window.location.href = "index.html";
    return;
  }
  const cycleUrl = `http://localhost:8080/school/overallscore`;

  $.ajax({
    url: cycleUrl,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      showLoader();
      //hideLoaderTimeout = setTimeout(hideLoader, 900000);
    },
    success: function (data) {
      $("#tab").css("display", "block");
      $(".heading-title").css("min-height", "146px");
      $("#overallScorecard").html("");
      $("#report-card-overallScore").html("");
      data.competencyAvg.forEach((item) => {
        //console.log("cycleavg:"+item)

        var rowDesign = `<tr>
                      <th scope="row">${item.name || "N/A"}</th>
                      <td>${item.status || "N/A"}</td>
                      <td>${gradeIndicator(item.score) || "N/A"}</td>
                      
                  </tr>`;

        $("#overallScorecard").append(rowDesign);
        $("#report-card-overallScore").append(rowDesign);
      });
      data.cycleAvg.forEach((item) => {
        var rowDesign = `<tr>
                      <th scope="row">${item.name}</th>
                      <td>${item.status}</td>
                      <td>${item.avrageScore}</td>
                  </tr>`;
        $("#overallScorecard").append(rowDesign);
        $("#report-card-overallScore").append(rowDesign);
      });
      hideLoader();
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", status, error);

      // Handle token expiration
      if (xhr.status === 401) {
        alert("Token is expired. Please log in again.");
        window.location.href = "index.html";  // Redirect to login page
      } else if (xhr.status === 500) {
        alert("An internal problem occurred. Please try again later.");
        window.location.href = "index.html";
      } else {
        alert("Error fetching data. Please try again later.");
      }

      hideLoader();
    },
  });
}

// Function to split long labels into multiple lines
function splitLabel(label, maxLength) {
  if (label.length <= maxLength) {
    return [label];
  }
  const words = label.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxLength) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
}

//funcation for bar chart
function createChart(canvasId, labels, preTestData, postTestData, labelPrefix) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.error(`Canvas with ID '${canvasId}' not found.`);
    return null;
  }
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${labelPrefix} Pre-test`,
          data: preTestData,
          borderColor: "#36A2EB",
          backgroundColor: "#c14f4d",
        },
        {
          label: `${labelPrefix} Post-test`,
          data: postTestData,
          borderColor: "#FF6384",
          backgroundColor: "#1f487c",
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: function (value) {
            return value;
          },
          font: {
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            maxRotation: 0, // Set the maximum rotation for the labels
            minRotation: 0, // Set the minimum rotation for the labels
            font: {
              size: 10, // Reduce the font size to fit more labels
            },
            callback: function (value) {
              // Call splitLabel to handle long labels
              return splitLabel(this.getLabelForValue(value), 10);
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false, // Hide grid lines on y-axis
            drawBorder: false, // Remove the y-axis line
            drawTicks: false, // Remove the ticks along the y-axis line
          },
          ticks: {
            display: false, // Disable y-axis tick labels
          },
        },
      },
    },
    plugins: [ChartDataLabels], // Register the plugin
  });
}

//Fetch cycle one data
function fetchCycleOneData() {
  $("#loaderContainer").show();
  const token = getCookie("authToken");
  if (!token) {
    alert("Token not found in cookies. Please log in again.");
    window.location.href = "index.html";
    return;
  }
  const cycleUrl = `http://localhost:8080/school/cycleOne`;
  
  $.ajax({
    url: cycleUrl,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      showLoader();
      hideLoaderTimeout = setTimeout(hideLoader, 900000);
    },
    success: function (data) {
      $("#tab").css("display", "block");
      $(".heading-title").css("min-height", "146px");
      
      let cycleOneLabels = [];
      let cycleOnePreTestData = [];
      let cycleOnePostTestData = [];
      
      $("#LC-One").html("");
      $("#learningCycle").html("");

      if (data.tableData && Array.isArray(data.tableData)) {
        data.tableData.forEach((item) => {
          // Handle null or undefined values
          const name = item.name || "No Data Found";
          const preMark = item.preMark ? parseInt(item.preMark) : 0;
          const postMark = item.postMark ? parseInt(item.postMark) : 0;
          const total = item.total || 0;
          const prePercentage = item.prePercentage || 0;
          const postPercentage = item.postPercentage || 0;
          const difference = item.difference || 0;
          const diffPercentage = item.diffPercentage || 0;
          const competencyLebel = item.competencyLebel || "No Data Found";

          cycleOneLabels.push(name);
          cycleOnePreTestData.push(preMark);
          cycleOnePostTestData.push(postMark);

          let rowDesign = `<tr>
                            <th scope="row">${name}</th>
                            <td>${total}</td>
                            <td>${preMark}</td>
                            <td>${prePercentage}</td>
                            <td>${postMark}</td>
                            <td>${postPercentage}</td>
                            <td>${difference}</td>
                            <td>${diffPercentage}</td>
                            <td>${competencyLebel}</td>
                          </tr>`;

          $("#LC-One").append(rowDesign);
          $("#learningCycle").append(rowDesign);
        });
      } else {
        // Handle case where data.tableData is not available or not an array
        $("#LC-One").html("<tr><td colspan='9'>No Data Found</td></tr>");
        $("#learningCycle").html("<tr><td colspan='9'>No Data Found</td></tr>");
      }

      let ApplaudList1 = "";
      let FeedbackList1 = "";

      if (data.applCode && data.feedback) {
        for (const key in data.feedback) {
          const categoryName1 = key || "Unknown";
          const applaud1 = data.applCode[categoryName1] || "";
          const feedback1 = data.feedback[categoryName1] || "";

          if (applaud1) {
            ApplaudList1 += `<li><b>${categoryName1}:</b> ${applaud1}</li>`;
          }
          if (feedback1) {
            FeedbackList1 += `<li><b>${categoryName1}:</b> ${feedback1}</li>`;
          }
        }
      } else {
        console.warn("Missing applCode or feedback in data");
      }

      $(".applaud-data-1").html(ApplaudList1);
      $(".feedback-data-1").html(FeedbackList1);

      if (cycleOneChart) {
        cycleOneChart.destroy();
        cycleOneChart = null; // Clear reference
      }

      cycleOneChart = createChart(
        "cycle_One",
        cycleOneLabels,
        cycleOnePreTestData,
        cycleOnePostTestData,
        "Cycle One"
      );
      hideLoader();
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", status, error);

      // Handle token expiration
      if (xhr.status === 401) {
       // alert("Token is expired. Please log in again.");
        window.location.href = "index.html";  // Redirect to login page
      } else if (xhr.status === 500) {
        alert("An internal problem occurred. Please try again later.");
        window.location.href = "index.html";
      } else {
        alert("Error fetching data. Please try again later.");
      }

      hideLoader();
    },
  });
}

//Fetch cycle two data
function fetchCycleTwoData() {
  const token = getCookie("authToken"); // Retrieve token from cookies
  if (!token) {
    alert("Token not found in cookies. Please log in again.");
    window.location.href = "index.html"; // Redirect to login page
    return;
  }
  const cycleTwoUrl = `http://localhost:8080/school/cycleTwo`;

  $.ajax({
    url: cycleTwoUrl,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      showLoader();
      hideLoaderTimeout = setTimeout(hideLoader, 900000);
    },
    success: function (data) {
      $("#tab").css("display", "block");
      $(".heading-title").css("min-height", "146px");

      let cycleTwoLabels = [];
      let cycleTwoPreTestData = [];
      let cycleTwoPostTestData = [];

      $("#cycleTwoTable").html(""); // Clear existing table data
      $("#learningCycle").html(""); // Clear existing learning cycle data

      if (data && Array.isArray(data.tableData) && data.tableData.length > 0) {
        data.tableData.forEach((item) => {
          
          cycleTwoLabels.push(item.name);
          cycleTwoPreTestData.push(item.preMark);
          cycleTwoPostTestData.push(item.postMark);

          let rowDesign = `<tr>
                      <th scope="row">${item.name}</th>
                      <td>${item.total}</td>
                      <td>${parseFloat(item.preMark)}</td>
                      <td>${item.prePercentage}</td>
                      <td>${parseFloat(item.postMark)}</td>
                      <td>${item.postPercentage}</td>
                      <td>${item.difference}</td>
                      <td>${item.diffPercentage}</td>
                      <td>${item.competencyLebel}</td>
                  </tr>`;

          $("#cycleTwoTable").append(rowDesign);
          $("#learningCycle").append(rowDesign);
        });
      } else {
        // Handle no data found scenario
        $("#cycleTwoTable").html("<tr><td colspan='9'>No Data Found</td></tr>");
        $("#learningCycle").html("<tr><td colspan='9'>No Data Found</td></tr>");
        cycleTwoLabels = [];
        cycleTwoPreTestData = [];
        cycleTwoPostTestData = [];
      }

      // Process feedbackData2
      let ApplaudList2 = "";
      let FeedbackList2 = "";

      if (data.feedback && typeof data.feedback === 'object') {
        Object.keys(data.feedback).forEach((key) => {
          const categoryName2 = key || "Unknown";
          const applaud2 = data.applCode && data.applCode[categoryName2] ? data.applCode[categoryName2] : ""; // Ensure correct path
          const feedback2 = data.feedback[categoryName2] || ""; // Ensure correct path

          if (applaud2) {
            ApplaudList2 += `<li><b>${categoryName2}:</b> ${applaud2}</li>`;
          }
          if (feedback2) {
            FeedbackList2 += `<li><b>${categoryName2}:</b> ${feedback2}</li>`;
          }
        });
      } else {
        console.warn("Missing or invalid feedback data:", data.feedback);
      }

      $(".applaud-data-2").html(ApplaudList2);
      $(".feedback-data-2").html(FeedbackList2);

      if (cycleTwoChart) {
        cycleTwoChart.destroy();
        cycleTwoChart = null;
      }

      // Check if there's data to plot
      if (cycleTwoLabels.length > 0) {
        cycleTwoChart = createChart(
          "cycle_Two",
          cycleTwoLabels,
          cycleTwoPreTestData,
          cycleTwoPostTestData,
          "Cycle Two"
        );
      } else {
        // Handle case where there's no data to plot
        $("#cycle_Two").html("<p>No data available to display the chart.</p>");
      }

      hideLoader();
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", status, error);

      // Handle token expiration
      if (xhr.status === 401) {
        //alert("Token is expired. Please log in again.");
        window.location.href = "index.html";  // Redirect to login page
      } else if (xhr.status === 500) {
        alert("An internal problem occurred. Please try again later.");
        window.location.href = "index.html";
      } else {
        alert("Error fetching data. Please try again later.");
      }

      hideLoader();
    },
  });
}


//Learning cycle analysis
function LearningCycleAnalysis() {
  const token = getCookie("authToken"); // Retrieve token from cookies
  if (!token) {
    alert("Token not found in cookies. Please log in again.");
    window.location.href = "index.html"; // Redirect to login page
    return;
  }
  const cycleUrl = `http://localhost:8080/school/learningcycle`;

  $.ajax({
    url: cycleUrl,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      showLoader();
      //hideLoaderTimeout = setTimeout(hideLoader, 900000);
    },
    success: function (data) {
      let cycleOneLabels = [];
      let cycleOnePreTestData = [];
      let cycleOnePostTestData = [];

      let cycleTwoLabels = [];
      let cycleTwoPreTestData = [];
      let cycleTwoPostTestData = [];

      $("#LC-One").html("");
      $("#learningCycle").html("");
      $("#report-card-learningcycle").html("");

      if (data.tableData && Array.isArray(data.tableData)) {
        data.tableData.forEach((item) => {
          // Handle null or undefined values
          const name = item.name || "N/A";
          const preMark = item.preMark ? parseInt(item.preMark) : 0;
          const postMark = item.postMark ? parseInt(item.postMark) : 0;
          const attendance = item.attendance || "N/A";
          const total = item.total || 0;
          const prePercentage = item.prePercentage || 0;
          const postPercentage = item.postPercentage || 0;
          const difference = item.difference || 0;
          const diffPercentage = item.diffPercentage || 0;
          const competencyLebel = item.competencyLebel || "N/A";

          if (item.cycleCode === "LC1") {
            cycleOneLabels.push(item.name);
            cycleOnePreTestData.push(item.preMark);
            cycleOnePostTestData.push(item.postMark);
          } else if (item.cycleCode === "LC2") {
            cycleTwoLabels.push(item.name);
            cycleTwoPreTestData.push(item.preMark);
            cycleTwoPostTestData.push(item.postMark);
          }

          $("#attenCycle1").text(attendance);
          let rowDesign = `<tr>
                            <th scope="row">${name}</th>
                            <td>${total}</td>
                            <td>${preMark}</td>
                            <td>${prePercentage}</td>
                            <td>${postMark}</td>
                            <td>${postPercentage}</td>
                            <td>${difference}</td>
                            <td>${diffPercentage}</td>
                            <td>${competencyLebel}</td>
                          </tr>`;

          $("#LC-One").append(rowDesign);
          $("#learningCycle").append(rowDesign);
          $("#report-card-learningcycle").append(rowDesign);
        });
      } else {
        // Handle case where data.tableData is not available or not an array
        $("#LC-One").html("<tr><td colspan='9'>No Data Found</td></tr>");
        $("#learningCycle").html("<tr><td colspan='9'>No Data Found</td></tr>");
        $("#report-card-learningcycle").html("<tr><td colspan='9'>No Data Found</td></tr>");
      }

      hideLoader();
      // Destroy existing charts if they exist
      if (learningCycleChartOne) {
        learningCycleChartOne.destroy();
        learningCycleChartOne = null; // Clear reference
      }
      if (learningCycleChartTwo) {
        learningCycleChartTwo.destroy();
        learningCycleChartTwo = null; // Clear reference
      }
      if (reportCardCycleOne) {
        reportCardCycleOne.destroy();
        reportCardCycleOne = null; // Clear reference
      }
      if (reportCardCycleTwo) {
        reportCardCycleTwo.destroy();
        reportCardCycleTwo = null; // Clear reference
      }
      reportCardCycleOne = createChart(
        "ReportCard-Learning_cycle_one",
        cycleOneLabels,
        cycleOnePreTestData,
        cycleOnePostTestData,
        "Learning Cycle One"
      );
      reportCardCycleTwo = createChart(
        "ReportCard-Learning_cycle_two",
        cycleTwoLabels,
        cycleTwoPreTestData,
        cycleTwoPostTestData,
        "Learning Cycle Two"
      );
      learningCycleChartOne = createChart(
        "Learning_cycle_one",
        cycleOneLabels,
        cycleOnePreTestData,
        cycleOnePostTestData,
        "Learning Cycle One"
      );
      learningCycleChartTwo = createChart(
        "Learning_cycle_two",
        cycleTwoLabels,
        cycleTwoPreTestData,
        cycleTwoPostTestData,
        "Learning Cycle Two"
      );
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", status, error);

      // Handle token expiration
      if (xhr.status === 401) {
        //alert("Token is expired. Please log in again.");
        window.location.href = "index.html";  // Redirect to login page
      } else if (xhr.status === 500) {
        alert("An internal problem occurred. Please try again later.");
        window.location.href = "index.html";
      } else {
        alert("Error fetching data. Please try again later.");
      }

      hideLoader();
    },
  });
}


//Cometency wise analysis
let competencyChart = null; // Define this globally if needed

function CometencyWiseDataFetch() {
  $("#loaderContainer").show();
  const token = getCookie("authToken"); // Retrieve token from cookies
  if (!token) {
    alert("Token not found in cookies. Please log in again.");
    window.location.href = "index.html"; // Redirect to login page
    return;
  }
  const cycleTwoUrl = `http://localhost:8080/school/competency`;

  $.ajax({
    url: cycleTwoUrl,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    beforeSend: function () {
      showLoader();
      //hideLoaderTimeout = setTimeout(hideLoader, 900000);
    },
    success: function (data) {
      $("#tab").css("display", "block");
      $(".heading-title").css("min-height", "146px");

      let baselineApploude = "";
      let midlineApploude = "";
      let endlineApploude = "";

      let baselineFeedback = "";
      let midlineFeedback = "";
      let endlineFeedback = "";
      let competencyLabels = [];
      let baseLineData = [];
      let midLineData = [];
      let endLineData = [];
      
      $("#competencyWise").html("");
      
      if (data.competency && Array.isArray(data.competency) && data.competency.length > 0) {
        console.log(data.competency);
        data.competency.forEach((item) => {
          if (item && item.tableData) {
            competencyLabels.push(item.tableData.name || "Unknown");

            // Handle cases where scores might be missing or invalid
            let baseScore = item.tableData.baseScore === "N/A" || item.tableData.baseScore == null ? 0 : parseFloat(item.tableData.baseScore);
            let midScore = item.tableData.midScore === "N/A" || item.tableData.midScore == null ? 0 : parseFloat(item.tableData.midScore);
            let endScore = item.tableData.endScore === "N/A" || item.tableData.endScore == null ? 0 : parseFloat(item.tableData.endScore);

            baseLineData.push(baseScore);
            midLineData.push(midScore);
            endLineData.push(endScore);

            let rowDesign = `<tr>
                            <th scope="row">${item.tableData.name || "Unknown"}</th>
                            <td>${item.tableData.baseLevel || "N/A"}</td>
                            <td>${item.tableData.midLevel || "N/A"}</td>
                            <td>${item.tableData.endLevel || "N/A"}</td>
                        </tr>`;

            $("#competencyWise").append(rowDesign);

            // Safeguard against undefined properties
            if (item.applause) {
              if (item.applause.baseline && item.applause.baseline[item.tableData.name]) {
                baselineApploude += `<li><span class="point-title-bold">${item.tableData.name}</span>: ${item.applause.baseline[item.tableData.name]}</li>`;
              }
              if (item.applause.midline && item.applause.midline[item.tableData.name]) {
                midlineApploude += `<li><span class="point-title-bold">${item.tableData.name}</span>: ${item.applause.midline[item.tableData.name]}</li>`;
              }
              if (item.applause.endline && item.applause.endline[item.tableData.name]) {
                endlineApploude += `<li><span class="point-title-bold">${item.tableData.name}</span>: ${item.applause.endline[item.tableData.name]}</li>`;
              }
            }

            if (item.feedback) {
              if (item.feedback.baseline && item.feedback.baseline[item.tableData.name]) {
                baselineFeedback += `<li><span class="point-title-bold">${item.tableData.name}</span>: ${item.feedback.baseline[item.tableData.name]}</li>`;
              }
              if (item.feedback.midline && item.feedback.midline[item.tableData.name]) {
                midlineFeedback += `<li><span class="point-title-bold">${item.tableData.name}</span>: ${item.feedback.midline[item.tableData.name]}</li>`;
              }
              if (item.feedback.endline && item.feedback.endline[item.tableData.name]) {
                endlineFeedback += `<li><span class="point-title-bold">${item.tableData.name}</span>: ${item.feedback.endline[item.tableData.name]}</li>`;
              }
            }
          }
        });
      } else {
        // Handle no data found scenario
        $("#competencyWise").html("<tr><td colspan='4'>No Data Found</td></tr>");
        competencyLabels = [];
        baseLineData = [];
        midLineData = [];
        endLineData = [];
      }

      $("#baselineAppluad").html(baselineApploude);
      $("#baselineFeedback").html(baselineFeedback);
      $("#midlineAppluad").html(midlineApploude);
      $("#midlineFeedback").html(midlineFeedback);
      $("#endlineAppluad").html(endlineApploude);
      $("#endlineFeedback").html(endlineFeedback);
      hideLoader();

      // Chart Handling
      if (competencyChart) {
        competencyChart.destroy(); // Destroy previous chart
      }
      if (competencyLabels.length > 0) {
        competencyChart = createCompetencyChart(
          competencyLabels,
          baseLineData,
          midLineData,
          endLineData
        );
      } else {
        // Handle case where there's no data to plot
        $("#competencyChartContainer").html("<p>No data available to display the chart.</p>");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", status, error);

      // Handle token expiration
      if (xhr.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "index.html";  // Redirect to login page
      } else if (xhr.status === 500) {
        alert("An error occurred on the server. Please try again later.");
        // Optionally redirect to login page as well
        window.location.href = "index.html";
      } else {
        alert("Error fetching data. Please try again later.");
      }

      hideLoader();
    },
  });
}


//Competency wise analysis
function createCompetencyChart(labels, baseLineData, midLineData, endLineData) {
  var canvasElement = document.getElementById("competencyChart");
  var config = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Base Line",
          data: baseLineData,
          borderColor: "#36A2EB",
          backgroundColor: "#c14f4d",
        },
        {
          label: "Mid Line",
          data: midLineData,
          borderColor: "#FF6384",
          backgroundColor: "#1f487c",
        },
        {
          label: "End Line",
          data: endLineData,
          backgroundColor: "#f0a708",
          borderColor: "#f0a708",
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: function (value) {
            return value;
          },
          font: {
            weight: "bold",
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            maxRotation: 0, // Set the maximum rotation for the labels
            minRotation: 0, // Set the minimum rotation for the labels
            font: {
              size: 10, // Reduce the font size to fit more labels
            },
            callback: function (value) {
              // Call splitLabel to handle long labels
              return splitLabel(this.getLabelForValue(value), 10);
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false, // Hide grid lines on y-axis
            drawBorder: false, // Remove the y-axis line
            drawTicks: false, // Remove the ticks along the y-axis line
          },
          ticks: {
            display: false, // Disable y-axis tick labels
          },
        },
      },
    },
    plugins: [ChartDataLabels], // Register the plugin
  };

  return new Chart(canvasElement, config);
}

//funcation for download PDF
// function downloadPDF() {
//   const { jsPDF } = window.jspdf;
//   var page1Content = document.getElementById('page1-content');
//   var page2Content = document.getElementById('page2-content');
//   var pdf = new jsPDF('p', 'mm', 'a4');
//   var margin = 10; // Margin in mm
//   var pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin; // A4 width in mm minus margins
//   var pdfHeight = pdf.internal.pageSize.height;

//   // Local image paths
//   var leftImagePath = 'images/ap-Gov_Logo-copy-removebg-preview.png'; // Path to the first image
//   var rightImagePath = 'images/Samagra-Shiksha-Logo.png'; // Path to the second image

//   // Function to convert image URL to Base64
//   function toBase64(url, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//       var reader = new FileReader();
//       reader.onloadend = function() {
//         callback(reader.result);
//       };
//       reader.readAsDataURL(xhr.response);
//     };
//     xhr.open('GET', url);
//     xhr.responseType = 'blob';
//     xhr.send();
//   }

//   // Convert local images to base64
//   var leftImageDataUrl;
//   var rightImageDataUrl;

//   toBase64(leftImagePath, function(dataUrl) {
//     leftImageDataUrl = dataUrl;

//     toBase64(rightImagePath, function(dataUrl) {
//       rightImageDataUrl = dataUrl;

//       // Add Page 1
//       html2canvas(page1Content, { scale: 2 }).then(canvas => {
//         var imgData = canvas.toDataURL('image/png');
//         var imgWidth = pdfWidth;
//         var imgHeight = canvas.height * imgWidth / canvas.width;
//         var pageHeight = pdf.internal.pageSize.height - 2 * margin;

//         var heightLeft = imgHeight;
//         var position = margin;

//         // Add header to the first page
//         addHeader(pdf, leftImageDataUrl, rightImageDataUrl);

//         pdf.addImage(imgData, 'PNG', margin, position + 50, imgWidth, imgHeight); // Adjusted position for header
//         heightLeft -= pageHeight;

//         while (heightLeft > 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // Only add content, no header
//           heightLeft -= pageHeight;
//         }

//         // Add Page 2
//         pdf.addPage();
//         html2canvas(page2Content, { scale: 2 }).then(canvas => {
//           var imgData = canvas.toDataURL('image/png');
//           var imgWidth = pdfWidth;
//           var imgHeight = canvas.height * imgWidth / canvas.width;
//           var pageHeight = pdf.internal.pageSize.height - 2 * margin;

//           var heightLeft = imgHeight;
//           var position = margin;

//           pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // Only add content, no header
//           heightLeft -= pageHeight;

//           while (heightLeft > 0) {
//             position = heightLeft - imgHeight;
//             pdf.addPage();
//             pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // Only add content, no header
//             heightLeft -= pageHeight;
//           }

//           pdf.save('report.pdf');
//         });
//       });
//     });
//   });

//   // Function to add header with image and text in one line
//   function addHeader(pdf, leftImageDataUrl, rightImageDataUrl) {
//     var headerText = [
//         'Department of School Education',
//         'Government of Andhra Pradesh',
//         'Samagra Shiksha - SIEMAT'
//     ];

//     var headerTopMargin = 10; // Top margin for the header in mm
//     var headerImageWidth = 30; // Width of images in mm
//     var headerImageHeight = 30; // Height of images in mm
//     var rightImgaeWidth = 45;
//     var textStartY = 15; // Starting Y position for text
//     var lineSpacing = 10; // Vertical spacing between text lines

//     // Add the left image
//     if (leftImageDataUrl) {
//         pdf.addImage(leftImageDataUrl, 'PNG', margin, headerTopMargin, headerImageWidth, headerImageHeight);
//     }

//     // Add the right image
//     if (rightImageDataUrl) {
//         pdf.addImage(rightImageDataUrl, 'PNG', pdf.internal.pageSize.width - rightImgaeWidth - margin, headerTopMargin, rightImgaeWidth, headerImageHeight);
//     }

//     // Calculate available width for text
//     var textAreaWidth = pdf.internal.pageSize.width - 2 * (margin + 40);
//     var textX = margin + headerImageWidth; // X position of text starting point

//     // Set font and size for text
//     pdf.setFont('Helvetica', 'normal');

//     // Add the text in a pyramid format
//     headerText.forEach((line, index) => {
//         // Adjust the font size for the first line
//         if (index === 0) {
//             pdf.setFontSize(12); // Larger font size
//             pdf.setFont('Helvetica', 'bold'); // Bold font
//         } else {
//             pdf.setFontSize(12); // Regular font size
//             pdf.setFont('Helvetica', 'bold'); // Regular font
//         }

//         var textWidth = pdf.getStringUnitWidth(line) * pdf.internal.scaleFactor;
//         var lineX = textX + (textAreaWidth - textWidth) / 2; // Center text horizontally
//         var lineY = textStartY + (index * lineSpacing); // Adjust vertical spacing for pyramid effect

//         pdf.text(line, lineX, lineY); // Add text to PDF
//     });
//   }
// }
const DOMPurify = require('dompurify');

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 10;

  // Example of simple text content for testing
  const pageContent = document.getElementById('page1-content').innerHTML;

  pdf.html(pageContent, {
    x: margin,
    y: margin,
    callback: function () {
      pdf.save('report.pdf');
    }
  });
}

// Add error handling to html2canvas
html2canvas(document.getElementById('page1-content'), { scale: 2 })
  .then(canvas => {
    // Your canvas to PDF logic here
  })
  .catch(err => {
    console.error("html2canvas error:", err);
  });






