import express, { response } from "express";
import {OpenAI} from "openai";
import Replicate from "replicate";
import axios from 'axios';
import cors from "cors";

import 'dotenv/config';

const app = express();
const port = 8000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
const replicate = new Replicate({
  auth: process.env.STABLEDIFFUSION_API_KEY,
});

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.use(cors({
  origin: 'http://localhost:3001'
}));


app.get('/image', async (req,res) => {
  console.log("got request for /image")
  const {prompt} = req.query;
  try{
  const output = await replicate.run(
    "stability-ai/stable-diffusion:d70beb400d223e6432425a5299910329c6050c6abcf97b8c70537d6a1fcb269a",
    {
      input: {
        prompt: prompt,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    }
  );
  console.log("got an output: ", output)
  res.json({imageURL: output})
  }
  catch(e){
    console.log("error in /image: ", e)
  }
})

app.get('/chat', async (req, res) => {
  console.log("hit chat endpoint")
  try{
    const {message} = req.query;
    
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Give me a detailed write up of a thumbnail based off of this description ${message}` }],
      temperature: 0,
      max_tokens: 50,
    });
    console.log("suggested thumbnail description: ", chatResponse)
    const responseText = chatResponse.choices[0].message.content
    console.log("suggested thumbnail description: ", responseText)
    const stableDiffusionResponse = await axios.get(`http://localhost:8000/image?prompt=${responseText}`)
    console.log("stableDiffusionResponse: ", stableDiffusionResponse.data.imageURL[0])
    res.json({imageURL: stableDiffusionResponse.data.imageURL[0]})
  }
  catch(e){
    console.log("error in /chat: ", e);
  }
});

app.listen(port, () => {
  console.log(`auth: ${process.env.STABLEDIFFUSION_API_KEY}`)
  console.log(`Server is running on port ${port}`);
});