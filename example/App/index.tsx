import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { PageTransition } from '../../src';
import List from '../List';
import Item, { IItem } from '../Item';
import './index.styl';

interface Props {
  location: any;
  history: any;
}

const TRANSITION_SLIDE_LEFT = 'transition-slide-left';
const TRANSITION_SLIDE_RIGHT = 'transition-slide-right';
const TRANSITION_ACTIVE = 'transition-active';

interface State {
  items: IItem[];
  directionClassName: string;
  transitionActive: boolean;
}

export class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      items: [],
      directionClassName: TRANSITION_SLIDE_LEFT,
      transitionActive: false
    };
  }

  componentWillMount() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(items => this.setState({ items }))
      .catch(error => console.error(error));
  }

  goBack = () => {
    const directionClassName = TRANSITION_SLIDE_RIGHT;
    this.setState({ directionClassName });
    this.props.history.goBack();
  }

  selectRoute = () => {
    const directionClassName = TRANSITION_SLIDE_LEFT;
    this.setState({ directionClassName });
  }

  onTransitionStart = () => {
    const transitionActive = true;
    this.setState({ transitionActive })
  }

  onTransitionEnd = () => {
    const transitionActive = false;
    this.setState({ transitionActive })
  }

  render() {
    const { location } = this.props;
    const { items, directionClassName, transitionActive } = this.state;
    const transitionClassNames = [];
    transitionClassNames.push(directionClassName);
    if (transitionActive) transitionClassNames.push(TRANSITION_ACTIVE)

    if (items.length > 0) {
      return (
        <div className="App">
          <PageTransition
            timeout={500}
            onTransitionStart={this.onTransitionStart}
            onTransitionEnd={this.onTransitionEnd}
            className={transitionClassNames.join(' ')}
          >
            <Switch location={location}>
              <Route exact path="/" render={props => (
                <List {...props} items={items} onLinkClick={this.selectRoute} />
              )} /> 
              <Route exact path="/item/:id" render={props => (
                <Item {...props} items={items} goBack={this.goBack} />
              )} /> 
            </Switch>
          </PageTransition>
        </div>
      );
    }
    return null;
  }
}

export default withRouter(App);