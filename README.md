# bilibili-api
API helper to get info from bilibili.com


## Installation

```
npm install @lawchihon/bilibili-api
```

## Peer Dependencies
- [@johman/helper](https://www.npmjs.com/package/@johman/helper): Joined mini functions to help minimize duplicated coding between projects.
- [axios](https://github.com/axios/axios): Promise based HTTP client for the browser and node.js.
- [cheerio](https://github.com/cheeriojs/cheerio): Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
- [lodash](https://github.com/lodash/lodash): A modern JavaScript utility library delivering modularity, performance & extras.

`Note: Peer dependencies are required to be installed.`

## Documentation
`Note: All functions are returning in promise and optional to pass a custom axios instance`

- `alive`: Check if bilibili.com is accessible

```
const alive = await Bilibili.alive();
```

```
const alive = await Bilibili.alive(axiosInstance);
```

```
const alive = await Bilibili.alive({instance: axiosInstance});
```

- `getFilters`: Get the filters that is using on bilibili.com

```
const filters = await Bilibili.getFilters();
```

```
const filters = await Bilibili.getFilters(axiosInstance);
```

```
const filters = await Bilibili.getFilters({instance: axiosInstance});
```

- `getVideos`: Search for videos on bilibili.com

`Note: Only 'keyword' is required in order to search for videos`

`Note2: 'page' must be >= 1`

```
const videos = await Bilibili.getVideos(order, page, keyword, duration, typeId, instance);
```

```
const videos = await Bilibili.getVideos({order, page, keyword, duration, typeId, instance});
```

- `getPlayUrl`: Get the url to the flash video

`Note: Either 'id'/'bvid'/'aid' is required in order to search for videos`

`Note2: 'page' must be >= 1`

```
const playUrl = await Bilibili.getPlayUrl(id, bvid, cid, aid, page, instance);
```

```
const playUrl = await Bilibili.getPlayUrl({id, bvid, cid, aid, page, instance});
```

- `getVideo`: Get the video info base on id/bvid/aid

`Note: Either 'id'/'bvid'/'aid' is required in order to search for videos`

`Note2: If 'cid'/'page' is passed, it will return info for that cid/page specifically`

```
const video = await Bilibili.getVideo(id, bvid, cid, aid, page, instance);
```

```
const video = await Bilibili.getVideo({id, bvid, cid, aid, page, instance});
```


### Video format
```
{
    // custom bilibili video id
    id: String,
    // previous bilibili video id
    aid: String,
    // new bilibili video id
    bvid: String,
    // title of video
    title: String,
    // name of video type
    type: String,
    // name of the author
    author: String,
    // id of the author
    mid: String,
    // video description
    description: String,
    // string of video picture link
    picture: String,
    // date of publish
    publishDate: Number,
    // array of tag name
    tags: Array<String>
    // number of views
    views: Number,
    // number of reviews
    reviews: Number,
    // number of favorites
    favorites: Number
    // array of page
    pages: Array<VideoPage>
}
```

### Video page format
`Note: it is based on the video and added cid and playUrl info`
```
{
    // custom bilibili video id
    id: String,
    // previous bilibili video id
    aid: String,
    // new bilibili video id
    bvid: String,
    // use to identify video within 
    cid: String,
    // title of video
    title: String,
    // name of video type
    type: String,
    // name of the author
    author: String,
    // id of the author
    mid: String,
    // video description
    description: String,
    // string of video picture link
    picture: String,
    // date of publish
    publishDate: Number,
    // array of tag name
    tags: Array<String>
    // number of views
    views: Number,
    // number of reviews
    reviews: Number,
    // number of favorites
    favorites: Number
    // array of page
    pages: Array<VideoPage>
    // url to the flash video
    playUrl: String
}
```

## Testing

```
npm run test
```

## License
[MIT](LICENSE)
