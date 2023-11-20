import React, {useEffect, useState, Suspense} from 'react';
import Input from '@material-ui/core/Input/Input';
import {fetchApi} from '../global/APIs'
import RepositoryLists from './RepositoryList/RepositoryList';
import PaginationBlock from './PaginationBlock/PaginationBlock';


const ListLayout = () => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setPage] = useState(1);

  useEffect(() => {
    getList()
  }, []);

  const getList = async () => {
    try {
      const result = await fetchApi();
      setList(result);
      setError(false);
    } catch (e) {
      setError(true);
    }
  };

  const handleNextPage = () => setPage(currentPage + 1);
  const handlePrevPage = () => setPage(currentPage - 1);

  //Ideally should filter by API but I did'nt find query for this in githubAPI;
  const filterList = (items, filterCriteria) => {
    return items.filter(item => (item?.language?.toUpperCase() || '').indexOf(filterCriteria.toUpperCase()) !== -1);
  };

  const handleSearch = (e) => {

    setSearchValue(e.target.value);
    setPage(1);

    if (e.target.value) {
      setList(filterList(list, searchValue))
    } else {
      getList();
    }
  };


  return (
    <div className="App">
      <Input style={{margin: '10px'}} onChange={handleSearch} placeholder='Filter by Language' fullWidth={true}/>
      {
        error ? <>
            <h1>
              Something went wrong
            </h1>
          </> :
          <>
            <Suspense fallback={<h1>Loading</h1>}>
              <RepositoryLists list={list} page={currentPage}/>
              <PaginationBlock
                currentPage={currentPage}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                listLength={list.length}
              />
            </Suspense>
          </>}
    </div>
  );

}

export default ListLayout;
