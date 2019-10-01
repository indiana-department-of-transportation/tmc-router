/**
 * AuthOnlyRoute.js
 *
 * @description Tests for the AuthOnlyRoute component.
 * @author jarsmith@indot.in.gov
 * @license MIT
 */

import 'jsdom-global/register';
import React from 'react';

import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import { Route, MemoryRouter as Router } from 'react-router-dom';

import AuthOnlyRoute from './authonly';

Enzyme.configure({ adapter: new Adapter() });

const defaultUser = {
  user_name: '',
  user_id: null,
  roles: [],
  token: null,
  ts: null,
};

describe('AuthOnlyRoute', () => {
  it('should render without crashing', () => {
    shallow(
      <Router>
        <AuthOnlyRoute
          exact
          path="/"
          user={defaultUser}
          roles={['a']}
          render={() => "Hello world"}
        />
      </Router>
    );
  });

  it('should return a redirect if there is no user token', () => {
    const wrapper = mount(
      <Router>
        <AuthOnlyRoute
          exact
          path="/"
          user={defaultUser}
          roles={['a']}
          render={() => <div id="goodbye">Adios</div>}
        />
        <Route exact path="/login"><div id="hello">Hola</div></Route>
      </Router>
    );

    expect(wrapper.find('div').length).toBe(1);
    const hello = wrapper.find('#hello');
    const goodbye = wrapper.find('#goodbye');
    expect(hello.length).toBe(1);
    expect(goodbye.length).toBe(0);
  });

  it('should render the route if there is a user token', () => {
    const validUser = {
      user_name: 'foobar',
      user_id: 12,
      roles: ['test'],
      token: '123ABC',
      ts: new Date(),
    };

    const wrapper = mount(
      <Router>
        <AuthOnlyRoute
          exact
          path="/"
          user={validUser}
          roles={['test']}
          render={() => <div id="goodbye">Adios</div>}
        />
        <Route exact path="/login"><div id="hello">Hello</div></Route>
      </Router>
    );

    const hello = wrapper.find('#hello');
    const goodbye = wrapper.find('#goodbye');
    expect(goodbye.length).toBe(1);
    expect(hello.length).toBe(0);
  });
});
