define(['durandal/app'], function (app) {
    var vm = function () {
        self.won_games = amplify.store("won_battles");
        self.lost_games = amplify.store("lost_battles");
        self.fav = ko.observable();
        self.best = ko.observable();
        if (self.won_games == undefined || self.lost_games == undefined) {
            window.location.hash = "#battle";
        }
        
        self.drawChart = function () {
            var data = google.visualization.arrayToDataTable([
                ['Jogos', 'Numero'],
                ['Vitórias', self.won_games.length],
                ['Derrotas', self.lost_games.length],
            ]);

            var options = {
                title: 'Total de jogos: '+(self.won_games.length+self.lost_games.length)
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));

            chart.draw(data, options);
        }
        self.putImages = function() {
            $(".image").each(
                function(im){
                    if ($(this).attr("backgroundimage") != "url(null)") {
                        $(this).css({"background-image":$(this).attr("backgroundimage")})
                    }
                });
        }
        self.addFav = function(data, event) {alert(1);
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
        self.isFav = function(data) {alert(1);
            if (amplify.store("favs")) {
                if (amplify.store("favs").includes(data.Id)) {
                    return 'red';
                }
            }
            return '';
        }
        self.init = function () {
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(self.drawChart);
            
            var f = [];
            var b = [];
            var temp = {};
            var temp2 = {};
            var add = true;
            if (self.won_games.length > 0) {
                for (var game in self.won_games) {
                    add = true;
                    temp = {Id:self.won_games[game][0].Id, Name:self.won_games[game][0].Name, frontDefault:self.won_games[game][0].frontDefault, Num:1}
                    for (var rec in f) {
                        if (temp.Id == f[rec].Id) {
                            f[rec].Num++;
                            add = false;
                            break;
                        }
                    }
                    if (add) {
                        f.push(temp);
                    }
                }
            }
            for (var a in f) {
                temp = {Id:f[a].Id, Name:f[a].Name, frontDefault:f[a].frontDefault, Num:f[a].Num}
                b.push(temp);
            }
            if (self.lost_games.length > 0) {
                for (var game in self.lost_games) {
                    add = true;
                    temp = {Id:self.lost_games[game][0].Id, Name:self.lost_games[game][0].Name, frontDefault:self.lost_games[game][0].frontDefault, Num:1}
                    temp2 = {Id:self.lost_games[game][1].Id, Name:self.lost_games[game][1].Name, frontDefault:self.lost_games[game][1].frontDefault, Num:1}
                    for (var rec in b) {
                        if (temp2.Id == b[rec].Id) {
                            b[rec].Num++;
                            add = false;
                            break;
                        }
                    }
                    if (add) {
                        b.push(temp2);
                    }
                    add = true;
                    for (var rec in f) {
                        if (temp.Id == f[rec].Id) {
                            f[rec].Num++;
                            add = false;
                            break;
                        }
                    }
                    if (add) {
                        f.push(temp);
                    }
                }
            }
            
            var maxNum = 0;
            for (var a in f) {
                if (f[a].Num >= maxNum) {
                    self.fav(f[a]);
                    maxNum = f[a].Num;
                }
            }
            
            maxNum = 0;
            for (var a in b) {
                if (b[a].Num >= maxNum) {
                    self.best(b[a]);
                    maxNum = b[a].Num;
                }
            }
            self.putImages();
        }
        
    };

    return vm;
});