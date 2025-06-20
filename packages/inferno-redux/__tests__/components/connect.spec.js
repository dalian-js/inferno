import { Component, render as _render, rerender } from 'inferno';
import { connect } from 'inferno-redux';
import { findRenderedVNodeWithType, Wrapper } from 'inferno-test-utils';
import { createStore } from 'redux';
import { VNodeFlags } from 'inferno-vnode-flags';

describe('Inferno', () => {
  // IE does not support function names so error messages are different
  const testFunction = function testFunction() {};
  const supportFnName = testFunction.name === 'testFunction';
  const unmountDOM = (elm) => render(null, elm);
  let container;

  function render(vNode, container, cb) {
    _render(vNode, container, cb);

    if (vNode && vNode.flags & VNodeFlags.Component) {
      return vNode.children;
    }
  }

  beforeEach(() => {
    rerender();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    render(null, container);
    document.body.removeChild(container);
  });

  function renderToContainer(vNode) {
    return render(vNode, container);
  }

  describe('redux', () => {
    class Passthrough extends Component {
      render() {
        return <div />;
      }
    }

    class ProviderMock extends Component {
      getChildContext() {
        return { store: this.props.store };
      }

      render() {
        return this.props.children;
      }
    }

    class ContextBoundStore {
      constructor(reducer) {
        this.reducer = reducer;
        this.listeners = [];
        this.state = undefined;
        this.dispatch({});
      }

      getState() {
        return this.state;
      }

      subscribe(listener) {
        let live = true;
        const call = (...args) => {
          if (live) {
            listener(...args);
          }
        };
        this.listeners.push(call);
        return () => {
          live = false;
          this.listeners = this.listeners.filter((c) => c !== call);
        };
      }

      dispatch(action) {
        this.state = this.reducer(this.state, action);
        for (const l of this.listeners) {
          l();
        }
        return action;
      }
    }

    const stringBuilder = (prev = '', action) =>
      action.type === 'APPEND' ? prev + action.payload : prev;

    const renderWithBadConnect = (Component) => {
      const store = createStore(() => ({}));

      try {
        renderToContainer(
          <ProviderMock store={store}>
            <Component pass="through" />
          </ProviderMock>,
        );

        return null;
      } catch (e) {
        return e.message;
      }
    };

    it('should receive the store in the context', () => {
      const store = createStore(() => ({}));

      const Container = connect()(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <Container pass="through" />
        </ProviderMock>,
      );

      const container = findRenderedVNodeWithType(tree, Container).children;
      expect(container.context.store).toBe(store);
    });

    it('should pass state and props to the given component', () => {
      const store = createStore(() => ({
        foo: 'bar',
        baz: 42,
        hello: 'world',
      }));

      const Container = connect(({ foo, baz }) => ({ foo, baz }))(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <Container pass="through" baz={50} />
        </ProviderMock>,
      );

      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(stub.props.pass).toBe('through');
      expect(stub.props.foo).toBe('bar');
      expect(stub.props.baz).toBe(42);
      expect(stub.props.hello).toBe(undefined);
      findRenderedVNodeWithType(tree, Container);
    });

    it('should subscribe class components to the store changes', () => {
      const store = createStore(stringBuilder);

      const Container = connect((state) => ({ string: state }))(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      const tree = renderToContainer(vNode);

      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(stub.props.string).toBe('');

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(stub.props.string).toBe('a');

      store.dispatch({ type: 'APPEND', payload: 'b' });
      renderToContainer(vNode);
      expect(stub.props.string).toBe('ab');
    });

    it('should subscribe pure function components to the store changes', () => {
      const store = createStore(stringBuilder);

      const Container = connect((state) => ({
        string: state,
      }))(function Container(props) {
        return <Passthrough {...props} />;
      });

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      const tree = renderToContainer(vNode);

      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(stub.props.string).toBe('');

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(stub.props.string).toBe('a');

      store.dispatch({ type: 'APPEND', payload: 'b' });
      renderToContainer(vNode);
      expect(stub.props.string).toBe('ab');
    });

    it("should retain the store's context", () => {
      const store = new ContextBoundStore(stringBuilder);

      const Container = connect((state) => ({
        string: state,
      }))(function Container(props) {
        return <Passthrough {...props} />;
      });

      const spy = spyOn(console, 'error');

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      const tree = renderToContainer(vNode);

      expect(spy.calls.count()).toBe(0);

      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(stub.props.string).toBe('');

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(stub.props.string).toBe('a');
    });

    it('should handle dispatches before componentDidMount', (done) => {
      const store = createStore(stringBuilder);

      const Container = connect((state) => ({ string: state }))(
        class Container extends Component {
          componentDidMount() {
            store.dispatch({ type: 'APPEND', payload: 'a' });
          }

          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>,
      );

      setTimeout(() => {
        const stub = findRenderedVNodeWithType(tree, Passthrough).children;
        expect(stub.props.string).toBe('a');
        done();
      }, 20);
    });

    it('should handle additional prop changes in addition to slice', () => {
      const store = createStore(() => ({
        foo: 'bar',
      }));

      const ConnectContainer = connect((state) => state)(
        class ConnectContainer extends Component {
          render() {
            return <Passthrough {...this.props} pass={this.props.bar.baz} />;
          }
        },
      );

      class Container extends Component {
        constructor() {
          super();
          this.state = {
            bar: {
              baz: '',
            },
          };
        }

        componentDidMount() {
          const newBar = {};

          for (const key in this.state.bar) {
            newBar[key] = this.state.bar[key];
          }
          newBar.baz = 'through';
          this.setState({
            bar: newBar,
          });
        }

        render() {
          return (
            <ProviderMock store={store}>
              <ConnectContainer bar={this.state.bar} />
            </ProviderMock>
          );
        }
      }

      const vNode = <Container />;
      const tree = renderToContainer(vNode);
      const stub = findRenderedVNodeWithType(tree, Passthrough).children;

      renderToContainer(vNode);

      rerender();

      expect(stub.props.foo).toBe('bar');
      expect(stub.props.pass).toBe('through');
    });

    it('should handle unexpected prop changes with forceUpdate()', (done) => {
      const store = createStore(() => ({}));

      const ConnectContainer = connect((state) => state)(
        class ConnectContainer extends Component {
          render() {
            return <Passthrough {...this.props} pass={this.props.bar} />;
          }
        },
      );

      class Container extends Component {
        constructor() {
          super();
          this.baz = 'baz';
        }

        componentDidMount() {
          this.bar = 'foo';
          this.forceUpdate();
          this.c.forceUpdate();
        }

        render() {
          return (
            <ProviderMock store={store}>
              <ConnectContainer
                bar={this.bar}
                ref={(c) => {
                  this.c = c;
                }}
              />
            </ProviderMock>
          );
        }
      }

      const tree = renderToContainer(<Container />);

      setTimeout(() => {
        const stub = findRenderedVNodeWithType(tree, Passthrough).children;
        expect(stub.props.bar).toBe('foo');
        done();
      }, 20);
    });

    it('should remove undefined props', () => {
      const store = createStore(() => {});
      let props = { x: true };
      let container;

      const ConnectContainer = connect(
        () => ({}),
        () => ({}),
      )(
        class ConnectContainer extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class HolderContainer extends Component {
        render() {
          return <ConnectContainer {...props} />;
        }
      }

      renderToContainer(
        <ProviderMock store={store}>
          <HolderContainer
            ref={(instance) => {
              container = instance;
            }}
          />
        </ProviderMock>,
      );

      const propsBefore = {
        ...findRenderedVNodeWithType(container, Passthrough).children.props,
      };

      props = {};
      container.forceUpdate();

      const propsAfter = {
        ...findRenderedVNodeWithType(container, Passthrough).children.props,
      };

      expect(propsBefore.x).toBe(true);
      expect('x' in propsAfter).toBe(false);
    });

    it('should remove undefined props without mapDispatch', () => {
      const store = createStore(() => ({}));
      let props = { x: true };
      let container;

      const ConnectContainer = connect(() => ({}))(
        class ConnectContainer extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class HolderContainer extends Component {
        render() {
          return <ConnectContainer {...props} />;
        }
      }

      renderToContainer(
        <ProviderMock store={store}>
          <HolderContainer
            ref={(instance) => {
              container = instance;
            }}
          />
        </ProviderMock>,
      );

      const propsBefore = {
        ...findRenderedVNodeWithType(container, Passthrough).children.props,
      };

      props = {};
      container.forceUpdate();

      const propsAfter = {
        ...findRenderedVNodeWithType(container, Passthrough).children.props,
      };

      expect(propsBefore.x).toBe(true);
      expect('x' in propsAfter).toBe(false);
    });

    it('should ignore deep mutations in props', () => {
      const store = createStore(() => ({
        foo: 'bar',
      }));

      const ConnectContainer = connect((state) => state)(
        class ConnectContainer extends Component {
          render() {
            return <Passthrough {...this.props} pass={this.props.bar.baz} />;
          }
        },
      );

      class Container extends Component {
        constructor() {
          super();
          this.state = {
            bar: {
              baz: '',
            },
          };
        }

        componentDidMount() {
          // Simulate deep object mutation
          const bar = this.state.bar;
          bar.baz = 'through';
          this.setState({
            bar,
          });
        }

        render() {
          return (
            <ProviderMock store={store}>
              <ConnectContainer bar={this.state.bar} />
            </ProviderMock>
          );
        }
      }

      const tree = renderToContainer(<Container />);
      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(stub.props.foo).toBe('bar');
      expect(stub.props.pass).toBe('');
    });

    it('should allow for merge to incorporate state and prop changes', (done) => {
      const store = createStore(stringBuilder);

      const doSomething = (thing) => ({
        type: 'APPEND',
        payload: thing,
      });

      const Container = connect(
        (state) => ({ stateThing: state }),
        (dispatch) => ({
          doSomething: (whatever) => dispatch(doSomething(whatever)),
        }),
        (stateProps, actionProps, parentProps) => ({
          ...stateProps,
          ...actionProps,
          mergedDoSomething(thing) {
            const seed = stateProps.stateThing === '' ? 'HELLO ' : '';
            actionProps.doSomething(seed + thing + parentProps.extra);
          },
        }),
      )(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class OuterContainer extends Component {
        constructor() {
          super();
          this.state = { extra: 'z' };
        }

        render() {
          return (
            <ProviderMock store={store}>
              <Container extra={this.state.extra} />
            </ProviderMock>
          );
        }
      }

      const outerStub = render(
        <OuterContainer />,
        document.createElement('div'),
      );
      const stub = findRenderedVNodeWithType(outerStub, Passthrough).children;
      expect(stub.props.stateThing).toBe('');
      stub.props.mergedDoSomething('a');
      outerStub.setState({}, () => {
        expect(stub.props.stateThing).toBe('HELLO az');

        stub.props.mergedDoSomething('b');
        outerStub.setState({}, () => {
          expect(stub.props.stateThing).toBe('HELLO azbz');

          outerStub.setState({ extra: 'Z' });
          outerStub.setState({}, () => {
            stub.props.mergedDoSomething('c');
            outerStub.setState({}, () => {
              expect(stub.props.stateThing).toBe('HELLO azbzcZ');

              done();
            });
          });
        });
      });
    });

    it('should merge actionProps into WrappedComponent', () => {
      const store = createStore(() => ({
        foo: 'bar',
      }));

      const Container = connect(
        (state) => state,
        (dispatch) => ({ dispatch }),
      )(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <Container pass="through" />
        </ProviderMock>,
      );

      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(stub.props.dispatch).toBe(store.dispatch);
      expect(stub.props.foo).toBe('bar');
      expect(
        () => findRenderedVNodeWithType(tree, Container).children,
      ).not.toThrow();
      const decorated = findRenderedVNodeWithType(tree, Container).children;
      expect(decorated.isSubscribed()).toBe(true);
    });

    it('should not invoke mapState when props change if it only has one argument', () => {
      const store = createStore(stringBuilder);

      let invocationCount = 0;

      const WithoutProps = connect((_arg1) => {
        invocationCount++;
        return {};
      })(
        class WithoutProps extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class OuterComponent extends Component {
        constructor() {
          super();
          this.state = { foo: 'FOO' };
        }

        setFoo(foo) {
          this.setState({ foo });
        }

        render() {
          return (
            <div>
              <WithoutProps {...this.state} />
            </div>
          );
        }
      }

      let outerComponent;
      renderToContainer(
        <ProviderMock store={store}>
          <OuterComponent
            ref={(c) => {
              outerComponent = c;
            }}
          />
        </ProviderMock>,
      );

      outerComponent.setFoo('BAR');
      outerComponent.setFoo('DID');

      expect(invocationCount).toBe(1);
    });

    it('should invoke mapState every time props are changed if it has zero arguments', () => {
      const store = createStore(stringBuilder);

      let invocationCount = 0;

      const WithoutProps = connect(() => {
        invocationCount++;
        return {};
      })(
        class WithoutProps extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class OuterComponent extends Component {
        constructor() {
          super();
          this.state = { foo: 'FOO' };
        }

        setFoo(foo) {
          this.setState({ foo });
        }

        render() {
          return (
            <div>
              <WithoutProps {...this.state} />
            </div>
          );
        }
      }

      let outerComponent;
      const vNode = (
        <ProviderMock store={store}>
          <OuterComponent
            ref={(c) => {
              outerComponent = c;
            }}
          />
        </ProviderMock>
      );
      renderToContainer(vNode);

      outerComponent.setFoo('BAR');
      renderToContainer(vNode);
      outerComponent.setFoo('DID');
      renderToContainer(vNode);
      expect(invocationCount).toBe(3);
    });

    it('should invoke mapState every time props are changed if it has a second argument', () => {
      const store = createStore(stringBuilder);

      let propsPassedIn;
      let invocationCount = 0;

      const WithoutProps = connect((_state, props) => {
        invocationCount++;
        propsPassedIn = props;
        return {};
      })(
        class WithoutProps extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class OuterComponent extends Component {
        constructor() {
          super();
          this.state = { foo: 'FOO' };
        }

        setFoo(foo) {
          this.setState({ foo });
        }

        render() {
          return (
            <div>
              <WithoutProps {...this.state} />
            </div>
          );
        }
      }

      let outerComponent;
      const vNode = (
        <ProviderMock store={store}>
          <OuterComponent
            ref={(c) => {
              outerComponent = c;
            }}
          />
        </ProviderMock>
      );
      renderToContainer(vNode);

      outerComponent.setFoo('BAR');
      renderToContainer(vNode);
      outerComponent.setFoo('BAZ');
      renderToContainer(vNode);

      expect(invocationCount).toBe(3);
      expect(propsPassedIn).toEqual({
        foo: 'BAZ',
      });
    });

    it('should not invoke mapDispatch when props change if it only has one argument', () => {
      const store = createStore(stringBuilder);

      let invocationCount = 0;

      const WithoutProps = connect(null, (_arg1) => {
        invocationCount++;
        return {};
      })(
        class WithoutProps extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class OuterComponent extends Component {
        constructor() {
          super();
          this.state = { foo: 'FOO' };
        }

        setFoo(foo) {
          this.setState({ foo });
        }

        render() {
          return (
            <div>
              <WithoutProps {...this.state} />
            </div>
          );
        }
      }

      let outerComponent;
      renderToContainer(
        <ProviderMock store={store}>
          <OuterComponent
            ref={(c) => {
              outerComponent = c;
            }}
          />
        </ProviderMock>,
      );

      outerComponent.setFoo('BAR');
      outerComponent.setFoo('DID');

      expect(invocationCount).toBe(1);
    });

    it('should invoke mapDispatch every time props are changed if it has zero arguments', () => {
      const store = createStore(stringBuilder);

      let invocationCount = 0;

      const WithoutProps = connect(null, () => {
        invocationCount++;
        return {};
      })(
        class WithoutProps extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class OuterComponent extends Component {
        constructor() {
          super();
          this.state = { foo: 'FOO' };
        }

        setFoo(foo) {
          this.setState({ foo });
        }

        render() {
          return (
            <div>
              <WithoutProps {...this.state} />
            </div>
          );
        }
      }

      let outerComponent;
      const vNode = (
        <ProviderMock store={store}>
          <OuterComponent
            ref={(c) => {
              outerComponent = c;
            }}
          />
        </ProviderMock>
      );
      renderToContainer(vNode);

      outerComponent.setFoo('BAR');
      renderToContainer(vNode);
      outerComponent.setFoo('DID');
      renderToContainer(vNode);
      expect(invocationCount).toBe(3);
    });

    it('should invoke mapDispatch every time props are changed if it has a second argument', () => {
      const store = createStore(stringBuilder);

      let propsPassedIn;
      let invocationCount = 0;

      const WithoutProps = connect(null, (_state, props) => {
        invocationCount++;
        propsPassedIn = props;
        return {};
      })(
        class WithoutProps extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      class OuterComponent extends Component {
        constructor() {
          super();
          this.state = { foo: 'FOO' };
        }

        setFoo(foo) {
          this.setState({ foo });
        }

        render() {
          return (
            <div>
              <WithoutProps {...this.state} />
            </div>
          );
        }
      }

      let outerComponent;
      const vNode = (
        <ProviderMock store={store}>
          <OuterComponent
            ref={(c) => {
              outerComponent = c;
            }}
          />
        </ProviderMock>
      );
      renderToContainer(vNode);

      outerComponent.setFoo('BAR');
      renderToContainer(vNode);
      outerComponent.setFoo('BAZ');
      renderToContainer(vNode);

      expect(invocationCount).toBe(3);
      expect(propsPassedIn).toEqual({
        foo: 'BAZ',
      });
    });

    it('should pass dispatch and avoid subscription if arguments are falsy', () => {
      const store = createStore(() => ({
        foo: 'bar',
      }));

      const runCheck = (...connectArgs) => {
        const Container = connect(...connectArgs)(
          class Container extends Component {
            render() {
              return <Passthrough {...this.props} />;
            }
          },
        );

        const vNode = (
          <ProviderMock store={store}>
            <Container pass="through" />
          </ProviderMock>
        );
        const tree = renderToContainer(vNode);

        const stub = findRenderedVNodeWithType(tree, Passthrough).children;
        expect(stub.props.dispatch).toBe(store.dispatch);
        expect(stub.props.foo).toBeUndefined();
        expect(stub.props.pass).toBe('through');
        expect(
          () => findRenderedVNodeWithType(tree, Container).children,
        ).not.toThrow();

        const decorated = findRenderedVNodeWithType(tree, Container).children;
        expect(decorated.isSubscribed()).toBe(false);
      };

      runCheck();
      runCheck(null, null, null);
      runCheck(false, false, false);
    });

    it('should unsubscribe before unmounting', () => {
      const store = createStore(stringBuilder);
      const subscribe = store.subscribe;

      // Keep track of unsubscribe by wrapping subscribe()
      let unsubscribeCalls = 0;
      store.subscribe = (listener) => {
        const unsubscribe = subscribe(listener);
        return () => {
          unsubscribeCalls++;
          return unsubscribe();
        };
      };

      const Container = connect(
        (state) => ({ string: state }),
        (dispatch) => ({ dispatch }),
      )(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const div = document.createElement('div');
      render(
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>,
        div,
      );

      expect(unsubscribeCalls).toBe(0);
      unmountDOM(div);
      expect(unsubscribeCalls).toBe(1);
    });

    it('should not attempt to set state after unmounting', () => {
      const store = createStore(stringBuilder);
      let mapStateToPropsCalls = 0;

      const Container = connect(
        () => ({ calls: ++mapStateToPropsCalls }),
        (dispatch) => ({ dispatch }),
      )(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const div = document.createElement('div');
      store.subscribe(() => {
        unmountDOM(div);
      });
      render(
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>,
        div,
      );

      expect(mapStateToPropsCalls).toBe(1);
      const spy = spyOn(console, 'error');

      store.dispatch({ type: 'APPEND', payload: 'a' });
      expect(spy.calls.count()).toBe(0);
      expect(mapStateToPropsCalls).toBe(1);
    });

    it('should not attempt to notify unmounted child of state change', () => {
      class ProviderMockTest extends Component {
        getChildContext() {
          return { store: this.props.store };
        }

        render() {
          return this.props.children;
        }
      }

      const store = createStore(stringBuilder);

      const App = connect((state) => ({ hide: state === 'AB' }))(
        class App extends Component {
          getDisplayName() {
            return 'App';
          }

          render() {
            return this.props.hide ? null : <Container />;
          }
        },
      );

      const Container = connect((state) => ({ state }))(
        class Container extends Component {
          getDisplayName() {
            return 'Container';
          }

          componentWillReceiveProps(nextProps) {
            if (nextProps.state === 'A') {
              store.dispatch({ type: 'APPEND', payload: 'B' });
            }
          }

          render() {
            return null;
          }
        },
      );

      const div = document.createElement('div');
      render(
        <ProviderMockTest store={store}>
          <App />
        </ProviderMockTest>,
        div,
      );

      try {
        store.dispatch({ type: 'APPEND', payload: 'A' });
      } finally {
        unmountDOM(div);
      }
    });

    it('should not attempt to set state after unmounting nested components', () => {
      const store = createStore(() => ({}));
      let mapStateToPropsCalls = 0;

      let linkA;
      let linkB;

      let App = ({ children, setLocation }) => {
        const onClick = (to) => (event) => {
          event.preventDefault();
          setLocation(to);
        };

        return (
          <div>
            <a
              href="#"
              onClick={onClick('a')}
              ref={(c) => {
                linkA = c;
              }}
            >
              A
            </a>
            <a
              href="#"
              onClick={onClick('b')}
              ref={(c) => {
                linkB = c;
              }}
            >
              B
            </a>
            {children}
          </div>
        );
      };
      App = connect(() => ({}))(App);

      let A = () => <h1>A</h1>;
      A = connect(() => ({ calls: ++mapStateToPropsCalls }))(A);

      const B = () => <h1>B</h1>;

      class RouterMock extends Component {
        constructor(...args) {
          super(...args);
          this.state = { location: { pathname: 'a' } };
          this.setLocation = this.setLocation.bind(this);
        }

        setLocation(pathname) {
          store.dispatch({ type: 'TEST' });
          this.setState({ location: { pathname } });
        }

        getChildComponent(location) {
          switch (location) {
            case 'a':
              return <A />;
            case 'b':
              return <B />;
            default:
              throw new Error('Unknown location: ' + location);
          }
        }

        render() {
          return (
            <App setLocation={this.setLocation}>
              {this.getChildComponent(this.state.location.pathname)}
            </App>
          );
        }
      }

      let wrapper;
      const div = document.createElement('div');
      document.body.appendChild(div);
      const vNode = (
        <Wrapper
          ref={(w) => {
            wrapper = w;
          }}
        >
          <ProviderMock store={store}>
            <RouterMock />
          </ProviderMock>
        </Wrapper>
      );
      render(vNode, div);

      const spy = spyOn(console, 'error');
      expect(mapStateToPropsCalls).toBe(1);
      linkA.click();
      render(vNode, div);
      expect(mapStateToPropsCalls).toBe(2);
      linkB.click();
      render(vNode, div);

      expect(mapStateToPropsCalls).toBe(3);
      linkB.click();
      render(vNode, div);

      expect(spy.calls.count()).toBe(0);

      unmountDOM(div);
      document.body.removeChild(div);
      expect(mapStateToPropsCalls).toBe(3);
    });

    it('should not attempt to set state when dispatching in componentWillUnmount', () => {
      const store = createStore(stringBuilder);
      let mapStateToPropsCalls = 0;

      const Container = connect(
        (state) => ({ calls: mapStateToPropsCalls++ }),
        (dispatch) => ({ dispatch }),
      )(
        class Container extends Component {
          componentWillUnmount() {
            this.props.dispatch({ type: 'APPEND', payload: 'a' });
          }

          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const div = document.createElement('div');
      render(
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>,
        div,
      );

      expect(mapStateToPropsCalls).toBe(1);

      const spy = spyOn(console, 'error');

      unmountDOM(div);

      expect(spy.calls.count()).toBe(0);

      expect(mapStateToPropsCalls).toBe(1);
    });

    it('should shallowly compare the selected state to prevent unnecessary updates', () => {
      const store = createStore(stringBuilder);
      let renderCallCount = 0;

      const Container = connect(
        (state) => ({ string: state }),
        (dispatch) => ({ dispatch }),
      )(
        class Container extends Component {
          render() {
            const { string } = this.props;

            renderCallCount++;
            return <Passthrough string={string} />;
          }
        },
      );

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      const tree = renderToContainer(vNode);

      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(renderCallCount).toBe(1);
      expect(stub.props.string).toBe('');
      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(2);
      store.dispatch({ type: 'APPEND', payload: 'b' });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(3);
      store.dispatch({ type: 'APPEND', payload: '' });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(3);
    });

    it('should shallowly compare the merged state to prevent unnecessary updates', () => {
      const store = createStore(stringBuilder);
      let renderCallCount = 0;

      const Container = connect(
        (state) => ({ string: state }),
        (dispatch) => ({ dispatch }),
        (stateProps, dispatchProps, parentProps) => ({
          ...dispatchProps,
          ...stateProps,
          ...parentProps,
        }),
      )(
        class Container extends Component {
          render() {
            const { string, pass } = this.props;

            renderCallCount++;
            return (
              <Passthrough string={string} pass={pass} passVal={pass.val} />
            );
          }
        },
      );

      class Root extends Component {
        constructor(props) {
          super(props);
          this.state = { pass: '' };
        }

        render() {
          return (
            <ProviderMock store={store}>
              <Container pass={this.state.pass} />
            </ProviderMock>
          );
        }
      }

      const vNode = <Root />;
      const rootStub = renderToContainer(vNode);
      const stub = findRenderedVNodeWithType(rootStub, Passthrough).children;

      expect(renderCallCount).toBe(1);
      expect(stub.props.string).toBe('');
      expect(stub.props.pass).toBe('');

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(2);
      expect(stub.props.string).toBe('a');
      expect(stub.props.pass).toBe('');

      rootStub.setState({ pass: '' });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(2);
      expect(stub.props.string).toBe('a');
      expect(stub.props.pass).toBe('');

      rootStub.setState({ pass: 'through' });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(3);
      expect(stub.props.string).toBe('a');
      expect(stub.props.pass).toBe('through');

      rootStub.setState({ pass: 'through' });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(3);
      expect(stub.props.string).toBe('a');
      expect(stub.props.pass).toBe('through');

      const obj = { prop: 'val' };
      rootStub.setState({ pass: obj });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(4);
      expect(stub.props.string).toBe('a');
      expect(stub.props.pass).toBe(obj);

      rootStub.setState({ pass: obj });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(4);
      expect(stub.props.string).toBe('a');
      expect(stub.props.pass).toBe(obj);

      const obj2 = { ...obj, val: 'otherval' };
      rootStub.setState({ pass: obj2 });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(5);
      expect(stub.props.string).toBe('a');
      expect(stub.props.pass).toBe(obj2);

      obj2.val = 'mutation';
      rootStub.setState({ pass: obj2 });
      renderToContainer(vNode);
      expect(renderCallCount).toBe(5);
      expect(stub.props.string).toBe('a');
      expect(stub.props.passVal).toBe('otherval');
    });

    it('should throw an error if a component is not passed to the function returned by connect', () => {
      expect(connect()).toThrow(
        new Error(
          'You must pass a component to the function returned by connect. Instead received undefined',
        ),
      );
    });

    // TODO: Refactor this test. Regex way of matching values vary per browser
    // it('should throw an error if mapState, mapDispatch, or mergeProps returns anything but a plain object', () => {
    //   const store = createStore(() => ({}));
    //
    //   const makeContainer = (mapState, mapDispatch, mergeProps) =>
    //     createElement(
    //       connect(mapState, mapDispatch, mergeProps)(
    //         class Container extends Component {
    //           render() {
    //             return <Passthrough />;
    //           }
    //         }
    //       )
    //     );
    //
    //   function AwesomeMap() {}
    //
    //   let spyValue = '';
    //   // mapStateToProps
    //   const spy = spyOn(console, 'error').and.callFake(e => (spyValue = e));
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => 1, () => ({}), () => ({}))}</ProviderMock>);
    //
    //   const errorMsg = supportFnName
    //     ? /mapStateToProps\(\) in Connect\(Container\) must return a plain object/
    //     : /mapStateToProps\(\) in Connect\(Component\) must return a plain object/;
    //
    //   expect(spy.calls.count()).toBe(1);
    //   expect(spyValue).toMatch(errorMsg);
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => 'hey', () => ({}), () => ({}))}</ProviderMock>);
    //
    //   expect(spy.calls.count()).toBe(2);
    //   expect(spyValue).toMatch(errorMsg);
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => new AwesomeMap(), () => ({}), () => ({}))}</ProviderMock>);
    //
    //   expect(spy.calls.count()).toBe(3);
    //   expect(spyValue).toMatch(errorMsg);
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => ({}), () => 1, () => ({}))}</ProviderMock>);
    //
    //   const errorMsg2 = supportFnName
    //     ? /mapDispatchToProps\(\) in Connect\(Container\) must return a plain object/
    //     : /mapDispatchToProps\(\) in Connect\(Component\) must return a plain object/;
    //
    //   expect(spy.calls.count()).toBe(4);
    //   expect(spyValue).toMatch(errorMsg2);
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => ({}), () => 'hey', () => ({}))}</ProviderMock>);
    //
    //   expect(spy.calls.count()).toBe(5);
    //   expect(spyValue).toMatch(errorMsg2);
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => ({}), () => new AwesomeMap(), () => ({}))}</ProviderMock>);
    //
    //   expect(spy.calls.count()).toBe(6);
    //   expect(spyValue).toMatch(errorMsg2);
    //
    //   // mergeProps
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => ({}), () => ({}), () => 1)}</ProviderMock>);
    //
    //   const errorMsg3 = supportFnName
    //     ? /mergeProps\(\) in Connect\(Container\) must return a plain object/
    //     : /mergeProps\(\) in Connect\(Component\) must return a plain object/;
    //
    //   expect(spy.calls.count()).toBe(7);
    //   expect(spyValue).toMatch(errorMsg3);
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => ({}), () => ({}), () => 'hey')}</ProviderMock>);
    //
    //   expect(spy.calls.count()).toBe(8);
    //   expect(spyValue).toMatch(errorMsg3);
    //
    //   renderToContainer(<ProviderMock store={store}>{makeContainer(() => ({}), () => ({}), () => new AwesomeMap())}</ProviderMock>);
    //
    //   expect(spy.calls.count()).toBe(9);
    //   expect(spyValue).toMatch(errorMsg3);
    // });

    it('should recalculate the state and rebind the actions on hot update', () => {
      const store = createStore(() => {});

      const ContainerBefore = connect(null, () => ({ scooby: 'doo' }))(
        class ContainerBefore extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const ContainerAfter = connect(
        () => ({ foo: 'baz' }),
        () => ({ scooby: 'foo' }),
      )(
        class ContainerAfter extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const ContainerNext = connect(
        () => ({ foo: 'bar' }),
        () => ({ scooby: 'boo' }),
      )(
        class ContainerNext extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <ContainerBefore />
        </ProviderMock>,
      );

      const container = findRenderedVNodeWithType(
        tree,
        ContainerBefore,
      ).children;
      const stub = findRenderedVNodeWithType(tree, Passthrough).children;
      expect(stub.props.foo).toBeUndefined();
      expect(stub.props.scooby).toBe('doo');

      const imitateHotReloading = (TargetClass, SourceClass) => {
        // Crude imitation of hot reloading that does the job
        const fns = Object.getOwnPropertyNames(SourceClass.prototype).filter(
          (key) => typeof SourceClass.prototype[key] === 'function',
        );

        for (const key of fns) {
          if (key !== 'render' && key !== 'constructor') {
            TargetClass.prototype[key] = SourceClass.prototype[key];
          }
        }

        container.forceUpdate();
      };

      imitateHotReloading(ContainerBefore, ContainerAfter);
      expect(stub.props.foo).toBe('baz');
      expect(stub.props.scooby).toBe('foo');

      imitateHotReloading(ContainerBefore, ContainerNext);
      expect(stub.props.foo).toBe('bar');
      expect(stub.props.scooby).toBe('boo');
    });

    it('should set the displayName correctly', () => {
      expect(
        connect((state) => state)(
          class Foo extends Component {
            render() {
              return <div />;
            }
          },
        ).displayName,
      ).not.toEqual(undefined);
    });

    it('should expose the wrapped component as WrappedComponent', () => {
      class Container extends Component {
        render() {
          return <Passthrough />;
        }
      }

      const decorator = connect((state) => state);
      const decorated = decorator(Container);

      expect(decorated.WrappedComponent).toBe(Container);
    });

    it('should hoist non-react statics from wrapped component', () => {
      class Container extends Component {
        render() {
          return <Passthrough />;
        }
      }

      Container.howIsRedux = () => 'Awesome!';
      Container.foo = 'bar';

      const decorator = connect((state) => state);
      const decorated = decorator(Container);

      expect(typeof decorated.howIsRedux).toBe('function');
      expect(decorated.howIsRedux()).toBe('Awesome!');
      expect(decorated.foo).toBe('bar');
    });

    it('should use the store from the props instead of from the context if present', () => {
      class Container extends Component {
        render() {
          return <Passthrough />;
        }
      }

      let actualState;

      const expectedState = { foos: {} };
      const decorator = connect((state) => {
        actualState = state;
        return {};
      });

      const Decorated = decorator(Container);
      const mockStore = {
        dispatch: () => {},
        subscribe: () => {},
        getState: () => expectedState,
      };

      renderToContainer(<Decorated store={mockStore} />);
      expect(actualState).toBe(expectedState);
    });

    it('should throw an error if the store is not in the props or context', () => {
      class Container extends Component {
        render() {
          return <Passthrough />;
        }
      }

      const decorator = connect(() => {});
      const Decorated = decorator(Container);

      expect(() => renderToContainer(<Decorated />)).toThrow(
        new Error(
          'Could not find "store" in either the context or props of "Connect(Container)". Either wrap the root component in a <Provider>, or explicitly pass "store" as a prop to "Connect(Container)".',
        ),
      );
    });

    it('should throw when trying to access the wrapped instance if withRef is not specified', () => {
      const store = createStore(() => ({}));

      class Container extends Component {
        render() {
          return <Passthrough />;
        }
      }

      const decorator = connect((state) => state);
      const Decorated = decorator(Container);

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <Decorated />
        </ProviderMock>,
      );

      const decorated = findRenderedVNodeWithType(tree, Decorated).children;
      expect(() => decorated.getWrappedInstance()).toThrow(
        new Error(
          'To access the wrapped instance, you need to specify { withRef: true } in the options argument of the connect() call.',
        ),
      );
    });

    it('should return the instance of the wrapped component for use in calling child methods', () => {
      const store = createStore(() => ({}));

      const someData = {
        some: 'data',
      };

      class Container extends Component {
        someInstanceMethod() {
          return someData;
        }

        render() {
          return <Passthrough />;
        }
      }

      const decorator = connect((state) => state, null, null, {
        withRef: true,
      });
      const Decorated = decorator(Container);

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <Decorated />
        </ProviderMock>,
      );

      const decorated = findRenderedVNodeWithType(tree, Decorated).children;
      expect(() => decorated.someInstanceMethod()).toThrow();
      expect(decorated.getWrappedInstance().someInstanceMethod()).toEqual(
        someData,
      );
      expect(decorated.wrappedInstance.someInstanceMethod()).toBe(someData);
    });

    it('should wrap impure components without supressing updates', () => {
      const store = createStore(() => ({}));

      class ImpureComponent extends Component {
        render() {
          return <Passthrough statefulValue={this.context.statefulValue} />;
        }
      }

      const decorator = connect((state) => state, null, null, { pure: false });
      const Decorated = decorator(ImpureComponent);

      class StatefulWrapper extends Component {
        constructor() {
          super();
          this.state = { value: 0 };
        }

        getChildContext() {
          return {
            statefulValue: this.state.value,
          };
        }

        render() {
          return <Decorated />;
        }
      }

      const vNode = (
        <ProviderMock store={store}>
          <StatefulWrapper />
        </ProviderMock>
      );
      const tree = renderToContainer(vNode);

      const target = findRenderedVNodeWithType(tree, Passthrough).children;
      const wrapper = findRenderedVNodeWithType(tree, StatefulWrapper).children;
      expect(target.props.statefulValue).toBe(0);

      wrapper.setState({ value: 1 });
      renderToContainer(vNode);
      expect(target.props.statefulValue).toBe(1);
    });

    it('calls mapState and mapDispatch for impure components', () => {
      const store = createStore(() => ({
        foo: 'foo',
        bar: 'bar',
      }));

      let mapStateToPropsCalls = 0;
      let mapDispatchToPropsCalls = 0;

      class ImpureComponent extends Component {
        render() {
          return <Passthrough statefulValue={this.props.value} />;
        }
      }

      const decorator = connect(
        (state, { storeGetter }) => {
          mapStateToPropsCalls++;
          return { value: state[storeGetter.storeKey] };
        },
        () => {
          mapDispatchToPropsCalls++;
          return {};
        },
        null,
        { pure: false },
      );
      const Decorated = decorator(ImpureComponent);

      class StatefulWrapper extends Component {
        constructor() {
          super();
          this.state = {
            storeGetter: { storeKey: 'foo' },
          };
        }

        render() {
          return <Decorated storeGetter={this.state.storeGetter} />;
        }
      }

      const tree = renderToContainer(
        <ProviderMock store={store}>
          <StatefulWrapper />
        </ProviderMock>,
      );

      const target = findRenderedVNodeWithType(tree, Passthrough).children;
      const wrapper = findRenderedVNodeWithType(tree, StatefulWrapper).children;

      expect(mapStateToPropsCalls).toBe(2);
      expect(mapDispatchToPropsCalls).toBe(2);
      expect(target.props.statefulValue).toBe('foo');

      // Impure update
      const storeGetter = wrapper.state.storeGetter;
      storeGetter.storeKey = 'bar';
      wrapper.setState({ storeGetter });

      expect(mapStateToPropsCalls).toBe(3);
      expect(mapDispatchToPropsCalls).toBe(3);
      expect(target.props.statefulValue).toBe('bar');
    });

    it('should pass state consistently to mapState', () => {
      const store = createStore(stringBuilder);

      store.dispatch({ type: 'APPEND', payload: 'a' });
      let childMapStateInvokes = 0;

      const Container = connect((state) => ({ state }), null, null, {
        withRef: true,
      })(
        class Container extends Component {
          emitChange() {
            store.dispatch({ type: 'APPEND', payload: 'b' });
          }

          render() {
            return (
              <div>
                <button
                  ref={(btn) => {
                    this.button = btn;
                  }}
                  onClick={this.emitChange.bind(this)}
                >
                  change
                </button>
                <ChildContainer parentState={this.props.state} />
              </div>
            );
          }
        },
      );

      const ChildContainer = connect((state, parentProps) => {
        childMapStateInvokes++;

        // The state from parent props should always be consistent with the current state.
        expect(state).toBe(parentProps.parentState);
        return {};
      })(
        class ChildContainer extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      const tree = renderToContainer(vNode);

      expect(childMapStateInvokes).toBe(1);

      store.dispatch({ type: 'APPEND', payload: 'c' });
      renderToContainer(vNode);
      expect(childMapStateInvokes).toBe(2);

      const container = findRenderedVNodeWithType(tree, Container).children;
      const button = container.getWrappedInstance().button;
      button.click();
      renderToContainer(vNode);
      expect(childMapStateInvokes).toBe(3);

      store.dispatch({ type: 'APPEND', payload: 'd' });
      renderToContainer(vNode);
      expect(childMapStateInvokes).toBe(4);
    });

    it('should not render the wrapped component when mapState does not produce change', () => {
      const store = createStore(stringBuilder);
      let renderCalls = 0;
      let mapStateCalls = 0;

      const Container = connect(() => {
        mapStateCalls++;
        return {}; // no change!
      })(
        class Container extends Component {
          render() {
            renderCalls++;
            return <Passthrough {...this.props} />;
          }
        },
      );

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      renderToContainer(vNode);

      expect(renderCalls).toBe(1);
      expect(mapStateCalls).toBe(1);
      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);

      // After store a change mapState has been called
      expect(mapStateCalls).toBe(2);
      // But render is not because it did not make any actual changes
      expect(renderCalls).toBe(1);
    });

    it('should bail out early if mapState does not depend on props', () => {
      const store = createStore(stringBuilder);
      let renderCalls = 0;
      let mapStateCalls = 0;
      let setStateCalls = 0;

      const Container = connect((state) => {
        mapStateCalls++;
        return state === 'aaa' ? { change: 1 } : {};
      })(
        class Container extends Component {
          render() {
            renderCalls++;
            return <Passthrough {...this.props} />;
          }
        },
      );

      const oldSetState = Container.prototype.setState;
      Container.prototype.setState = function setState(...args) {
        setStateCalls++;
        oldSetState.apply(this, args);
      };

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      renderToContainer(vNode);

      expect(renderCalls).toBe(1);
      expect(mapStateCalls).toBe(1);

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(mapStateCalls).toBe(2);
      expect(renderCalls).toBe(1);
      expect(setStateCalls).toBe(0);

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(mapStateCalls).toBe(3);
      expect(renderCalls).toBe(1);
      expect(setStateCalls).toBe(0);

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);
      expect(mapStateCalls).toBe(4);
      expect(renderCalls).toBe(2);
      expect(setStateCalls).toBe(1);
    });

    it('should not swallow errors when bailing out early', () => {
      const store = createStore(stringBuilder);
      let renderCalls = 0;
      let mapStateCalls = 0;

      const Container = connect((state) => {
        mapStateCalls++;
        if (state === 'a') {
          throw new Error('Oops');
        } else {
          return {};
        }
      })(
        class Container extends Component {
          render() {
            renderCalls++;
            return <Passthrough {...this.props} />;
          }
        },
      );

      renderToContainer(
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>,
      );

      expect(renderCalls).toBe(1);
      expect(mapStateCalls).toBe(1);
      expect(() => store.dispatch({ type: 'APPEND', payload: 'a' })).toThrow(
        new Error('Oops'),
      );
    });

    it('should allow providing a factory function to mapStateToProps', () => {
      let updateCount = 0;
      let memoizedReturnCount = 0;
      const store = createStore(() => ({ value: 1 }));

      const mapStateFactory = () => {
        let lastProp;
        let lastVal;
        let lastResult;
        return (state, props) => {
          if (props.name === lastProp && lastVal === state.value) {
            memoizedReturnCount++;
            return lastResult;
          }

          lastProp = props.name;
          lastVal = state.value;
          lastResult = {
            someObject: { prop: props.name, stateVal: state.value },
          };
          return lastResult;
        };
      };

      const Container = connect(mapStateFactory)(
        class Container extends Component {
          componentWillUpdate() {
            updateCount++;
          }

          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      renderToContainer(
        <ProviderMock store={store}>
          <div>
            <Container name="a" />
            <Container name="b" />
          </div>
        </ProviderMock>,
      );

      store.dispatch({ type: 'test' });
      expect(updateCount).toBe(0);
      expect(memoizedReturnCount).toBe(2);
    });

    it('should allow a mapStateToProps factory consuming just state to return a function that gets ownProps', () => {
      const store = createStore(() => ({ value: 1 }));

      let initialState;
      let initialOwnProps;
      let secondaryOwnProps;
      const mapStateFactory = function (factoryInitialState) {
        initialState = factoryInitialState;
        initialOwnProps = arguments[1];
        return (state, props) => {
          secondaryOwnProps = props;
          return {};
        };
      };

      const Container = connect(mapStateFactory)(
        class Container extends Component {
          render() {
            return <Passthrough {...this.props} />;
          }
        },
      );

      const vNode = (
        <ProviderMock store={store}>
          <div>
            <Container name="a" />
          </div>
        </ProviderMock>
      );
      renderToContainer(vNode);

      store.dispatch({ type: 'test' });
      renderToContainer(vNode);
      expect(initialOwnProps).toBeUndefined();
      expect(initialState).toBeDefined();
      expect(secondaryOwnProps).toBeDefined();
      expect(secondaryOwnProps.name).toBe('a');
    });

    it('should allow providing a factory function to mapDispatchToProps', (done) => {
      let updatedCount = 0;
      let memoizedReturnCount = 0;
      const store = createStore(() => ({ value: 1 }));

      const mapDispatchFactory = () => {
        let lastProp;
        let lastResult;
        return (dispatch, props) => {
          if (props.name === lastProp) {
            memoizedReturnCount++;
            return lastResult;
          }

          lastProp = props.name;
          lastResult = { someObject: { dispatchFn: dispatch } };
          return lastResult;
        };
      };

      const mergeParentDispatch = (stateProps, dispatchProps, parentProps) => ({
        ...stateProps,
        ...dispatchProps,
        name: parentProps.name,
      });

      const Passthrough = connect(
        null,
        mapDispatchFactory,
        mergeParentDispatch,
      )(
        class Passthrough extends Component {
          componentWillUpdate() {
            updatedCount++;
          }

          render() {
            return <div />;
          }
        },
      );

      class Container extends Component {
        constructor(props) {
          super(props);
          this.state = { count: 0 };
        }

        componentDidMount() {
          this.setState({ count: 1 });
        }

        render() {
          const { count } = this.state;
          return (
            <div>
              <Passthrough count={count} name="a" />
              <Passthrough count={count} name="b" />
            </div>
          );
        }
      }
      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      renderToContainer(vNode);

      setTimeout(() => {
        store.dispatch({ type: 'test' });
        renderToContainer(vNode);
        expect(updatedCount).toBe(0);
        expect(memoizedReturnCount).toBe(2);
        done();
      }, 20);
    });

    it('should not call update if mergeProps return value has not changed', () => {
      let mapStateCalls = 0;
      let renderCalls = 0;
      const store = createStore(stringBuilder);

      const Container = connect(
        () => ({ a: ++mapStateCalls }),
        null,
        () => ({
          changed: false,
        }),
      )(
        class Container extends Component {
          render() {
            renderCalls++;
            return <Passthrough {...this.props} />;
          }
        },
      );

      const vNode = (
        <ProviderMock store={store}>
          <Container />
        </ProviderMock>
      );
      renderToContainer(vNode);

      expect(mapStateCalls).toBe(1);
      expect(renderCalls).toBe(1);

      store.dispatch({ type: 'APPEND', payload: 'a' });
      renderToContainer(vNode);

      expect(mapStateCalls).toBe(2);
      expect(renderCalls).toBe(1);
    });

    it('should update impure components with custom mergeProps', (done) => {
      const store = createStore(() => ({}));
      let renderCount = 0;

      const Container = connect(null, null, () => ({ a: 1 }), { pure: false })(
        class Container extends Component {
          render() {
            renderCount++;
            return <div />;
          }
        },
      );

      class Parent extends Component {
        componentDidMount() {
          this.forceUpdate();
        }

        render() {
          return <Container />;
        }
      }

      renderToContainer(
        <ProviderMock store={store}>
          <Parent>
            <Container />
          </Parent>
        </ProviderMock>,
      );

      expect(renderCount).toBe(1);

      setTimeout(() => {
        expect(renderCount).toBe(2);
        done();
      }, 20);
    });

    it('should allow to clean up child state in parent componentWillUnmount', () => {
      const reducer = (state = { data: null }, action) => {
        switch (action.type) {
          case 'fetch':
            return { data: { profile: { name: 'April' } } };
          case 'clean':
            return { data: null };
          default:
            return state;
        }
      };

      const Child = connect((state) => ({
        profile: state.data?.profile,
      }))(
        class Child extends Component {
          render() {
            return null;
          }
        },
      );

      const Parent = connect(null)(
        class Parent extends Component {
          componentWillMount() {
            this.props.dispatch({ type: 'fetch' });
          }

          componentWillUnmount() {
            this.props.dispatch({ type: 'clean' });
          }

          render() {
            return <Child />;
          }
        },
      );

      const store = createStore(reducer);
      const div = document.createElement('div');
      render(
        <ProviderMock store={store}>
          <Parent />
        </ProviderMock>,
        div,
      );

      unmountDOM(div);
      expect(store.getState().data).toEqual(null);
    });

    it('should allow custom displayName', () => {
      const MyComponent = connect(null, null, null, {
        getDisplayName: (name) => `Custom(${name})`,
      })(
        class MyComponent extends Component {
          render() {
            return <div />;
          }
        },
      );

      // This depends on minification, browser support, etc
      expect(MyComponent.displayName).not.toBe(undefined);
    });

    it('should update impure components whenever the state of the store changes', () => {
      const store = createStore(() => ({}));
      let renderCount = 0;

      const ImpureComponent = connect(() => ({}), null, null, { pure: false })(
        class ImpureComponent extends Component {
          render() {
            renderCount++;
            return <div />;
          }
        },
      );

      renderToContainer(
        <ProviderMock store={store}>
          <ImpureComponent />
        </ProviderMock>,
      );

      const rendersBeforeStateChange = renderCount;
      store.dispatch({ type: 'ACTION' });
      expect(renderCount).toBe(rendersBeforeStateChange + 1);
    });

    it('should throw a helpful error for invalid mapStateToProps arguments', () => {
      const InvalidMapState = connect('invalid')(
        class InvalidMapState extends Component {
          render() {
            return <div />;
          }
        },
      );

      const error = renderWithBadConnect(InvalidMapState);
      expect(error).toContain('string');
      expect(error).toContain('mapStateToProps');
      if (supportFnName) {
        expect(error).toContain('InvalidMapState');
      }
    });

    it('should throw a helpful error for invalid mapDispatchToProps arguments', () => {
      const InvalidMapDispatch = connect(
        null,
        'invalid',
      )(
        class InvalidMapDispatch extends Component {
          render() {
            return <div />;
          }
        },
      );

      const error = renderWithBadConnect(InvalidMapDispatch);
      expect(error).toContain('string');
      expect(error).toContain('mapDispatchToProps');
      if (supportFnName) {
        expect(error).toContain('InvalidMapDispatch');
      }
    });

    it('should throw a helpful error for invalid mergeProps arguments', () => {
      const InvalidMerge = connect(
        null,
        null,
        'invalid',
      )(
        class InvalidMerge extends Component {
          render() {
            return <div />;
          }
        },
      );

      const error = renderWithBadConnect(InvalidMerge);
      expect(error).toContain('string');
      expect(error).toContain('mergeProps');
    });

    it('should notify nested components through a blocking component', () => {
      const store = createStore((state = 0, action) =>
        action.type === 'INC' ? state + 1 : state,
      );

      let mapStateCalls = 0;
      const mapStateToProps = (state) => {
        mapStateCalls++;
        return { count: state };
      };

      const Child = connect(mapStateToProps)(
        class Child extends Component {
          render() {
            return <div>{this.props.count}</div>;
          }
        },
      );

      class BlockUpdates extends Component {
        shouldComponentUpdate() {
          return false;
        }

        render() {
          return this.props.children;
        }
      }

      const Parent = connect((state) => ({ count: state }))(
        class Parent extends Component {
          render() {
            return (
              <BlockUpdates>
                <Child />
              </BlockUpdates>
            );
          }
        },
      );

      const vNode = (
        <ProviderMock store={store}>
          <Parent />
        </ProviderMock>
      );
      renderToContainer(vNode);

      expect(mapStateCalls).toBe(1);
      store.dispatch({ type: 'INC' });
      renderToContainer(vNode);
      expect(mapStateCalls).toBe(2);
    });

    it('should subscribe properly when a middle connected component does not subscribe', () => {
      const store = createStore((state = 0, action) =>
        action.type === 'INC' ? state + 1 : state,
      );

      const C = connect((state, props) => {
        expect(props.count).toBe(state);
        return { count: state * 10 + props.count };
      })(
        class C extends Component {
          render() {
            return <div>{this.props.count}</div>;
          }
        },
      );

      // no mapStateToProps. therefore it should be transparent for subscriptions
      const B = connect()(
        class B extends Component {
          render() {
            return <C {...this.props} />;
          }
        },
      );

      const A = connect((state) => ({ count: state }))(
        class A extends Component {
          render() {
            return <B {...this.props} />;
          }
        },
      );

      renderToContainer(
        <ProviderMock store={store}>
          <A />
        </ProviderMock>,
      );

      store.dispatch({ type: 'INC' });
    });

    it('should subscribe properly when a new store is provided via props', () => {
      const store1 = createStore((state = 0, action) =>
        action.type === 'INC' ? state + 1 : state,
      );
      const store2 = createStore((state = 0, action) =>
        action.type === 'INC' ? state + 1 : state,
      );

      const A = connect((state) => ({ count: state }))(
        class A extends Component {
          render() {
            return <B store={store2} />;
          }
        },
      );

      const mapStateToPropsB = jasmine.createSpy((state) => ({ count: state }));
      const B = connect(mapStateToPropsB)(
        class B extends Component {
          render() {
            return <C {...this.props} />;
          }
        },
      );

      const mapStateToPropsC = jasmine.createSpy((state) => ({ count: state }));
      const C = connect(mapStateToPropsC)(
        class C extends Component {
          render() {
            return <D />;
          }
        },
      );

      const mapStateToPropsD = jasmine.createSpy((state) => ({ count: state }));
      const D = connect(mapStateToPropsD)(
        class D extends Component {
          render() {
            return <div>{this.props.count}</div>;
          }
        },
      );

      const vNode = (
        <ProviderMock store={store1}>
          <A />
        </ProviderMock>
      );
      renderToContainer(vNode);

      expect(mapStateToPropsB).toHaveBeenCalledTimes(1);
      expect(mapStateToPropsC).toHaveBeenCalledTimes(1);
      expect(mapStateToPropsD).toHaveBeenCalledTimes(1);

      store1.dispatch({ type: 'INC' });
      renderToContainer(vNode);
      expect(mapStateToPropsB).toHaveBeenCalledTimes(1);
      expect(mapStateToPropsC).toHaveBeenCalledTimes(1);
      expect(mapStateToPropsD).toHaveBeenCalledTimes(2);

      store2.dispatch({ type: 'INC' });
      renderToContainer(vNode);
      expect(mapStateToPropsB).toHaveBeenCalledTimes(2);
      expect(mapStateToPropsC).toHaveBeenCalledTimes(2);
      expect(mapStateToPropsD).toHaveBeenCalledTimes(2);
    });
  });
});
