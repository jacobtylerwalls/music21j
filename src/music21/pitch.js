/**
 * music21j -- Javascript reimplementation of Core music21 features.  
 * music21/pitch -- pitch routines
 *
 * Copyright (c) 2013-14, Michael Scott Cuthbert and cuthbertLab
 * Based on music21, Copyright (c) 2006–14, Michael Scott Cuthbert and cuthbertLab
 * 
 */

define(function(require) {
	var pitch = {};
	
	/*  pitch based objects; from pitch.py */

	pitch.Accidental = function (accName) {
		this.classes = ['Accidental'];

		this._name = "";
		this._alter = 0.0;
		this._modifier = "";
		this.displayType = "normal"; // "normal", "always" supported currently
		this.displayStatus = undefined; // true, false, undefined
		this.isClassOrSubclass = function (testClass) {
		    if (testClass instanceof Array == false) {
		        testClass = [testClass];
		    }
		    for (var i = 0; i < testClass.length; i++) {
		        if ($.inArray(testClass[i], this.classes) != -1) {
		            return true;
		        }   
		    }
		    return false;
		};
		
        Object.defineProperties(this, {
            'name' : {
              enumerable: true,
              configurable: true,
              get: function () { return this._name; },
              set: function (n) { this.set(n); },
            },
            'alter' : {
                enumerable: true,
                configurable: true,
                get: function () { return this._alter; },
                set: function (n) { this.set(n); },
            },
            'modifier' : {
                  enumerable: true,
                  configurable: true,
                  get: function () { return this._modifier; },
                  set: function (n) { this.set(n); },
            },
            'vexflowModifier' : {
                  enumerable: true,
                  configurable: true,
                  get: function () { 
                      m = this.modifier;
                      if (m == "") { return "n"; }
                      else if (m == "#") { return "#"; }
                      else if (m == '-') { return "b"; }
                      else if (m == "##") { return "##"; }
                      else if (m == '--') { return "bb"; }
                      else if (m == "###") { return "###"; }
                      else if (m == '---') { return "bbb"; }
                      else { throw ("Vexflow does not support: " + m); }
                  },
            }
              
        });		
		
		
		this.set = function (accName) {
			if ((accName != undefined) && (accName.toLowerCase != undefined)) {
		    	accName = accName.toLowerCase();
		    }
		    if (accName == 'natural' || accName == 'n' || accName == 0 || accName == undefined) {
		        this._name = 'natural';
		        this._alter = 0.0;
		        this._modifier = "";
		    } else if (accName == 'sharp' || accName == '#' || accName == 1) {
		        this._name = 'sharp';
		        this._alter = 1.0;
		        this._modifier = "#";
		    } else if (accName == 'flat' || accName == '-' || accName == -1) {
		        this._name = 'flat';
		        this._alter = -1.0;
		        this._modifier = "-";
		    } else if (accName == 'double-flat' || accName == '--' || accName == -2) {
		        this._name = 'double-flat';
		        this._alter = -2.0;
		        this._modifier = "--";
		    } else if (accName == 'double-sharp' || accName == '##' || accName == 2) {
		        this._name = 'double-sharp';
		        this._alter = 2.0;
		        this._modifier = "##";
		    } else if (accName == 'triple-flat' || accName == '---' || accName == -3) {
		        this._name = 'triple-flat';
		        this._alter = -3.0;
		        this._modifier = "---";
		    } else if (accName == 'triple-sharp' || accName == '###' || accName == 3) {
		        this._name = 'triple-sharp';
		        this._alter = 3.0;
		        this._modifier = "###";
		    }
		};
		this.set(accName);
	};
	
	
	
	
	pitch.Pitch = function (pn) {
	    if (pn == undefined) {
	    	pn = "C";
	    }
	    this._step = 'C';
	    this._octave = 4;
	    this._accidental = undefined;
		this.classes = ['Pitch'];
		this.isClassOrSubclass = function (testClass) {
		    if (testClass instanceof Array == false) {
		        testClass = [testClass];
		    }
		    for (var i = 0; i < testClass.length; i++) {
		        if ($.inArray(testClass[i], this.classes) != -1) {
		            return true;
		        }   
		    }
		    return false;
		};
	    
	    Object.defineProperties(this, {
	    	'step' : {
	    	  enumerable: true,
	    	  configurable: true,
	    	  get: function () { return this._step; },
	    	  set: function (s) { this._step = s; }
	    	},
            'octave' : {
                enumerable: true,
                configurable: true,
                get: function () { return this._octave; },
                set: function (o) { this._octave = o; }
              },
            'accidental' : {
                  enumerable: true,
                  configurable: true,
                  get: function () { return this._accidental; },
                  set: function (a) { 
                      if (typeof(a) != 'object') {
                          a = new music21.pitch.Accidental(a);
                      }
                      this._accidental = a; 
                  }
                },	        
	        'name': {
	    	    enumerable: true,
	    	    configurable: true,
	    		get: function () {
					if (this.accidental == undefined) {
						return this.step;
					} else {
						return this.step + this.accidental.modifier;
					}
				},
	    		set: function(nn) {
					this.step = nn.slice(0,1).toUpperCase();
					var tempAccidental = nn.slice(1);
					if (tempAccidental != undefined) {
						this.accidental = tempAccidental; // converts automatically
					} else {
						this.accidental = undefined;
					}
				}
			},
			'nameWithOctave': {
                enumerable: true,
                configurable: true,
				get: function () {
					return this.name + this.octave.toString();
				},
				set: function (pn) {
			        var storedOctave = pn.match(/\d+/);
			        if (storedOctave != undefined) {
			            pn = pn.replace(/\d+/, "");
			            this.octave = parseInt(storedOctave);
			            this.name = pn;
			        } else {
			            this.name = pn;
			        }
				},
			},
	    	'diatonicNoteNum': { 
                enumerable: true,
                configurable: true,
	    		get: function () { 
			    	var nameToSteps = {'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6};
	       			return (this.octave * 7) + nameToSteps[this.step] + 1;
	   			},
	    		set: function (newDNN) {
	   				var stepsToName = ['C','D','E','F','G','A','B'];
	   				newDNN = newDNN - 1; // makes math easier
	   				this.octave = Math.floor(newDNN / 7);
	   				this.step = stepsToName[newDNN % 7];
	   			}
	   		},    		
	    	'midi': { 
                enumerable: true,
                configurable: true,
	    		get: function () { 
	    			return this.ps;
	    		}
	    	},
	    	'ps': {
                enumerable: true,
                configurable: true,
	    		get: function () {
					var nameToMidi = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
					var accidentalAlter = 0;
					if (this.accidental != undefined) {
						accidentalAlter = parseInt(this.accidental.alter);
					}
					return (this.octave + 1) * 12 + nameToMidi[this.step] + accidentalAlter;
				},
	    		set: function (ps) {
	    			var midiToName = ['C','C#','D','E-','E','F','F#','G','A-','A','B-','B'];
	    			this.name = midiToName[ps % 12];
	    			this.octave = Math.floor(ps / 12) - 1;
	    		}
	    	}
	    });

	    /* pn can be a nameWithOctave */
	    if (pn.match(/\d+/)) {
	        this.nameWithOctave = pn;
	    } else {
	        this.name = pn;	        
	    }
	    	
	    this.vexflowName = function (clefName) {
	    	//alert(this.octave + " " + clefName);
		    var bassToTrebleMapping = {'E': 'C', 'F': 'D', 'G': 'E', 'A': 'F', 'B': 'G', 'C': 'A', 'D': 'B'};
	    	var accidentalType = 'n';
	    	if (this.accidental != undefined) {
	          	accidentalType = this.accidental.vexflowModifier;
	    	}
	    	
	    	
	    	if (clefName == 'treble' || clefName == undefined) {
	            var outName = this.step + accidentalType + '/' + this.octave; 
	            return outName;
	        } else if (clefName == 'bass') {
	        	var tempPn = bassToTrebleMapping[this.step];
	            var tempPitch = new music21.pitch.Pitch(tempPn);
	            tempPitch.octave = this.octave;
	            if (this.step == 'C' || this.step == 'D') {
	                tempPitch.octave += 1;
	            } else {
	                tempPitch.octave += 2;
	            }
	            return tempPitch.step + accidentalType + '/' + tempPitch.octave;
	        }
	    };
	};
	pitch.tests = function () {
	    test( "music21.pitch.Accidental", function () {
	        var a = new music21.pitch.Accidental("-");
	        equal(a.alter, -1.0, "flat alter passed");
	        equal(a.name, 'flat', "flat name passed");
	    });

	    test( "music21.pitch.Pitch", function() {
	        var p = new music21.pitch.Pitch("D#5");
	        equal ( p.name, "D#", "Pitch Name set to D#");
	        equal ( p.step, "D",  "Pitch Step set to D");
	        equal ( p.octave, 5, "Pitch octave set to 5");
	    });
  
	};
	// end of define
	if (typeof(music21) != "undefined") {
		music21.pitch = pitch;
	}
	return pitch;	
});



