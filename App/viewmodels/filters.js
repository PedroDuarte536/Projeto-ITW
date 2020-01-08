define(['durandal/app'], function (app) {
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var baseUri = 'http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/SearchByName?name=';
        self.description = '';
        self.error = ko.observable('');
        self.passingMessage = ko.observable('');
        self.records = ko.observableArray([]);
        self.all_records = [];
        self.types = ko.observableArray([]);
        self.term = ko.observable();
        self.selectedTypes = [];
        self.auto = ko.observableArray([]);
        
        self.autofn = function() {
            self.auto.removeAll();
            var data = document.getElementById("searchInput").value;
            if (data.length > 2) {
                var composedUri = baseUri + data + "&type=json";
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
        
        self.typeClicked = function (data, event) {
            var type = data.Name;
            if (self.selectedTypes.includes(type)) {
                self.selectedTypes.splice(self.selectedTypes.indexOf(type), 1);
            }
            else {
                self.selectedTypes.push(type);
            }
            $(event.target).toggleClass("selected");
        }
        self.putImages = function() {
            $(".image").each(
                function(im){
                    if ($(this).attr("backgroundimage") != "url(null)") {
                        $(this).css({"background-image":$(this).attr("backgroundimage")})
                    }
                });
        }
        //--- Page Events
        self.activate = function (searchTerm) {
            // Activation code here
            console.log('CALL: getSpecies...');
            self.term(searchTerm);
            var composedUri = baseUri + searchTerm + "&type=json";
            ajaxHelper(composedUri, 'GET').done(function (data) {
                self.all_records = data;
                self.totalPages = Math.ceil(self.all_records.length/self.perPage);
                self.loadPage();
            });
            ajaxHelper('http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/Types', 'GET').done(function (data) {
                self.types(data);
            });
        };
        self.search = function() {
            var term = document.getElementById("searchInput").value;
            var rar = $("input[name='rar']:checked").val();
            var temp_data = [];
            var favs = $("#favs:checked").length>0;
            if (rar) {
                var url = "http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/"+rar+"?type=json";
                ajaxHelper(url, 'GET').done(function (data) {  
                    if (rar == "Legendary") {
                        for (var i=0;i<data.length;i++) {
                            temp_data.push.apply(temp_data, data[i].Pokemons);
                        }
                        data = temp_data;
                        temp_data = [];
                    }
                    
                    if (term!="" && self.selectedTypes.length == 0) {
                        for (var i=0;i<data.length;i++) {
                            if (data[i].Name.includes(term)) {
                                temp_data.push((data[i]));
                            }
                        }
                    }
                    else if (self.selectedTypes.length > 0 && term=="") {
                        for (var i=0;i<data.length;i++) {
                            for (var type in data[i].Types) {
                                if (self.selectedTypes.includes(data[i].Types[type].Name)) {
                                    temp_data.push(data[i]);
                                }
                            }
                        }
                    }
                    else if (term!="" && self.selectedTypes.length > 0) {
                        for (var i=0;i<data.length;i++) {
                            if (data[i].Name.includes(term)) {
                                for (var type in data[i].Types) {
                                    if (self.selectedTypes.includes(data[i].Types[type].Name) && data[i].Name.includes(term) && !temp_data.includes(data[i])) {
                                        temp_data.push(data[i]);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        temp_data = data;
                    }
                    if (favs) {
                        var t_temp_data = [];
                        for (var i=0;i<temp_data.length;i++) {
                            if (amplify.store("favs").includes(temp_data[i].Id)) {
                                t_temp_data.push(temp_data[i]);
                            }
                        }
                        temp_data = t_temp_data;
                    }
                    self.curPage = 1;
                    self.all_records = temp_data;
                    self.totalPages = Math.ceil(self.all_records.length/self.perPage);
                    self.loadPage();
                });
            }
            else if (term!="") {
                var url = "http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/SearchByName?name="+term+"&type=json";
                ajaxHelper(url, 'GET').done(function (data) {
                    if (self.selectedTypes.length > 0) {
                        for (var i=0;i<data.length;i++) {
                            for (var type in data[i].Types) {
                                if (self.selectedTypes.includes(data[i].Types[type].Name)) {
                                    temp_data.push(data[i]);
                                }
                            }
                        }
                    }
                    else {
                        temp_data = data;
                    }
                    if (favs) {
                        var t_temp_data = [];
                        for (var i=0;i<temp_data.length;i++) {
                            if (amplify.store("favs").includes(temp_data[i].Id)) {
                                t_temp_data.push(temp_data[i]);
                            }
                        }
                        temp_data = t_temp_data;
                    }
                    self.curPage = 1;
                    self.all_records = temp_data;
                    self.totalPages = Math.ceil(self.all_records.length/self.perPage);
                    self.loadPage();
                });
            }
            else if (self.selectedTypes.length > 0) {
                for (var i=0;i<self.selectedTypes.length;i++) {
                    var url = "http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/Type?name="+self.selectedTypes[i]+"&type=json";
                    ajaxHelper(url, 'GET').done(function (data) {
                        temp_data.push.apply(temp_data, data.Pokemon);
                        if (favs) {
                            var t_temp_data = [];
                            for (var i=0;i<temp_data.length;i++) {
                                if (amplify.store("favs").includes(temp_data[i].Id)) {
                                    t_temp_data.push(temp_data[i]);
                                }
                            }
                            temp_data = t_temp_data;
                        }
                        
                        self.curPage = 1;
                        self.all_records = temp_data;
                        self.totalPages = Math.ceil(self.all_records.length/self.perPage);
                        self.loadPage();
                    });
                }
            }
            else if (favs) {
                if (amplify.store("favs")) {
                    ajaxHelper("http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/GetPage?page=1&pageSize=1&type=json", 'GET').done(function (data) {
                        ajaxHelper("http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/GetPage?page=1&pageSize="+data.Total+"&type=json", 'GET').done(function (data) {
                            for (var i=0;i<data.Pokemons.length;i++) {
                                if (amplify.store("favs").includes(data.Pokemons[i].Id)) {
                                    temp_data.push(data.Pokemons[i]);
                                }
                            }
                            self.curPage = 1;
                            self.all_records = temp_data;
                            self.totalPages = Math.ceil(self.all_records.length/self.perPage);
                            self.loadPage();
                        });
                    });
                }
            }
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