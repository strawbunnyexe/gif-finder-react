import './App.css';
import { useEffect, useState, useMemo } from 'react';
import { getData } from './ajax.js';
import { readFromLocalStorage, writeToLocalStorage } from './storage.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import GifGallery from './components/GifGallery.jsx';

//TO DO
// Get local storage working
// Refactor components

function App() {
  const GIPHY_KEY = "fBi5Q6X5qeSHkNA2C0a2V1CRAotgOxiL";
  const savedTerm = useMemo(() => readFromLocalStorage("term") || "", []);

  const [searchTerm, setSearchTerm] = useState(savedTerm);
  const [status, setStatus] = useState("Ready to search!");
  const [selectedLimit, setLimit] = useState(25);
  const [results, setResults] = useState([]);
  const [searchIndex, setIndex] = useState(0);
  const [baseurl, setUrl] = useState(`https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}`);

  //Search Button - search for gifs with a term
  const searchButtonClicked = () => {
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?"
    //reset the index
    setIndex(0);

    //display message if user doesn't input term
    if (searchTerm.trim() === "") {
      setStatus(`Please enter a search term!`);
      return;
    }

    setStatus(`Searching for ${searchTerm}`);

    setUrl(`${GIPHY_URL}api_key=${GIPHY_KEY}&q=${searchTerm.trim()}&limit=${selectedLimit}`);
    getData(`${GIPHY_URL}api_key=${GIPHY_KEY}&q=${searchTerm.trim()}}&limit=${selectedLimit}`, dataLoaded);

    //Update the status
    setStatus(`Success! Here are ${selectedLimit} results for "${searchTerm.trim()}"!`);
  };

  //adjust the index when next button is clicked
  const nextButtonClicked = () => {
    //set index for new gifs
    let newIndex = searchIndex;
    //check if index is in bounds
    if (!(searchIndex + selectedLimit > 4999)) {
      newIndex = searchIndex + selectedLimit;
      setIndex(newIndex);
    }

    //get new gifs
    getData(`${baseurl}&offset=${newIndex}`, dataLoaded);
  };

  //adjust the index when previous button is clicked
  const previousButtonClicked = () => {
    //set index for new gifs
    let newIndex = searchIndex;
    //check for valid index
    if (!(searchIndex - selectedLimit < 0)) {
      newIndex = searchIndex - selectedLimit;
      setIndex(newIndex);
    }

    //get new gifs
    getData(`${baseurl}&offset=${newIndex}`, dataLoaded);
  };

  const trendingItems = () => {
    //url for trending gifs
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/trending?"

    //reset index
    setIndex(0);

    //update status
    setStatus("Success! Here is what is trending!");

    setUrl(`${GIPHY_URL}api_key=${GIPHY_KEY}&limit=${selectedLimit}`);
    //get gifs
    getData(`${GIPHY_URL}api_key=${GIPHY_KEY}&limit=${selectedLimit}`, dataLoaded);
  };

  const dataLoaded = e => {
    //parse string into object
    let obj = JSON.parse(e.target.responseText);

    //if there are no results, print a message and return
    if (!obj.data || obj.data.length === 0) {
      setStatus(`No results found!`);
      setResults([]);
      return;
    }

    // set results
    setResults(obj.data);
  };

  useEffect(() => {
    // Fetch GIFs when the page loads
    getData(`${baseurl}&limit=${selectedLimit}&offset=${searchIndex}`, dataLoaded);
  }, [searchIndex, baseurl, selectedLimit]);

  useEffect(() => {
    writeToLocalStorage("term", searchTerm);
  }, [searchTerm]);

  return (
    <>
      {/* Form */}
      <div id="form">
        <Header title={"Gif Finder"} />

        <div id="container">

          <div className="widget">
            <h2>Search:</h2>
            <input list="previous-searches" id="search-input" type="text" size="20" maxLength="20" value={searchTerm} onChange={e => { setSearchTerm(e.target.value) }} />
            <datalist id="previous-searches">
            </datalist>
          </div>

          <div className="widget">
            <h2>Limit:</h2>
            <select id="limit-select" defaultValue={25} onChange={e => { setLimit(Number(e.target.value)) }}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <button type="button" id="search-btn" onClick={searchButtonClicked}>Search!</button>

          <button type="button" id="trending-btn" onClick={trendingItems}>Trending</button>

        </div>


        <div id="status">
          {status}
        </div>

      </div>


      {/* GIF Gallery */}
      <div id="gallery">

        <div className="pageBtns">
          <button type="button" id="previous-btn" onClick={previousButtonClicked}>Previous</button>
          <button type="button" id="next-btn" onClick={nextButtonClicked}>Next</button>
        </div>

        <GifGallery gifs={results} />
      </div>

      <Footer
        name="Jennifer Pichardo"
        year={new Date().getFullYear()}
      />
    </>
  );
}

export default App;
