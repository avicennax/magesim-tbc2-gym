importScripts("./magesim.js");

onmessage = (event) => {
    var data = event.data;

    var parseTalentsLink = (str) => {
        if (str.match(/^[0-9]+$/))
            return str;

        var m = str.match(/tbcdb\.com.*mage\&([0-9]+)/i);
        if (m)
            return m[1];

        return "---";
    };

    if (data.type == "start") {
        const wasm = fetch("./magesim.wasm", {cache: "no-store"})
        .then(r => r.arrayBuffer())
        .then(binary => MageSim({wasmBinary: binary}))
        .then(w => w.ready)
        .then(m => {
            var config = m.allocConfig();
            for (var key in data.config) {
                if (typeof(config[key]) != "undefined")
                    config[key] = data.config[key];
            }
            if (m.Trinket.values.hasOwnProperty(data.config.trinket1))
                config.trinket1 = m.Trinket.values[data.config.trinket1];
            if (m.Trinket.values.hasOwnProperty(data.config.trinket2))
                config.trinket2 = m.Trinket.values[data.config.trinket2];
            if (m.MetaGem.values.hasOwnProperty(data.config.meta_gem))
                config.meta_gem = m.MetaGem.values[data.config.meta_gem];

            var player = m.allocPlayer(config);
            var stats = JSON.parse(JSON.stringify(player.stats));
            for (var key in data.config.stats) {
                if (stats.hasOwnProperty(key))
                    stats[key] = data.config.stats[key];
            }
            if (m.Race.values.hasOwnProperty(data.config.race))
                player.race = m.Race.values[data.config.race];
            if (m.Race.values.hasOwnProperty(data.config.spec))
                player.spec = m.Race.values[data.config.spec];
            player.setStats(stats);

            if (data.config.talents) {
                var talents = parseTalentsLink(data.config.talents);
                player.loadTalentsFromString(talents);
            }

            if (data.iterations && data.iterations > 1)
                var result = m.runSimulations(config, player, data.iterations);
            else
                var result = m.runSimulation(config, player);

            if (result.log)
                result.log = JSON.parse(result.log);

            postMessage({
                type: "success",
                result: result
            });
        })
        .catch(e => console.error(e));
    }
}