import {reducer, prop, BaseStore, Base} from "./lib";
function fetch(url:string, obj:any):Promise<{id:number}> {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve(obj), 1000);
    });
}

class FantasyEventStore extends Base {

}

class FantasyEventRaw extends Base {
    @prop
    id:number;
    @prop
    name:string;
}

class FantasyEvent extends FantasyEventRaw {
    static fetchId(id:number) {
        return fetch('/getEvent/' + id, {id: 118, name: "TYUT"});
    }

    @reducer
    setName(name:string) {
        this.name = name;
    }
}


class FantasyEventPageDataRaw extends Base {
    @prop
    substitutionsVisible = false;
    @prop
    fantasyEvent = new FantasyEvent({id: 12, name: "Pui"});
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

export class Store extends BaseStore {
    @prop
    indexFantasyEvents = new FantasyEventStore();
    @prop
    fantasyEvents = new FantasyEventStore();
    @prop
    myFantasyEvents = new FantasyEventStore();
    @prop
    fantasyEventPageData = new FantasyEventPageData();
}


