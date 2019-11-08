class TimeoutMap extends Map {
    constructor(timeout, handler, margin=5000) {
        super();
        this._timeouts = {};
        // how long until called
        this._timeout = timeout;
        // what is called
        this._handler = handler;
        // minimum time interval between timeouts
        this._margin = margin;
    }
    set(key, value, timeout=this._timeout) {
        this._set_timeout(key);
        return super.set(key, value);
    }
    delete(key) {
        this._clear_timeout(key);
        return super.delete(key);
    }
    clear() {
        for (let key in this._timeouts) {
            if (this._timeouts.hasOwnProperty(key)) {
                this._clear_timeout(key);
            }
        }
        return super.clear();
    }
    size_timeout() {
        return Object.keys(this._timeouts).length;
    }
    _clear_timeout(key) {
        let timeout = this._timeouts[key];
        delete this._timeouts[key];
        if (timeout != null) {
            clearTimeout(timeout);
            return true;
        }
        return false;
    }
    _set_timeout(key, timeout) {
        this._clear_timeout(key);
        if (this._margin !== 0) timeout += this._margin - (timeout % this._margin);
        this._timeouts[key] = setTimeout(() => this._handler(key, super.get(key)), timeout);
    }
}

module.exports = TimeoutMap;
