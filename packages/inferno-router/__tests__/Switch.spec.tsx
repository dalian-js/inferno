import { render, rerender, Component } from 'inferno';
import { MemoryRouter, Redirect, Route, Switch } from 'inferno-router';
import { type IRouteProps } from '../src/Route';

describe('Switch (jsx)', () => {
  it('renders the first <Route> that matches the URL', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Route path="/one" render={() => <h1>one</h1>} />
          <Route path="/two" render={() => <h1>two</h1>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).toMatch(/one/);
  });

  it('renders the first <Redirect from> that matches the URL', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/three']}>
        <Switch>
          <Route path="/one" render={() => <h1>one</h1>} />
          <Redirect from="/four" to="/one" />
          <Redirect from="/three" to="/two" />
          <Route path="/two" render={() => <h1>two</h1>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    rerender();

    expect(node.innerHTML).toMatch(/two/);
  });

  it('does not render a second <Route> or <Redirect> that also matches the URL', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Route path="/one" render={() => <h1>one</h1>} />
          <Redirect from="/one" to="/two" />
          <Route path="/one" render={() => <h1>two</h1>} />
          <Route path="/two" render={() => <h1>two</h1>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).not.toMatch(/two/);
  });

  it('renders pathless Routes', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/cupcakes']}>
        <Switch>
          <Route path="/bubblegum" render={() => <div>one</div>} />
          <Route render={() => <div>two</div>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).not.toContain('one');
    expect(node.innerHTML).toContain('two');
  });

  it('handles from-less Redirects', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/cupcakes']}>
        <Switch>
          <Route path="/bubblegum" render={() => <div>bub</div>} />
          <Redirect to="/bubblegum" />
          <Route path="/cupcakes" render={() => <div>cup</div>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    rerender();

    expect(node.innerHTML).not.toContain('cup');
    expect(node.innerHTML).toContain('bub');
  });

  it('handles subsequent redirects', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Redirect exact from="/one" to="/two" />
          <Redirect exact from="/two" to="/three" />

          <Route path="/three" render={() => <div>three</div>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    rerender();

    expect(node.textContent).toBe('three');
  });

  it('warns when redirecting to same route, both strings', () => {
    const node = document.createElement('div');
    const redirected = false;
    let done = false;

    const consoleErrSpy = spyOn(console, 'error');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Route
            path="/one"
            render={() => {
              if (done) return <h1>done</h1>;

              if (!redirected) {
                return <Redirect to="/one" />;
              }
              done = true;

              return <Redirect to="/one" />;
            }}
          />
        </Switch>
      </MemoryRouter>,
      node,
    );

    rerender();

    expect(node.innerHTML).not.toContain('done');
    expect(consoleErrSpy.calls.count()).toBe(1);
    expect(consoleErrSpy.calls.argsFor(0)[0]).toContain('/one');
  });

  it('warns when redirecting to same route, mixed types', () => {
    const node = document.createElement('div');
    let redirected = false;
    let done = false;

    const consoleErrSpy = spyOn(console, 'error');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Route
            path="/one"
            render={() => {
              if (done) return <h1>done</h1>;

              if (!redirected) {
                redirected = true;
                return <Redirect to="/one" />;
              }
              done = true;

              return <Redirect to={{ pathname: '/one' }} />;
            }}
          />
        </Switch>
      </MemoryRouter>,
      node,
    );

    rerender();

    expect(node.innerHTML).not.toContain('done');
    expect(consoleErrSpy.calls.count()).toBe(1);
    expect(consoleErrSpy.calls.argsFor(0)[0]).toContain('/one');
  });

  it('warns when redirecting to same route, mixed types, string with query', () => {
    const node = document.createElement('div');
    let redirected = false;
    let done = false;

    const consoleErrSpy = spyOn(console, 'error');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Route
            path="/one"
            render={() => {
              if (done) return <h1>done</h1>;

              if (!redirected) {
                redirected = true;
                return <Redirect to="/one?utm=1" />;
              }
              done = true;

              return <Redirect to={{ pathname: '/one', search: '?utm=1' }} />;
            }}
          />
        </Switch>
      </MemoryRouter>,
      node,
    );

    rerender();

    expect(node.innerHTML).not.toContain('done');
    expect(consoleErrSpy.calls.count()).toBe(1);
    expect(consoleErrSpy.calls.argsFor(0)[0]).toContain('/one?utm=1');
  });

  it('does NOT warn when redirecting to same route with different `search`', () => {
    const node = document.createElement('div');
    let redirected = false;
    let done = false;

    const consoleErrSpy = spyOn(console, 'error');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Route
            path="/one"
            render={() => {
              if (done) return <h1>done</h1>;

              if (!redirected) {
                redirected = true;
                return <Redirect to={{ pathname: '/one', search: '?utm=1' }} />;
              }
              done = true;

              return <Redirect to={{ pathname: '/one', search: '?utm=2' }} />;
            }}
          />
        </Switch>
      </MemoryRouter>,
      node,
    );

    rerender();

    expect(node.innerHTML).toContain('done');
    expect(consoleErrSpy.calls.count()).toBe(0);
  });

  it('handles comments', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/cupcakes']}>
        <Switch>
          <Route path="/bubblegum" render={() => <div>bub</div>} />
          {/* this is a comment */}
          <Route path="/cupcakes" render={() => <div>cup</div>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).not.toContain('bub');
    expect(node.innerHTML).toContain('cup');
  });

  it('renders with non-element children', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch>
          <Route path="/one" render={() => <h1>one</h1>} />
          {false}
          {undefined}
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).toMatch(/one/);
  });

  it('throws with no <Router>', () => {
    const node = document.createElement('div');
    expect(() => {
      render(
        <Switch>
          <Route path="/one" render={() => <h1>one</h1>} />
          <Route path="/two" render={() => <h1>two</h1>} />
        </Switch>,
        node,
      );
    }).toThrow(new Error('You should not use <Switch> outside a <Router>'));
  });

  it('matches and renders array children correctly', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/bubblegum']}>
        <Switch>
          <Route path="/ice-cream" render={() => <div>beb</div>} />
          {[<Route path="/bubblegum" render={() => <div>bub</div>} />]}
          <Route path="/cupcakes" render={() => <div>cup</div>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).not.toContain('beb');
    expect(node.innerHTML).toContain('bub');
    expect(node.innerHTML).not.toContain('cup');
  });

  it('matches and renders children in nested arrays correctly', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/bubblegum']}>
        <Switch>
          {[[<Route path="/ice-cream" render={() => <div>beb</div>} />]]}
          {[
            <Route path="/something" render={() => <div>bab</div>} />,
            <Route path="/something-else" render={() => <div>bib</div>} />,
            [<Route path="/bubblegum" render={() => <div>bub</div>} />],
          ]}
          <Route path="/cupcakes" render={() => <div>cup</div>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).toContain('bub');
    expect(node.innerHTML).not.toContain('beb');
    expect(node.innerHTML).not.toContain('bab');
    expect(node.innerHTML).not.toContain('bib');
    expect(node.innerHTML).not.toContain('cup');
  });

  // TODO: This will not work because component is not mandatory
  it('Should allow using component child parameter as result, Github #1601', () => {
    const node = document.createElement('div');

    class Component1 extends Component<any, any> {
      public state = { foo: 0 };
      constructor(p, s) {
        super(p, s);

        this.state.foo = 1;
      }

      public render() {
        return <div>Component</div>;
      }
    }

    const routes: IRouteProps[] = [
      {
        component: Component1,
        exact: true,
        path: `/`,
      },
    ];

    render(
      <MemoryRouter initialEntries={['/bubblegum']}>
        <Switch>
          {routes.map(({ path, exact, component: Comp, ...rest }) => (
            <Route
              key={path}
              path={path}
              exact={exact}
              render={(props) => <Component1 {...props} {...rest} />}
            />
          ))}
        </Switch>
      </MemoryRouter>,
      node,
    );
  });
});

describe('A <Switch location>', () => {
  it('can use a `location` prop instead of `router.location`', () => {
    const node = document.createElement('div');

    render(
      <MemoryRouter initialEntries={['/one']}>
        <Switch location={{ pathname: '/two' }}>
          <Route path="/one" render={() => <h1>one</h1>} />
          <Route path="/two" render={() => <h1>two</h1>} />
        </Switch>
      </MemoryRouter>,
      node,
    );

    expect(node.innerHTML).toMatch(/two/);
  });

  describe('children', () => {
    it('passes location prop to matched <Route>', () => {
      const node = document.createElement('div');

      let propLocation;
      const RouteHoneytrap = (props) => {
        propLocation = props.location;
        return <Route {...props} />;
      };

      const switchLocation = { pathname: '/two' };
      render(
        <MemoryRouter initialEntries={['/one']}>
          <Switch location={switchLocation}>
            <Route path="/one" render={() => <h1>one</h1>} />
            <RouteHoneytrap path="/two" render={() => <h1>two</h1>} />
          </Switch>
        </MemoryRouter>,
        node,
      );
      expect(propLocation).toEqual(switchLocation);
    });
  });
});
