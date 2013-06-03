var WodTracker = function (wodRecordList) {
    this.wodRecordList = wodRecordList;

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
};

WodTracker.getListStorageKey = function () {
    return "projectCrossFit_WodRecordList";
};

WodTracker.prototype.storeToStorage = function () {
    //Store complete list
    var json = JSON.stringify(this.wodRecordList);
    localStorage.setItem(WodTracker.getListStorageKey(), json);
};

WodTracker.clearStorage = function () {
    //Remove list
    localStorage.removeItem(WodTracker.getListStorageKey());
};

WodTracker.getTracker = function () {
    var storage = localStorage.getItem(WodTracker.getListStorageKey());
    var records = storage == undefined ? [] : JSON.parse(storage);

    return new WodTracker(records);
};

WodTracker.prototype.removeWodRecord = function (record) {
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

    return removed;
};

WodTracker.prototype.getWodRecordList = function () {
    return this.wodRecordList;
};

WodTracker.prototype.getWodRecordsPerName = function (wodName) {
    //First access object
    var records = this.wodRecordLookup[wodName];
    if (records == undefined && records == null) {
        return [];
    }

    return records;
};

WodTracker.prototype.getNoTimesCompleted = function (wodName) {
    var records = this.wodRecordLookup[wodName];
    if (records == undefined && records == null)
        return 0;

    return records.length;
};

WodTracker.prototype.getPersonalBestHtml = function(wodName) {
    var personalBest = this.getPersonalBest(wodName);

    var bestText;
    if(personalBest != null) {
        bestText = "Personal best: " + DateFormatter.formatSecondsAsTime(personalBest);
    }
    else {
        bestText = "You do not have a personal best yet"
    }

    return '<span class="badge-icon"></span>' + bestText;
}

WodTracker.prototype.getPersonalBest = function (wodName) {
    var records = this.wodRecordLookup[wodName];
    if (records == undefined && records == null)
        return null;

    //Loop through all elements to determine best time (array will be sorted by date not time)
    var best = records[0].time;
    for(var i=1; i<records.length; i++) {
        var time = records[i].time;
        if(time < best) {
            best = time;
        }
    }

    return best;
};

WodTracker.prototype.isPersonalBest = function (record) {

    //Safe guard against time being null and comparing with null
    if(record.time == null)
        return false;

    var best = this.getPersonalBest(record.wodName);
    return best == record.time;
};

WodTracker.prototype.addWodRecord = function (wodName, dateCompleted, time) {
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
        return a.time - b.time;
    });

    this.storeToStorage(recordList);
};

