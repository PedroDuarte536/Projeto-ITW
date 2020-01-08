define(['durandal/app'], function (app) {
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var baseUri = 'http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/Type?name=';
        self.description = '';
        self.error = ko.observable('');
        self.passingMessage = ko.observable('');
        self.records = ko.observableArray([]);
        self.all_records = [];
        self.types = ko.observableArray([]);
        self.curType = ko.observable({Name:'',Color:''});
        self.type = ko.observable({Name:""});
        self.auto = ko.observableArray([]);
        
        self.autofn = function() {
            self.auto.removeAll();
            var data = document.getElementById("searchInput").value;
            if (data.length > 2) {
                var composedUri = 'http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/SearchByName?name=' + data + "&type=json";
                ajaxHelper(composedUri, 'GET').done(function (data) {
                    self.auto(data);
                });
            }
        }
        self.hideautoAction = function() {
            self.auto.removeAll();
        }
        self.hideauto = function() {
            setTimeout(self.hideautoAction, 500);
        }
        self.autoselect = function(data, event) {
            document.getElementById("searchInput").value = event.target.innerHTML;
            self.search();
        }
        
        self.curPage = 1;
        self.perPage = 20;
        self.totalPages = 0;
        self.loadPage = function () {
            self.records.removeAll();
            for (var i=(self.curPage-1)*self.perPage;i<self.curPage*self.perPage;i++) {
                if (i < self.all_records.length) {
                    self.records.push(self.all_records[i]);
                    self.putImages();
                }
            }
        }
        self.toPage = function(dif) {
            if (self.curPage+dif>0 && self.curPage+dif<=self.totalPages) {
                self.curPage += dif;
                self.loadPage();
            }
        }
        
        self.putImages = function() {
            $(".image").each(
                function(im){
                    if ($(this).attr("backgroundimage") != "url(null)") {
                        $(this).css({"background-image":$(this).attr("backgroundimage")})
                    }
                });
        }
        self.addFav = function(data, event) {
            if (!amplify.store("favs")) {
                amplify.store("favs", []);
            }
            var curFavs = amplify.store("favs");
            if (curFavs.includes(data.Id)) {
                curFavs.splice(curFavs.indexOf(data.Id), 1);
            }
            else {
                curFavs.push(data.Id);
            }
            $(event.target).toggleClass("red");
            amplify.store("favs", curFavs);
        }
        self.isFav = function(data) {
            if (amplify.store("favs")) {
                if (amplify.store("favs").includes(data.Id)) {
                    return 'red';
                }
            }
            return '';
        }
        //--- Page Events
        self.activate = function (searchTerm) {
            // Activation code here
            console.log('CALL: getSpecies...');
            var composedUri = baseUri + searchTerm + "&type=json";
            ajaxHelper(composedUri, 'GET').done(function (data) {
                self.curType({Name:data.Name,Color:data.Color});
                self.all_records = data.Pokemon;
                self.totalPages = Math.ceil(self.all_records.length/self.perPage);
                self.loadPage();
            });
            ajaxHelper('http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/Types', 'GET').done(function (data) {
                self.types(data);
            });
        };
        self.search = function() {
            window.location.hash = '#byName/'+document.getElementById("searchInput").value;
        }
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