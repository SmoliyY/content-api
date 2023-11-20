import * as React from 'react';

export function CustomFetchComponent() {
    const [ result, setResult ] = React.useState(null);
    const [ error, setError ] = React.useState(null);

    async function handleFetch() {

        try {
          const fetchedResult = await fetch('https://api.agify.io?name=michael');
          if (!fetchedResult.ok) {
              setError('Ups something wrong');
          }
          const result = await fetchedResult.json()
          setResult(result?.name || 'OPPS' );

        }
        catch (e) {
            setError(e)
        }
    }

    function handleClick () {
        handleFetch()
    }

    return (
            <div>
                {result && <div>Result : {result} </div>}
                {error && <div>Something going wrong!</div>}
                <button onClick={handleClick} >Fetch DATA</button>
            </div>
        )

}

