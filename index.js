class TimeoutMap extends Map {
    constructor(iterable, options) {
        super();
        this._timeouts = {};
        this.configure(options, true);
        for (const element of iterable) this.set(element[0], element[1]);
    }
    configure(options, reset=false) {
        if (reset) {
            this._config = {
                // how long until called
                timeout: null,
                // delete key before callback?
                autodelete: true,
                // what is called
                handler: () => {},
                // minimum time interval between timeouts
                margin: 0,
                // additional arguments in callback
                additional_arguments: [],
            };
        }
        Object.assign(this._config, options);
    }
    set(key, value, options) {
        if (!options) {
            options = this._config;
        }
        else {
            options = Object.assign(Object.assign({}, this._config), options);
        }
        this._set_timeout(key, options);
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
    _set_timeout(key, config) {
        this._clear_timeout(key);
        if (config.timeout == null || config.timeout === Infinity) return;

        let timeout = config.timeout;
        if (config.margin) timeout += config.margin - (timeout % config.margin);

        this._timeouts[key] = setTimeout(() => {
            let value = super.get(key);
            if (config.autodelete) this.delete(key);
            else this._clear_timeout(key);
            config.handler(key, value, this, ...config.additional_arguments);
        }, timeout);
    }
}

module.exports = TimeoutMap;
