
castRay = function (origin) {
    var nextStep, stepX, stepY;
    stepX = this.step(origin.sin, origin.cos, origin.x, origin.y);
    stepY = this.step(origin.cos, origin.sin, origin.y, origin.x, true);
    if (stepX.length2 < stepY.length2) {
        nextStep = this.inspect(stepX, 1, 0, origin, stepX.y);
    } else {
        nextStep = this.inspect(stepY, 0, 1, origin, stepY.x);
    }
    return this.castRay(nextStep);

};

RayCastCaller = function (startingX, startingY, angle) {
    origin = {
        x: startingX,
        y: startingY,
        distance: 0,
        sin: Math.sin(angle),
        cos: Math.cos(angle)
    };
    ray = this.castRay(origin);
}

step = function (rise, run, x, y, inverted) {
    var dx, dy;
    if (run === 0) {
        return {
            length2: 0
        };
    }
    dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
    dy = dx * (rise / run);
    return {
        x: inverted ? y + dy : x + dx,
        y: inverted ? x + dx : y + dy,
        length2: dx * dx + dy * dy
    };
};

inspect = function (step, shiftX, shiftY, origin, offset) {
    var dx, dy;
    dx = origin.cos < 0 ? shiftX : 0;
    dy = origin.sin < 0 ? shiftY : 0;


    step.distance = origin.distance + Math.sqrt(step.length2);
    if (shiftX) {
        step.shading = origin.cos < 0 ? 2 : 0;
    } else {
        step.shading = origin.sin < 0 ? 2 : 1;
    }
    step.offset = offset - Math.floor(offset);
    step.cos = origin.cos;
    step.sin = origin.sin;
    return step;
};


