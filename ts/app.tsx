import * as React from "react";
import * as ReactDom from "react-dom";
import {Store, Root} from "./store";
export var store = new Store();
(window as any).store = store;


class MainPage extends React.Component<{}, {}> {
    render() {
        return <div>Index</div>
    }
}

class FantasyEventPage extends React.Component<{}, {}> {
    render() {
        console.log("rnder FantasyEventPage");
        return <div>
            FantasyEventPage
            <button onClick={()=>store.fantasyEventPageData.toggleSubstitutions()}>
                {store.fantasyEventPageData.substitutionsVisible ? 'hide' : 'show'}
            </button>

            <button onClick={()=>store.fantasyEventPageData.fetch(1)}>fetch</button>
            <button onClick={()=>store.fantasyEventPageData.setFName()}>setName</button>
        </div>;
        // store.fantasyEventPageData.fetch(123)
        // store.fantasyEventPageData.toggleSubstitutions();
    }
}

class EventPage extends React.Component<{}, {}> {

}
ReactDom.render(<Root store={store}><FantasyEventPage/></Root>, document.body);
