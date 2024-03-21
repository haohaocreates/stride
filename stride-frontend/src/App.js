import './App.css';
import axios from 'axios';
import {useState} from 'react';


const App = () => {

  const [value, setValue] = useState('');
  const [imageUrl, setImageUrl] = useState(``)

  const onChange = (e) => {
    setValue(e.target.value);
  }

  const getPrompts = async () => {
    try{
    const res = await axios.get(`http://localhost:8000/chat?message=${value}`);
    console.log("response: ", res)
    console.log("image url: ", res.data.imageURL[0]);
      setImageUrl(res.data.imageURL);
      console.log("we got a url: ", res.data.imageURL[0]);
    }
    catch(e){
      console.log("Get Prompts Error: ", e)
    }
  };

  return (
    <div>
      <header>
        <p>
          <button onClick={getPrompts}>
          Stride
          </button>
          <input value={value} onChange={onChange} />
          {imageUrl ? (
        <img src={imageUrl} />
      ) : (
        <p>Loading...</p>
      )}
        </p>
      </header>
    </div>
  );
}

export default App;
