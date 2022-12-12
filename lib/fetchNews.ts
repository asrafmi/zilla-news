import { gql } from "graphql-request"
import sortNewsByImage from "./sortNewsByImage";

const fetchNews = async (
    category?: Category | string,
    keywords?: string,
    isDynamic?: boolean
) => {
    // GraphQL Query
    const query = gql`
    query MyQuery(
        $access_key: String!
        $categories: String!
        $keywords: String
    )   {
        myQuery(
            access_key: $access_key
            categories: $categories
            countries: "gb"
            sort: "published_desc"
            keywords: $keywords
        ) {
        data {
            author
            category
            country
            description
            image
            language
            published_at
            source
            title
            url
        }
        pagination {
            count
            limit
            offset
            total
        }
        }
    }
    `;
    // Fetch function w/ nextjs 13
    const res = await fetch('https://arauca.stepzen.net/api/broken-wolverine/__graphql', {
        method: 'POST',
        cache: isDynamic ? "no-cache" : "default",
        next: isDynamic ? { revalidate: 0 } : { revalidate: 20 },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`
        },
        body: JSON.stringify({
            query,
            variables: {
                access_key:process.env.MEDIASTACK_API_KEY,
                categories: category,
                keywords: keywords
            }
        })
    })

    console.log("LOADING NEW DATA FROM API >>>",category, keywords);
    
    const newsResponse = await res.json()

    // Sort function by images vs not images present
    const news = sortNewsByImage(newsResponse.data.myQuery)

    // return res
    return news
}

export default fetchNews
// const mediaStackUrl = `http://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_API_KEY}&sources=business,sports`
// stepzen import curl http://api.mediastack.com/v1/news?access_key=2f65b678b79cce917d5f6c9c120475cb