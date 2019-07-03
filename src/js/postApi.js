const axios = require("axios");

export default function postApi(startPoint, endPoint) {
    axios.post('http://127.0.0.1:5000/point', {
        startPoint : {
            "lat" : startPoint.lat,
            "long" : startPoint.long
        },
        endPoint: {
            "lat"  : endPoint.lat,
            "long" : endPoint.long
        }
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
}