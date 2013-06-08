define("WodTracker", [], function() {
    var instance = null;

    function WodTracker() {
        if(instance !== null)
            throw new Error("Duplicate singleton");

        this.initialize();
    }

    WodTracker.getInstance = function() {
        if(instance === null)
            instance = new WodTracker();

        return instance;
    };

    WodTracker.getListStorageKey = function () {
        return "projectCrossFit_WodRecordList";
    };

    WodTracker.prototype = {

        initialize: function () {
            var storage = localStorage.getItem(WodTracker.getListStorageKey());
            this.wodRecordList = storage == undefined ? [] : JSON.parse(storage);

            //Parse list to lookup
            this.wodRecordLookup = {};

            for (var i = 0; i < this.wodRecordList.length; i++) {
                var record = this.wodRecordList[i];
                var list = this.wodRecordLookup[record.wodName];
                if (list == null) {
                    list = [record];
                    this.wodRecordLookup[record.wodName] = list;
                }
                else {
                    list.push(record);
                }
            }
        },

        storeToStorage: function () {
            //Store complete list
            var json = JSON.stringify(this.wodRecordList);
            localStorage.setItem(WodTracker.getListStorageKey(), json);
        },

        removeWodRecord: function (record) {
            //Remove from list
            var index = this.wodRecordList.indexOf(record);
            if (index != -1) {
                this.wodRecordList.splice(index, 1);
            }

            //Remove from lookup  as well
            var lookup = this.wodRecordLookup[record.wodName];
            lookup.splice(lookup.indexOf(record), 1);

            //Store list again (as a record was removed)
            this.storeToStorage();
        },

        getWodRecordsPerName: function (wodName) {
            //First access object
            var records = this.wodRecordLookup[wodName];
            if (records == undefined && records == null) {
                return [];
            }

            return records;
        },

        getWodRecordList: function (noRecords) {
            if(noRecords == undefined)
                return this.wodRecordList;

            //Return noRecords newest records
            return this.wodRecordList.slice(0, noRecords);
        },

        getNoTimesCompleted: function (wodName) {
            var records = this.wodRecordLookup[wodName];
            if (records == undefined && records == null)
                return 0;

            return records.length;
        },

        getNewest: function(wodName) {
            var records = this.wodRecordLookup[wodName];
            if (records == undefined && records == null)
                return null;

            return records[0]; //they are sorted by newest
        },


        getPersonalBest: function (wodName) {
            var records = this.wodRecordLookup[wodName];
            if (records == undefined && records == null)
                return null;

            //Loop through all elements to determine best time (array will be sorted by date not time)
            var best = records[0].time;
            for (var i = 1; i < records.length; i++) {
                var time = records[i].time;
                if (time < best) {
                    best = time;
                }
            }

            return best;
        },

        isPersonalBest: function (record) {

            //Safe guard against time being null and comparing with null
            if (record.time == null)
                return false;

            var best = this.getPersonalBest(record.wodName);
            return best == record.time;
        },

        addWodRecord: function (wodName, dateCompleted, time) {
            //Get existing records
            var recordList = this.wodRecordList;

            var record = {};
            record.wodName = wodName;
            record.dateCompleted = dateCompleted;
            record.time = time;

            recordList.push(record);
            recordList.sort(function (a, b) {
                return b.dateCompleted - a.dateCompleted;
            });

            var nameRecordList = this.wodRecordLookup[wodName];
            if (nameRecordList == null) {
                nameRecordList = this.wodRecordLookup[wodName] = [];
            }

            nameRecordList.push(record);
            nameRecordList.sort(function (a, b) {
                return b.dateCompleted - a.dateCompleted;
            });

            this.storeToStorage();
        },

        clearStorage: function () {
            //Remove list
            localStorage.removeItem(WodTracker.getListStorageKey());
            this.initialize();
        }
    };

    return WodTracker.getInstance();
});


