import React from 'react';
import SingleRepository from '../RepositoryItem'

import {shallow} from "enzyme";


describe('SingleRepository', () => {
  let wrapper;
  let props;


  beforeEach(() => {
    wrapper = (aditionalProps) => {
      props = {
        name: 'Name',
        description: 'Desc',
        language: 'Go',
        html_url: 'some url',
        ...aditionalProps
      };

      return shallow(<SingleRepository props={props}/>)
    }
  })

  afterEach(() => {
    wrapper = null;
    props = null;
  })

  it('expect wrapper to exist', () => {
    expect(wrapper()).toHaveLength(1)
  })

  it('expect to language Go', () => {
    expect(wrapper().find('[data-testid="language-wrapper"]').text()).toEqual('Go')
  })

  it('expect to no language cause no such props', () => {
    expect(wrapper({language: null}).find('[data-testid="language-wrapper"]').text()).toEqual('Language is not provided')
  })

  it('expect to be with description', () => {
    expect(wrapper().find('[data-testid="description-wrapper"]').text()).toEqual('Description : Desc')
  })

  it('expect to be with description', () => {
    expect(wrapper({description: null}).find('[data-testid="description-wrapper"]').text()).toEqual('Description is not provided')
  })
})
