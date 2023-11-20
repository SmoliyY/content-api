import React from 'react';
import SingleRepository from '../RepositoryItem/RepositoryItem'
import {ITEMS_PER_PAGE} from '../../global/constants'
import styled from 'styled-components';


const RepositoryListsWrapper = styled.div`
      display: flex;
      flex-direction: column;
`;

const RepositoryLists = (props) => {
  const {list, page} = props;

  const listPerPage = (page) => list.slice(((page * ITEMS_PER_PAGE) - ITEMS_PER_PAGE), page * ITEMS_PER_PAGE);

  return (
    <RepositoryListsWrapper>
    {list === [] ? <div>List is empty</div> :
      <>
        {listPerPage(page).map((item) => <SingleRepository key={item.id} props={item}/>)}
      </>
    }
  </RepositoryListsWrapper>)
}

export default RepositoryLists;
