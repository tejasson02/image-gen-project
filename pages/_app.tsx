import React, { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import getConfig from 'next/config';
import './App.css';
import './App.scss';

const IMAGE_SIZE = '512x512';
const LOADING_TEXT = 'Creating Image... 🤪 Please Wait... 😅';

const App = () => {
  const [result, setResult] = useState('https://cdn.pixabay.com/photo/2016/03/21/20/05/image-1271454_1280.png');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState('');

  const { publicRuntimeConfig } = getConfig();
  const apiKey =
    typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.apiKey
      ? publicRuntimeConfig.apiKey
      : process.env.API_KEY;
  if (!apiKey) {
    throw new Error('apiKey is not defined in the config file');
  }

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setLoading(true);
    setTypedText('');
    setResult('');

    const res = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: IMAGE_SIZE,
    });

    setLoading(false);
    const data = res.data;
    setResult(data.data[0].url || 'no image found');
  };

  useEffect(() => {
    if (loading) {
      let i = 0;
      const typing = setInterval(() => {
        setTypedText(LOADING_TEXT.slice(0, i));
        i++;
        if (i > LOADING_TEXT.length + 1) {
          i = 0;
          setTypedText('');
        }
      }, 100);
      return () => clearInterval(typing);
    }
  }, [loading]);

  return (
    <div className="app-main">
      <div className="stars">
        {[...Array(200)].map((_, index) => (
          <div
            className="star"
            key={index}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
      <h2>Create Images With Your Imagination</h2>
      <textarea
        className="app-input"
        placeholder="Create any type of image you can think of with as much added description as you would like"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateImage} disabled={loading || prompt.trim() === ''}>
        Generate Image
      </button>
      {loading ? (
        <>
          <h3>{typedText}</h3>
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </>
      ) : result ? (
        <div className="result-container">
          <img src={result} className="result-image" alt="result" />
        </div>
      ) : (
        <p className="no-result-text">No image found. Please try again.</p>
      )}
    </div>
  );
};

export default App;