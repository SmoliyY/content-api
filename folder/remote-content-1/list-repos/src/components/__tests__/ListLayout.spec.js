import React from 'react';

import {shallow} from 'enzyme'
import ListLayout from '../ListLayout';
import RepositoryLists from '../RepositoryList/RepositoryList'


describe('ListLayout',() => {
  let wrapper;

  beforeEach(()=>{
    wrapper = shallow(<ListLayout/>);
  })

  afterEach(()=>{
    wrapper =null;
  });

  it('should render ListLayout  ', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find(RepositoryLists)).toHaveLength(1)
  })

});
