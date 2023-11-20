import React from 'react';
import styled from 'styled-components';
import {handleColor} from '../../helper/colorPickerForRepo'


const SingleRepositoryWrapper = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  font-weight: normal;
  font-size:14px;
  
  :hover{
  background: ghostwhite;
  cursor: pointer;
  }
`;

const RepoInfoWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   span:first-child {
   font-size: 16px;
   color: black;
    label{
     color:slategray;
     }
   }
`;

const DescriptionWrapper = styled.div`
  color: black;
  font-weight: bold;
  span { 
  color:grey;
  }
`;

const LanguageWrapper = styled.span`
  color: ${({item}) => handleColor(item)};
`;

const SingleRepository = ({props}) => {

  const {name, description, language, html_url} = props;

  return (
    <SingleRepositoryWrapper>
      <RepoInfoWrapper>
        <span>
          Repo: <label>{name}</label>
        </span>
        <LanguageWrapper data-testid='language-wrapper' item={language}>
          {language ?? 'Language is not provided'}
        </LanguageWrapper>
      </RepoInfoWrapper>
      <DescriptionWrapper data-testid='description-wrapper'>
        {description ? `Description : ${description}`: <span>Description is not provided</span> }
      </DescriptionWrapper>
      <a href={html_url} target='_blank'>Link to git Repo</a>
    </SingleRepositoryWrapper>
  )
};
export default SingleRepository;
