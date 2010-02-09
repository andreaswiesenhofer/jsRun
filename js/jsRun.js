/*
** jsRun - A Class for parsing and analyzing Nike+ Data
**
** @author Andreas Wiesenhofer <awiesi@gmail.com>
**
*/

var jsRun = {
	helper: {
		secondsToTime: function (secs) {
			var hours = Math.floor(secs / (60 * 60));

		    var divisor_for_minutes = secs % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);
			if (Math.abs(parseInt(minutes)) < 10)
				{ minutes = "0"+ Math.abs(minutes);	}

		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
			if (Math.abs(parseInt(seconds)) < 10)
				{ seconds = "0"+ Math.abs(seconds);	}

			return hours+':'+minutes+':'+seconds;
		}
	},
	/* use like this: var mylatestrun = new jsRun.Run(xmlinput); */
	Run: function (xmlinput) {
		
		/** create public variables **/
		this.workoutName = null;
		this.time = null; //date&time of the run 
		this.duration = null; //in milliseconds
		this.prettyduration = null;
		this.distance = null; //km
		this.pace = null; //average pace in min/km
		this.speed = null; //average speed in km/h
		this.calories = null;
		this.extendedData = []; //all datapoints in 10sec steps, current km count
		this.extendedPace = []; //computed pace from datapoints, also in 10sec steps -> m/10sec
		
		/** parse xml and fill class attributes **/
		var jsonXML = $.xmlToJSON($.textToXML(xmlinput));
		
		this.workoutName = jsonXML.runSummary[0].workoutName[0].Text;
		
		this.time = jsonXML.runSummary[0].time[0].Text;
		
		this.duration = parseInt(jsonXML.runSummary[0].duration[0].Text);
		this.prettyduration = jsRun.helper.secondsToTime(this.duration/1000);
		
		this.distance = parseFloat(jsonXML.runSummary[0].distance[0].Text);
		
		this.pace = jsonXML.runSummary[0].pace[0].Text;
		this.speed = (this.distance/(this.duration/(1000*60*60))).toFixed(2);
		
		this.calories = parseInt(jsonXML.runSummary[0].calories[0].Text);
		
		this.extendedData = jsonXML.extendedDataList[0].extendedData[0].Text.split(", ");
		
		for (var i = 0; i < this.extendedData.length; i++) {                  
           this.extendedPace.push(
                 (this.extendedData[i+1]-this.extendedData[i])*1000
           );
        }
	}
} /* End jsRun */