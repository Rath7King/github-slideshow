sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
], (Controller, JSONModel, FeedItem) => {
    "use strict";

    /* ── Shared chart defaults ── */
    const COMMON_PROPS = {
        legend:       { visible: false },
        categoryAxis: { title: { visible: false } },
        valueAxis:    { title: { visible: false } },
        title:        { visible: false }
    };

    const BAR_FEEDS = [
        new FeedItem({ uid: "valueAxis",    type: "Measure",   values: ["Usage"] }),
        new FeedItem({ uid: "categoryAxis", type: "Dimension", values: ["Template"] })
    ];

    return Controller.extend("project1.controller.View1", {

        onInit() {
            this._initModel();
            this._configureCharts();
        },

        /* ─────────────────────────────────────────────
           Model
        ───────────────────────────────────────────── */
        _initModel() {
            const oModel = new JSONModel({

                createdDate: "CREATEDDAY: Dec 28, 2025 5:00...",

                kpi: {
                    uploaded:  "71",
                    approved:  "60",
                    onboarded: "114",
                    rejected:  "11"
                },

                // Stacked bar — MFU Templates by Modules
                moduleData: [
                    { module: "ESG",      approved: 25, pending: 5, uploaded: 1 },
                    { module: "FINCOST",  approved: 2,  pending: 2, uploaded: 0 },
                    { module: "ICON",     approved: 6,  pending: 1, uploaded: 1 },
                    { module: "NFRP",     approved: 22, pending: 2, uploaded: 0 },
                    { module: "TREASURY", approved: 5,  pending: 0, uploaded: 0 }
                ],

                // Donut — MFU Templates by Count
                pieData: [
                    { module: "ESG",      count: 33.86 },
                    { module: "FINCOST",  count: 5.63  },
                    { module: "ICON",     count: 5.43  },
                    { module: "NFRP",     count: 6.40  },
                    { module: "TREASURY", count: 33.89 }
                ],

                // Top 3 by Month / Quarter / Year
                topMonthData:   [
                    { template: "NFRP", usage: 23 },
                    { template: "ESG",  usage: 17 },
                    { template: "ICON", usage: 2  }
                ],
                topQuarterData: [
                    { template: "ESG",      usage: 31 },
                    { template: "NFRP",     usage: 24 },
                    { template: "TREASURY", usage: 6  }
                ],
                topYearData: [
                    { template: "ESG",      usage: 31 },
                    { template: "NFRP",     usage: 24 },
                    { template: "TREASURY", usage: 6  }
                ],

                // MFU Details table
                tableData: [
                    { moduleName: "ESG", subModuleName: "MAPPING MASTER", loadType: "TRUNCATE", loadTemplate: "MFU BOOKING ENTITY XLATE", loadCount: "17,655"  },
                    { moduleName: "",    subModuleName: "",                loadType: "",         loadTemplate: "MFU BUSINESS INPUT",        loadCount: "223,375" },
                    { moduleName: "",    subModuleName: "",                loadType: "",         loadTemplate: "MFU CREDITNATE LIMIT",       loadCount: "18,200"  },
                    { moduleName: "",    subModuleName: "",                loadType: "",         loadTemplate: "MFU DEAL PIPELINE",          loadCount: "114,454" },
                    { moduleName: "",    subModuleName: "",                loadType: "",         loadTemplate: "MFU ENTITY XLATE",           loadCount: "303,321" },
                    { moduleName: "",    subModuleName: "",                loadType: "",         loadTemplate: "MFU INTEGRATED SF",          loadCount: "13,241"  },
                    { moduleName: "",    subModuleName: "",                loadType: "",         loadTemplate: "",                           loadCount: "12,988"  }
                ]
            });

            this.getView().setModel(oModel);
        },

        /* ─────────────────────────────────────────────
           Charts  (vizProperties + setFeeds — no
           FeedItem tags needed in the XML)
        ───────────────────────────────────────────── */
        _configureCharts() {
            this._setupModuleChart();
            this._setupPieChart();
            this._setupBarChart("monthChart",   ["#2196a8", "#4db8a4", "#7ec8c8"]);
            this._setupBarChart("quarterChart",  ["#1f3d7a", "#4db8a4", "#7ec8c8"]);
            this._setupBarChart("yearChart",     ["#4db8a4", "#2196a8", "#1f3d7a"]);
        },

        _setupModuleChart() {
            const oChart = this.byId("moduleBarChart");
            if (!oChart) { return; }

            oChart.setVizProperties({
                ...COMMON_PROPS,
                plotArea: {
                    colorPalette: ["#1f3d7a", "#4db8a4", "#7ec8a0"],
                    dataLabel: { visible: true, formatString: "#" }
                }
            });

            oChart.setFeeds([
                new FeedItem({ uid: "valueAxis",    type: "Measure",   values: ["Approved", "Pending", "Uploaded"] }),
                new FeedItem({ uid: "categoryAxis", type: "Dimension", values: ["Module"] })
            ]);
        },

        _setupPieChart() {
            const oChart = this.byId("pieChart");
            if (!oChart) { return; }

            oChart.setVizProperties({
                legend: { visible: false },
                title:  { visible: false },
                plotArea: {
                    colorPalette: ["#2196a8", "#4db8a4", "#7ec8c8", "#1a5276", "#34495e"],
                    dataLabel: { visible: true, type: "percentage" }
                }
            });

            oChart.setFeeds([
                new FeedItem({ uid: "size",  type: "Measure",   values: ["Count"] }),
                new FeedItem({ uid: "color", type: "Dimension", values: ["Module"] })
            ]);
        },

        _setupBarChart(sId, aColors) {
            const oChart = this.byId(sId);
            if (!oChart) { return; }

            oChart.setVizProperties({
                ...COMMON_PROPS,
                plotArea: {
                    colorPalette: aColors,
                    dataLabel: { visible: true }
                }
            });

            // Re-use shared feed items (each call creates fresh instances)
            oChart.setFeeds([
                new FeedItem({ uid: "valueAxis",    type: "Measure",   values: ["Usage"] }),
                new FeedItem({ uid: "categoryAxis", type: "Dimension", values: ["Template"] })
            ]);
        }
    });
});
