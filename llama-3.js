const axios = require("axios"); // If using ES Modules, consider using import axios from 'axios';

module.exports = function (RED) {
    function llama3Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.prompt = config.prompt;
        this.server = config.server;
        this.endpoint = config.endpoint;
        this.role = config.role;

        node.on("input", function (msg) {
            // Use async directly in the event handler

            const API_URL = this.server.concat(this.endpoint); // Centralized API URL
            const HEADERS = {
                // Centralized headers
                accept: "application/json",
                "Content-Type": "application/json",
            };
            const data = {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: this.role },
                    { role: "user", content: msg[this.prompt] },
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
