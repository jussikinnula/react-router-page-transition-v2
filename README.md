# react-router-page-transition-v2

Customizable page transitions, which work with *React 16.x* and with *React Router 4*.

I'll give most of the credit to @trungdq88 who implemented https://github.com/trungdq88/react-router-page-transition component, which unfortunately isn't yet functional with later React & React Router versions. This project is simplified from the original, so it's not exactly a replacement.

The biggest difference of `react-router-page-transition-v2` and https://github.com/trungdq88/react-router-page-transition are how children change is checked. While in this component the children change is just checked from `location.pathname`, the latter tries to more profoundly check if component did actually change. The implementation by the time this component was done was, however, incomplete.

## Why TypeScript?

The implementation of `react-router-page-transition-v2` component is done in TypeScript, since many people do prefer type-checking nowadays. You don't need to use TypeScript in order to use the component, so just skip ahead any `propName: string` definitions when using the component.

## Installation

Note! I'll probably add this to NPM repository later, after adding tests.

```
npm install react-router-page-transition-v2
```

## Usage

```tsx
import { PageTransition } from 'react-router-page-transition-v2';

const App = (props) => (
  <PageTransition timeout={500}>
    <Switch location={props.location}>
      <Route path="/" component={List} />
      <Route path="/item" component={Item} />
    </Switch>
  </PageTransition>
);
```

```styl
.transition-wrapper
  position relative
  z-index 1

  .transition-item
    position absolute
    top 0
    right 0
    left 0
    transition transform 0.5s

    &.transition-appear.transition-appear-active
      transform translate3d(0, 0, 0) 
      
    &.transition-appear
      transform translate3d(100%, 0, 0) 

    &.transition-leave
      transform translate3d(0, 0, 0) 

    &.transition-leave.transition-leave-active
      transform translate3d(-100%, 0, 0) 
```

## Customization

You can hook into `onTransitionStart` and `onTransitionEnd` events, and also pass CSS class names into `PageTransition` component.

```tsx
interface Props {
  location: any;
}

interface State {
  transitionActive: boolean;
}

class App extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);    
    this.state = { transitionActive: false };
  }

  onTransitionStart = () => {
    console.log('transition started');
    this.setState({ transitionActive: true });
  }

  onTransitionEnd = () => {
    console.log('transition ended');
    this.setState({ transitionActive: false });
  }

  render() {
    const className = this.state.transitionActive
      ? 'transition-active'
      : undefined;

    return (
      <PageTransition
      timeout={500}
      onTransitionStart={this.onTransitionStart}
      onTransitionEnd={this.onTransitionEnd}
      className={className}
    >
      ...
    </PageTransition>
  );
}
```

