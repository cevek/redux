import * as React from "react";
import * as ReactDom from "react-dom";
import {Store} from "./store";
import {Root, connect} from "./lib";
var store = new Store();
(window as any).store = store;


class MainPage extends React.Component<{}, {}> {
    render() {
        return <div>Index</div>
    }
}


@connect((store:Store)=>[store.fantasyEventPageData])
class FantasyEventPage extends React.Component<{}, {}> {
    render() {
        console.log("rnder FantasyEventPage");
        return <div>
            FantasyEventPage
            <button onClick={()=>store.fantasyEventPageData.toggleSubstitutions()}>
                {store.fantasyEventPageData.substitutionsVisible ? 'hide' : 'show'}
            </button>

            {store.fantasyEventPageData.fantasyEvent.name}
            <button onClick={()=>store.fantasyEventPageData.fetch(1)}>fetch</button>
            <button onClick={()=>store.fantasyEventPageData.setFName()}>setName</button>
        </div>;
    }
}

class EventPage extends React.Component<{}, {}> {

}
ReactDom.render(<Root store={store}><FantasyEventPage/></Root>, document.body);
