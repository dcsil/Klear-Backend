const express = require("express");
const app = require("./app");

const port = 3000;

// Application start
app.listen(port, () => {
    console.log(`Klear-backend listening on port ${port}`);
});