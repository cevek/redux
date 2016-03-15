import * as React from "react";

var a = function (proto:any, prop:string) {
    var origProp = proto[prop];
    return {
        set: function (value:any) {
            if (this['_' + prop] instanceof Base) {
                this['_' + prop].disconnect();
            }
            this['_' + prop] = value;
            if (value instanceof Base) {
                value.connect();
            }
        },
        get: function () {
            return this['_' + prop];
        }
    }
}

var activeReducerLevel = 0;
var reducer = function (proto:any, method:string) {
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
                root.forceUpdate();
            }
            return res;
        }
    }
}

var ID = 1;
var instances:{[id:number]:Base} = {};
(window as any).instances = instances;

var root:Root;

class Base {
    private __id = ID++;
    protected __store:BaseStore;

    constructor(json?:any) {
        for (var i in json) {
            if (json.hasOwnProperty(i)) {
                this[i] = json[i];
            }
        }
    }

    connect() {
        instances[this.__id] = this;
    }

    disconnect() {
        instances[this.__id] = null;
    }
}

interface RootProps {
    store:Store;
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


function fetch(url:string):Promise<{id:number}> {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve({id: 123}), 1000);
    });
}

class FantasyEventStore extends Base {

}

class FantasyEventRaw extends Base {
    @a
    id:number;
    @a
    name:string;
}


class FantasyEvent extends FantasyEventRaw {
    static fetchId(id:number) {
        return fetch('/getEvent/' + id);
    }

    @reducer
    setName(name:string) {
        this.name = name;
    }
}


class FantasyEventPageDataRaw extends Base {
    @a
    substitutionsVisible = false;
    @a
    fantasyEvent:FantasyEvent;
}

class FantasyEventPageData extends FantasyEventPageDataRaw {
    fetch(id:number) {
        FantasyEvent.fetchId(id).then((data:any) => this.onReceiveData(data));
    }

    @reducer
    onReceiveData(data:FantasyEvent) {
        this.fantasyEvent = new FantasyEvent(data);
        this.fantasyEvent.setName("Yow!");
    }


    setFName() {
        this.fantasyEvent.setName("Man!");
    }

    @reducer
    toggleSubstitutions() {
        this.substitutionsVisible = !this.substitutionsVisible;
    }
}

class BaseStore extends Base {
    root:Root;
    __store = this;

    setRoot(root:Root) {

    }
}


export class Store extends BaseStore {
    @a
    indexFantasyEvents = new FantasyEventStore();
    @a
    fantasyEvents = new FantasyEventStore();
    @a
    myFantasyEvents = new FantasyEventStore();
    @a
    fantasyEventPageData = new FantasyEventPageData();
}


