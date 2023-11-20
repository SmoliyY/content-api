
//Ideally here we store our main wrapped API calls and functions
export const fetchApi = async()=>  {

  const response = await fetch('https://api.github.com/users/a8m/repos?per_page=100');
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return await response.json()
};

