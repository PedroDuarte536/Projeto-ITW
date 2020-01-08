define(['durandal/app'], function (app) {
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var baseUri = 'http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/Legendary?type=json';
        self.description = '';
        self.error = ko.observable('');
        self.records = ko.observableArray([]);
        self.moves = ko.observableArray([]);
        self.curMoves = 0;
        self.pokemons = [];
        self.turn = 0;
        self.gamePokemons = ko.observableArray([]);
        self.title = ko.observable("Escolhe o Teu Pokemon");
        self.gameInfo = ko.observable("");
        self.putImages = function() {
            $(".image").each(
                function(im){
                    if ($(this).attr("backgroundimage") != "url(null)") {
                        $(this).css({"background-image":$(this).attr("backgroundimage")})
                    }
                });
        }
        self.choosePk = function (data, event) {
            $(event.target).closest(".pk").css("border-color", "red");
            self.pokemons.push(data);
            self.records.remove(data);
            
            if (self.pokemons.length == 1) {
                self.title("Escolhe Pokemon Inimigo");
            }
            else {
                self.loadMoves();
                self.title("Escolhe os Teus Moves (Max 4)");
                $("#choosePk").hide();
                $("#chooseMoves").show();
                self.showMoves();
            }
        }
        self.loadMoves = function () {
            for (var i=0;i<self.pokemons.length;i++) {
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: self.pokemons[i].Url,
                    dataType: 'json',
                    contentType: 'application/json',
                    error: function (jqXHR, textStatus, errorThrown) {
                        self.error(errorThrown);
                    },
                    success: function (data) {
                        self.pokemons[i].HP = data.Pokemon_Stats[0].BaseValue*3;
                        self.pokemons[i].curHP = ko.observable(data.Pokemon_Stats[0].BaseValue*3);
                        self.pokemons[i].Moves = data.Moves;
                    }
                });
            }
        }
        self.showMoves = function () {
            console.log(self.pokemons);
            self.moves(self.pokemons[self.curMoves].Moves);
            self.pokemons[self.curMoves].Moves = [];
        }
        self.moveClick = function (data, event) {
            self.pokemons[self.curMoves].Moves.push(data);
            self.moves.remove(data);
            if(self.pokemons[self.curMoves].Moves.length==4) {
               self.finishMoves();
            }
        }
        self.finishMoves = function() {
            if (self.pokemons[self.curMoves].Moves.length == 0) {
                self.gameInfo(self.title());
                $("#exampleModal").modal();
            }
            else if (self.curMoves == 1) {
                $("#chooseMoves").hide();
                self.gamePokemons(self.pokemons);
                self.putImages();
                $("#game").show();
                self.title("Battle");
                self.startBattle();
            }
            else {
                self.title("Escolhe os Moves Inimigos (Max 4)");
                self.curMoves++;
                self.showMoves();
            }
        }
        self.startBattle = function () {
            self.changeTurn();
        }
        self.changeTurn = function() {
            $(".gamePoke a").hide();
            $("#"+self.pokemons[self.turn%2].Id+" a").show();
            self.turn++;
        }
        self.useMove = function (data) {
            if (data.accuracy/100 >= Math.random()) {
                self.gamePokemons()[self.turn%2].curHP(self.gamePokemons()[self.turn%2].curHP()-data.power);
                if (self.gamePokemons()[self.turn%2].curHP()<=0) {
                    self.gamePokemons()[self.turn%2].curHP(0);
                    
                    if (amplify.store("won_battles") == undefined) {
                        amplify.store("won_battles", []);
                    }
                    if (amplify.store("lost_battles") == undefined) {
                        amplify.store("lost_battles", []);
                    }
                    
                    if (self.turn%2) {
                        self.gameInfo("You Win");
                        total = amplify.store("won_battles");
                        total.push(self.pokemons);
                        amplify.store("won_battles", total);
                    }
                    else {
                        self.gameInfo("You Lose");
                        total = amplify.store("lost_battles");
                        total.push(self.pokemons);
                        amplify.store("lost_battles", total);
                    }
                    $("#exampleModal").modal();
                    $("#exampleModal").on('hidden.bs.modal', function(){
                        window.location.hash = "#stats";
                    });
                }
                $("#"+self.pokemons[self.turn%2].Id+" .progress-bar").css("width", self.gamePokemons()[self.turn%2].curHP()*100/self.gamePokemons()[self.turn%2].HP+"%");
            }
            else {
                self.gameInfo("Attack Failed");
                $("#exampleModal").modal();
            }
            self.changeTurn();
        }
        self.useRandom = function (all_data) {
            self.useMove(all_data.Moves[Math.round(Math.random()*3)]);
        }
        //--- Page Events
        self.activate = function () {
            // Activation code here
            ajaxHelper(baseUri, 'GET').done(function (data) {
                var temp_data = [];
                for (var i=0;i<data.length;i++) {
                    temp_data.push.apply(temp_data, data[i].Pokemons);
                }
                self.records(temp_data);
                self.putImages();
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