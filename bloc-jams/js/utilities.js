function forEach(points, call) {
    for (var i = 0; i < points.length; i++){
        call(points[i]);
    }
}