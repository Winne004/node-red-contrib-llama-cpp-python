const axios = require("axios");

module.exports = function (RED) {
    function llama3Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const API_URL = config.server.concat(config.endpoint);
        const HEADERS = {
            // Centralized headers
            accept: "application/json",
            "Content-Type": "application/json",
        };
        node.on("input", function (msg) {
            const data = {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: config.role },
                    { role: "user", content: msg[config.prompt] },
                ],
            };
            axios
                .post(API_URL, data, { headers: HEADERS })
                .then(function (response) {
                    msg.payload = response.data;
                    node.send(msg);
                })
                .catch(function (error) {
                    if (error.response) {
                        msg.payload = error.response.data;
                        node.send(msg);
                    } else {
                        msg.payload = error;
                        node.send(msg);
                    }
                });
        });
    }

    RED.nodes.registerType("llama-3", llama3Node);
};
