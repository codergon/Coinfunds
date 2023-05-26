import axios from "axios";

axios.defaults.baseURL = "https://coin-funds.fly.dev/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
