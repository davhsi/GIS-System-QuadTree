class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.w &&
            point.y >= this.y &&
            point.y <= this.y + this.h
        );
    }

    intersects(range) {
        return !(
            range.x + range.w < this.x ||
            range.x > this.x + this.w ||
            range.y + range.h < this.y ||
            range.y > this.y + this.h
        );
    }
}

class QuadTree {
    constructor(boundary, capacity = 4) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        let ne = new Rectangle(x + w, y, w, h);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x, y, w, h);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w, y + h, w, h);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x, y + h, w, h);
        this.southwest = new QuadTree(sw, this.capacity);

        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        }

        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    queryByName(name) {
        let found = this.query(this.boundary);
        return found.find(p => p.name === name);
    }

    remove(point) {
        const index = this.points.findIndex(p => p.x === point.x && p.y === point.y && p.name === point.name);
        if (index !== -1) {
            this.points.splice(index, 1);
            return true;
        }

        if (this.divided) {
            if (this.northeast.remove(point)) {
                return true;
            } else if (this.northwest.remove(point)) {
                return true;
            } else if (this.southeast.remove(point)) {
                return true;
            } else if (this.southwest.remove(point)) {
                return true;
            }
        }

        return false;
    }
}