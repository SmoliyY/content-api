import React from 'react';
import Button from '@material-ui/core/Button';

const PaginationBlock = ({handlePrevPage, handleNextPage, currentPage, listLength}) => {
  return (
    <div>
      <Button size='medium' color='default' onClick={handlePrevPage} disabled={currentPage <= 1}>
        Prev
      </Button>
      <Button size='medium' color='default' onClick={handleNextPage} disabled={((currentPage) * 10) >= listLength}>
        Next
      </Button>
    </div>)
}

export default PaginationBlock;
