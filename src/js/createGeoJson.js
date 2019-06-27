export default function createGeoJson(coordinates, data) {
    // console.log(coordinates, data);

    let newObject = {
        "type": "FeatureCollection",
        "features": []
    }

    let newFeatures = [];

    if(coordinates && data) {
        for(var location in coordinates) {
            const lat = coordinates[location][0];
            const lng = coordinates[location][1];
            const value = data[location];

            if (lat !== undefined || lng !== undefined) {
            // filter out the id...

                const obj = {
                    "type": "Feature",
                    "properties": {
                        "data": value
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            lng,
                            lat
                        ]
                    }
                }
            newObject.features.push(obj)
            }
        }
    } else {
        console.log('please provide coordinates and data!')
    }

    return newObject;
}