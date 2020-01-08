define(['durandal/app'], function (app) {
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var baseUri = 'http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/';
        self.displayName = 'Pokemón Specie Details';
        self.error = ko.observable('');
        self.record = ko.observable();
        self.specie = ko.observable();
        self.desc = ko.observable(null);
        self.sprites = ko.observableArray([]);
        self.movesList = ko.observableArray([]);
        self.evolutions = ko.observableArray([]);
        self.temp_evolutions = [];
        self.currentMove = 0;
        self.movesPerPage = 3;
        self.putImages = function() {
            $(".image").each(
                function(im){
                    if ($(this).attr("backgroundimage") != "url(null)") {
                        $(this).css({"background-image":$(this).attr("backgroundimage")})
                    }
                });
        }
        self.showEvos = ko.observable(false);
        self.showEvosfn = function () {
            if (self.evolutions().length <= 1) {
                self.showEvos(false);
                return;
            }
            self.showEvos(true);
        }
        self.showSpecie = ko.observable(false);
        self.showSpeciefn = function () {
            if (self.specie().pokemon.length <= 1) {
                self.showSpecie(false);
                return;
            }
            self.showSpecie(true);
        }
        self.genMoveList = function() {
            self.movesList.removeAll();
            var lastMove = self.currentMove;
            for (;self.currentMove<lastMove+self.movesPerPage;self.currentMove++) {
                if (self.currentMove < self.record().Moves.length) {
                    self.movesList.push(self.record().Moves[self.currentMove]);
                }
            }
            self.controlBtns();
        }
        self.controlBtns = function () {
            $("#moves .controlBtn").attr("disabled", false);
            
            if (self.currentMove <= self.movesPerPage) {
                $($("#moves .controlBtn")[0]).attr("disabled", true);
                }
            
            if (self.currentMove+1 >= self.record().Moves.length) {
                $($("#moves .controlBtn")[1]).attr("disabled", true);
                }
        }
        self.nextMoves = function() {
            if (self.currentMove <= self.record().Moves.length) {
                self.genMoveList();
            }
        }
        self.prevMoves = function() {
            if (self.currentMove-self.movesPerPage > 0) {
                self.currentMove-=self.movesPerPage*2;
                self.genMoveList();
            }
        }
        self.descGen = function () {
            if(self.specie().Description.length != 0) {
                self.desc(self.specie().Description[Math.random()*(self.specie().Description.length-1)]);
            }
            else {
                if(self.specie().flavorText.length != 0) {
                    self.desc(self.specie().flavorText[Math.floor(Math.random()*(self.specie().flavorText.length-1))]);
                }
            }
        }
        self.gauge = function(val) {
            var opts = {
                angle: 0.35, // The span of the gauge arc
                lineWidth: 0.1, // The line thickness
                radiusScale: 1, // Relative radius
                pointer: {
                    length: 0.6, // // Relative to gauge radius
                    strokeWidth: 0.035, // The thickness
                    color: '#000000' // Fill color
                },
                limitMax: false,     // If false, max value increases automatically if value > maxValue
                limitMin: false,     // If true, the min value of the gauge will be fixed
                colorStart: '#6F6EA0',   // Colors
                colorStop: '#C0C0DB',    // just experiment with them
                strokeColor: '#EEEEEE',  // to see which ones work best for you
                generateGradient: true,
                staticLabels: {
                    font: "10px sans-serif",  // Specifies font
                    labels: [90, 130, 150, 220.1, 260, 300],  // Print labels at these values
                    color: "#000000",  // Optional: Label text color
                    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
                },
            };
            var target = document.getElementById('gauge'); // your canvas element
            var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
            gauge.maxValue = 200; // set max gauge value
            gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
            gauge.animationSpeed = 32; // set animation speed (32 is default value)
            gauge.set(val); // set actual value
            gauge.setTextField(document.getElementById("gauge-value"));
        }
        self.activate = function (id) {
            // Activation code here
            console.log('CALL: getSpecieDetails...');
            var composedUri = baseUri + id;
            console.log("composedUri = " + composedUri);
            
            ajaxHelper(composedUri, 'GET').done(function (data) {
                self.record(data);
                
                composedUri = "http://ieeta-cloudpt.web.ua.pt/pokemons/api/PokemonSpecies/"+data.Specie.Id+"?type=json";
                ajaxHelper(composedUri, 'GET').done(function (data) {
                    self.specie(data);
                    self.showSpeciefn();
                    self.descGen();
                    self.gauge(data.CaptureRate);
                    
                    
                    ajaxHelper("http://ieeta-cloudpt.web.ua.pt/pokemons/api/PokemonSpecies/FullEvolutionChain/"+data.Id+"?type=json", 'GET').done(function (data) {
                        data.EvolvesFrom.reverse();
                        data.EvolvesTo.shift();
                        
                        for (var pok in data.EvolvesFrom) {
                            self.temp_evolutions.push(data.EvolvesFrom[pok]);
                        }
                        for (var pok in data.EvolvesTo) {
                            self.temp_evolutions.push(data.EvolvesTo[pok]);
                        }
                        
                        for (var pok in self.temp_evolutions) {
                            $.ajax({
                                async: false,
                                type: 'GET',
                                url: self.temp_evolutions[pok].Url,
                                dataType: 'json',
                                contentType: 'application/json',
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log("AJAX Call[" + uri + "] Fail...");
                                    self.error(errorThrown);
                                },
                                success: function (data) {
                                    self.temp_evolutions[pok].Image = data.pokemon[0].frontDefault;
                                    console.log(self.temp_evolutions);
                                }
                            });
                        }
                        
                        self.evolutions(self.temp_evolutions);
                        self.showEvosfn();
                        self.putImages();
                    });
                });
                
                self.putImages(); 
                self.genMoveList();
                
                $.each(data.Sprites, function(key, value) {
                    self.sprites.push({Name:key, Link:value});
                })
            });
        };
        //--- Internal functions
        function ajaxHelper(uri, method, data) {
            self.error(''); // Clear error message
            return $.ajax({
                type: method,
                url: uri,
                dataType: 'json',
                contentType: 'application/json',
                data: data ? JSON.stringify(data) : null,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("AJAX Call[" + uri + "] Fail...");
                    self.error(errorThrown);
                }
            });
        }
    };

    return vm;
});