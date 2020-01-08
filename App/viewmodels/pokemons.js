define(['durandal/app'], function (app) {
    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        var baseUri = 'http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/GetPage';
        self.description = '';
        self.error = ko.observable('');
        self.pagesize = 20;
        self.passingMessage = ko.observable('');
        self.records = ko.observableArray([]);
        self.types = ko.observableArray([]);
        //self.totalRecords = ko.observable(-1);
        self.totalRecords = ko.observable(250);
        self.currentPage = ko.observable(1);
        self.previousPage = ko.computed(function () {
            return self.currentPage() * 1 - 1;
        }, self);
        self.nextPage = ko.computed(function () {
            return self.currentPage() * 1 + 1;
        }, self);
        self.fromRecord = ko.computed(function () {
            return self.previousPage() * self.pagesize + 1;
        }, self);
        self.toRecord = ko.computed(function () {
            return Math.min(self.currentPage() * self.pagesize, self.totalRecords());
        }, self);
        self.totalPages = ko.computed(function () {
            return Math.ceil(self.totalRecords() / self.pagesize);
        }, self);
        self.pageArray = function () {
            var list = [];
            var size = Math.min(self.totalPages(), 9);
            var step;
            if (size < 9 || self.currentPage() === 1)
                step = 0;
            else if (self.currentPage() >= self.totalPages() - 4)
                step = self.totalPages() - 9;
            else
                step = Math.max(self.currentPage() - 5, 0);

            for (var i = 1; i <= size; i++)
                list.push(i + step);
            return list;
        };
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
        self.putImages = function() {
            $(".image").each(
                function(im){
                    if ($(this).attr("backgroundimage") != "url(null)") {
                        $(this).css({"background-image":$(this).attr("backgroundimage")})
                    }
                });
        }
        self.search = function() {
            window.location.hash = '#byName/'+document.getElementById("searchInput").value;
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
        self.activate = function (id) {
            // Activation code here
            if (id)
                self.currentPage(id);
            console.log('CALL: getSpecies...');
            var composedUri = baseUri + "?page=" + self.currentPage() + "&pageSize=" + self.pagesize;
            ajaxHelper(composedUri, 'GET').done(function (data) {
                self.records(data.Pokemons);
                self.totalRecords(data.Total);
                self.putImages();
            });
            ajaxHelper('http://ieeta-cloudpt.web.ua.pt/pokemons/api/Pokemons/Types', 'GET').done(function (data) {
                self.types(data);
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