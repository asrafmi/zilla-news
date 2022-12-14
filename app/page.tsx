import React from 'react'
import { categories } from '../constants'
import fetchNews from '../lib/fetchNews'
import NewsList from './NewsList'
import response from '../response.json'

async function Homepage() {
  const news: NewsResponse = await fetchNews(categories.join(","))
  
  return (
    <div className='Homepage'>
      <NewsList news={news} />
    </div>
  )
}

export default Homepage
