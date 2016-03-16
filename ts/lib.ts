import * as React from "react";

var store:BaseStore;

export var prop:any = function (proto:any, prop:string) {
    var origProp = proto[prop];
    return {
        set: function (value:Base) {
            var that:Base = this;
            var oldVal:Base = this['_' + prop];
            if (oldVal instanceof Base) {
                oldVal.disconnect();
                oldVal.setParent(null);
            }
            this['_' + prop] = value;
            if (value instanceof Base) {
                if (oldVal) {
                    value.replaceWith(oldVal);
                }
                value.connect();
                value.setParent(that);
            }
            that.update();
        },
        get: function () {
            return this['_' + prop];
        }
    }
};

var activeReducerLevel = 0;
export var reducer = function (proto:any, method:string) {
    console.log(proto, method);
    var origMethod = proto[method];
    return {
        value: function () {
            activeReducerLevel++;
            if (activeReducerLevel == 1) {
                console.log(proto.constructor.name, this.__id, method);
                console.log("call", method, arguments);
            }
            var res = origMethod.apply(this, arguments);
            activeReducerLevel--;
            if (activeReducerLevel === 0) {
                // root.forceUpdate();
            }
            return res;
        }
    }
};

export var connect = function (callback:(store:BaseStore) => Base[]) {
    return function (Class:any) {
        console.log(Class);
        var origUpdate = Class.prototype.shouldComponentUpdate;
        var origWillMount = Class.prototype.componentWillMount;
        var origWillUnmount = Class.prototype.componentWillUnmount;

        Class.prototype.componentWillMount = function () {
            this.owners = callback(store);
            this.forceUpdateBinded = () => {
                this.forceUpdate();
            };
            for (let i = 0; i < this.owners.length; i++) {
                this.owners[i].listen(this.forceUpdateBinded);
            }

            console.log("componentWillMount", this);
            if (origWillMount) {
                origWillMount.apply(this, arguments);
            }
        };
        Class.prototype.shouldComponentUpdate = function () {
            return false;
        };

        Class.prototype.componentWillUnmount = function () {
            for (let i = 0; i < this.owners.length; i++) {
                this.owners[i].unlisten(this.forceUpdateBinded);
            }
            if (origWillUnmount) {
                origWillUnmount.apply(this, arguments);
            }
        };
    }
};

var ID = 1;
var instances:{[id:number]:Base} = {};
(window as any).instances = instances;

var root:Root;

interface Listener {
    callback:()=>void;
}
export class Base {
    private __id = ID++;
    protected __store:BaseStore;

    private _listeners:{[id:string]:Listener} = {};
    private __parent:Base;

    listen(arg:()=>void | Base) {
        if (!this._listeners) {
            this._listeners = {};
        }
        if (typeof arg == 'function') {
            this._listeners[this.__id] = {callback: arg}
        }
    }

    unlisten(arg:()=>void | Base) {
        if (typeof arg == 'function') {
            this._listeners[this.__id] = null;
        }
    }

    update() {
        console.log(this._listeners);
        for (var i in this._listeners) {
            if (this._listeners.hasOwnProperty(i)) {
                this._listeners[i].callback();
            }
        }
        var p:Base = this;
        while (p = p.__parent){
            p.update();
        }
    }

    replaceWith(el:Base) {
        this._listeners = el._listeners;
        el._listeners = null;
    }


    constructor(json?:any) {
        for (var i in json) {
            if (json.hasOwnProperty(i)) {
                (<any>this)[i] = json[i];
            }
        }
    }

    setParent(parent:Base) {
        this.__parent = parent;
    }

    connect() {
        instances[this.__id] = this;
    }

    disconnect() {
        instances[this.__id] = null;
    }
}

interface RootProps {
    store:BaseStore;
    children?:any;
}
export class Root extends React.Component<RootProps, {}> {
    constructor(props:RootProps) {
        super(props);
        props.store.setRoot(this);
        root = this;
        (window as any).root = this;
    }

    render() {
        return React.cloneElement(this.props.children);
    }
}
export class BaseStore extends Base {
    root:Root;
    __store = this;

    constructor() {
        super();
        store = this;
    }

    setRoot(root:Root) {

    }
}

