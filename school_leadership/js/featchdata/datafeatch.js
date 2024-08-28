// document.addEventListener("DOMContentLoaded", function () {
//   const loaderContainer = document.getElementById("loaderContainer");
//   const tab = document.getElementById("tab");
//   let chartdataOne = null;
//   let chartdataTwo = null;
//   let competencyChart = null;

//   $("#submitLogin").click(function () {
//     handleLogin();
//   });
//   async function handleLogin() {
//     // const userIdText = document.getElementById("#userIdText");

//     console.log(userIdText);
//     let userId = $("#userIdText").val();
//     let password = $("#exampleInputPassword1").val();
//     console.log(userId);
//     console.log(password);
//     var formData = new FormData();
//     formData.append("userId", userId);
//     formData.append("password", password);
//     try {
//       const loginUrl = "http://localhost:8080/school/user/login";
//       const response = await fetch(loginUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           treasuryId: userId,
//           password: password,
//         }),
//         // body:formData
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const responseData = await response.json();
//       if (responseData.message === "Login Failed") {
//         console.log(responseData.message);
//         alert("Enter a valid user id and password");
//         throw new Error("Login failed");
//       }

//       // Check if login response indicates password change required
//       else if (responseData.message === "Change your default password") {
//         // Show change password modal
//         //$("#myModal").modal("show");
//         localStorage.setItem("userId", userId);
//         featchdata();
//       }
//       //check for successfu; login message
//       else if (responseData.message === "Login Success") {
//         localStorage.setItem("userId", userId);
//         featchdata();
//         return userId; //Return the treasury ID (username) for data fetching
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   }
//   // Event listener for the Save Changes button in the modal
//   document
//     .getElementById("featchdata")
//     .addEventListener("click", async function () {
//       const oldPassword = document.getElementById(
//         "exampleInputPassword1"
//       ).value;
//       const newPassword = document.getElementById(
//         "exampleInputPassword2"
//       ).value;
//       const confirmPassword = document.getElementById(
//         "exampleInputPassword3"
//       ).value;

//       if (newPassword !== confirmPassword) {
//         alert("New password and confirm password do not match");
//         return;
//       }

//       if (oldPassword === newPassword) {
//         alert("Old password and new password must be different");
//         return;
//       }

//       try {
//         // Call API to change password
//         // Replace with your actual endpoint for changing password
//         const changePasswordUrl =
//           "http://localhost:8080/school/user/update-password";
//         const response = await fetch(changePasswordUrl, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ oldPassword, newPassword }),
//         });

//         if (!response.ok) {
//           throw new Error("Password change failed");
//         }

//         alert("Password changed successfully");
//         $("#myModal").modal("hide");
//       } catch (error) {
//         console.error("Error changing password:", error);
//         alert("Error changing password. Please try again.");
//       }
//     });
//   // // Function to fetch data using treasury ID
//   // async function fetchData() {
//   //   try {
//   //     const cfmsId = localStorage.getItem("userId");
//   //     if (!cfmsId){
//   //       throw new Error("userId not found in localStorage");
//   //     }
//   //     const scoreUrl = `http://localhost:8080/school/${cfmsId}`;
//   //     const response = await fetch(scoreUrl);

//   //     if (!response.ok) {
//   //       throw new Error("Network response was not ok");
//   //     }

//   //     const data = await response.json();
//   //     return data;
//   //   } catch (error) {
//   //     console.error("Fetch error:", error);
//   //     throw error;
//   //   }
//   // }

//   async function featchdata() {
//     try {
//       const cfmsId = localStorage.getItem("userId");
//       if (!cfmsId) {
//         throw new Error("userId not found in localStorage");
//       }
//       const scoreUrl = `http://localhost:8080/school/${cfmsId}`;

//       fetch(scoreUrl)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           } else {
//             return response.json();
//           }
//         })
//         .then((data) => {
//           // if(data.status != "200"){ //if data not featch correctly
//           //     alert("Please enter valid tragedy ID."); // alert message
//           //     return 0;
//           //   }
//           loader.style.display = "none";
//           $("#tab").css("display", "block");
//           $(".heading-title").css("min-height", "146px");
//           //------------------------------------Profile---------------------------------------------------------------//
//           //console.log("Data:", data.profile);
//           $(".nameOfSchoolHead").text(data.profile.nameOfTheSchoolHead);
//           $(".nameOfSchool").text(data.profile.schoolName);
//           $(".udiseCode").text(data.profile.school_udise);
//           $(".contactNumber").text(data.profile.contactNumber);
//           $(".nameOfTheComplex").text(data.profile.nameOfTheComplex);
//           $(".complexUDISECode").text(data.profile.complexUdiseCode);
//           $(".district").text(data.profile.district);
//           $(".mandal").text(data.profile.mandal);
//           $(".designation").text(data.profile.desgination);
//           $(".trainingBatch").text(data.profile.batch);

//           //----------------------------------------------------------------------------------------------------------//

//           //-----------------------------------------------Overall Score----------------------------------------------//

//           //----------------------------------------------------------------------------------------------------------//

//           //-----------------------------------------------cycle one---------------------------------------------------//
//           //document.querySelector(".cycleOne").innerText = data.cycleOne;
//           // Cycle One Data
//           let cycleOneLabels = [];
//           let cycleOnePreTestData = [];
//           let cycleOnePostTestData = [];
//           $("#LC-One").html("");
//           $("#learningCycle").html("");
//           let sumC1 = 0;
//           let countC1 = 0;
//           //console.log(data.cycleOne.tableData);
//           data.cycleOne.tableData.forEach((item) => {
//             cycleOneLabels.push(item.name);
//             cycleOnePreTestData.push(parseInt(item.preMark));
//             cycleOnePostTestData.push(parseInt(item.postMark));
//             $("#attenCycle1").text(item.attendance);
//             sumC1 += parseInt(item.postMark);
//             countC1++;
//             // const row = document.createElement("tbody");
//             var rowDesign = `<tr>
//                             <th scope="row">${item.name}</th>
//                             <td>${item.total}</td>
//                             <td>${item.preMark}</td>
//                             <td>${item.prePercentage}</td>
//                             <td>${item.postMark}</td>
//                             <td>${item.postPercentage}</td>
//                             <td>${item.difference}</td>
//                             <td>${item.diffPercentage}</td>
//                                           <td>${item.competencyLebel}</td>
//                         </tr>`;

//             $("#LC-One").append(rowDesign);
//             $("#learningCycle").append(rowDesign);
//           });
//           $("#avgCycle1").text((sumC1 / countC1).toFixed(1));
//           if (chartdataOne) {
//             chartdataOne.destroy();
//           }
//           chartdataOne = createChartOne(
//             cycleOneLabels,
//             cycleOnePreTestData,
//             cycleOnePostTestData
//           );
//           // Process feedbackData1
//           let ApplaudList1 = "";
//           let FeedbackList1 = "";

//           // Process the data as per your structure
//           Object.keys(data.cycleOne.feedback).forEach((key) => {
//             const categoryName1 = key || "Unknown";
//             const applaud1 = data.cycleOne.applCode[categoryName1];
//             const feedback1 = data.cycleOne.feedback[categoryName1];

//             if (applaud1 != null && applaud1 !== "") {
//               ApplaudList1 += `<li><b>${categoryName1}:</b> ${applaud1}</li>`;
//             }
//             if (feedback1 != null && feedback1 !== "") {
//               FeedbackList1 += `<li><b>${categoryName1}:</b> ${feedback1}</li>`;
//             }
//           });

//           // Append the constructed lists to the appropriate elements
//           document.querySelector(".applaud-data-1").innerHTML = ApplaudList1;
//           document.querySelector(".feedback-data-1").innerHTML = FeedbackList1;
//           // Cycle Two Data
//           let cycleTwoLabels = [];
//           let cycleTwoPreTestData = [];
//           let cycleTwoPostTestData = [];

//           $("#cycleTwoTable").html("");

//           let sumC2 = 0;
//           let countC2 = 0;
//           // console.log(data.cycleTwo.tableData);
//           data.cycleTwo.tableData.forEach((item) => {
//             cycleTwoLabels.push(item.name);
//             cycleTwoPreTestData.push(parseInt(item.preMark));
//             cycleTwoPostTestData.push(parseInt(item.postMark));
//             $("#attenCycle2").text(item.attendance);
//             // const row = document.createElement("tbody");
//             sumC2 += parseInt(item.postMark);
//             countC2++;
//             var rowDesign = `<tr>
//                             <th scope="row">${item.name}</th>
//                             <td>${item.total}</td>
//                             <td>${item.preMark}</td>
//                             <td>${item.prePercentage}</td>
//                             <td>${item.postMark}</td>
//                             <td>${item.postPercentage}</td>
//                             <td>${item.difference}</td>
//                             <td>${item.diffPercentage}</td>
//                                           <td>${item.competencyLebel}</td>
//                         </tr>`;

//             $("#cycleTwoTable").append(rowDesign);
//             $("#learningCycle").append(rowDesign);
//           });
//           $("#avgCycle2").text((sumC2 / countC2).toFixed(1));
//           if (chartdataTwo) {
//             chartdataTwo.destroy();
//           }
//           chartdataTwo = createChartTwo(
//             cycleTwoLabels,
//             cycleTwoPreTestData,
//             cycleTwoPostTestData
//           );

//           // Process feedbackData2
//           let ApplaudList2 = "";
//           let FeedbackList2 = "";

//           // Process the data as per your structure
//           Object.keys(data.cycleTwo.feedback).forEach((key) => {
//             const categoryName1 = key || "Unknown";
//             const applaud1 = data.cycleTwo.applCode[categoryName1];
//             const feedback1 = data.cycleTwo.feedback[categoryName1];

//             if (applaud1 != null && applaud1 !== "") {
//               ApplaudList2 += `<li><b>${categoryName1}:</b> ${applaud1}</li>`;
//             }
//             if (feedback1 != null && feedback1 !== "") {
//               FeedbackList2 += `<li><b>${categoryName1}:</b> ${feedback1}</li>`;
//             }
//           });

//           // Append the constructed lists to the appropriate elements
//           document.querySelector(".applaud-data-2").innerHTML = ApplaudList2;
//           document.querySelector(".feedback-data-2").innerHTML = FeedbackList2;
//           //---------------------------------------compentency Data------------------------------------->
//           // Competency Data
//           let competencyLabels = [];
//           let baseLineData = [];
//           let midLineData = [];
//           let endLineData = [];
//           let baselineSum = 0;
//           let midlineSum = 0;
//           let endlineSum = 0;
//           let countC3 = 0;
//           let competencyChart;
//           let reportChart;

//           let baselineApploude = "";
//           let midlineApploude = "";
//           let endlineApploude = "";

//           let baselineFeedback = "";
//           let midlineFeedback = "";
//           let endlineFeedback = "";
//           $("#competencyWise").html("");
//           $("#reportCard").html(""); // Clear the new table as well
//           // console.log(data.compentency);
//           data.compentency.forEach((item, index) => {
//             // competencyLabels.push(item.tableData.name);
//             // baseLineData.push(parseInt(item.tableData.baseScore));
//             // midLineData.push(parseInt(item.tableData.midScore));
//             // endLineData.push(parseInt(item.tableData.endScore));
//             // baselineSum += parseInt(item.tableData.baseScore);
//             // midlineSum += parseInt(item.tableData.midScore);
//             // endlineSum += parseInt(item.tableData.endScore);
//             // countC3++;
//             // const row = document.createElement("tbody");
//             // $("#baseLineAtten").text(item.tableData.attendance);
//             // $("#midLineAtten").text(item.tableData.attendance);
//             // $("#endLineAtten").text(item.tableData.attendance);

//             // Calculate improvement percentage
//             const improvement =
//               item.tableData.endScore - item.tableData.baseScore;
//             const improvementPercentage = improvement.toFixed(2);

//             // Compare scores with averages and add icons
//             const baseComparison =
//               item.tableData.baseScore > data.stateAverage[index].baseAvg
//                 ? '<i class="fa-solid fa-sort-up up-icon"></i>'
//                 : '<i class="fa-solid fa-sort-down down-icon"></i>';

//             const midComparison =
//               item.tableData.midScore > data.stateAverage[index].midAvg
//                 ? '<i class="fa-solid fa-sort-up" style="color: #25a433;"></i>'
//                 : '<i class="fa-solid fa-sort-down" style="color: #fa1100;"></i>';

//             const endComparison =
//               item.tableData.endScore > data.stateAverage[index].endAvg
//                 ? '<i class="fa-solid fa-sort-up" style="color: #25a433;"></i>'
//                 : '<i class="fa-solid fa-sort-down" style="color: #fa1100;"></i>';

//             const improvementComparison =
//               improvement > 1
//                 ? '<i class="fa-solid fa-sort-up up-icon"></i>'
//                 : '<i class="fa-solid fa-sort-down down-icon"></i>';
//             // Row for competencyWise table
//             // var rowDesignCompetencyWise = `<tr>
//             //   <th scope="row">${item.tableData.name}</th>
//             //   <td>${item.tableData.basePercentage}</td>
//             //   <td>${item.tableData.midPercentage}</td>
//             //   <td>${item.tableData.endPercentage}</td>
//             // </tr>`;

//             // Row for reportCard table

//             // let midvel = item.tableData.midScore;
//             // let endvel = item.tableData.endScore;
//             // var rowDesignReportCard = `<tr>
//             //   <th scope="row">${item.tableData.name}</th>
//             //   <td>${item.tableData.baseScore} ${baseComparison}</td>
//             //   <td>${data.stateAverage[index].baseAvg}</td>
//             //   <td>${midvel.toFixed(2)} ${midComparison}</td>
//             //   <td>${data.stateAverage[index].midAvg}</td>
//             //   <td>${endvel.toFixed(2)} ${endComparison}</td>
//             //   <td>${data.stateAverage[index].endAvg}</td>
//             //   <td>${improvementPercentage}% ${improvementComparison}</td>

//             // </tr>`;
//             // Check if baseAvg is not zero before creating and appending the report card row

//             let midvel = item.tableData.midScore;
//             let endvel = item.tableData.endScore;
//             const found = data.stateAverage.find(
//               (minItem) => minItem.code === item.tableData.name
//             );

//             console.log(found.baseAvg);
//             var rowDesignReportCard = `<tr>
//               <th scope="row">${item.tableData.name}</th>
//               <td>${item.tableData.baseScore} ${baseComparison}</td>
//               <td>${found.baseAvg}</td>
//               <td>${midvel.toFixed(2)} ${midComparison}</td>
//              <td>${found.midAvg}</td>
//               <td>${endvel.toFixed(2)} ${endComparison}</td>
//               <td>${found.endAvg}</td>
//               <td>${improvementPercentage}% ${improvementComparison}</td>
//             </tr>`;

//             $("#competencyWise").append(rowDesignCompetencyWise);
//             $("#reportCard").append(rowDesignReportCard);

//             item.applause.baseline[item.tableData.name] != ""
//               ? (baselineApploude += `<li> <span class="point-title-bold">${
//                   item.tableData.name
//                 } </span>: ${
//                   item.applause.baseline[item.tableData.name]
//                 } </li>`)
//               : "";
//             item.applause.midline[item.tableData.name] != ""
//               ? (midlineApploude += `<li><span class="point-title-bold">${
//                   item.tableData.name
//                 }</span>: ${item.applause.midline[item.tableData.name]}</li>`)
//               : "";
//             item.applause.endline[item.tableData.name] != ""
//               ? (endlineApploude += `<li><span class="point-title-bold">${
//                   item.tableData.name
//                 }</span>: ${item.applause.endline[item.tableData.name]}</li>`)
//               : "";

//             item.feedback.baseline[item.tableData.name] != ""
//               ? (baselineFeedback += `<li><span class="point-title-bold">${
//                   item.tableData.name
//                 }</span>: ${item.feedback.baseline[item.tableData.name]}</li>`)
//               : "";
//             item.feedback.midline[item.tableData.name] != ""
//               ? (midlineFeedback += `<li><span class="point-title-bold">${
//                   item.tableData.name
//                 }</span>: ${item.feedback.midline[item.tableData.name]}</li>`)
//               : "";
//             item.feedback.endline[item.tableData.name] != ""
//               ? (endlineFeedback += `<li><span class="point-title-bold">${
//                   item.tableData.name
//                 }</span>: ${item.feedback.endline[item.tableData.name]}</li>`)
//               : "";
//           });
//           $("#baselineAppluad").html(baselineApploude);
//           $("#baselineFeedback").html(baselineFeedback);
//           $("#midlineAppluad").html(midlineApploude);
//           $("#midlineFeedback").html(midlineFeedback);
//           $("#endlineAppluad").html(endlineApploude);
//           $("#endlineFeedback").html(endlineFeedback);

//           $("#avgbaseLine").text(
//             gradeIndicator(((baselineSum / (countC3 * 10)) * 100).toFixed(0))
//           );
//           $("#avgmidLine").text(
//             gradeIndicator(((midlineSum / (countC3 * 10)) * 100).toFixed(0))
//           );
//           $("#angendLine").text(
//             gradeIndicator(((endlineSum / (countC3 * 10)) * 100).toFixed(0))
//           );
//           // Destroy and recreate competency chart
//           if (competencyChart) {
//             competencyChart.destroy();
//           }
//           competencyChart = createCompetencyChart(
//             competencyLabels,
//             baseLineData,
//             midLineData,
//             endLineData
//           );

//           // Destroy and recreate report chart
//           if (reportChart) {
//             reportChart.destroy();
//           }
//           reportChart = createPieCharts(competencyLabels, endLineData);

//           let stateLabels = [];
//           let stateEndLineData = [];
//           let stateAvgPieCharts;

//           data.stateAverage.forEach((item) => {
//             // Only push to arrays if endAvg is not zero
//             if (item.endAvg !== 0) {
//               stateLabels.push(item.code);
//               stateEndLineData.push(item.endAvg);
//             }
//           });

//           if (stateAvgPieCharts) {
//             stateAvgPieCharts.dispose();
//           }

//           // Create the state average pie chart only if there are valid data points
//           if (stateLabels.length > 0 && stateEndLineData.length > 0) {
//             stateAvgPieCharts = createStateAvgPieChart(
//               stateLabels,
//               stateEndLineData
//             );
//           }
//         });
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert("Error fetching data. Please try again later.");
//       loader.style.display = "none";
//     }
//   }
// });

// // Novice = 0-25%, Advanced Beginner = 26-50%, Proficient = 51-75%, Expert = Above 76%
// function gradeIndicator(val) {
//   var grade = "";
//   if (val >= 76) {
//     grade = "Expert";
//   } else if (val >= 51 && val <= 75) {
//     grade = "Proficient";
//   } else if (val >= 26 && val <= 50) {
//     grade = "Advanced Beginner";
//   } else if (val >= 0 && val <= 25) {
//     grade = "Novice";
//   }

//   return grade;
// }

// //Learning Cycle One
// function createChartOne(labels, preTestData, postTestData) {
//   const chartConfigs = [
//     { canvasId: "Cycle_one", label: "Cycle One" },
//     { canvasId: "Learning_Cycle_one", label: "Learning_Cycle_one" },
//   ];

//   const charts = chartConfigs.map((config) => {
//     const ctx = document.getElementById(config.canvasId).getContext("2d");
//     return new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: "Pre-Test Marks",
//             backgroundColor: "#c14f4d",
//             data: preTestData,
//           },
//           {
//             label: "Post-Test Marks",
//             backgroundColor: "#1f487c",
//             data: postTestData,
//           },
//         ],
//       },
//       options: {
//         scales: {
//           x: {
//             beginAtZero: true,
//             grid: {
//               drawOnChartArea: false,
//             },
//           },
//         },
//       },
//     });
//   });

//   return charts;
// }

// //Learning cycle two
// function createChartTwo(labels, preTestData, postTestData) {
//   const chartConfigs = [
//     { canvasId: "cycle_Two", label: "cycle_Two" },
//     { canvasId: "Learning_Cycle_two", label: "Learning_Cycle_two" },
//   ];

//   const charts = chartConfigs.map((config) => {
//     const ctx = document.getElementById(config.canvasId).getContext("2d");
//     return new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: "Pre-test",
//             data: preTestData,
//             borderColor: "#36A2EB",
//             backgroundColor: "#c14f4d",
//           },
//           {
//             label: "Post-test",
//             data: postTestData,
//             borderColor: "#FF6384",
//             backgroundColor: "#1f487c",
//           },
//         ],
//       },
//       options: {
//         scales: {
//           x: {
//             beginAtZero: true,
//             grid: {
//               drawOnChartArea: false,
//             },
//           },
//         },
//       },
//     });
//   });

//   return charts;
// }
// //Competency wise analysis
// function createCompetencyChart(labels, baseLineData, midLineData, endLineData) {
//   var canvasElement = document.getElementById("competencyChart");
//   var config = {
//     type: "bar",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           label: "Base Line",
//           data: baseLineData,
//           borderColor: "#36A2EB",
//           backgroundColor: "#c14f4d",
//         },
//         {
//           label: "Mid Line",
//           data: midLineData,
//           borderColor: "#FF6384",
//           backgroundColor: "#1f487c",
//         },
//         {
//           label: "End Line",
//           data: endLineData,
//           backgroundColor: "#f0a708",
//           borderColor: "#f0a708",
//         },
//       ],
//     },
//   };

//   return new Chart(canvasElement, config);
// }

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

//   // Customize tooltip
//   pieSeries.slices.template.tooltipText =
//     "{category}: {value.formatNumber('#.0')}"; // Show only category and value
//   chart.legend = new am4charts.Legend();
//   chart.legend.position = "right";

//   return chart;
// }

// // Function to create a 3D pie chart for state averages
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
